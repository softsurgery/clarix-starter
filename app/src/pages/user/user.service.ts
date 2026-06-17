import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type {
  CreateUserDto,
  FindManyQueryDto,
  PaginatedResponse,
  ResponseUserDto,
  UpdateUserDto,
} from '@/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  findAll(query: FindManyQueryDto = {}): Observable<ResponseUserDto[]> {
    return from(window.electronAPI!.user.findAll(query));
  }

  findAllPaginated(query: FindManyQueryDto = {}): Observable<PaginatedResponse<ResponseUserDto>> {
    return from(window.electronAPI!.user.findAllPaginated(query));
  }

  create(data: CreateUserDto): Observable<ResponseUserDto> {
    return from(window.electronAPI!.user.create(data));
  }

  update(id: string, data: UpdateUserDto): Observable<ResponseUserDto | null> {
    return from(window.electronAPI!.user.update(id, data));
  }

  delete(id: string): Observable<ResponseUserDto> {
    return from(window.electronAPI!.user.delete(id));
  }
}
