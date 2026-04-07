import React, { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { FieldType } from '../../types/form.types';
import { Type, AlignLeft, Mail, Phone, Hash, Calendar, ChevronDown, CheckSquare, CircleDot, Star, Upload, Link as LinkIcon, Heading, Minus, Search } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'motion/react';

const FIELD_GROUPS = [
  {
    title: 'Basic Fields',
    fields: [
      { type: 'short_text', label: 'Short Text', icon: Type },
      { type: 'long_text', label: 'Long Text', icon: AlignLeft },
      { type: 'email', label: 'Email', icon: Mail },
      { type: 'phone', label: 'Phone', icon: Phone },
      { type: 'number', label: 'Number', icon: Hash },
      { type: 'url', label: 'URL', icon: LinkIcon },
    ]
  },
  {
    title: 'Choices',
    fields: [
      { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
      { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
      { type: 'radio', label: 'Radio', icon: CircleDot },
    ]
  },
  {
    title: 'Advanced',
    fields: [
      { type: 'date', label: 'Date', icon: Calendar },
      { type: 'rating', label: 'Rating', icon: Star },
      { type: 'file_upload', label: 'File Upload', icon: Upload },
    ]
  },
  {
    title: 'Layout',
    fields: [
      { type: 'heading', label: 'Heading', icon: Heading },
      { type: 'divider', label: 'Divider', icon: Minus },
    ]
  }
];

function SidebarItem({ type, label, icon: Icon, onClick }: { type: FieldType, label: string, icon: any, onClick: () => void, key?: React.Key }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type: 'sidebar-item',
      fieldType: type,
      label,
      icon: Icon,
    },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`group flex flex-col items-center justify-center p-3 border border-gray-100 bg-white rounded-xl hover:border-green-500 hover:bg-green-50 hover:shadow-sm transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : ''}`}
    >
      <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-green-100 flex items-center justify-center mb-2 transition-colors">
        <Icon className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
      </div>
      <span className="text-xs font-medium text-gray-600 group-hover:text-green-700 text-center">{label}</span>
    </button>
  );
}

export default function FieldsSidebar() {
  const addField = useBuilderStore((state) => state.addField);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = FIELD_GROUPS.map(group => ({
    ...group,
    fields: group.fields.filter(field => 
      field.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.fields.length > 0);

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-gray-200 overflow-y-auto flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)] z-10 h-full">
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Add Fields</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, groupIdx) => (
            <motion.div 
              key={group.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.05 }}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                {group.title}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {group.fields.map((field) => (
                  <SidebarItem
                    key={field.type}
                    {...field as any}
                    onClick={() => addField(field.type as FieldType)}
                  />
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No fields found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </aside>
  );
}
