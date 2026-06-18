import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { AskDatabaseQuestionDto, DatabaseQueryAgentResult } from '@/types';

@Injectable({
  providedIn: 'root',
})
export class DatabaseQueryAgentService {
  askQuestion(dto: AskDatabaseQuestionDto): Observable<DatabaseQueryAgentResult> {
    return from(window.electronAPI!.agent.askDatabase(dto));
  }
}
