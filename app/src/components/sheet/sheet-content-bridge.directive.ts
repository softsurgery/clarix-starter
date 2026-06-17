import { Directive, inject, signal } from '@angular/core';
import {
  provideExposedSideProviderExisting,
  provideExposesStateProviderExisting,
} from '@spartan-ng/brain/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { SheetObject } from './types';

@Directive({
  selector: '[sheetContentBridge]',
  standalone: true,
  providers: [
    provideExposesStateProviderExisting(() => SheetContentBridgeDirective),
    provideExposedSideProviderExisting(() => SheetContentBridgeDirective),
  ],
})
export class SheetContentBridgeDirective {
  private readonly dialogRef = inject(BrnDialogRef);
  private readonly context = injectBrnDialogContext<SheetObject>({ optional: true });

  readonly state = this.dialogRef.state;
  readonly side = signal(
    (this.context?.position ?? 'right') as 'top' | 'bottom' | 'left' | 'right',
  );
}
