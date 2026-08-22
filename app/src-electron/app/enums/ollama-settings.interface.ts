export type OllamaModeValue = 'local' | 'cloud';

export interface OllamaConfig {
  mode: OllamaModeValue;
  apiKey?: string;
  baseUrl: string;
  temperature: number;
  timeout: number;
}
