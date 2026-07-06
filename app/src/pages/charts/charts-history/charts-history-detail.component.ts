import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartSessionService } from '../charts-session.service';
import type { ChartSessionChartSummary, ResponseChartSessionDto } from '@/types';
import { LayoutService } from '@/components/layout/layout.service';
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
  lucideTrash2,
  lucideChartLine,
} from '@ng-icons/lucide';
import { ChartPanelComponent } from '../chart-panel/chart-panel.component';

@Component({
  selector: 'app-charts-history-detail',
  standalone: true,
  imports: [
    CommonModule,
    ChartPanelComponent,
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
      lucideTrash2,
      lucideChartLine,
    }),
  ],
  templateUrl: 'charts-history-detail.component.html',
  styleUrls: ['charts-history-detail.component.css'],
})
export class ChartsHistoryDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chartSessionService = inject(ChartSessionService);
  public layoutService = inject(LayoutService);

  session = signal<ResponseChartSessionDto | null>(null);
  loading = signal(true);
  notFound = signal(false);
  logsExpanded = signal(false);
  deleting = signal(false);

  // Global tab state
  activeTab = signal<'details' | 'preview'>('details');

  charts = computed<ChartSessionChartSummary[]>(() => {
    const payload = this.session()?.chartsPayload;
    if (!payload) return [];

    try {
      const parsed = JSON.parse(payload);
      if (!Array.isArray(parsed)) return [];
      
      // Inject fallback option if missing so the preview tab always shows *something*
      // rather than the missing data message.
      return parsed.map((chart: ChartSessionChartSummary) => {
        if (!chart.option) {
          chart.option = {
            title: { text: chart.title, subtext: 'Reconstructed (Missing Data)', left: 'center' },
            xAxis: { type: 'category', data: ['No Data'] },
            yAxis: { type: 'value' },
            series: [{ type: 'bar', data: [0] }]
          };
        }
        return chart;
      });
    } catch {
      return [];
    }
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/agent-charts/history']);
      return;
    }

    this.loadSession(id);
  }

  setTab(tab: 'details' | 'preview') {
    this.activeTab.set(tab);
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  private loadSession(id: string) {
    this.loading.set(true);
    this.chartSessionService.findOneById(id).subscribe({
      next: (data) => {
        if (!data) {
          this.notFound.set(true);
          this.loading.set(false);
          this.layoutService.setBreadcrumbs([
            { label: 'Charts', url: '/agent-charts' },
            { label: 'History', url: '/agent-charts/history' },
            { label: 'Not found', url: '' },
          ]);
          this.layoutService.setIntro(
            'Session not found',
            'This history entry may have been deleted.',
          );
          return;
        }

        this.session.set(data);
        this.loading.set(false);
        this.setLayout(data);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  private setLayout(session: ResponseChartSessionDto) {
    const truncatedQuestion =
      session.question.length > 48 ? `${session.question.slice(0, 48)}…` : session.question;

    this.layoutService.setBreadcrumbs([
      { label: 'Charts', url: '/agent-charts' },
      { label: 'History', url: '/agent-charts/history' },
      { label: truncatedQuestion, url: '' },
    ]);
    this.layoutService.setIntro(
      'Session Detail',
      'Review the request, generated charts, SQL queries, and pipeline execution logs.',
    );
  }

  backToHistory() {
    this.router.navigate(['/agent-charts/history']);
  }

  deleteSession() {
    const session = this.session();
    if (!session || this.deleting()) return;

    this.deleting.set(true);
    this.chartSessionService.delete(session.id).subscribe({
      next: () => {
        this.router.navigate(['/agent-charts/history']);
      },
      error: () => {
        this.deleting.set(false);
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
