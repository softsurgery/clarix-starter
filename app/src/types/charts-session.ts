export interface ChartSessionChartSummary {
  title: string;
  type: string;
  sql: string;
  rowCount: number;
  error?: string;
  option?: any;
}

export interface ResponseChartSessionDto {
  id: string;
  question: string;
  dataSourceName?: string;
  dataSourceId?: string;
  status: 'success' | 'failed' | 'pending';
  title?: string;
  description?: string;
  chartCount?: number;
  chartsPayload?: string;
  error?: string;
  durationMs: number;
  logs?: string;
  createdAt?: string;
  updatedAt?: string;
}
