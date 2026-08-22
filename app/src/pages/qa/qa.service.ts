import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { QADto, QAResult, OllamaModelOption } from '@/types';

@Injectable({
  providedIn: 'root',
})
export class QAService {
  askQuestion(dto: QADto): Observable<QAResult> {
    return from(window.electronAPI!.qa.askDatabase(dto));
  }

  models(): Observable<{ models: OllamaModelOption[] }> {
    return from(window.electronAPI!.agent.models());
  }
}
