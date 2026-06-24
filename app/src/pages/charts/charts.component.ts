import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LayoutService } from '@/components/layout/layout.service';
import { DataSourceService } from '@/pages/data-sources/data-source.service';
import { ChartsService } from '@/pages/charts/charts.service';
import type { ChartsResult, ResponseDataSourceDto } from '@/types';
import { ChartsInputComponent } from './chart-input/charts-input.component';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMaximize2, lucideMinimize2 } from '@ng-icons/lucide';
import { ChartPanelComponent } from './chart-panel/chart-panel.component';

@Component({
  selector: 'app-charts',
  imports: [
    CommonModule,
    FormsModule,
    BrnSelectImports,
    HlmSelectImports,
    ...HlmButtonImports,
    ...HlmIconImports,
    NgIcon,
    ChartPanelComponent,
  ],
  viewProviders: [provideIcons({ lucideMaximize2, lucideMinimize2 })],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private dataSourceService = inject(DataSourceService);
  private chartsService = inject(ChartsService);

  @ViewChild('dashboardRef') dashboardRef?: ElementRef<HTMLElement>;

  question = '';
  selectedDataSourceId: string | null = null;
  dataSources = signal<ResponseDataSourceDto[]>([]);
  result = signal<ChartsResult | null>(null);
  loading = signal<boolean>(false);
  isFullscreen = signal<boolean>(false);

  private readonly onFullscreenChange = () => {
    this.isFullscreen.set(document.fullscreenElement === this.dashboardRef?.nativeElement);
  };

  itemToString = (value: any): string => {
    const ds = this.dataSources().find((d) => d.id === value);
    return ds ? `${ds.name} (${ds.type})` : (value?.toString() ?? '');
  };

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Charts', url: '/agent-charts' }]);
    this.layoutService.setIntro(
      'AI Charts & Dashboards',
      'Ask for charts or full dashboards — AI writes SQL and renders them with Apache ECharts.',
    );
    this.layoutService.setFooter(ChartsInputComponent, { charts: this });
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
    this.loadDataSources();
  }

  ngOnDestroy() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    if (document.fullscreenElement === this.dashboardRef?.nativeElement) {
      document.exitFullscreen().catch(() => undefined);
    }
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
    this.layoutService.clearFooter();
  }

  async loadDataSources() {
    try {
      const sources = await firstValueFrom(this.dataSourceService.findAll());
      this.dataSources.set(sources);
      if (sources.length === 1) {
        this.selectedDataSourceId = sources[0].id;
      }
    } catch (err) {
      console.error('Failed to load data sources:', err);
    }
  }

  async generateCharts() {
    if (!this.question.trim() || !this.selectedDataSourceId || this.loading()) return;

    this.loading.set(true);
    this.result.set(null);

    try {
      const response = await firstValueFrom(
        this.chartsService.generate({
          dataSourceId: this.selectedDataSourceId,
          question: this.question.trim(),
        }),
      );
      this.result.set(response);
      this.question = '';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.result.set({ success: false, error: message });
    } finally {
      this.loading.set(false);
    }
  }

  async toggleFullscreen() {
    const el = this.dashboardRef?.nativeElement;
    if (!el) return;

    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (err) {
      console.error('Failed to toggle fullscreen:', err);
    }
  }
}
