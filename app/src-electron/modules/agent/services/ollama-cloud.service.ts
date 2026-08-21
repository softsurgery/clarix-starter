import { Ollama } from 'ollama';
import type { OllamaConfig } from '@/app/enums/ollama-settings.interface';
import { AbstractOllamaService } from './abstract-ollama.service';
import type {
  OllamaChatMessage,
  OllamaChatOptions,
  OllamaGenerateOptions,
} from './ollama.types';

/** Direct cloud API host — see https://docs.ollama.com/cloud */
const CLOUD_BASE_URL = 'https://ollama.com';

export class OllamaCloudService extends AbstractOllamaService {
  private readonly apiKey?: string;
  private readonly client: Ollama;

  constructor(config: OllamaConfig) {
    super(
      'cloud',
      CLOUD_BASE_URL,
      config.model || 'llama3',
      config.temperature ?? 0.7,
      config.timeout ?? 60000,
    );
    this.apiKey = config.apiKey?.trim();
    this.client = new Ollama({
      host: CLOUD_BASE_URL,
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    });

    if (!this.apiKey) {
      console.warn('[OllamaCloudService] an API key is required — configure it in Settings');
    }

    console.log(
      `[OllamaCloudService] configured → ${this.baseUrl} (model: ${this.resolveModel()}, apiKey=${this.apiKey ? 'set' : 'missing'})`,
    );
  }

  async generate(prompt: string, options?: OllamaGenerateOptions): Promise<string> {
    this.assertApiKey();

    try {
      const data = await this.client.generate({
        model: this.resolveModel(options?.model),
        prompt,
        stream: false,
        ...(options?.system ? { system: options.system } : {}),
        ...(options?.think !== undefined ? { think: options.think } : {}),
        options: {
          temperature: options?.temperature ?? this.defaultTemperature,
        },
      });

      return data.response;
    } catch (error) {
      this.rethrow(error);
    }
  }

  async chat(
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions,
  ): Promise<OllamaChatMessage> {
    this.assertApiKey();

    try {
      const data = await this.client.chat({
        model: this.resolveModel(options?.model),
        messages,
        stream: false,
        ...(options?.think !== undefined ? { think: options.think } : {}),
        options: {
          temperature: options?.temperature ?? this.defaultTemperature,
        },
      });

      return {
        role: (data.message?.role as OllamaChatMessage['role']) ?? 'assistant',
        content: data.message?.content ?? '',
      };
    } catch (error) {
      this.rethrow(error);
    }
  }

  async *streamChat(
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions,
  ): AsyncGenerator<string> {
    this.assertApiKey();

    try {
      const stream = await this.client.chat({
        model: this.resolveModel(options?.model),
        messages,
        stream: true,
        ...(options?.think !== undefined ? { think: options.think } : {}),
        options: {
          temperature: options?.temperature ?? this.defaultTemperature,
        },
      });

      for await (const part of stream) {
        if (part.message?.content) {
          yield part.message.content;
        }
      }
    } catch (error) {
      this.rethrow(error);
    }
  }

  /**
   * `/api/tags` is public on ollama.com, so listing models does not prove the API key works.
   * Probe `/api/chat` instead: 401 means the key was rejected.
   */
  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      await this.client.chat({
        model: '_auth_check',
        messages: [],
        stream: false,
      });
      return true;
    } catch (error) {
      return !this.isUnauthorized(error);
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const data = await this.client.list();
      return data.models.map((model) => model.name);
    } catch {
      return [];
    }
  }

  /**
   * Cloud models accessed via ollama.com use names without the "-cloud" suffix
   * (e.g. "gpt-oss:120b" instead of "gpt-oss:120b-cloud").
   */
  protected resolveModel(model?: string): string {
    const name = model ?? this.defaultModel;
    return name.replace(/-cloud$/, '');
  }

  protected buildHeaders(): Record<string, string> {
    this.assertApiKey();

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private assertApiKey(): void {
    if (!this.apiKey) {
      throw new Error(
        'Ollama API key is required for cloud mode — set it in Settings, or create one at https://ollama.com/settings/keys',
      );
    }
  }

  private isUnauthorized(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status_code' in error &&
      (error as { status_code: number }).status_code === 401
    );
  }

  private rethrow(error: unknown): never {
    if (this.isUnauthorized(error)) {
      throw new Error(
        'Ollama cloud authentication failed (401). Set a valid API key in Settings (https://ollama.com/settings/keys)',
      );
    }

    throw error instanceof Error ? error : new Error(String(error));
  }
}
