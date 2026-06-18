import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/components/layout/layout.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full p-8 text-center">
      <div class="bg-primary/10 text-primary p-4 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
      </div>
      <h1 class="text-3xl font-bold tracking-tight mb-2">Welcome to Clarix</h1>
      <p class="text-muted-foreground max-w-md">
        Select an option from the sidebar to manage your store, view orders, or access administrative tools.
      </p>
    </div>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      {
        label: 'Home',
        url: '/home',
      },
    ]);
    this.layoutService.setIntro('Dashboard', 'Overview of your store activities.');
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }
}
