import type { EChartsOption } from 'echarts';

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area';

export interface ChartsDto {
  dataSourceId: string;
  question: string;
  model?: string;
  temperature?: number;
}

export interface ChartSpec {
  title: string;
  type: ChartType;
  sql: string;
  xField?: string;
  yFields?: string[];
  seriesNames?: string[];
  nameField?: string;
  valueField?: string;
}

export interface RenderedChart {
  title: string;
  type: ChartType;
  sql: string;
  option: EChartsOption;
  rowCount: number;
  error?: string;
}

export interface ChartsResult {
  success: boolean;
  title?: string;
  description?: string;
  charts?: RenderedChart[];
  error?: string;
}
