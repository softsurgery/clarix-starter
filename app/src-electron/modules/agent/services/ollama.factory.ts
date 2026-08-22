import type { OllamaConfig } from '@/app/enums/ollama-settings.interface';
import { AbstractOllamaService } from './abstract-ollama.service';
import { OllamaCloudService } from './ollama-cloud.service';
import { OllamaLocalService } from './ollama-local.service';

export function createOllamaService(config: OllamaConfig): AbstractOllamaService {
  if (config.mode === 'cloud') {
    return new OllamaCloudService(config);
  }

  return new OllamaLocalService(config);
}
