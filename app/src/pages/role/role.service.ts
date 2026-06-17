import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type {
  CreateRoleDto,
  FindManyQueryDto,
  PaginatedResponse,
  ResponseRoleDto,
  UpdateRoleDto,
} from '@/types';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  findAll(query: FindManyQueryDto = {}): Observable<ResponseRoleDto[]> {
    return from(window.electronAPI!.role.findAll(query));
  }

  findAllPaginated(query: FindManyQueryDto = {}): Observable<PaginatedResponse<ResponseRoleDto>> {
    return from(window.electronAPI!.role.findAllPaginated(query));
  }

  create(data: CreateRoleDto): Observable<ResponseRoleDto> {
    return from(window.electronAPI!.role.create({ ...data, permissions: data.permissions ?? [] }));
  }

  update(id: string, data: UpdateRoleDto): Observable<ResponseRoleDto | null> {
    return from(window.electronAPI!.role.update(id, { ...data, permissions: data.permissions ?? [] }));
  }

  delete(id: string): Observable<ResponseRoleDto> {
    return from(window.electronAPI!.role.delete(id));
  }
}
