import { DataSourceRepository } from '@/modules/data-source/repositories/data-source.repository';
import { DataSourceType } from '@/modules/data-source/enums/data-source-type.enm';
import {
  createDatabaseOperationsService,
  toConnectionConfig,
} from '@/modules/data-source/database-operations/database-operations.factory';
import type { AbstractDatabaseOperationsService } from '@/modules/data-source/database-operations/abstract-database-operations.service';
import type {
  ColumnInfo,
  TableInfo,
} from '@/modules/data-source/database-operations/types/database-operations.types';
import { OllamaService } from '@/modules/agent/services/ollama.service';
import { extractSqlFromResponse, isReadOnlyQuery } from '@/modules/qa/services/qa.service';
import { ChartBuilderService, isSupportedChartType } from './chart-builder.service';
import type {
  AskChartsDto,
  ChartPlan,
  ChartPlanSpec,
  ChartsAgentResult,
  RenderedChart,
} from '../interfaces/ask-chart.dto';

const LOG_PREFIX = '[ChartsAgent]';
const MAX_RESULT_ROWS = 500;
const MAX_TABLES_IN_SCHEMA = 50;

export class ChartsService {
  private readonly dataSourceRepository = new DataSourceRepository();
  private readonly chartBuilder = new ChartBuilderService();

  constructor(private readonly ollamaService: OllamaService) {}

  async generateCharts(dto: AskChartsDto): Promise<ChartsAgentResult> {
    const dataSource = await this.dataSourceRepository.findOneById(dto.dataSourceId);

    if (!dataSource) {
      return { success: false, error: 'Data source not found' };
    }

    const operations = createDatabaseOperationsService(
      dataSource.type,
      toConnectionConfig(dataSource),
    );

    try {
      const schemaContext = await this.buildSchemaContext(operations, dataSource.type, dataSource);
      const plan = await this.generateChartPlan(dto, dataSource.type, schemaContext);

      if (!plan.charts.length) {
        return { success: false, error: 'AI did not return any charts for this request.' };
      }

      const charts: RenderedChart[] = [];

      for (const spec of plan.charts) {
        charts.push(await this.renderChartSpec(spec, operations));
      }

      const hasRenderableChart = charts.some((chart) => !chart.error);

      return {
        success: hasRenderableChart,
        title: plan.title,
        description: plan.description,
        charts,
        error: hasRenderableChart ? undefined : 'All chart queries failed.',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`${LOG_PREFIX} Pipeline failed`, message);
      return { success: false, error: message };
    } finally {
      await operations.disconnect().catch(() => undefined);
    }
  }

