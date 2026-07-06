import { ChartSessionRepository } from '../repositories/chart-session.repository';
import { ChartSessionStatus } from '../enums/chart-session-status.enum';

export interface CreateChartSessionDto {
  question: string;
  dataSourceName?: string;
  dataSourceId?: string;
  status: ChartSessionStatus;
  title?: string;
  description?: string;
  chartCount?: number;
  chartsPayload?: string;
  error?: string;
  durationMs: number;
  logs?: string;
}

export interface ResponseChartSessionDto {
  id: string;
  question: string;
  dataSourceName?: string;
  dataSourceId?: string;
  status: ChartSessionStatus;
  title?: string;
  description?: string;
  chartCount?: number;
  chartsPayload?: string;
  error?: string;
  durationMs: number;
  logs?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ChartSessionService {
  private readonly repository = new ChartSessionRepository();

  async create(dto: CreateChartSessionDto): Promise<ResponseChartSessionDto> {
    const entity = this.repository.create({
      question: dto.question,
      dataSourceName: dto.dataSourceName,
      dataSourceId: dto.dataSourceId,
      status: dto.status,
      title: dto.title,
      description: dto.description,
      chartCount: dto.chartCount,
      chartsPayload: dto.chartsPayload,
      error: dto.error,
      durationMs: dto.durationMs,
      logs: dto.logs,
    });

    return this.repository.save(entity);
  }

  async findAll(): Promise<ResponseChartSessionDto[]> {
    return this.repository.findAll({
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findOneById(id: string): Promise<ResponseChartSessionDto | null> {
    return this.repository.findOneById(id);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async deleteAll(): Promise<void> {
    return this.repository.deleteAll();
  }
}
