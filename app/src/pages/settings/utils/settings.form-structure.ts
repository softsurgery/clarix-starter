import { map } from 'rxjs';
import {
  DynamicField,
  DynamicForm,
  DynamicGrid,
  FieldVariant,
  NumberFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SwitchFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { SettingsRepository } from '@/stores/settings-state/settings-state.repository';
import type {
  ParamVariant,
  ResponseConfigurationNamespaceDto,
  ResponseConfigurationParamDto,
} from '@/types';

interface SettingsFormStructureProps {
  store: SettingsRepository;
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

  const variantMap: Record<ParamVariant, FieldVariant> = {
    string: FieldVariant.TEXT,
    number: FieldVariant.NUMBER,
    boolean: FieldVariant.SWITCH,
    select: FieldVariant.SELECT,
  };

  return variantMap[param.variant] ?? FieldVariant.TEXT;
}

function toField(
  store: SettingsRepository,
  param: ResponseConfigurationParamDto,
): DynamicField {
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

export const getSettingsFormStructure = ({
  store,
  namespaces,
}: SettingsFormStructureProps): DynamicForm => {
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
    title: 'Application Settings',
    description: 'Configure application parameters stored in the configuration database.',
    isHeaderHidden: true,
    grids,
  };
};
