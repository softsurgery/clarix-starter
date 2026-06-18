import { Injectable, ViewContainerRef } from '@angular/core';
import { BrnDialogService } from '@spartan-ng/brain/dialog';
import { SheetComponent } from './sheet.component';
import { SheetObject } from './types';

@Injectable({ providedIn: 'root' })
export class SheetService {
  constructor(private readonly brnDialog: BrnDialogService) {}

  open(viewContainerRef: ViewContainerRef, config: SheetObject) {
    const side = config.position ?? 'right';

    return this.brnDialog.open(SheetComponent, viewContainerRef, config, {
      closeOnBackdropClick: config.dismissable ?? true,
      disableClose: config.closeOnEscape === false,
      panelClass: [`sheet-side-${side}`],
    });
  }
}
