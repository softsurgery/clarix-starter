import { ipcMain } from 'electron';
import { OllamaService, OllamaChatMessage, OllamaGenerateOptions } from './ollama.service';

export function registerAgentHandlers(): void {
  const ollamaService = new OllamaService();
  ollamaService.init(); // Initialize configuration

  ipcMain.handle(
    'agent:generate',
    async (_event, prompt: string, options: OllamaGenerateOptions) => {
      const response = await ollamaService.generate(prompt, options);
      return { response };
    },
  );

  ipcMain.handle('agent:chat', async (_event, dto: any) => {
    const message = await ollamaService.chat(dto.messages, {
      model: dto.model,
      temperature: dto.temperature,
      think: dto.think,
    });
    return { message };
  });

  ipcMain.on('agent:chat-stream', async (event, dto: any) => {
    try {
      for await (const token of ollamaService.streamChat(dto.messages, {
        model: dto.model,
        temperature: dto.temperature,
        think: dto.think,
      })) {
        event.sender.send('agent:chat-stream-token', { token, done: false });
      }
      event.sender.send('agent:chat-stream-token', { done: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      event.sender.send('agent:chat-stream-token', { error: errorMessage, done: true });
    }
  });

  ipcMain.handle('agent:health', async () => {
    const available = await ollamaService.isAvailable();
    return { available };
  });

  ipcMain.handle('agent:models', async () => {
    const models = await ollamaService.listModels();
    return { models };
  });
}
