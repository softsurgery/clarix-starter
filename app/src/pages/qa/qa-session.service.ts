import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { ResponseQASessionDto } from '@/types';

@Injectable({
  providedIn: 'root',
})
export class QASessionService {
  findAll(): Observable<ResponseQASessionDto[]> {
    return from(window.electronAPI!.qaSession.findAll());
  }

  findOneById(id: string): Observable<ResponseQASessionDto | null> {
    return from(window.electronAPI!.qaSession.findOneById(id));
  }

  delete(id: string): Observable<{ success: boolean }> {
    return from(window.electronAPI!.qaSession.delete(id));
  }

  deleteAll(): Observable<{ success: boolean }> {
    return from(window.electronAPI!.qaSession.deleteAll());
  }
}
