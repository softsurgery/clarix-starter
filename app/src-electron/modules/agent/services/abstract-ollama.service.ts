import type { OllamaModeValue } from '@/app/enums/ollama-settings.interface';
import type {
  OllamaChatMessage,
  OllamaChatOptions,
  OllamaChatResponse,
  OllamaGenerateOptions,
} from './ollama.types';
import {
  fetchCloudRequiredPlans,
  toListedOllamaModel,
  type OllamaListedModel,
} from './ollama-model.utils';

export abstract class AbstractOllamaService {
  constructor(
    protected readonly mode: OllamaModeValue,
    protected readonly baseUrl: string,
    protected readonly defaultModel: string,
    protected readonly defaultTemperature: number,
    protected readonly timeoutMs: number,
  ) {}

  abstract generate(prompt: string, options?: OllamaGenerateOptions): Promise<string>;

  abstract isAvailable(): Promise<boolean>;

  async chat(
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions,
  ): Promise<OllamaChatMessage> {
    const body = {
      model: this.resolveModel(options?.model),
      messages,
      stream: false,
      options: {
        temperature: options?.temperature ?? this.defaultTemperature,
      },
      ...(options?.think !== undefined ? { think: options.think } : {}),
    };

    const data = await this.request<OllamaChatResponse>('/api/chat', body);

    return data.message;
  }

  async *streamChat(
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions,
  ): AsyncGenerator<string> {
    const body = {
      model: this.resolveModel(options?.model),
      messages,
      stream: true,
      options: {
        temperature: options?.temperature ?? this.defaultTemperature,
      },
      ...(options?.think !== undefined ? { think: options.think } : {}),
    };

    const url = `${this.baseUrl}/api/chat`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      throw this.toFetchError(error);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama stream error [${response.status}]: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No readable stream returned from Ollama');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          const parsed = JSON.parse(line) as OllamaChatResponse;
          if (parsed.message?.content) {
            yield parsed.message.content;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async listModels(): Promise<OllamaListedModel[]> {
    try {
      const [data, requiredPlans] = await Promise.all([
        this.request<{
          models: {
            name: string;
            size?: number;
            remote_host?: string;
            remote_model?: string;
            premium?: boolean;
            required_plan?: string;
          }[];
        }>('/api/tags', undefined, 'GET'),
        fetchCloudRequiredPlans(),
      ]);
      return data.models.map((model) =>
        toListedOllamaModel(model, this.mode === 'cloud', requiredPlans),
      );
    } catch {
      return [];
    }
  }

  protected abstract resolveModel(model?: string): string;

  protected abstract buildHeaders(): Record<string, string>;

  protected toFetchError(error: unknown): Error {
    const cause = error instanceof Error && 'cause' in error ? error.cause : error;
    const details =
      cause instanceof Error
        ? `${cause.message}${'code' in cause && cause.code ? ` (${cause.code})` : ''}`
        : String(cause);

    return new Error(
      `Cannot reach Ollama at ${this.baseUrl} [mode=${this.mode}]: ${details}. Check Ollama settings`,
    );
  }

  protected throwForErrorResponse(status: number, errorText: string): never {
    console.error(`[${this.constructor.name}] request failed [${status}]: ${errorText}`);
    throw new Error(`Ollama error [${status}]: ${errorText}`);
  }

  protected async request<T>(
    path: string,
    body?: unknown,
    method: 'GET' | 'POST' = 'POST',
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const fetchOptions: RequestInit = {
      method,
      headers: this.buildHeaders(),
      signal: AbortSignal.timeout(this.timeoutMs),
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    let response: Response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (error) {
      throw this.toFetchError(error);
    }

    if (!response.ok) {
      const errorText = await response.text();
      this.throwForErrorResponse(response.status, errorText);
    }

    return response.json() as Promise<T>;
  }
}
