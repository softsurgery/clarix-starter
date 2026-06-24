import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { ChartsDto, ChartsResult } from '@/types';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  generate(dto: ChartsDto): Observable<ChartsResult> {
    return from(window.electronAPI!.charts.generate(dto));
  }
}
