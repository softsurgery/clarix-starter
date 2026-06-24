import { ipcMain } from 'electron';
import { OllamaService } from '@/modules/agent/services/ollama.service';
import { ChartsService } from '../services/charts.service';
import { AskChartsDto } from '../interfaces/ask-chart.dto';

export function registerChartsHandlers(): void {
  const ollamaService = new OllamaService();
  ollamaService.init();
  const service = new ChartsService(ollamaService);

  ipcMain.handle('charts:generate', async (_event, dto: AskChartsDto) => {
    console.log('[ChartsIPC] charts:generate invoked', {
      dataSourceId: dto.dataSourceId,
      question: dto.question,
    });
    return service.generateCharts(dto);
  });
}
