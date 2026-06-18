import { OllamaService } from '@/modules/agent/services/ollama.service';
import { QAService } from '../services/qa.service';
import { ipcMain } from 'electron';
import { AskDatabaseQuestionDto } from '@/modules/agent/interfaces/database-query-agent';

export function registerQAHandlers(): void {
  const llamaService = new OllamaService();
  llamaService.init();
  const service = new QAService(llamaService);

  ipcMain.handle('agent:askDatabase', async (_event, dto: AskDatabaseQuestionDto) => {
    console.log('[AgentIPC] agent:askDatabase invoked', {
      dataSourceId: dto.dataSourceId,
      question: dto.question,
    });
    return service.askQuestion(dto);
  });
}
