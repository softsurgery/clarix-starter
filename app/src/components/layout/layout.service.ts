import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const SIDEBAR_KEY = 'layout.sidebar.visible';
const THEME_KEY = 'layout.theme';

export type AppTheme = 'light' | 'dark' | 'system';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isSidebarVisible = new BehaviorSubject<boolean>(this.getBoolean(SIDEBAR_KEY, true));

  theme = new BehaviorSubject<AppTheme>(this.getTheme());

  breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);

  intro: {
    title: string;
    description: string;
  } = {
    title: '',
    description: '',
  };

  injectableFooter = new BehaviorSubject<{
    component: any;
    inputs?: { [key: string]: any };
  }>({
    component: null,
    inputs: {},
  });

  constructor() {
    this.applyTheme(this.theme.value);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme.value === 'system') {
        this.applyTheme('system');
      }
    });
  }

  toggleSidebar(): void {
    const value = !this.isSidebarVisible.value;
    this.isSidebarVisible.next(value);
    localStorage.setItem(SIDEBAR_KEY, String(value));
  }

  setTheme(theme: AppTheme): void {
    this.theme.next(theme);
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
  }

  setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
    console.log('[LayoutService] Setting breadcrumbs:', breadcrumbs);
    this.breadcrumbs.next(breadcrumbs);
  }

  clearBreadcrumbs() {
    this.breadcrumbs.next([]);
  }

  setIntro(title: string, description: string) {
    this.intro = { title, description };
  }

  clearIntro() {
    this.intro = { title: '', description: '' };
  }

  setFooter(component: any, inputs?: { [key: string]: any }): void {
    this.injectableFooter.next({ component, inputs });
  }

  clearFooter(): void {
    this.injectableFooter.next({ component: null, inputs: {} });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  private applyTheme(theme: AppTheme): void {
    const html = document.documentElement;
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const enabled = effectiveTheme === 'dark';
    html.classList.toggle('dark', enabled);
    html.setAttribute('data-theme', effectiveTheme);
  }

  private getBoolean(key: string, fallback: boolean): boolean {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === 'true';
  }

  private getTheme(): AppTheme {
    const value = localStorage.getItem(THEME_KEY) as AppTheme;
    return value || 'system';
  }
}
