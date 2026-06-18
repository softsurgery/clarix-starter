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
import { OllamaService } from '../../agent/services/ollama.service';
import type {
  AskDatabaseQuestionDto,
  DatabaseQueryAgentResult,
} from '../../agent/interfaces/database-query-agent';
import { QASessionService } from '@/modules/qa/services/qa-session.service';
import { QASessionStatus } from '@/modules/qa/enums/qa-session-status.enum';

const LOG_PREFIX = '[DatabaseQueryAgent]';
const MAX_RESULT_ROWS = 100;
const MAX_TABLES_IN_SCHEMA = 50;
const FORBIDDEN_SQL_KEYWORDS = [
  'INSERT',
  'UPDATE',
  'DELETE',
  'DROP',
  'CREATE',
  'ALTER',
  'TRUNCATE',
  'GRANT',
  'REVOKE',
  'EXEC',
  'EXECUTE',
  'CALL',
  'MERGE',
  'REPLACE',
];

export class QAService {
  private readonly dataSourceRepository = new DataSourceRepository();
  private readonly qaSessionService = new QASessionService();

  constructor(private readonly ollamaService: OllamaService) {}

  async askQuestion(dto: AskDatabaseQuestionDto): Promise<DatabaseQueryAgentResult> {
    const startedAt = Date.now();
    const logCollector: string[] = [];
    const collectLog = (message: string) =>
      logCollector.push(`[${new Date().toISOString()}] ${message}`);

    collectLog(`Step 1 — Starting database Q&A pipeline | question: ${dto.question}`);
    logStep(1, 'Starting database Q&A pipeline', {
      dataSourceId: dto.dataSourceId,
      question: dto.question,
      model: dto.model ?? 'default',
    });

    const dataSource = await this.dataSourceRepository.findOneById(dto.dataSourceId);

    if (!dataSource) {
      collectLog('Step 1 — Failed — data source not found');
      logStep(1, 'Failed — data source not found', { dataSourceId: dto.dataSourceId });
      const result: DatabaseQueryAgentResult = { success: false, error: 'Data source not found' };
      await this.saveSession(dto, result, Date.now() - startedAt, logCollector, undefined);
      return result;
    }

    collectLog(`Step 1 — Data source loaded: ${dataSource.name} (${dataSource.type})`);
    logStep(1, 'Data source loaded', {
      name: dataSource.name,
      type: dataSource.type,
      host: dataSource.host,
      database: dataSource.defaultDatabase ?? '(default)',
    });

    const operations = createDatabaseOperationsService(
      dataSource.type,
      toConnectionConfig(dataSource),
    );

    try {
      collectLog('Step 2 — Introspecting database schema...');
      logStep(2, 'Introspecting database schema...');
      const schemaStartedAt = Date.now();
      const schemaContext = await this.buildSchemaContext(operations, dataSource.type, dataSource);
      collectLog(`Step 2 — Schema introspection complete (${Date.now() - schemaStartedAt}ms)`);
      logStep(2, 'Schema introspection complete', {
        durationMs: Date.now() - schemaStartedAt,
        contextLength: schemaContext.length,
      });

      collectLog('Step 3 — Requesting SQL from AI agent...');
      logStep(3, 'Requesting SQL from AI agent...', {
        dialect: getDialectName(dataSource.type),
        temperature: dto.temperature ?? 0.1,
      });
      const sqlStartedAt = Date.now();
      const { sql, rawResponse } = await this.generateSql(dto, dataSource.type, schemaContext);
      collectLog(`Step 3 — SQL generation complete (${Date.now() - sqlStartedAt}ms) | SQL: ${sql}`);
      logStep(3, 'SQL generation complete', {
        durationMs: Date.now() - sqlStartedAt,
        sql,
        rawResponsePreview: truncate(rawResponse, 300),
      });

      collectLog('Step 4 — Validating generated SQL...');
      logStep(4, 'Validating generated SQL...');
      if (!isReadOnlyQuery(sql)) {
        collectLog('Step 4 — Validation failed — query is not read-only');
        logStep(4, 'Validation failed — query is not read-only', { sql });
        const result: DatabaseQueryAgentResult = {
          success: false,
          sql,
          error: 'Generated query is not read-only. Only SELECT queries are allowed.',
        };
        await this.saveSession(dto, result, Date.now() - startedAt, logCollector, dataSource.name);
        return result;
      }
      collectLog('Step 4 — Validation passed — query is read-only');
      logStep(4, 'Validation passed — query is read-only');

      collectLog('Step 5 — Executing SQL against database...');
      logStep(5, 'Executing SQL against database...');
      const queryStartedAt = Date.now();
      const data = await operations.executeQuery<Record<string, unknown>>(sql);
      collectLog(
        `Step 5 — Query execution complete (${Date.now() - queryStartedAt}ms) | ${data.length} rows`,
      );
      logStep(5, 'Query execution complete', {
        durationMs: Date.now() - queryStartedAt,
        rowCount: data.length,
        columns: data[0] ? Object.keys(data[0]) : [],
      });

      collectLog('Step 6 — Generating natural-language answer from results...');
      logStep(6, 'Generating natural-language answer from results...');
      const answerStartedAt = Date.now();
      const answer = await this.generateAnswer(dto, sql, data);
      collectLog(`Step 6 — Answer generation complete (${Date.now() - answerStartedAt}ms)`);
      logStep(6, 'Answer generation complete', {
        durationMs: Date.now() - answerStartedAt,
        answerPreview: truncate(answer, 200),
      });

      collectLog(
        `Step 7 — Pipeline finished successfully (${Date.now() - startedAt}ms total, ${data.length} rows)`,
      );
      logStep(7, 'Pipeline finished successfully', {
        totalDurationMs: Date.now() - startedAt,
        rowCount: data.length,
      });

      const result: DatabaseQueryAgentResult = {
        success: true,
        sql,
        data,
        answer,
        rowCount: data.length,
      };

      await this.saveSession(dto, result, Date.now() - startedAt, logCollector, dataSource.name);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      collectLog(`Pipeline failed — ${message}`);
      logStep('!', 'Pipeline failed', {
        totalDurationMs: Date.now() - startedAt,
        error: message,
        stack: error instanceof Error ? error.stack : undefined,
      });
      const result: DatabaseQueryAgentResult = { success: false, error: message };
      await this.saveSession(dto, result, Date.now() - startedAt, logCollector, dataSource.name);
      return result;
    } finally {
      collectLog('Cleanup — Closing database connection');
      logStep('cleanup', 'Closing database connection');
      await operations.disconnect().catch(() => undefined);
    }
  }

