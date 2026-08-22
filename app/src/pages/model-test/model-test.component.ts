import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { LayoutService } from '@/components/layout/layout.service';
import { ModelTestService } from '@/pages/model-test/model-test.service';
import { ModelTestInputComponent } from '@/pages/model-test/model-test-input.component';
import type { OllamaModelOption } from '@/types';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
  selector: 'app-model-test',
  imports: [CommonModule, FormsModule, ...HlmBadgeImports, BrnSelectImports, HlmSelectImports],
  templateUrl: './model-test.component.html',
  styleUrls: ['./model-test.component.css'],
})
export class ModelTestComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private modelTestService = inject(ModelTestService);

  prompt = 'Say hello in one short sentence.';
  selectedModel: string | null = null;
  available = signal<boolean | null>(null);
  models = signal<OllamaModelOption[]>([]);
  response = signal<string | null>(null);
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  checkingStatus = signal<boolean>(true);

  itemToString = (value: unknown): string => {
    const name = value?.toString() ?? '';
    const model = this.models().find((item) => item.name === name);
    if (!model) return name;
    return `${model.name} · ${model.premium ? 'Premium' : 'Free'}`;
  };

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Model Test', url: '/model-test' }]);
    this.layoutService.setIntro(
      'Model Test',
      'Check Ollama connectivity and send a test prompt to the configured backend model.',
    );
    this.layoutService.setFooter(ModelTestInputComponent, { modelTest: this });
    void this.refreshStatus();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
    this.layoutService.clearFooter();
  }

  async refreshStatus() {
    this.checkingStatus.set(true);
    this.error.set(null);

    try {
      const [health, modelList] = await Promise.all([
        firstValueFrom(this.modelTestService.health()),
        firstValueFrom(this.modelTestService.models()),
      ]);

      this.available.set(health.available);
      this.models.set(modelList.models);

      if (modelList.models.length > 0 && !this.selectedModel) {
        this.selectedModel = modelList.models[0].name;
      }
    } catch (err: unknown) {
      this.available.set(false);
      this.models.set([]);
      const message = err instanceof Error ? err.message : 'Failed to check model status';
      this.error.set(message);
    } finally {
      this.checkingStatus.set(false);
    }
  }

  async runTest() {
    if (!this.prompt.trim() || this.loading()) return;

    this.loading.set(true);
    this.response.set(null);
    this.error.set(null);

    try {
      const result = await firstValueFrom(
        this.modelTestService.generate(this.prompt.trim(), {
          ...(this.selectedModel ? { model: this.selectedModel } : {}),
        }),
      );
      this.response.set(result.response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
