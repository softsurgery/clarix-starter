import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { QASessionService } from '../qa-session.service';
import type { ResponseQASessionDto } from '@/types';
import { LayoutService } from '@/components/layout/layout.service';
import { DatatableBuilderComponent } from '@/components/datatable-builder/datatable-builder.component';
import { DynamicDataTable } from '@/components/datatable-builder/datatable-builder.types';
import { getSessionHistoryDataTableObject } from './utils/qa-history.data-table';

@Component({
  selector: 'app-qa-history',
  standalone: true,
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: 'qa-history.component.html',
  styleUrls: ['qa-history.component.css'],
})
export class QAHistoryComponent implements OnInit, OnDestroy {
  private qaSessionService = inject(QASessionService);
  private layoutService = inject(LayoutService);
  private router = inject(Router);

  sessions = signal<ResponseQASessionDto[]>([]);
  loading = signal(true);

  data$ = new BehaviorSubject<ResponseQASessionDto[]>([]);
  totalRecords$ = new BehaviorSubject<number>(0);

  dataTableObject: DynamicDataTable<ResponseQASessionDto> = getSessionHistoryDataTableObject({
    onInspectAction: (row: ResponseQASessionDto) => this.inspectSession(row),
    onDeleteAction: (row: ResponseQASessionDto) => this.deleteSession(row.id),
  });

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      { label: 'Database Q&A', url: '/agent' },
      { label: 'History', url: '/agent/history' },
    ]);
    this.layoutService.setIntro(
      'Session History',
      'Browse past Q&A sessions and their execution logs.',
    );
    this.loadSessions();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
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
    this.router.navigate(['/agent/history', session.id]);
  }

  deleteSession(id: string) {
    this.qaSessionService.delete(id).subscribe({
      next: () => {
        this.sessions.update((s) => s.filter((item) => item.id !== id));
        this.data$.next(this.sessions());
        this.totalRecords$.next(this.sessions().length);
      },
    });
  }
}
