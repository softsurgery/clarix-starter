import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { QASessionService } from '../qa-session.service';
import type { ResponseQASessionDto } from '@/types';
import { DatatableBuilderComponent } from '@/components/datatable-builder/datatable-builder.component';
import { DynamicDataTable } from '@/components/datatable-builder/datatable-builder.types';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideCircleCheck,
  lucideCircleX,
  lucideClock,
  lucideDatabase,
  lucideScrollText,
  lucideChevronDown,
  lucideChevronUp,
} from '@ng-icons/lucide';
import { getSessionHistoryDataTableObject } from './utils/qa-history.data-table';

@Component({
  selector: 'app-qa-history',
  standalone: true,
  imports: [
    CommonModule,
    DatatableBuilderComponent,
    ...HlmButtonImports,
    ...HlmBadgeImports,
    ...HlmIconImports,
    NgIcon,
  ],
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideCircleCheck,
      lucideCircleX,
      lucideClock,
      lucideDatabase,
      lucideScrollText,
      lucideChevronDown,
      lucideChevronUp,
    }),
  ],
  templateUrl: 'qa-history.component.html',
  styleUrls: ['qa-history.component.css'],
})
export class QAHistoryComponent implements OnInit {
  @Input() onSessionDeleted?: () => void;

  private qaSessionService = inject(QASessionService);

  sessions = signal<ResponseQASessionDto[]>([]);
  loading = signal(true);
  inspecting = signal(false);
  inspectedSession = signal<ResponseQASessionDto | null>(null);
  logsExpanded = signal(false);

  data$ = new BehaviorSubject<ResponseQASessionDto[]>([]);
  totalRecords$ = new BehaviorSubject<number>(0);

  dataTableObject: DynamicDataTable<ResponseQASessionDto> = getSessionHistoryDataTableObject({
    onInspectAction: (row: ResponseQASessionDto) => this.inspectSession(row),
    onDeleteAction: (row: ResponseQASessionDto) => this.deleteSession(row.id),
  });

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.loading.set(true);
    this.qaSessionService.findAll().subscribe({
      next: (data) => {
        this.sessions.set(data);
        this.data$.next(data);
        this.totalRecords$.next(data.length);
        this.loading.set(false);
      },
      error: () => {
        this.sessions.set([]);
        this.data$.next([]);
        this.totalRecords$.next(0);
        this.loading.set(false);
      },
    });
  }

  inspectSession(session: ResponseQASessionDto) {
    this.inspectedSession.set(session);
    this.logsExpanded.set(false);
    this.inspecting.set(true);
  }

  backToTable() {
    this.inspecting.set(false);
    this.inspectedSession.set(null);
  }

  deleteSession(id: string) {
    this.qaSessionService.delete(id).subscribe({
      next: () => {
        this.sessions.update((s) => s.filter((item) => item.id !== id));
        this.data$.next(this.sessions());
        this.totalRecords$.next(this.sessions().length);
        this.onSessionDeleted?.();
      },
    });
  }

  formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  formatDate(date?: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
