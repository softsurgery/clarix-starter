import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { LayoutService } from '@/components/layout/layout.service';
import { ConfigurationsService } from '@/pages/configurations/configurations.service';
import { ConfigurationsRepository } from '@/stores/configurations-state/configurations-state.repository';
import { ConfigurationsFooterComponent } from '@/pages/configurations/configurations-footer.component';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { SidebarNavComponent } from '@/components/sidebar-nav/sidebar-nav.component';
import { SidebarNavItem } from '@/components/sidebar-nav/sidebar-nav.types';
import type {
  ResponseConfigurationNamespaceDto,
  UpdateConfigurationParamaterDto,
  OllamaModelOption,
} from '@/types';
import { getConfigurationsFormStructure } from './utils/configurations.form-structure';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [CommonModule, FormBuilderComponent, SidebarNavComponent, ...HlmBadgeImports],
  templateUrl: './configurations.component.html',
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private configurationsService = inject(ConfigurationsService);
  private store = inject(ConfigurationsRepository);

  saving = signal(false);
  testing = signal(false);
  testStatus = signal<string | null>(null);
  testModels = signal<OllamaModelOption[]>([]);

  namespaces = signal<ResponseConfigurationNamespaceDto[]>([]);
  activeNamespaceId = signal<string | null>(null);

  sidebarItems = computed<SidebarNavItem[]>(() => {
    return this.namespaces()
      .slice()
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
      .map((ns) => ({
        id: String(ns.id),
        title: this.formatLabel(ns.name),
      }));
  });

  activeNamespace = computed(() => {
    const id = this.activeNamespaceId();
    if (!id) return this.namespaces()[0] || null;
    return this.namespaces().find((ns) => String(ns.id) === id) || this.namespaces()[0] || null;
  });

  formStructure = computed(() => {
    const active = this.activeNamespace();
    if (!active) return null;
    return getConfigurationsFormStructure({ store: this.store, namespaces: [active] });
  });

  private formatLabel(value?: string): string {
    if (!value) return '';
    return value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/^./, (char) => char.toUpperCase())
      .replace(/\bApi\b/g, 'API')
      .replace(/\bUrl\b/g, 'URL');
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Configurations', url: '/configurations' }]);
    this.layoutService.setIntro(
      'Configurations',
      'Configure global Ollama and Python configurations stored in the configuration database.',
    );
    this.layoutService.setFooter(ConfigurationsFooterComponent, {
      saving: this.saving,
      testing: this.testing,
      onTest: () => this.onTest(),
      onSave: () => this.onSave(),
    });

    this.loadConfigurations();
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
    this.layoutService.clearFooter();
  }

  private loadConfigurations() {
    this.configurationsService.findAllGlobal().subscribe({
      next: (namespaces) => {
        this.namespaces.set(namespaces);
        if (namespaces.length > 0 && !this.activeNamespaceId()) {
          this.activeNamespaceId.set(String(namespaces[0].id));
        }
        this.applyNamespaces(namespaces);
      },
      error: () => {
        toast.error('Failed to load configurations');
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
  }

  onSidebarSelect(item: SidebarNavItem) {
    this.activeNamespaceId.set(item.id);
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
    this.configurationsService.updateParams(this.getUpdateDtos()).subscribe({
      next: () => {
        this.saving.set(false);
        toast.success('Configurations saved');
        // Reload configurations to ensure we have the latest state, but keep active tab
        this.loadConfigurations();
      },
      error: () => {
        this.saving.set(false);
        toast.error('Failed to save configurations');
      },
    });
  }

  onTest() {
    this.testing.set(true);
    this.testStatus.set(null);
    this.testModels.set([]);

    this.configurationsService.testOllama().subscribe({
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
