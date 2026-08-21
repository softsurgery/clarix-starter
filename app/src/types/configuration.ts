export type ParamVariant = 'string' | 'number' | 'boolean' | 'select';

export interface ResponseConfigurationParamDto {
  id: number;
  name?: string;
  description?: string;
  namespaceId: string;
  variant: ParamVariant;
  value?: string;
  options?: { label: string; value: string }[];
}

export interface ResponseConfigurationNamespaceDto {
  id: string;
  name?: string;
  description?: string;
  params?: ResponseConfigurationParamDto[];
  userId?: string | null;
}

export interface UpdateConfigurationParamaterDto {
  id: number;
  value: string;
}
