import { ConfigurationNamespaceEntity } from '../../../shared/configurations/entities/configuration-namespace.entity';
import { ConfigurationNamespaceService } from '../../../shared/configurations/services/configuration-namespace.service';
import {
  OLLAMA_NAMESPACE,
  OLLAMA_PARAMS,
  RUNTIME_NAMESPACE,
  RUNTIME_PARAMS,
} from '../../../app/constants/ollama-configuration.constants';
import { OllamaConfig, OllamaModeValue } from '../../../app/enums/ollama-settings.interface';

export class OllamaConfigurationService {
  private readonly namespaceService = new ConfigurationNamespaceService();

  async getOllamaConfig(): Promise<OllamaConfig> {
    const ollamaNamespace = await this.getGlobalNamespace(OLLAMA_NAMESPACE);
    return this.namespaceToOllamaConfig(ollamaNamespace);
  }

  async getPythonPath(): Promise<string | undefined> {
    const runtimeNamespace = await this.getGlobalNamespace(RUNTIME_NAMESPACE);
    const value = this.getParamValue(runtimeNamespace, RUNTIME_PARAMS.PYTHON_PATH);
    return value?.trim() || undefined;
  }

  private async getGlobalNamespace(name: string): Promise<ConfigurationNamespaceEntity> {
    const namespace = await this.namespaceService.findGlobalByName(name);

    if (!namespace) {
      throw new Error(`Global configuration namespace "${name}" was not seeded.`);
    }

    return namespace;
  }

  private getParamValue(namespace: ConfigurationNamespaceEntity, name: string): string {
    return namespace.params.find((param) => param.name === name)?.value ?? '';
  }

  private namespaceToOllamaConfig(namespace: ConfigurationNamespaceEntity): OllamaConfig {
    return {
      mode: this.getParamValue(namespace, OLLAMA_PARAMS.MODE) as OllamaModeValue,
      apiKey: this.getParamValue(namespace, OLLAMA_PARAMS.API_KEY) || undefined,
      baseUrl: this.getParamValue(namespace, OLLAMA_PARAMS.BASE_URL) || 'http://localhost:11434',
      model: this.getParamValue(namespace, OLLAMA_PARAMS.MODEL) || 'llama3',
      temperature: Number(this.getParamValue(namespace, OLLAMA_PARAMS.TEMPERATURE)) || 0.7,
      timeout: Number(this.getParamValue(namespace, OLLAMA_PARAMS.TIMEOUT)) || 60000,
    };
  }
}
