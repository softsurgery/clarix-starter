import { QAService } from '../services/qa.service';
import { ipcMain } from 'electron';
import { AskDatabaseQuestionDto } from '@/modules/agent/interfaces/database-query-agent';
import { getSharedOllamaService } from '@/modules/agent/services/ollama-instance';

export function registerQAHandlers(): void {
  ipcMain.handle('agent:askDatabase', async (_event, dto: AskDatabaseQuestionDto) => {
    console.log('[AgentIPC] agent:askDatabase invoked', {
      dataSourceId: dto.dataSourceId,
      question: dto.question,
    });
    return new QAService(getSharedOllamaService()).askQuestion(dto);
  });
}
