import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { LayoutService } from '@/components/layout/layout.service';
import { SettingsService } from '@/pages/settings/settings.service';
import { SettingsRepository } from '@/stores/settings-state/settings-state.repository';
import { getSettingsFormStructure } from '@/pages/settings/utils/settings.form-structure';
import { SettingsFooterComponent } from '@/pages/settings/settings-footer.component';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import type {
  ResponseConfigurationNamespaceDto,
  UpdateConfigurationParamaterDto,
} from '@/types';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormBuilderComponent, ...HlmBadgeImports],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private settingsService = inject(SettingsService);
  private store = inject(SettingsRepository);

  saving = signal(false);
  testing = signal(false);
  formStructure = signal<any>(null);
  testStatus = signal<string | null>(null);
  testModels = signal<string[]>([]);

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Settings', url: '/settings' }]);
    this.layoutService.setIntro(
      'Settings',
      'Configure global Ollama and Python settings stored in the configuration database.',
    );
    this.layoutService.setFooter(SettingsFooterComponent, {
      saving: this.saving,
      testing: this.testing,
      onTest: () => this.onTest(),
      onSave: () => this.onSave(),
    });

    this.loadSettings();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
    this.layoutService.clearFooter();
  }

  private loadSettings() {
    this.settingsService.findAllGlobal().subscribe({
      next: (namespaces) => {
        this.applyNamespaces(namespaces);
      },
      error: () => {
        toast.error('Failed to load settings');
      },
    });
  }

  private applyNamespaces(namespaces: ResponseConfigurationNamespaceDto[]) {
    const values: Record<number, string> = {};

    for (const namespace of namespaces) {
      for (const param of namespace.params ?? []) {
        values[param.id] = param.value ?? '';
      }
    }

    this.store.set('values', values);
    this.formStructure.set(getSettingsFormStructure({ store: this.store, namespaces }));
  }

  private getUpdateDtos(): UpdateConfigurationParamaterDto[] {
    const values = this.store.get<Record<number, string>>('values');
    return Object.entries(values).map(([id, value]) => ({
      id: Number(id),
      value: value ?? '',
    }));
  }

  onSave() {
    this.saving.set(true);
    this.settingsService.updateParams(this.getUpdateDtos()).subscribe({
      next: () => {
        this.saving.set(false);
        toast.success('Settings saved');
        this.loadSettings();
      },
      error: () => {
        this.saving.set(false);
        toast.error('Failed to save settings');
      },
    });
  }

  onTest() {
    this.testing.set(true);
    this.testStatus.set(null);
    this.testModels.set([]);

    this.settingsService.testOllama().subscribe({
      next: (result) => {
        this.testing.set(false);
        this.testStatus.set(
          result.available
            ? `Connected — ${result.models.length} model(s) available`
            : 'Ollama backend unavailable',
        );
        this.testModels.set(result.models);

        if (result.available) {
          toast.success('Ollama connection successful');
        } else {
          toast.error('Ollama connection failed');
        }
      },
      error: () => {
        this.testing.set(false);
        toast.error('Failed to test Ollama connection');
      },
    });
  }
}
