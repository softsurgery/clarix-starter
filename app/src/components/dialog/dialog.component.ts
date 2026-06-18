import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Signal, AfterViewInit, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { DialogAction, DialogObject } from './types';
import { applyOverlayStyles, removeOverlayStyles } from '@/lib/overlay.lib';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [HlmDialogImports, HlmButtonImports, NgComponentOutlet],
  templateUrl: 'dialog.component.html',
  styleUrl: 'dialog.component.css',
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  private readonly dialogRef = inject(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<DialogObject>();

  protected readonly actions = this.context.actions ?? [];

  private readonly disabledSignals = new Map<DialogAction, Signal<boolean>>();

  ngAfterViewInit() {
    setTimeout(() => {
      applyOverlayStyles();
    }, 10);
  }

  ngOnDestroy() {
    removeOverlayStyles();
  }

  protected isDisabled(action: DialogAction): boolean {
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
    this.dialogRef.close();
  }

  onActionClick(action: DialogAction) {
    action.onClick();
  }
}
