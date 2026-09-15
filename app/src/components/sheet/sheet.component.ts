import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Signal, AfterViewInit, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { SheetContentBridgeDirective } from './sheet-content-bridge.directive';
import { SheetAction, SheetObject } from './types';
import { applyOverlayStyles, removeOverlayStyles } from '@/lib/overlay.lib';

@Component({
  selector: 'app-sheet',
  standalone: true,
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
  imports: [
    HlmSheetImports,
    HlmButtonImports,
    HlmIconImports,
    NgComponentOutlet,
    SheetContentBridgeDirective,
  ],
  providers: [provideIcons({ lucideX })],
})
export class SheetComponent implements AfterViewInit, OnDestroy {
  private readonly sheetRef = inject(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<SheetObject>();

  protected readonly actions = this.context.actions ?? [];

  private readonly disabledSignals = new Map<SheetAction, Signal<boolean>>();

  constructor() {
    for (const action of this.actions) {
      if (action.disabled) {
        this.disabledSignals.set(action, toSignal(action.disabled, { initialValue: false }));
      }
    }
  }

  ngAfterViewInit() {
    // Use setTimeout to ensure the overlay container is rendered
    setTimeout(() => {
      applyOverlayStyles();
    }, 10);
  }

  ngOnDestroy() {
    removeOverlayStyles();
  }

  protected isDisabled(action: SheetAction): boolean {
    return this.disabledSignals.get(action)?.() ?? false;
  }

  close() {
    removeOverlayStyles();
    this.context.onHide?.();
    this.sheetRef.close();
  }

  onActionClick(action: SheetAction) {
    action.onClick();
  }
}
