import { Injectable, ViewContainerRef } from '@angular/core';
import { BrnDialogService } from '@spartan-ng/brain/dialog';
import { DialogComponent } from './dialog.component';
import { DialogObject } from './types';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private readonly brnDialog: BrnDialogService) {}

  open(viewContainerRef: ViewContainerRef, config: DialogObject) {
    return this.brnDialog.open(DialogComponent, viewContainerRef, config, {
      closeOnBackdropClick: config.dismissable ?? true,
      disableClose: config.closeOnEscape === false,
    });
  }
}
