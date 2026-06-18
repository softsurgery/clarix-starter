import { select, Store } from '@ngneat/elf';
import { Observable } from 'rxjs';

type ExtendedElfStore<T> = T & {
  errors?: Record<string, string[]>;
};

export type ElfBaseStore<T = any> = Store<
  {
    name: string;
    state: T;
    config: undefined;
  },
  T
>;

export class BaseStoreRepository<T = any> {
  private state$: Observable<ExtendedElfStore<T>>;
  private store: ElfBaseStore<ExtendedElfStore<T>>;
  private initialState: ExtendedElfStore<T>;

  constructor(
    state$: Observable<ExtendedElfStore<T>>,
    store: ElfBaseStore<ExtendedElfStore<T>>,
    initialState: T,
  ) {
    this.state$ = state$.pipe(select((state) => state));
    this.store = store;
    this.initialState = JSON.parse(JSON.stringify({ ...initialState }));
  }

  // utilities ****************************************************************************
  static normalizePath(args: string[] | [string[]], dotsplit = true): string[] {
    let path: string[] = [];

    if (Array.isArray(args[0])) {
      path = args[0] as string[];
    } else {
      path = args as string[];
    }

    if (dotsplit) {
      path = path.flatMap((segment) => segment.split('.'));
    }

    return path;
  }

  // non-observables ***********************************************************************
  set(field: keyof T, value: T[keyof T]) {
    this.store.update((state) => ({ ...state, [field]: value }));
  }

  get<K>(field: keyof T) {
    return this.store.getValue()[field] as K;
  }

  setState(state: Partial<T>) {
    this.store.update((prev) => ({ ...prev, ...state }));
  }

  getState() {
    return this.store.getValue();
  }

  getNested<T>(...args: string[] | [string[]]): T {
    const pathArray = BaseStoreRepository.normalizePath(args);
    return pathArray.reduce((obj, key) => {
      return obj && (obj as any)[key] !== undefined ? (obj as any)[key] : undefined;
    }, this.getState() as any) as T;
  }

  setNested(...args: [...(string[] | [string[]] | []), any, boolean?]): void {
    let dotsplit = true;

    if (typeof args[args.length - 1] === 'boolean') {
      dotsplit = args.pop() as boolean;
    }

    const value = args.pop();
    const pathArray = BaseStoreRepository.normalizePath(args as string[] | [string[]], dotsplit);

    this.store.update((state) => {
      const newState = { ...state };
      let current: any = newState;

      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (current[key] === undefined || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }

      current[pathArray[pathArray.length - 1]] = value;
      return newState;
    });
  }

  // observables **************************************************************************
  getObservable<K>(field: keyof T) {
    return this.store.pipe(select((state) => state[field])) as Observable<K>;
  }

  getNestedObservable<T>(...args: [...(string[] | [string[]] | []), boolean?]): Observable<T> {
    let dotsplit = true;

    if (typeof args[args.length - 1] === 'boolean') {
      dotsplit = args.pop() as boolean;
    }

    const pathArray = BaseStoreRepository.normalizePath(args as string[] | [string[]], dotsplit);

    return this.store.pipe(
      select((state) => {
        return pathArray.reduce((obj, key) => {
          return obj && obj[key] !== undefined ? obj[key] : undefined;
        }, state as any) as T;
      }),
    );
  }

  reset() {
    const deepCopy = JSON.parse(JSON.stringify(this.initialState));
    this.store.update(() => deepCopy);
  }
}
