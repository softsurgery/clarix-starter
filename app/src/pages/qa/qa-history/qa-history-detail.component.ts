import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QASessionService } from '../qa-session.service';
import type { ResponseQASessionDto } from '@/types';
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
} from '@ng-icons/lucide';

@Component({
  selector: 'app-qa-history-detail',
  standalone: true,
  imports: [CommonModule, ...HlmButtonImports, ...HlmBadgeImports, ...HlmIconImports, NgIcon],
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
    }),
  ],
  templateUrl: 'qa-history-detail.component.html',
  styleUrls: ['qa-history-detail.component.css'],
})
export class QAHistoryDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qaSessionService = inject(QASessionService);
  private layoutService = inject(LayoutService);

  session = signal<ResponseQASessionDto | null>(null);
  loading = signal(true);
  notFound = signal(false);
  logsExpanded = signal(false);
  deleting = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/agent/history']);
      return;
    }

    this.loadSession(id);
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  private loadSession(id: string) {
    this.loading.set(true);
    this.qaSessionService.findOneById(id).subscribe({
      next: (data) => {
        if (!data) {
          this.notFound.set(true);
          this.loading.set(false);
          this.layoutService.setBreadcrumbs([
            { label: 'Database Q&A', url: '/agent' },
            { label: 'History', url: '/agent/history' },
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

  private setLayout(session: ResponseQASessionDto) {
    const truncatedQuestion =
      session.question.length > 48 ? `${session.question.slice(0, 48)}…` : session.question;

    this.layoutService.setBreadcrumbs([
      { label: 'Database Q&A', url: '/agent' },
      { label: 'History', url: '/agent/history' },
      { label: truncatedQuestion, url: '' },
    ]);
    this.layoutService.setIntro(
      'Session Detail',
      'Review the question, generated SQL, answer, and pipeline execution logs.',
    );
  }

  backToHistory() {
    this.router.navigate(['/agent/history']);
  }

  deleteSession() {
    const session = this.session();
    if (!session || this.deleting()) return;

    this.deleting.set(true);
    this.qaSessionService.delete(session.id).subscribe({
      next: () => {
        this.router.navigate(['/agent/history']);
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
