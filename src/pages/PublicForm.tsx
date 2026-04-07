import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Form, FormField } from '../types/form.types';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { getTheme } from '../lib/themes';

export default function PublicForm() {
  const { slug } = useParams<{ slug: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) fetchForm(slug);
  }, [slug]);

  const fetchForm = async (slug: string) => {
    try {
      const data = await apiFetch(`/forms/public/${slug}`);
      setForm(data);
    } catch (error: any) {
      toast.error(error.message || 'Form not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSubmitting(true);
    try {
      await apiFetch(`/responses/${form.id}`, {
        method: 'POST',
        body: JSON.stringify({ data: formData }),
      });
      
      if (form.settings?.redirectUrl) {
        window.location.href = form.settings.redirectUrl;
      } else {
        navigate('/success');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = async (fieldId: string, file: File | null) => {
    if (!file || !form) return;
    
    // Show uploading toast
    const toastId = toast.loading(`Uploading ${file.name}...`);
    
    try {
      // Create a temporary unique ID for this submission's files
      const submissionId = formData._submissionId || Date.now().toString();
      if (!formData._submissionId) {
        handleChange('_submissionId', submissionId);
      }

      const filePath = `${form.id}/${submissionId}/${fieldId}/${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('form-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('form-uploads')
        .getPublicUrl(filePath);

      handleChange(fieldId, data.publicUrl);
      toast.success('File uploaded successfully', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file', { id: toastId });
    }
  };

  const theme = getTheme(form?.settings?.theme);
  const inputClasses = `mt-1 block w-full px-3 py-2 border ${theme.inputBorder} ${theme.inputBg} ${theme.borderRadius} ${theme.textColor} shadow-sm focus:outline-none ${theme.inputFocus} sm:text-sm transition-colors`;

  const renderField = (field: FormField) => {
    if (!field.visible) return null;

    switch (field.type) {
      case 'short_text':
      case 'email':
      case 'phone':
      case 'number':
      case 'url':
        return (
          <input
            type={field.type === 'short_text' ? 'text' : field.type}
            required={field.required}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={inputClasses}
          />
        );
      case 'long_text':
        return (
          <textarea
            required={field.required}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.id, e.target.value)}
            rows={4}
            className={inputClasses}
          />
        );
      case 'dropdown':
        return (
          <select
            required={field.required}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${theme.inputBorder} ${theme.inputBg} ${theme.borderRadius} ${theme.textColor} focus:outline-none ${theme.inputFocus} sm:text-sm transition-colors`}
          >
            <option value="">Select an option</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="mt-2 space-y-2">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300`}
                />
                <label className={`ml-3 block text-sm font-medium ${theme.textColor}`}>{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="mt-2 space-y-2">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  value={opt}
                  onChange={(e) => {
                    const current = formData[field.id] || [];
                    if (e.target.checked) {
                      handleChange(field.id, [...current, opt]);
                    } else {
                      handleChange(field.id, current.filter((v: string) => v !== opt));
                    }
                  }}
                  className={`focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded`}
                />
                <label className={`ml-3 block text-sm font-medium ${theme.textColor}`}>{opt}</label>
              </div>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="mt-2 flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleChange(field.id, star)}
                className={`focus:outline-none ${formData[field.id] >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            ))}
            {field.required && !formData[field.id] && (
              <input type="number" required className="opacity-0 w-0 h-0 absolute" />
            )}
          </div>
        );
      case 'file_upload':
        return (
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${theme.inputBorder} ${theme.borderRadius} border-dashed`}>
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label className={`relative cursor-pointer ${theme.formBg} rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500`}>
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    required={field.required && !formData[field.id]}
                    accept={field.accept}
                    onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                {formData[field.id] ? 'File uploaded' : 'Click to upload'}
              </p>
            </div>
          </div>
        );
      case 'heading':
        return <h2 className={`text-2xl font-bold ${theme.headingColor} mt-6 mb-2`}>{field.label}</h2>;
      case 'divider':
        return <hr className={`my-6 ${theme.inputBorder}`} />;
      default:
        return <div className="text-red-500">Unsupported field type: {field.type}</div>;
    }
  };

  const isClosed = form?.settings?.closeDate && new Date(form.settings.closeDate) < new Date();

  if (loading) return <div className="flex justify-center py-20">Loading...</div>;
  if (!form) return <div className="flex justify-center py-20 text-gray-500">Form not found or is no longer available.</div>;
  if (!form.is_published) return <div className="flex justify-center py-20 text-gray-500">This form is not currently published.</div>;
  if (isClosed) return <div className="flex justify-center py-20 text-gray-500">This form is closed and no longer accepting responses.</div>;

  const evaluateCondition = (field: FormField) => {
    if (!field.condition) return true;

    const { fieldId, operator, value } = field.condition;
    const targetValue = formData[fieldId];

    if (targetValue === undefined || targetValue === null) {
      return false; // If the target field hasn't been filled out yet, don't show this field
    }

    const targetStr = String(targetValue).toLowerCase();
    const conditionStr = String(value).toLowerCase();

    switch (operator) {
      case 'equals':
        return targetStr === conditionStr;
      case 'not_equals':
        return targetStr !== conditionStr;
      case 'contains':
        return targetStr.includes(conditionStr);
      case 'not_contains':
        return !targetStr.includes(conditionStr);
      case 'greater_than':
        return Number(targetValue) > Number(value);
      case 'less_than':
        return Number(targetValue) < Number(value);
      default:
        return true;
    }
  };

  return (
    <div className={`min-h-screen ${theme.canvasBg} ${theme.fontFamily} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <div className={`max-w-2xl mx-auto ${theme.formBg} ${theme.borderRadius} shadow-sm border ${theme.id === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-hidden transition-colors duration-300`}>
        <div className={`px-8 py-6 border-b ${theme.id === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${theme.id === 'playful' ? 'bg-pink-500 text-white' : theme.id === 'dark' ? 'bg-gray-800 text-white' : 'bg-green-600 text-white'}`}>
          <h1 className="text-3xl font-bold">{form.title}</h1>
          {form.description && <p className="mt-2 opacity-90">{form.description}</p>}
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
          {form.fields.map((field) => {
            if (!evaluateCondition(field)) return null;
            
            return (
              <div key={field.id}>
                {field.type !== 'heading' && field.type !== 'divider' && (
                  <label className={`block text-sm font-medium ${theme.textColor} mb-1`}>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                )}
                {field.helpText && <p className="text-sm text-gray-500 mb-2">{field.helpText}</p>}
                {renderField(field)}
              </div>
            );
          })}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent ${theme.borderRadius} shadow-sm text-sm font-medium ${theme.buttonText} ${theme.buttonBg} ${theme.buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors`}
            >
              {submitting ? 'Submitting...' : (form.settings?.submitButtonLabel || 'Submit')}
            </button>
          </div>
        </form>
      </div>
      <div className="mt-8 text-center text-sm text-gray-400">
        Powered by <span className="font-semibold text-gray-500">Formify</span>
      </div>
    </div>
  );
}
