import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Signal, AfterViewInit, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { SheetContentBridgeDirective } from './sheet-content-bridge.directive';
import { SheetAction, SheetObject } from './types';
import { applyOverlayStyles, removeOverlayStyles } from '@/lib/overlay.lib';

@Component({
  selector: 'app-sheet',
  standalone: true,
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
  imports: [HlmSheetImports, HlmButtonImports, NgComponentOutlet, SheetContentBridgeDirective],
})
export class SheetComponent implements AfterViewInit, OnDestroy {
  private readonly sheetRef = inject(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<SheetObject>();

  protected readonly actions = this.context.actions ?? [];

  private readonly disabledSignals = new Map<SheetAction, Signal<boolean>>();

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
    if (!action.disabled) return false;
    let sig = this.disabledSignals.get(action);
    if (!sig) {
      sig = toSignal(action.disabled, { initialValue: false });
      this.disabledSignals.set(action, sig);
    }
    return sig();
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
