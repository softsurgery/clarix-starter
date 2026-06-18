import { QASessionRepository } from '../repositories/qa-session.repository';
import { QASessionEntity } from '../entities/qa-session.entity';
import { QASessionStatus } from '../enums/qa-session-status.enum';

export interface CreateAgentSessionDto {
  question: string;
  dataSourceName?: string;
  dataSourceId?: string;
  status: QASessionStatus;
  generatedSql?: string;
  answer?: string;
  rowCount?: number;
  error?: string;
  durationMs: number;
  logs?: string;
}

export interface ResponseAgentSessionDto {
  id: string;
  question: string;
  dataSourceName?: string;
  dataSourceId?: string;
  status: QASessionStatus;
  generatedSql?: string;
  answer?: string;
  rowCount?: number;
  error?: string;
  durationMs: number;
  logs?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class QASessionService {
  private readonly repository = new QASessionRepository();

  async create(dto: CreateAgentSessionDto): Promise<ResponseAgentSessionDto> {
    const entity = this.repository.create({
      question: dto.question,
      dataSourceName: dto.dataSourceName,
      dataSourceId: dto.dataSourceId,
      status: dto.status,
      generatedSql: dto.generatedSql,
      answer: dto.answer,
      rowCount: dto.rowCount,
      error: dto.error,
      durationMs: dto.durationMs,
      logs: dto.logs,
    });

    return this.repository.save(entity);
  }

  async findAll(): Promise<ResponseAgentSessionDto[]> {
    return this.repository.findAll({
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findOneById(id: string): Promise<ResponseAgentSessionDto | null> {
    return this.repository.findOneById(id);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async deleteAll(): Promise<void> {
    return this.repository.deleteAll();
  }
}
