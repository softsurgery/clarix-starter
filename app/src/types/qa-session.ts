export interface ResponseQASessionDto {
  id: string;
  question: string;
  dataSourceName?: string;
  dataSourceId?: string;
  status: 'success' | 'failed' | 'pending';
  generatedSql?: string;
  answer?: string;
  rowCount?: number;
  error?: string;
  durationMs: number;
  logs?: string;
  createdAt?: string;
  updatedAt?: string;
}
