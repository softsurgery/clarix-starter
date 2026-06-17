import { DynamicDataTable } from "../datatable-builder.types";

export const getDatatableBuilderObjectFactory = (): DynamicDataTable => {
  return {
    singular: '',
    plural: '',
    rowActions: {},
    sizes: [],
    columns: [],
  };
};
