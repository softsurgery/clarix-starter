import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type {
  CreateDataSourceDto,
  FindManyQueryDto,
  PaginatedResponse,
  ResponseDataSourceDto,
  UpdateDataSourceDto,
} from '@/types';

@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  findAll(query: FindManyQueryDto = {}): Observable<ResponseDataSourceDto[]> {
    return from(window.electronAPI!.dataSource.findAll(query));
  }

  findAllPaginated(
    query: FindManyQueryDto = {},
  ): Observable<PaginatedResponse<ResponseDataSourceDto>> {
    return from(window.electronAPI!.dataSource.findAllPaginated(query));
  }

  findOneById(id: string): Observable<ResponseDataSourceDto | null> {
    return from(window.electronAPI!.dataSource.findOneById(id));
  }

  create(data: CreateDataSourceDto): Observable<ResponseDataSourceDto> {
    return from(window.electronAPI!.dataSource.create(data));
  }

  update(id: string, data: UpdateDataSourceDto): Observable<ResponseDataSourceDto | null> {
    return from(window.electronAPI!.dataSource.update(id, data));
  }

  delete(id: string): Observable<ResponseDataSourceDto> {
    return from(window.electronAPI!.dataSource.delete(id));
  }

  testConnection(id: string): Observable<{ success: boolean; message: string }> {
    return from(window.electronAPI!.dataSource.testConnection(id));
  }
}
