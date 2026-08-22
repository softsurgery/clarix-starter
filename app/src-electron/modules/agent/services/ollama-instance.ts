import { AbstractOllamaService } from '@/modules/agent/services/abstract-ollama.service';
import { OllamaConfigurationService } from '@/modules/agent/services/ollama-configuration.service';
import { createOllamaService } from '@/modules/agent/services/ollama.factory';

let sharedInstance: AbstractOllamaService | null = null;

export function getSharedOllamaService(): AbstractOllamaService {
  if (!sharedInstance) {
    throw new Error('Ollama service has not been initialized');
  }

  return sharedInstance;
}

export async function initSharedOllamaService(): Promise<AbstractOllamaService> {
  const configurationService = new OllamaConfigurationService();
  const config = await configurationService.getOllamaConfig();
  sharedInstance = createOllamaService(config);
  return sharedInstance;
}

export async function reloadSharedOllamaService(): Promise<void> {
  await initSharedOllamaService();
}
