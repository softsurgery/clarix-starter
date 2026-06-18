import { Observable } from 'rxjs';

export type DialogActionVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: DialogActionVariant;
  disabled?: Observable<boolean>;
}

export interface DialogObject {
  title: string;
  description: string;
  component?: {
    outlet: any;
    props: any;
  };
  width?: string;
  closeOnEscape?: boolean;
  dismissable?: boolean;
  onHide?: () => void;
  actions?: DialogAction[];
}
