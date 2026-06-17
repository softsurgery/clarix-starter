import { DynamicField, DynamicForm, FieldVariant } from '../form-builder.types';

export const getSingleFieldObjectFactory = (field: DynamicField): DynamicForm => {
  return {
    title: '',
    description: '',
    isHeaderHidden: true,
    class: '',
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: [
          {
            fields: [field],
          },
        ],
      },
    ],
  };
};

export const emptyFieldObjectFactory = (): DynamicField => {
  return {
    id: crypto.randomUUID(),
    label: '',
    variant: FieldVariant.EMPTY,
    isRequired: undefined,
    isDisabled: undefined,
    props: {},
  };
};