  private async saveSession(
    dto: AskDatabaseQuestionDto,
    result: DatabaseQueryAgentResult,
    durationMs: number,
    logs: string[],
    dataSourceName?: string,
  ): Promise<void> {
    try {
      await this.qaSessionService.create({
        question: dto.question,
        dataSourceId: dto.dataSourceId,
        dataSourceName: dataSourceName,
        status: result.success ? QASessionStatus.SUCCESS : QASessionStatus.FAILED,
        generatedSql: result.sql,
        answer: result.answer,
        rowCount: result.rowCount,
        error: result.error,
        durationMs,
        logs: logs.join('\n'),
      });
    } catch (err) {
      console.error('[DatabaseQueryAgent] Failed to save session:', err);
    }
  }

  private async buildSchemaContext(
    operations: AbstractDatabaseOperationsService,
    type: DataSourceType,
    dataSource: { defaultDatabase?: string; username: string },
  ): Promise<string> {
    const defaultSchema = getDefaultSchema(type, dataSource);
    logDetail('Using schema scope', { defaultSchema: defaultSchema ?? '(none)' });

    const tables = await operations.getAllTables(defaultSchema);
    logDetail('Tables discovered', {
      total: tables.length,
      names: tables.map((t) => `${t.schema}.${t.name}`),
    });

    const limitedTables = tables.slice(0, MAX_TABLES_IN_SCHEMA);
    if (tables.length > MAX_TABLES_IN_SCHEMA) {
      logDetail('Schema truncated for AI context', {
        included: MAX_TABLES_IN_SCHEMA,
        omitted: tables.length - MAX_TABLES_IN_SCHEMA,
      });
    }

    const sections: string[] = [];

    for (const table of limitedTables) {
      const columns = await operations.getTableColumns(table.name, table.schema);
      logDetail('Table columns loaded', {
        table: `${table.schema}.${table.name}`,
        columnCount: columns.length,
      });
      sections.push(formatTableSchema(table, columns));
    }

    if (tables.length > MAX_TABLES_IN_SCHEMA) {
      sections.push(
        `-- Note: schema truncated to ${MAX_TABLES_IN_SCHEMA} of ${tables.length} tables`,
      );
    }

    return sections.join('\n\n');
  }