  private async renderChartSpec(
    spec: ChartPlanSpec,
    operations: AbstractDatabaseOperationsService,
  ): Promise<RenderedChart> {
    const sql = spec.sql.trim();

    if (!isReadOnlyQuery(sql)) {
      return {
        title: spec.title,
        type: spec.type,
        sql,
        option: this.chartBuilder.buildOption(spec, []),
        rowCount: 0,
        error: 'Generated query is not read-only. Only SELECT queries are allowed.',
      };
    }

    try {
      const data = await operations.executeQuery<Record<string, unknown>>(sql);
      return {
        title: spec.title,
        type: spec.type,
        sql,
        option: this.chartBuilder.buildOption(spec, data),
        rowCount: data.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Query execution failed';
      return {
        title: spec.title,
        type: spec.type,
        sql,
        option: this.chartBuilder.buildOption(spec, []),
        rowCount: 0,
        error: message,
      };
    }
  }

  private async buildSchemaContext(
    operations: AbstractDatabaseOperationsService,
    type: DataSourceType,
    dataSource: { defaultDatabase?: string; username: string },
  ): Promise<string> {
    const defaultSchema = getDefaultSchema(type, dataSource);
    const tables = await operations.getAllTables(defaultSchema);
    const limitedTables = tables.slice(0, MAX_TABLES_IN_SCHEMA);
    const sections: string[] = [];

    for (const table of limitedTables) {
      const columns = await operations.getTableColumns(table.name, table.schema);
      sections.push(formatTableSchema(table, columns));
    }

    if (tables.length > MAX_TABLES_IN_SCHEMA) {
      sections.push(
        `-- Note: schema truncated to ${MAX_TABLES_IN_SCHEMA} of ${tables.length} tables`,
      );
    }

    return sections.join('\n\n');
  }

  private async generateChartPlan(
    dto: AskChartsDto,
    type: DataSourceType,
    schemaContext: string,
  ): Promise<ChartPlan> {
    const dialect = getDialectName(type);
    const systemPrompt = [
      `You are a ${dialect} SQL and data-visualization expert.`,
      'Given a database schema and a user request, produce one or more charts (or a full dashboard).',
      'Respond with ONLY valid JSON wrapped in a ```json code block.',
      'Schema:',
      '{',
      '  "title": "Dashboard or chart title",',
      '  "description": "Short summary of what was built",',
      '  "charts": [',
      '    {',
      '      "title": "Chart title",',
      `      "type": "line" | "bar" | "pie" | "scatter" | "area",`,
      `      "sql": "valid read-only ${dialect} SELECT query",`,
      '      "xField": "column for categories or x-axis (line/bar/area/scatter)",',
      '      "yFields": ["numeric column(s) for values"],',
      '      "seriesNames": ["optional display names"],',
      '      "nameField": "label column for pie charts",',
      '      "valueField": "numeric column for pie charts"',
      '    }',
      '  ]',
      '}',
      'Rules:',
      '- Use only tables and columns from the provided schema.',
      `- Write valid read-only ${dialect} SQL for each chart.`,
      `- Include LIMIT ${MAX_RESULT_ROWS} unless the query is a pure aggregate.`,
      '- Pick chart types that fit the data (trends → line/area, comparisons → bar, proportions → pie).',
      '- For dashboards, return multiple chart objects with distinct SQL queries.',
      '- Field names must match SQL result column aliases exactly.',
      '- Do not include markdown outside the JSON code block.',
    ].join('\n');

    const prompt = ['Database schema:', schemaContext, '', `User request: ${dto.question}`].join(
      '\n',
    );

    const response = await this.ollamaService.generate(prompt, {
      system: systemPrompt,
      model: dto.model,
      temperature: dto.temperature ?? 0.7,
      think: false,
    });

    return parseChartPlan(response);
  }
}

function parseChartPlan(response: string): ChartPlan {
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = jsonMatch?.[1]?.trim() ?? response.trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI response did not contain valid chart plan JSON.');
  }

  if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as ChartPlan).charts)) {
    throw new Error('Chart plan JSON is missing a charts array.');
  }

  const plan = parsed as ChartPlan;
  const charts = plan.charts
    .filter((chart) => chart && typeof chart === 'object')
    .map(normalizeChartSpec)
    .filter((chart): chart is ChartPlanSpec => chart !== null);

  return {
    title: typeof plan.title === 'string' ? plan.title : 'Generated charts',
    description: typeof plan.description === 'string' ? plan.description : undefined,
    charts,
  };
}

function normalizeChartSpec(raw: Partial<ChartPlanSpec>): ChartPlanSpec | null {
  if (!raw.title || !raw.type || !raw.sql) {
    return null;
  }

  if (!isSupportedChartType(raw.type)) {
    return null;
  }

  return {
    title: raw.title,
    type: raw.type,
    sql: extractSqlFromResponse(raw.sql),
    xField: raw.xField,
    yFields: raw.yFields?.filter(Boolean),
    seriesNames: raw.seriesNames?.filter(Boolean),
    nameField: raw.nameField,
    valueField: raw.valueField,
  };
}

function getDefaultSchema(
  type: DataSourceType,
  dataSource: { defaultDatabase?: string; username: string },
): string | undefined {
  switch (type) {
    case DataSourceType.POSTGRESQL:
      return 'public';
    case DataSourceType.MYSQL:
    case DataSourceType.MARIADB:
      return dataSource.defaultDatabase;
    case DataSourceType.ORACLE:
      return dataSource.username;
    default:
      return undefined;
  }
}

function getDialectName(type: DataSourceType): string {
  switch (type) {
    case DataSourceType.POSTGRESQL:
      return 'PostgreSQL';
    case DataSourceType.MYSQL:
      return 'MySQL';
    case DataSourceType.MARIADB:
      return 'MariaDB';
    case DataSourceType.ORACLE:
      return 'Oracle';
    default:
      return 'SQL';
  }
}

function formatTableSchema(table: TableInfo, columns: ColumnInfo[]): string {
  const qualifiedName =
    table.schema && table.schema !== table.name ? `${table.schema}.${table.name}` : table.name;

  const columnLines = columns.map((col) => {
    const flags = [col.isPrimaryKey ? 'PK' : null, col.nullable ? 'nullable' : 'not null']
      .filter(Boolean)
      .join(', ');

    return `  ${col.name} ${col.dataType}${flags ? ` (${flags})` : ''}`;
  });

  return `TABLE ${qualifiedName}(\n${columnLines.join('\n')}\n)`;
}
