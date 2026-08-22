import type { OllamaConfig } from '@/app/enums/ollama-settings.interface';
import { AbstractOllamaService } from './abstract-ollama.service';
import type { OllamaGenerateOptions, OllamaGenerateResponse } from './ollama.types';

const DEFAULT_LOCAL_BASE_URL = 'http://localhost:11434';

export class OllamaLocalService extends AbstractOllamaService {
  constructor(config: OllamaConfig) {
    super(
      'local',
      config.baseUrl?.trim() || DEFAULT_LOCAL_BASE_URL,
      config.model || 'llama3',
      config.temperature ?? 0.7,
      config.timeout ?? 60000,
    );

    console.log(
      `[OllamaLocalService] configured → ${this.baseUrl} (model: ${this.resolveModel()})`,
    );
  }

  async generate(prompt: string, options?: OllamaGenerateOptions): Promise<string> {
    const body = {
      model: this.resolveModel(options?.model),
      prompt,
      stream: false,
      options: {
        temperature: options?.temperature ?? this.defaultTemperature,
      },
      ...(options?.system ? { system: options.system } : {}),
      ...(options?.think !== undefined ? { think: options.think } : {}),
    };

    const data = await this.request<OllamaGenerateResponse>('/api/generate', body);

    return data.response;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        headers: this.buildHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  protected resolveModel(model?: string): string {
    return model ?? this.defaultModel;
  }

  protected buildHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json' };
  }
}
