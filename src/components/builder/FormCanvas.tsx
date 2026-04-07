import { useBuilderStore } from '../../store/builderStore';
import DraggableField from './DraggableField';
import { useDroppable } from '@dnd-kit/core';
import { LayoutTemplate } from 'lucide-react';
import { getTheme } from '../../lib/themes';
import { motion } from 'motion/react';

export default function FormCanvas() {
  const { form, fields, updateFormMeta } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
    data: {
      type: 'canvas',
    },
  });

  if (!form) return null;

  const theme = getTheme(form.settings?.theme);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      ref={setNodeRef}
      className={`${theme.formBg} ${theme.fontFamily} ${theme.borderRadius} shadow-xl border p-4 sm:p-8 md:p-12 min-h-[700px] transition-all duration-300 ease-in-out relative ${
        isOver ? 'border-green-400 ring-4 ring-green-50 scale-[1.01]' : 'border-gray-100'
      }`}
    >
      {isOver && fields.length === 0 && (
        <div className="absolute inset-0 bg-green-50/30 rounded-2xl z-0 pointer-events-none transition-opacity" />
      )}

      <div className={`relative z-10 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b ${theme.id === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateFormMeta({ title: e.target.value })}
          className={`w-full text-3xl sm:text-4xl md:text-5xl font-bold ${theme.headingColor} border-none focus:ring-0 p-2 -ml-2 mb-2 sm:mb-4 placeholder-gray-300 bg-transparent transition-colors hover:bg-black/5 focus:bg-black/5 rounded-xl outline-none`}
          placeholder="Form Title"
        />
        <textarea
          value={form.description || ''}
          onChange={(e) => updateFormMeta({ description: e.target.value })}
          className={`w-full text-base sm:text-lg md:text-xl ${theme.textColor} border-none focus:ring-0 p-2 -ml-2 resize-none placeholder-gray-400 bg-transparent transition-colors hover:bg-black/5 focus:bg-black/5 rounded-xl outline-none`}
          placeholder="Form description (optional)"
          rows={2}
        />
      </div>

      <div className="relative z-10 space-y-4 min-h-[300px]">
        {fields.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed rounded-2xl transition-all duration-300 pointer-events-none ${
              isOver ? 'border-green-400 bg-green-50/80 text-green-700 scale-[1.02]' : 'border-gray-200 bg-gray-50/50 text-gray-400'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 ${isOver ? 'bg-green-100' : 'bg-gray-100'}`}>
              <LayoutTemplate className={`w-10 h-10 transition-all duration-300 ${isOver ? 'text-green-600 animate-bounce' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isOver ? 'text-green-800' : 'text-gray-600'}`}>
              Your form is empty
            </h3>
            <p className={`text-sm text-center max-w-sm ${isOver ? 'text-green-600' : 'text-gray-500'}`}>
              Drag and drop fields from the left sidebar to start building your form.
            </p>
          </motion.div>
        ) : (
          fields.map((field) => (
            <DraggableField key={field.id} field={field} />
          ))
        )}
      </div>
    </motion.div>
  );
}
