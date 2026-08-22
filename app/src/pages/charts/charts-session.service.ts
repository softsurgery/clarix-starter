import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { ResponseChartSessionDto } from '@/types';

@Injectable({
  providedIn: 'root',
})
export class ChartSessionService {
  findAll(): Observable<ResponseChartSessionDto[]> {
    return from(window.electronAPI!.chartSession.findAll());
  }

  findOneById(id: string): Observable<ResponseChartSessionDto | null> {
    return from(window.electronAPI!.chartSession.findOneById(id));
  }

  delete(id: string): Observable<{ success: boolean }> {
    return from(window.electronAPI!.chartSession.delete(id));
  }

  deleteAll(): Observable<{ success: boolean }> {
    return from(window.electronAPI!.chartSession.deleteAll());
  }
}
