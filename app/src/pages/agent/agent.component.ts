import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '@/components/layout/layout.service';

@Component({
  selector: 'app-agent',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full p-8 max-w-4xl mx-auto w-full">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Test Agent Model</h1>
      <p class="text-muted-foreground mb-6">
        Send a prompt to the local Ollama agent and test its response. Make sure Ollama is running and the model specified in .env is downloaded.
      </p>

      <div class="flex flex-col flex-1 bg-card rounded-lg border shadow-sm p-4 min-h-[400px]">
        <div class="flex-1 overflow-y-auto mb-4 p-4 border rounded bg-muted/30 whitespace-pre-wrap text-sm font-mono">
          {{ response() || 'No response yet. Send a prompt to start.' }}
        </div>
        
        <div class="flex gap-2">
          <input 
            type="text" 
            [(ngModel)]="prompt" 
            (keydown.enter)="sendPrompt()"
            [disabled]="loading()"
            placeholder="Type your prompt here..." 
            class="flex-1 px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            (click)="sendPrompt()" 
            [disabled]="loading() || !prompt.trim()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
            {{ loading() ? 'Generating...' : 'Send' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AgentComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  
  prompt = '';
  response = signal<string>('');
  loading = signal<boolean>(false);

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      { label: 'Agent Testing', url: '/agent' },
    ]);
    this.layoutService.setIntro('Agent Testing', 'Test the local AI model integration via IPC.');
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  async sendPrompt() {
    if (!this.prompt.trim() || this.loading()) return;
    
    this.loading.set(true);
    this.response.set('Generating response...');
    
    try {
      const res = await window.electronAPI?.agent.generate(this.prompt);
      this.response.set(res?.response || 'No response received.');
      this.prompt = ''; // clear input
    } catch (err: any) {
      this.response.set('Error: ' + err.message);
    } finally {
      this.loading.set(false);
    }
  }
}
