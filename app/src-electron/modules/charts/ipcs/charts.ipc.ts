import { ChartsService } from '../services/charts.service';
import { ipcMain } from 'electron';
import { AskChartsDto } from '../interfaces/ask-chart.dto';
import { getSharedOllamaService } from '@/modules/agent/services/ollama-instance';

export function registerChartsHandlers(): void {
  ipcMain.handle('charts:generate', async (_event, dto: AskChartsDto) => {
    console.log('[ChartsIPC] charts:generate invoked', {
      dataSourceId: dto.dataSourceId,
      question: dto.question,
    });
    return new ChartsService(getSharedOllamaService()).generateCharts(dto);
  });
}
