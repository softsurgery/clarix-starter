import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LayoutService } from '@/components/layout/layout.service';
import { DataSourceService } from '@/pages/data-sources/data-source.service';
import { DatabaseQueryAgentService } from '@/pages/qa/qa-query.service';
import type { DatabaseQueryAgentResult, ResponseDataSourceDto } from '@/types';
import { QAnputComponent } from './qa-input/qa-input.component';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
  selector: 'app-agent',
  imports: [CommonModule, FormsModule, BrnSelectImports, HlmSelectImports],
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.css'],
})
export class QAComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private dataSourceService = inject(DataSourceService);
  private databaseQueryAgentService = inject(DatabaseQueryAgentService);

  question = '';
  selectedDataSourceId: string | null = null;
  dataSources = signal<ResponseDataSourceDto[]>([]);
  result = signal<DatabaseQueryAgentResult | null>(null);
  loading = signal<boolean>(false);

  itemToString = (value: any): string => {
    const ds = this.dataSources().find((d) => d.id === value);
    return ds ? `${ds.name} (${ds.type})` : value?.toString() ?? '';
  };

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Agent Testing', url: '/agent' }]);
    this.layoutService.setIntro(
      'Database Q&A',
      'Ask questions about your connected databases using natural language.',
    );
    this.layoutService.setFooter(QAnputComponent, { agent: this });
    this.loadDataSources();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
    this.layoutService.clearFooter();
  }

  private async loadDataSources() {
    try {
      const sources = await firstValueFrom(this.dataSourceService.findAll());
      this.dataSources.set(sources.filter((ds) => ds.isActive));
    } catch {
      this.dataSources.set([]);
    }
  }

  async askQuestion() {
    if (!this.question.trim() || !this.selectedDataSourceId || this.loading()) return;

    this.loading.set(true);
    this.result.set(null);

    try {
      const response = await firstValueFrom(
        this.databaseQueryAgentService.askQuestion({
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
}
