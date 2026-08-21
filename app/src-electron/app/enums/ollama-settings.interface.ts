export type OllamaModeValue = 'local' | 'cloud';

export interface OllamaConfig {
  mode: OllamaModeValue;
  apiKey?: string;
  baseUrl: string;
  model: string;
  temperature: number;
  timeout: number;
}
