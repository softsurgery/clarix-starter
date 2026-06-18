import { Observable } from 'rxjs';

export type SheetActionVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export interface SheetAction {
  label: string;
  onClick: () => void;
  variant?: SheetActionVariant;
  disabled?: Observable<boolean>;
}

export interface SheetObject {
  title: string;
  description: string;
  component?: {
    outlet: any;
    props: any;
  };
  position?: 'left' | 'right' | 'top' | 'bottom';
  width?: string;
  closeOnEscape?: boolean;
  dismissable?: boolean;
  onHide?: () => void;
  actions?: SheetAction[];
}
