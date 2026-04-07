import { create } from 'zustand';
import { Form, FormField, FieldType } from '../types/form.types';
import { nanoid } from 'nanoid';
import { apiFetch } from '../lib/api';

interface BuilderStore {
  form: Form | null;
  fields: FormField[];
  selectedFieldId: string | null;
  isDirty: boolean;
  isSaving: boolean;

  setForm: (form: Form) => void;
  addField: (type: FieldType, position?: number) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;
  duplicateField: (id: string) => void;
  selectField: (id: string | null) => void;
  saveForm: () => Promise<void>;
  updateFormMeta: (updates: Partial<Form>) => void;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  form: null,
  fields: [],
  selectedFieldId: null,
  isDirty: false,
  isSaving: false,

  setForm: (form) => set({ form, fields: form.fields, isDirty: false }),

  addField: (type, position) => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: `New ${type.replace('_', ' ')}`,
      required: false,
      visible: true,
      options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };

    set((state) => {
      const newFields = [...state.fields];
      if (position !== undefined) {
        newFields.splice(position, 0, newField);
      } else {
        newFields.push(newField);
      }
      return { fields: newFields, isDirty: true, selectedFieldId: newField.id };
    });
  },

  removeField: (id) => {
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
      selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
      isDirty: true,
    }));
  },

  updateField: (id, updates) => {
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      isDirty: true,
    }));
  },

  reorderFields: (oldIndex, newIndex) => {
    set((state) => {
      const newFields = [...state.fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      return { fields: newFields, isDirty: true };
    });
  },

  duplicateField: (id) => {
    set((state) => {
      const fieldIndex = state.fields.findIndex((f) => f.id === id);
      if (fieldIndex === -1) return state;
      const fieldToDuplicate = state.fields[fieldIndex];
      const newField = { ...fieldToDuplicate, id: nanoid() };
      const newFields = [...state.fields];
      newFields.splice(fieldIndex + 1, 0, newField);
      return { fields: newFields, isDirty: true, selectedFieldId: newField.id };
    });
  },

  selectField: (id) => set({ selectedFieldId: id }),

  updateFormMeta: (updates) => {
    set((state) => ({
      form: state.form ? { ...state.form, ...updates } : null,
      isDirty: true,
    }));
  },

  saveForm: async () => {
    const { form, fields, isDirty } = get();
    if (!form || !isDirty) return;

    set({ isSaving: true });
    try {
      const updatedForm = await apiFetch(`/forms/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          settings: form.settings,
          is_published: form.is_published,
          fields,
        }),
      });
      set({ form: updatedForm, isDirty: false });
    } catch (error) {
      console.error('Failed to save form', error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
}));
