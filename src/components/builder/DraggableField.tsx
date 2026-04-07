import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '../../types/form.types';
import { useBuilderStore } from '../../store/builderStore';
import { GripVertical, Copy, Trash2, Star, EyeOff, UploadCloud } from 'lucide-react';
import { getTheme } from '../../lib/themes';

interface Props {
  field: FormField;
  key?: React.Key;
}

export default function DraggableField({ field }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const { form, selectedFieldId, selectField, duplicateField, removeField } = useBuilderStore();

  const isSelected = selectedFieldId === field.id;
  const theme = getTheme(form?.settings?.theme);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-28 bg-green-50/50 border-2 border-dashed border-green-400 rounded-2xl opacity-80"
      />
    );
  }

  const inputClasses = `w-full mt-1.5 p-2.5 border ${theme.inputBorder} ${theme.inputBg} ${theme.borderRadius} ${theme.textColor} transition-colors focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none`;

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'short_text':
      case 'email':
      case 'phone':
      case 'number':
      case 'url':
        return <input type="text" disabled placeholder={field.placeholder || 'Enter text here...'} className={inputClasses} />;
      case 'long_text':
        return <textarea disabled placeholder={field.placeholder || 'Enter long text here...'} className={inputClasses} rows={3} />;
      case 'dropdown':
        return (
          <select disabled className={inputClasses}>
            <option value="" disabled selected>Select an option</option>
            {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="mt-3 space-y-3">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center">
                <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center"></div>
                <label className={`ml-3 text-sm ${theme.textColor}`}>{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="mt-3 space-y-3">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center">
                <div className="w-4 h-4 rounded border border-gray-300"></div>
                <label className={`ml-3 text-sm ${theme.textColor}`}>{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="mt-3 flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-8 h-8 text-gray-200" />
            ))}
          </div>
        );
      case 'file_upload':
        return (
          <div className={`mt-3 py-8 px-4 border-2 border-dashed ${theme.inputBorder} ${theme.borderRadius} bg-gray-50/50 flex flex-col items-center justify-center text-gray-500 transition-colors`}>
            <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
            <span className="text-sm font-medium">Click or drag file to this area to upload</span>
            <span className="text-xs text-gray-400 mt-1">Support for a single or bulk upload.</span>
          </div>
        );
      case 'heading':
        return <h3 className={`text-2xl font-bold ${theme.headingColor}`}>{field.label}</h3>;
      case 'divider':
        return <hr className={`my-6 border-t-2 ${theme.inputBorder}`} />;
      default:
        return <div className={`p-4 ${theme.inputBg} rounded-xl text-center text-sm ${theme.textColor}`}>{field.type} preview</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${theme.formBg} border-2 ${isSelected ? 'border-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]' : 'border-transparent hover:border-gray-200 shadow-sm hover:shadow-md'} rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-200 ease-in-out cursor-pointer`}
      onClick={() => selectField(field.id)}
    >
      <div 
        className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-8 h-12 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-lg`} 
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      <div className="pl-6 pr-12">
        {field.condition && (
          <div className="absolute top-4 left-10 flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 shadow-sm">
            <EyeOff className="w-3.5 h-3.5 mr-1.5" />
            Conditional Logic
          </div>
        )}
        <div className={field.condition ? 'mt-8' : ''}>
          {field.type !== 'heading' && field.type !== 'divider' && (
            <label className={`block text-base font-semibold ${theme.textColor} mb-1.5`}>
              {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {field.helpText && <p className="text-sm text-gray-500 mb-4">{field.helpText}</p>}
          <div className="pointer-events-none">
            {renderFieldPreview()}
          </div>
        </div>
      </div>

      <div className="absolute right-2 sm:right-4 top-2 sm:top-4 flex flex-col space-y-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }} 
          className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 bg-white rounded-xl shadow-sm border border-gray-200 transition-colors"
          title="Duplicate field"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); removeField(field.id); }} 
          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 bg-white rounded-xl shadow-sm border border-gray-200 transition-colors"
          title="Delete field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
