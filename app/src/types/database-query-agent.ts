export interface AskDatabaseQuestionDto {
  dataSourceId: string;
  question: string;
  model?: string;
  temperature?: number;
}

export interface DatabaseQueryAgentResult {
  success: boolean;
  sql?: string;
  data?: Record<string, unknown>[];
  answer?: string;
  rowCount?: number;
  error?: string;
}

export interface OllamaGenerateOptions {
  model?: string;
  temperature?: number;
  system?: string;
  stream?: boolean;
  think?: boolean;
}
