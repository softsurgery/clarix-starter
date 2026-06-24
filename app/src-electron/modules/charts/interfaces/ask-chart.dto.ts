import { EChartsOption } from 'echarts';

export interface AskChartsDto {
  dataSourceId: string;
  question: string;
  model?: string;
  temperature?: number;
}
export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area';

export interface ChartPlanSpec {
  title: string;
  type: ChartType;
  sql: string;
  xField?: string;
  yFields?: string[];
  seriesNames?: string[];
  nameField?: string;
  valueField?: string;
}

export interface ChartPlan {
  title: string;
  description?: string;
  charts: ChartPlanSpec[];
}

export interface RenderedChart {
  title: string;
  type: ChartType;
  sql: string;
  option: EChartsOption;
  rowCount: number;
  error?: string;
}

export interface ChartsAgentResult {
  success: boolean;
  title?: string;
  description?: string;
  charts?: RenderedChart[];
  error?: string;
}
