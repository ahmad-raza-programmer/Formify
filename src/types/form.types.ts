export type FieldType = 
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'rating'
  | 'file_upload'
  | 'url'
  | 'heading'
  | 'divider';

export type FieldCondition = {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: string;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  visible: boolean;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  accept?: string;
  condition?: FieldCondition;
};

export type FormSettings = {
  submitButtonLabel?: string;
  redirectUrl?: string;
  closeDate?: string;
  showResponseCount?: boolean;
  theme?: string;
};

export type Form = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: FormSettings;
  is_published: boolean;
  public_slug: string;
  response_count: number;
  created_at: string;
  updated_at: string;
};

export type FormResponse = {
  id: string;
  form_id: string;
  data: Record<string, any>;
  submitted_at: string;
  ip_address?: string;
  user_agent?: string;
};