  private async generateSql(
    dto: AskDatabaseQuestionDto,
    type: DataSourceType,
    schemaContext: string,
  ): Promise<{ sql: string; rawResponse: string }> {
    const dialect = getDialectName(type);
    const systemPrompt = [
      `You are a ${dialect} SQL expert.`,
      'Given a database schema and a user question, write a single read-only SQL query that answers the question.',
      'Rules:',
      '- Output ONLY the SQL query, wrapped in a ```sql code block.',
      '- Use only tables and columns from the provided schema.',
      `- Write valid ${dialect} SQL.`,
      `- Always include LIMIT ${MAX_RESULT_ROWS} unless the query is a pure aggregate with no row expansion.`,
      '- Do not use INSERT, UPDATE, DELETE, DROP, or any data-modifying statements.',
    ].join('\n');

    const prompt = ['Database schema:', schemaContext, '', `User question: ${dto.question}`].join(
      '\n',
    );

    logDetail('Sending text-to-SQL prompt to Ollama', {
      systemPromptLength: systemPrompt.length,
      promptLength: prompt.length,
    });

    const response = await this.ollamaService.generate(prompt, {
      system: systemPrompt,
      model: dto.model,
      temperature: dto.temperature ?? 0.1,
      think: false,
    });

    const sql = extractSqlFromResponse(response);
    logDetail('Extracted SQL from model response', {
      extractionMethod: detectExtractionMethod(response),
    });

    return { sql, rawResponse: response };
  }

  private async generateAnswer(
    dto: AskDatabaseQuestionDto,
    sql: string,
    data: Record<string, unknown>[],
  ): Promise<string> {
    const preview = JSON.stringify(data.slice(0, 20), null, 2);
    const rowNote =
      data.length > 20 ? `\n(showing 20 of ${data.length} rows)` : `\n(${data.length} rows)`;

    const prompt = [
      `User question: ${dto.question}`,
      '',
      'SQL executed:',
      sql,
      '',
      `Query results${rowNote}:`,
      preview,
      '',
      'Provide a concise, plain-language answer to the user question based on the results.',
    ].join('\n');

    logDetail('Sending answer-generation prompt to Ollama', {
      promptLength: prompt.length,
      rowsIncludedInPrompt: Math.min(data.length, 20),
    });

    return this.ollamaService.generate(prompt, {
      model: dto.model,
      temperature: dto.temperature ?? 0.3,
      think: false,
    });
  }
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

export function extractSqlFromResponse(response: string): string {
  const codeBlockMatch = response.match(/```(?:sql)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  const selectMatch = response.match(/((?:WITH|SELECT)[\s\S]*)/i);
  if (selectMatch) {
    return selectMatch[1].trim().replace(/;+\s*$/, '');
  }

  return response.trim().replace(/;+\s*$/, '');
}

export function isReadOnlyQuery(sql: string): boolean {
  const normalized = sql.trim().replace(/;+\s*$/, '');
  const upper = normalized.toUpperCase();

  if (!/^(SELECT|WITH)\b/.test(upper)) {
    logDetail('SQL validation failed — must start with SELECT or WITH', { sql: normalized });
    return false;
  }

  const forbiddenMatch = FORBIDDEN_SQL_KEYWORDS.find((keyword) =>
    new RegExp(`\\b${keyword}\\b`).test(upper),
  );

  if (forbiddenMatch) {
    logDetail('SQL validation failed — forbidden keyword detected', {
      keyword: forbiddenMatch,
      sql: normalized,
    });
    return false;
  }

  return true;
}

function logStep(step: number | string, message: string, detail?: Record<string, unknown>): void {
  const label = typeof step === 'number' ? `Step ${step}` : String(step);
  if (detail) {
    console.log(`${LOG_PREFIX} ${label} — ${message}`, detail);
  } else {
    console.log(`${LOG_PREFIX} ${label} — ${message}`);
  }
}

function logDetail(message: string, detail?: Record<string, unknown>): void {
  if (detail) {
    console.log(`${LOG_PREFIX}   ↳ ${message}`, detail);
  } else {
    console.log(`${LOG_PREFIX}   ↳ ${message}`);
  }
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}…`;
}

function detectExtractionMethod(response: string): string {
  if (/```(?:sql)?\s*[\s\S]*?```/i.test(response)) {
    return 'sql-code-block';
  }
  if (/((?:WITH|SELECT)[\s\S]*)/i.test(response)) {
    return 'select-statement-match';
  }
  return 'raw-response-fallback';
}
