import { map } from 'rxjs';
import {
  DynamicField,
  DynamicForm,
  DynamicGrid,
  FieldVariant,
  NumberFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SliderFieldProps,
  SwitchFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { ConfigurationsRepository } from '@/stores/configurations-state/configurations-state.repository';
import type {
  ParamVariant,
  ParamViewMode,
  ResponseConfigurationNamespaceDto,
  ResponseConfigurationParamDto,
} from '@/types';

interface ConfigurationsFormStructureProps {
  store: ConfigurationsRepository;
  namespaces: ResponseConfigurationNamespaceDto[];
}

const SECRET_PARAM_PATTERN = /key|password|secret/i;

function formatLabel(value?: string): string {
  if (!value) return '';

  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (char) => char.toUpperCase())
    .replace(/\bApi\b/g, 'API')
    .replace(/\bUrl\b/g, 'URL');
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function toFieldVariant(param: ResponseConfigurationParamDto): FieldVariant {
  if (SECRET_PARAM_PATTERN.test(param.name ?? '')) {
    return FieldVariant.PASSWORD;
  }

  const viewModeMap: Partial<Record<ParamViewMode, FieldVariant>> = {
    slider: FieldVariant.SLIDER,
    textarea: FieldVariant.TEXTAREA,
  };

  if (param.viewMode && viewModeMap[param.viewMode]) {
    return viewModeMap[param.viewMode]!;
  }

  const variantMap: Record<ParamVariant, FieldVariant> = {
    string: FieldVariant.TEXT,
    number: FieldVariant.NUMBER,
    boolean: FieldVariant.SWITCH,
    select: FieldVariant.SELECT,
  };

  return variantMap[param.variant] ?? FieldVariant.TEXT;
}

function toField(store: ConfigurationsRepository, param: ResponseConfigurationParamDto): DynamicField {
  const path = `values.${param.id}`;
  const variant = toFieldVariant(param);
  const label = formatLabel(param.name);
  const description = param.description;

  if (variant === FieldVariant.SELECT) {
    const field: DynamicField<SelectFieldProps> = {
      id: String(param.id),
      label,
      description,
      variant,
      props: {
        placeholder: `Select ${label.toLowerCase()}`,
        options: (param.options ?? []).map((option) => ({
          name: option.label,
          code: option.value,
        })),
        value: store.getNestedObservable<string>(path),
        onSelectChange: (code: string) => {
          store.setNested(path, code);
        },
      },
    };
    return field;
  }

  if (variant === FieldVariant.NUMBER) {
    const field: DynamicField<NumberFieldProps> = {
      id: String(param.id),
      label,
      description,
      variant,
      props: {
        value: store.getNestedObservable<string>(path),
        onChange: (value: string) => {
          store.setNested(path, String(value ?? ''));
        },
      },
    };
    return field;
  }

  if (variant === FieldVariant.SLIDER) {
    const field: DynamicField<SliderFieldProps> = {
      id: String(param.id),
      label,
      description,
      variant,
      props: {
        value: store.getNestedObservable<string>(path),
        min: param.min ?? 0,
        max: param.max ?? 1,
        step: param.step ?? 0.1,
        onChange: (value: string) => {
          store.setNested(path, String(value ?? ''));
        },
      },
    };
    return field;
  }

  if (variant === FieldVariant.TEXTAREA) {
    const field: DynamicField<TextareaFieldProps> = {
      id: String(param.id),
      label,
      description,
      variant,
      props: {
        placeholder: label,
        rows: 4,
        value: store.getNestedObservable<string>(path),
        onChange: (value: string) => {
          store.setNested(path, value);
        },
      },
    };
    return field;
  }

  if (variant === FieldVariant.SWITCH) {
    const field: DynamicField<SwitchFieldProps> = {
      id: String(param.id),
      label,
      description,
      variant,
      props: {
        checked: store.getNestedObservable<string>(path).pipe(map((value) => value === 'true')),
        onCheckedChange: (value: boolean) => {
          store.setNested(path, value ? 'true' : 'false');
        },
      },
    };
    return field;
  }

  if (variant === FieldVariant.PASSWORD) {
    const field: DynamicField<PasswordFieldProps> = {
      id: String(param.id),
      label,
      description,
      variant,
      props: {
        placeholder: label,
        value: store.getNestedObservable<string>(path),
        onChange: (value: string) => {
          store.setNested(path, value);
        },
      },
    };
    return field;
  }

  const field: DynamicField<TextFieldProps> = {
    id: String(param.id),
    label,
    description,
    variant: FieldVariant.TEXT,
    props: {
      placeholder: label,
      value: store.getNestedObservable<string>(path),
      onChange: (value: string) => {
        store.setNested(path, value);
      },
    },
  };
  return field;
}

export const getConfigurationsFormStructure = ({
  store,
  namespaces,
}: ConfigurationsFormStructureProps): DynamicForm => {
  const grids: DynamicGrid[] = [...namespaces]
    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
    .map((namespace) => {
      const params = [...(namespace.params ?? [])].sort((a, b) => a.id - b.id);

      return {
        title: formatLabel(namespace.name),
        description: namespace.description,
        gridItems: chunk(params, 2).map((row) => ({
          fields: row.map((param) => toField(store, param)),
        })),
      };
    });

  return {
    title: 'Application Configurations',
    description: 'Configure application parameters stored in the configuration database.',
    isHeaderHidden: true,
    grids,
  };
};
