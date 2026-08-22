import { ConfigurationNamespaceService } from '../../shared/configurations/services/configuration-namespace.service';
import { ConfigurationParamService } from '../../shared/configurations/services/configuration-param.service';
import { ParamVariant } from '../../shared/configurations/enums/param-variant.enum';
import {
  OLLAMA_MODE_OPTIONS,
  OLLAMA_NAMESPACE,
  OLLAMA_PARAMS,
  RUNTIME_NAMESPACE,
  RUNTIME_PARAMS,
} from '../../app/constants/ollama-configuration.constants';

interface SeedParamDefinition {
  name: string;
  description: string;
  variant: ParamVariant;
  value: string;
  options?: { label: string; value: string }[];
}

function buildOllamaDefaults(): SeedParamDefinition[] {
  return [
    {
      name: OLLAMA_PARAMS.MODE,
      description: 'Ollama connection mode',
      variant: ParamVariant.SELECT,
      value: 'local',
      options: OLLAMA_MODE_OPTIONS,
    },
    {
      name: OLLAMA_PARAMS.API_KEY,
      description: 'Ollama cloud API key',
      variant: ParamVariant.STRING,
      value: '',
    },
    {
      name: OLLAMA_PARAMS.BASE_URL,
      description: 'Local Ollama base URL',
      variant: ParamVariant.STRING,
      value: 'http://localhost:11434',
    },
    {
      name: OLLAMA_PARAMS.MODEL,
      description: 'Default Ollama model',
      variant: ParamVariant.STRING,
      value: 'llama3',
    },
    {
      name: OLLAMA_PARAMS.TEMPERATURE,
      description: 'Default model temperature',
      variant: ParamVariant.NUMBER,
      value: '0.7',
    },
    {
      name: OLLAMA_PARAMS.TIMEOUT,
      description: 'Request timeout in milliseconds',
      variant: ParamVariant.NUMBER,
      value: '60000',
    },
  ];
}

function buildRuntimeDefaults(): SeedParamDefinition[] {
  return [
    {
      name: RUNTIME_PARAMS.PYTHON_PATH,
      description: 'Custom Python interpreter path',
      variant: ParamVariant.STRING,
      value: '',
    },
  ];
}

async function seedGlobalNamespace(
  namespaceService: ConfigurationNamespaceService,
  paramService: ConfigurationParamService,
  name: string,
  description: string,
  defaults: SeedParamDefinition[],
): Promise<void> {
  let namespace = await namespaceService.findGlobalByName(name);

  if (!namespace) {
    namespace = await namespaceService.save({
      name,
      description,
      userId: null,
    });
  }

  for (const definition of defaults) {
    const existing = namespace.params?.find((param) => param.name === definition.name);

    if (existing) continue;

    await paramService.save({
      namespaceId: namespace.id,
      name: definition.name,
      description: definition.description,
      variant: definition.variant,
      value: definition.value,
      options: definition.options,
    });
  }
}

export async function seedGlobalConfigurations(): Promise<void> {
  const namespaceService = new ConfigurationNamespaceService();
  const paramService = new ConfigurationParamService();

  await seedGlobalNamespace(
    namespaceService,
    paramService,
    OLLAMA_NAMESPACE,
    'Global Ollama configuration',
    buildOllamaDefaults(),
  );

  await seedGlobalNamespace(
    namespaceService,
    paramService,
    RUNTIME_NAMESPACE,
    'Global runtime configuration',
    buildRuntimeDefaults(),
  );

  console.log('[Seed] Global configuration namespaces ready.');
}
