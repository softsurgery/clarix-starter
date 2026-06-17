import { DynamicForm } from "../form-builder.types";

export const getFormBuilderObjectFactory = (): DynamicForm => {
  return {
    title: "",
    description: "",
    class: "",
    grids: [],
  };
};
