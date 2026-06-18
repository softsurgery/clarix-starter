import { DynamicField, FieldVariant } from '../form-builder.types';

export const getFieldBuilderObjectFactory = (): DynamicField => {
  return {
    id: crypto.randomUUID(),
    label: '',
    variant: FieldVariant.EMPTY,
    description: '',
    class: '',
    isRequired: false,
    isHidden: true,
    props: {},
  };
};
