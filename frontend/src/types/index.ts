export interface FormSchema {
  id: number;
  name: string;
  description: string;
  jsonSchema: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormSchemaDto {
  name: string;
  description: string;
  jsonSchema: string;
}

export interface UpdateFormSchemaDto {
  name?: string;
  description?: string;
  jsonSchema?: string;
}

export interface FormField {
  id: string;
  fieldName: string;
  fieldLabel: string;
  inputType: InputType;
  isRequired: boolean;
  placeholder?: string;
  defaultValue?: string;
  validationRules?: string;
  order: number;
  // Canvas positioning
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export type InputType = 
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'radio'
  | 'file';

export interface FormBuilderOptions {
  apiUrl?: string;
  language?: 'en' | 'fa';
  onInit?: () => void;
  onChange?: (schema: FormSchema) => void;
  onSave?: (schema: FormSchema) => void;
}

export interface PostMessageEvent {
  type: 'init' | 'changed' | 'saved';
  data?: any;
}
