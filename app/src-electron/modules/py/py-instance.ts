import { PyRunnerService } from '@/modules/py/py-runner.service';
import { OllamaConfigurationService } from '@/modules/agent/services/ollama-configuration.service';

let sharedInstance: PyRunnerService | null = null;

export function getSharedPyRunnerService(): PyRunnerService {
  if (!sharedInstance) {
    sharedInstance = new PyRunnerService();
  }

  return sharedInstance;
}

export async function initSharedPyRunnerService(): Promise<PyRunnerService> {
  const configurationService = new OllamaConfigurationService();
  const service = getSharedPyRunnerService();
  service.setPythonPath(await configurationService.getPythonPath());
  return service;
}

export async function reloadSharedPyRunnerService(): Promise<void> {
  await initSharedPyRunnerService();
}
