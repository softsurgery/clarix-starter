export const OLLAMA_NAMESPACE = 'ollama';
export const RUNTIME_NAMESPACE = 'runtime';

export const OLLAMA_PARAMS = {
  MODE: 'mode',
  API_KEY: 'apiKey',
  BASE_URL: 'baseUrl',
  TEMPERATURE: 'temperature',
  TIMEOUT: 'timeout',
} as const;

export const RUNTIME_PARAMS = {
  PYTHON_PATH: 'pythonPath',
} as const;

export const OLLAMA_MODE_OPTIONS = [
  { label: 'Local (self-hosted Ollama)', value: 'local' },
  { label: 'Cloud (ollama.com API)', value: 'cloud' },
];
