import { ConfigurationNamespaceService } from '../../shared/configurations/services/configuration-namespace.service';
import { ConfigurationParamService } from '../../shared/configurations/services/configuration-param.service';
import { ParamVariant } from '../../shared/configurations/enums/param-variant.enum';
import { ParamViewMode } from '../../shared/configurations/enums/param-view-mode.enum';
import { ConfigurationNamespaceEntity } from '../../shared/configurations/entities/configuration-namespace.entity';
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
  viewMode?: ParamViewMode;
  value: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
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
      name: OLLAMA_PARAMS.TEMPERATURE,
      description: 'Default model temperature',
      variant: ParamVariant.NUMBER,
      viewMode: ParamViewMode.SLIDER,
      value: '0.7',
      min: 0,
      max: 2,
      step: 0.1,
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

  await removeObsoleteParams(paramService, namespace, defaults);
  namespace = (await namespaceService.findGlobalByName(name)) ?? namespace;

  for (const definition of defaults) {
    const existing = namespace.params?.find((param) => param.name === definition.name);
    const viewMode = definition.viewMode ?? ParamViewMode.DEFAULT;

    if (existing) {
      await paramService.update(existing.id, {
        description: definition.description,
        variant: definition.variant,
        viewMode,
        options: definition.options,
        min: definition.min,
        max: definition.max,
        step: definition.step,
      });
      continue;
    }

    await paramService.save({
      namespaceId: namespace.id,
      name: definition.name,
      description: definition.description,
      variant: definition.variant,
      viewMode,
      value: definition.value,
      options: definition.options,
      min: definition.min,
      max: definition.max,
      step: definition.step,
    });
  }
}

async function removeObsoleteParams(
  paramService: ConfigurationParamService,
  namespace: ConfigurationNamespaceEntity,
  defaults: SeedParamDefinition[],
): Promise<void> {
  const defaultNames = new Set(defaults.map((definition) => definition.name));

  for (const param of namespace.params ?? []) {
    if (!defaultNames.has(param.name)) {
      await paramService.delete(param.id);
    }
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
