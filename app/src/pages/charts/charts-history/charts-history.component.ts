import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ChartSessionService } from '../charts-session.service';
import type { ResponseChartSessionDto } from '@/types';
import { LayoutService } from '@/components/layout/layout.service';
import { DatatableBuilderComponent } from '@/components/datatable-builder/datatable-builder.component';
import { DynamicDataTable } from '@/components/datatable-builder/datatable-builder.types';
import { getChartHistoryDataTableObject } from './utils/charts-history.data-table';

@Component({
  selector: 'app-charts-history',
  standalone: true,
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: 'charts-history.component.html',
  styleUrls: ['charts-history.component.css'],
})
export class ChartsHistoryComponent implements OnInit, OnDestroy {
  private chartSessionService = inject(ChartSessionService);
  private layoutService = inject(LayoutService);
  private router = inject(Router);

  sessions = signal<ResponseChartSessionDto[]>([]);
  loading = signal(true);

  data$ = new BehaviorSubject<ResponseChartSessionDto[]>([]);
  totalRecords$ = new BehaviorSubject<number>(0);

  dataTableObject: DynamicDataTable<ResponseChartSessionDto> = getChartHistoryDataTableObject({
    onInspectAction: (row: ResponseChartSessionDto) => this.inspectSession(row),
    onDeleteAction: (row: ResponseChartSessionDto) => this.deleteSession(row.id),
  });

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      { label: 'Charts', url: '/agent-charts' },
      { label: 'History', url: '/agent-charts/history' },
    ]);
    this.layoutService.setIntro(
      'Session History',
      'Browse past chart generation sessions and their execution logs.',
    );
    this.loadSessions();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  loadSessions() {
    this.loading.set(true);
    this.chartSessionService.findAll().subscribe({
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

  inspectSession(session: ResponseChartSessionDto) {
    this.router.navigate(['/agent-charts/history', session.id]);
  }

  deleteSession(id: string) {
    this.chartSessionService.delete(id).subscribe({
      next: () => {
        this.sessions.update((s) => s.filter((item) => item.id !== id));
        this.data$.next(this.sessions());
        this.totalRecords$.next(this.sessions().length);
      },
    });
  }
}
