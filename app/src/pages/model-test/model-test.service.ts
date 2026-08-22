import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { OllamaGenerateOptions, OllamaModelOption } from '@/types';

@Injectable({
  providedIn: 'root',
})
export class ModelTestService {
  health(): Observable<{ available: boolean }> {
    return from(window.electronAPI!.agent.health());
  }

  models(): Observable<{ models: OllamaModelOption[] }> {
    return from(window.electronAPI!.agent.models());
  }

  generate(prompt: string, options?: OllamaGenerateOptions): Observable<{ response: string }> {
    return from(window.electronAPI!.agent.generate(prompt, options ?? {}));
  }
}
