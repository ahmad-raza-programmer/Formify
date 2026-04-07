import { useBuilderStore } from '../../store/builderStore';
import { Settings, X, Plus, Trash2, Eye, EyeOff, Layout } from 'lucide-react';
import { THEMES } from '../../lib/themes';
import { motion, AnimatePresence } from 'motion/react';

export default function PropertiesPanel() {
  const { form, fields, selectedFieldId, updateField, selectField, updateFormMeta } = useBuilderStore();
  
  const field = fields.find(f => f.id === selectedFieldId);

  if (!field) {
    if (!form) return null;
    return (
      <motion.aside 
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col shadow-[-1px_0_10px_rgba(0,0,0,0.02)] z-10 h-full"
      >
        <div className="p-5 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-900">Form Settings</h2>
        </div>
        
        <div className="p-5 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Appearance</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Theme</label>
              <select
                value={form.settings?.theme || 'default'}
                onChange={(e) => updateFormMeta({ settings: { ...form.settings, theme: e.target.value } })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              >
                {Object.values(THEMES).map((theme) => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Submit Button Label</label>
              <input
                type="text"
                value={form.settings?.submitButtonLabel || ''}
                onChange={(e) => updateFormMeta({ settings: { ...form.settings, submitButtonLabel: e.target.value } })}
                placeholder="e.g., Submit Form"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <div className="w-full h-px bg-gray-100"></div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Behavior</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Redirect URL after submission</label>
              <input
                type="url"
                value={form.settings?.redirectUrl || ''}
                onChange={(e) => updateFormMeta({ settings: { ...form.settings, redirectUrl: e.target.value } })}
                placeholder="https://example.com/thanks"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Close Date (Optional)</label>
              <input
                type="date"
                value={form.settings?.closeDate || ''}
                onChange={(e) => updateFormMeta({ settings: { ...form.settings, closeDate: e.target.value } })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Show response count</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={form.settings?.showResponseCount || false}
                  onChange={(e) => updateFormMeta({ settings: { ...form.settings, showResponseCount: e.target.checked } })}
                  className="checked:bg-green-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </label>
          </div>
        </div>
      </motion.aside>
    );
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    updateField(field.id, { options: newOptions });
  };

  const addOption = () => {
    updateField(field.id, { options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    updateField(field.id, { options: newOptions });
  };

  return (
    <motion.aside 
      key="field-properties"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-full lg:w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col shadow-[-1px_0_10px_rgba(0,0,0,0.02)] z-10 h-full"
    >
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Layout className="w-4 h-4 text-green-600" />
          <h2 className="text-sm font-bold text-gray-900">Field Properties</h2>
        </div>
        <button 
          onClick={() => selectField(null)} 
          className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Common Properties */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
            />
          </div>

          {field.type !== 'heading' && field.type !== 'divider' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Help Text</label>
                <textarea
                  value={field.helpText || ''}
                  onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                />
              </div>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">Required Field</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="checked:bg-green-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </label>
            </>
          )}

          {field.type === 'file_upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Allowed File Types</label>
              <input
                type="text"
                value={field.accept || ''}
                onChange={(e) => updateField(field.id, { accept: e.target.value })}
                placeholder="e.g., image/*, .pdf"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1.5">Leave blank to allow all files.</p>
            </div>
          )}
        </div>

        {/* Options for Choice Fields */}
        {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
          <>
            <div className="w-full h-px bg-gray-100"></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {field.options?.map((opt, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(i, e.target.value)}
                          className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => removeOption(i)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <button
                onClick={addOption}
                className="mt-3 flex items-center text-sm text-green-600 font-medium hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors w-full justify-center"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Option
              </button>
            </div>
          </>
        )}

        {/* Conditional Logic */}
        <div className="w-full h-px bg-gray-100"></div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Conditional Logic</label>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-2">
                {field.condition ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                <span className="text-sm font-medium text-gray-700">Enable condition</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={!!field.condition}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const previousFields = fields.slice(0, fields.findIndex(f => f.id === field.id));
                      const firstValidField = previousFields.find(f => !['heading', 'divider'].includes(f.type));
                      updateField(field.id, {
                        condition: {
                          fieldId: firstValidField?.id || '',
                          operator: 'equals',
                          value: ''
                        }
                      });
                    } else {
                      updateField(field.id, { condition: undefined });
                    }
                  }}
                  className="checked:bg-green-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </label>

            <AnimatePresence>
              {field.condition && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-blue-50/50 rounded-lg space-y-3 border border-blue-100 overflow-hidden"
                >
                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1.5 uppercase tracking-wider">Show this field if</label>
                    <select
                      value={field.condition.fieldId}
                      onChange={(e) => updateField(field.id, { condition: { ...field.condition!, fieldId: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="" disabled>Select a field</option>
                      {fields
                        .slice(0, fields.findIndex(f => f.id === field.id))
                        .filter(f => !['heading', 'divider'].includes(f.type))
                        .map(f => (
                          <option key={f.id} value={f.id}>{f.label || 'Untitled Field'}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div>
                    <select
                      value={field.condition.operator}
                      onChange={(e) => updateField(field.id, { condition: { ...field.condition!, operator: e.target.value as any } })}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="equals">Equals</option>
                      <option value="not_equals">Does not equal</option>
                      <option value="contains">Contains</option>
                      <option value="not_contains">Does not contain</option>
                      <option value="greater_than">Greater than</option>
                      <option value="less_than">Less than</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={field.condition.value}
                      onChange={(e) => updateField(field.id, { condition: { ...field.condition!, value: e.target.value } })}
                      placeholder="Value to match"
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
