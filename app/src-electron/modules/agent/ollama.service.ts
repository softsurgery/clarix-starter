// ─── Types ────────────────────────────────────────────────────────────────────

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaGenerateOptions {
  model?: string;
  temperature?: number;
  system?: string;
  stream?: boolean;
  think?: boolean;
}

export interface OllamaChatOptions {
  model?: string;
  temperature?: number;
  stream?: boolean;
  think?: boolean;
}

export interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
}

export interface OllamaChatResponse {
  model: string;
  message: OllamaChatMessage;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class OllamaService {
  private baseUrl: string;
  private defaultModel: string;
  private defaultTemperature: number;
  private timeoutMs: number;

  constructor() {}

  init(): void {
    // Basic fallback without configService
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.defaultModel = process.env.OLLAMA_MODEL || 'llama3';
    this.defaultTemperature = Number(process.env.OLLAMA_TEMPERATURE) || 0.7;
    this.timeoutMs = Number(process.env.OLLAMA_TIMEOUT) || 60000;

    console.log(`[OllamaService] configured → ${this.baseUrl} (model: ${this.defaultModel})`);
  }

  // ─── Generate (single prompt → single response) ────────────────────────────

  /**
   * Sends a single prompt to the Ollama `/api/generate` endpoint
   * and returns the full response text.
   */
  async generate(prompt: string, options?: OllamaGenerateOptions): Promise<string> {
    const body = {
      model: options?.model ?? this.defaultModel,
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

  // ─── Chat (multi-turn conversation) ─────────────────────────────────────────

  /**
   * Sends a multi-turn conversation to the Ollama `/api/chat` endpoint
   * and returns the assistant's reply.
   */
  async chat(
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions,
  ): Promise<OllamaChatMessage> {
    const body = {
      model: options?.model ?? this.defaultModel,
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

  // ─── Streaming Chat ─────────────────────────────────────────────────────────

  /**
   * Streams a chat response token-by-token via an async generator.
   *
   * Usage:
   * ```ts
   * for await (const chunk of ollamaService.streamChat(messages)) {
   *   process.stdout.write(chunk);
   * }
   * ```
   */
  async *streamChat(
    messages: OllamaChatMessage[],
    options?: OllamaChatOptions,
  ): AsyncGenerator<string> {
    const body = {
      model: options?.model ?? this.defaultModel,
      messages,
      stream: true,
      options: {
        temperature: options?.temperature ?? this.defaultTemperature,
      },
      ...(options?.think !== undefined ? { think: options.think } : {}),
    };

    const url = `${this.baseUrl}/api/chat`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

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

        // Ollama sends newline-delimited JSON objects
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

  // ─── Health check ───────────────────────────────────────────────────────────

  /**
   * Pings the Ollama server to verify connectivity.
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Lists all models currently available on the Ollama server.
   */
  async listModels(): Promise<string[]> {
    try {
      const data = await this.request<{ models: { name: string }[] }>(
        '/api/tags',
        undefined,
        'GET',
      );
      return data.models.map((m) => m.name);
    } catch {
      return [];
    }
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  private async request<T>(
    path: string,
    body?: unknown,
    method: 'GET' | 'POST' = 'POST',
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const fetchOptions: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(this.timeoutMs),
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[OllamaService] request failed [${response.status}]: ${errorText}`);
      throw new Error(`Ollama error [${response.status}]: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }
}
