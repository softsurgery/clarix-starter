import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private readonly count = signal(0);

  readonly loading = computed(() => this.count() > 0);

  constructor() {
    effect(() => {
      const loading = this.loading();
      document.body.classList.toggle('global-loader-active', loading);
      document.body.setAttribute('aria-busy', String(loading));

      document.querySelectorAll('.cdk-overlay-container').forEach((el) => {
        if (loading) {
          el.setAttribute('inert', '');
        } else {
          el.removeAttribute('inert');
        }
      });
    });
  }

  show(): void {
    this.count.update((value) => value + 1);
  }

  hide(): void {
    this.count.update((value) => Math.max(0, value - 1));
  }

  set(loading: boolean): void {
    this.count.set(loading ? 1 : 0);
  }
}
