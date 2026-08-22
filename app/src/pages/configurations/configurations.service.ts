import { Injectable } from '@angular/core';
import { forkJoin, from, map, Observable } from 'rxjs';
import type {
  ResponseConfigurationNamespaceDto,
  ResponseConfigurationParamDto,
  UpdateConfigurationParamaterDto,
  OllamaModelOption,
} from '@/types';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationsService {
  findAllGlobal(): Observable<ResponseConfigurationNamespaceDto[]> {
    return from(window.electronAPI!.configuration.findAllGlobal());
  }

  updateParams(
    dtos: UpdateConfigurationParamaterDto[],
  ): Observable<ResponseConfigurationParamDto[]> {
    return from(window.electronAPI!.configuration.updateParams(dtos));
  }

  testOllama(): Observable<{ available: boolean; models: OllamaModelOption[] }> {
    return forkJoin({
      health: from(window.electronAPI!.agent.health()),
      models: from(window.electronAPI!.agent.models()),
    }).pipe(
      map(({ health, models }) => ({
        available: health.available,
        models: models.models,
      })),
    );
  }
}
