import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBuilderStore } from '../store/builderStore';
import { apiFetch } from '../lib/api';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { X, Copy, ExternalLink, GripVertical, ArrowLeft, CheckCircle2, Loader2, Share2, Play, Settings2, Globe, Lock, Link as LinkIcon, Code, LayoutTemplate, Settings } from 'lucide-react';
import { getTheme } from '../lib/themes';
import { motion, AnimatePresence } from 'motion/react';

import FieldsSidebar from '../components/builder/FieldsSidebar';
import FormCanvas from '../components/builder/FormCanvas';
import PropertiesPanel from '../components/builder/PropertiesPanel';

export default function FormBuilder() {
  const { id } = useParams<{ id: string }>();
  const { form, setForm, isSaving, isDirty, saveForm, reorderFields, selectedFieldId } = useBuilderStore();
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [embedWidth, setEmbedWidth] = useState('100%');
  const [embedHeight, setEmbedHeight] = useState('800px');
  const [mobileTab, setMobileTab] = useState<'sidebar' | 'canvas' | 'properties'>('canvas');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if (id) fetchForm(id);
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDirty) {
        saveForm();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isDirty, saveForm]);

  useEffect(() => {
    if (selectedFieldId) {
      setMobileTab('properties');
    }
  }, [selectedFieldId]);

  const fetchForm = async (formId: string) => {
    try {
      const data = await apiFetch(`/forms/${formId}`);
      setForm(data);
    } catch (error) {
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveData(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveData(null);

    if (!over) return;

    if (active.data.current?.type === 'sidebar-item') {
      // Handle dropping a new field from sidebar
      const fieldType = active.data.current.fieldType;
      const overIndex = form?.fields.findIndex((f) => f.id === over.id);
      
      // Add field at the specific index if dropped over an existing field
      if (overIndex !== undefined && overIndex !== -1) {
        useBuilderStore.getState().addField(fieldType, overIndex);
      } else {
        useBuilderStore.getState().addField(fieldType);
      }
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = form?.fields.findIndex((f) => f.id === active.id);
      const newIndex = form?.fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading builder...</p>
        </div>
      </div>
    );
  }
  
  if (!form) return <div className="flex h-screen items-center justify-center text-gray-500">Form not found</div>;

  const theme = getTheme(form.settings?.theme);

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans selection:bg-green-100 selection:text-green-900">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-20 shadow-sm shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link 
            to="/dashboard" 
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => useBuilderStore.getState().updateFormMeta({ title: e.target.value })}
            className="font-semibold text-base sm:text-lg border-none focus:ring-0 p-1 hover:bg-gray-50 focus:bg-gray-50 rounded transition-colors w-32 sm:w-64 truncate"
            placeholder="Form Title"
          />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center text-sm text-gray-500 mr-2">
            {isSaving ? (
              <span className="flex items-center text-amber-600"><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...</span>
            ) : isDirty ? (
              <span className="flex items-center text-amber-600"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Unsaved changes</span>
            ) : (
              <span className="flex items-center text-green-600"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Saved</span>
            )}
          </div>
          
          <Link 
            to={`/forms/${form.id}/responses`} 
            className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Responses
          </Link>
          
          <a 
            href={`/f/${form.public_slug}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden sm:flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <Play className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Preview</span>
          </a>
          
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
          >
            <Share2 className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative pb-16 lg:pb-0">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          
          <div className={`absolute inset-0 lg:static lg:flex lg:w-72 lg:shrink-0 bg-white border-r border-gray-200 z-10 transition-transform duration-300 ${mobileTab === 'sidebar' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <FieldsSidebar />
          </div>
          
          <main className={`flex-1 overflow-y-auto p-4 sm:p-8 transition-colors duration-300 ${theme.canvasBg} absolute inset-0 lg:static z-0 ${mobileTab === 'canvas' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}>
            <div className="max-w-3xl mx-auto pb-32">
              <SortableContext items={form.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <FormCanvas />
              </SortableContext>
            </div>
          </main>

          <div className={`absolute inset-0 lg:static lg:flex lg:w-80 lg:shrink-0 bg-white border-l border-gray-200 z-10 transition-transform duration-300 ${mobileTab === 'properties' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
            <PropertiesPanel />
          </div>
          
          <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
            {activeId ? (
              activeData?.type === 'sidebar-item' ? (
                <div className="flex flex-col items-center justify-center p-4 border-2 border-green-500 bg-white shadow-2xl rounded-xl w-32 transform rotate-3 scale-105 cursor-grabbing">
                  {activeData.icon && (() => {
                    const Icon = activeData.icon;
                    return <Icon className="w-6 h-6 text-green-600 mb-2" />;
                  })()}
                  <span className="text-sm font-medium text-gray-700 text-center">{activeData.label}</span>
                </div>
              ) : (
                <div className="bg-white border-2 border-green-500 shadow-2xl rounded-xl p-6 transform rotate-2 scale-105 cursor-grabbing opacity-90">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">{form.fields.find(f => f.id === activeId)?.label || 'Field'}</span>
                  </div>
                </div>
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2 safe-area-pb">
        <button
          onClick={() => setMobileTab('sidebar')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileTab === 'sidebar' ? 'text-green-600' : 'text-gray-500'}`}
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="text-[10px] font-medium">Add Fields</span>
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileTab === 'canvas' ? 'text-green-600' : 'text-gray-500'}`}
        >
          <div className="relative">
            <CheckCircle2 className="w-5 h-5" />
            {isDirty && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></div>}
          </div>
          <span className="text-[10px] font-medium">Canvas</span>
        </button>
        <button
          onClick={() => setMobileTab('properties')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileTab === 'properties' ? 'text-green-600' : 'text-gray-500'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Properties</span>
        </button>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
                aria-hidden="true" 
                onClick={() => setShowShareModal(false)}
              />
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-xl font-semibold text-gray-900" id="modal-title">
                          Share Form
                        </h3>
                        <button 
                          onClick={() => setShowShareModal(false)} 
                          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="mt-4 space-y-6">
                        {/* Status Toggle */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${form.is_published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                              {form.is_published ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-900 block">Form Status</span>
                              <span className="text-xs text-gray-500 mt-0.5 block">
                                {form.is_published ? 'Public and accepting responses' : 'Private and closed'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => useBuilderStore.getState().updateFormMeta({ is_published: !form.is_published })}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${form.is_published ? 'bg-green-600' : 'bg-gray-300'}`}
                          >
                            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${form.is_published ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        {/* Link Share */}
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Share Link
                          </label>
                          <div className="flex items-center rounded-lg border border-gray-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all">
                            <div className="pl-3 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-500 flex items-center justify-center">
                              <LinkIcon className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}/f/${form.public_slug}`}
                              className="flex-1 block w-full border-none focus:ring-0 sm:text-sm p-2.5 bg-gray-50 text-gray-700 outline-none"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/f/${form.public_slug}`);
                                toast.success('Link copied!');
                              }}
                              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors border-l border-gray-200"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </button>
                          </div>
                        </div>

                        {/* Embed Code */}
                        <div className="pt-6 border-t border-gray-100">
                          <div className="flex items-center gap-2 mb-4">
                            <Code className="w-4 h-4 text-gray-500" />
                            <label className="block text-sm font-medium text-gray-900">
                              Embed on your website
                            </label>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Width</label>
                              <input
                                type="text"
                                value={embedWidth}
                                onChange={(e) => setEmbedWidth(e.target.value)}
                                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 transition-all"
                                placeholder="e.g. 100% or 600px"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">Height</label>
                              <input
                                type="text"
                                value={embedHeight}
                                onChange={(e) => setEmbedHeight(e.target.value)}
                                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 transition-all"
                                placeholder="e.g. 800px"
                              />
                            </div>
                          </div>
                          <div className="relative group">
                            <textarea
                              readOnly
                              value={`<iframe src="${window.location.origin}/f/${form.public_slug}" width="${embedWidth}" height="${embedHeight}" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`}
                              className="block w-full rounded-xl border border-gray-200 shadow-inner focus:border-green-500 focus:ring-green-500 sm:text-sm p-4 bg-gray-900 text-green-400 font-mono text-xs resize-none leading-relaxed"
                              rows={4}
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`<iframe src="${window.location.origin}/f/${form.public_slug}" width="${embedWidth}" height="${embedHeight}" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`);
                                toast.success('Embed code copied!');
                              }}
                              className="absolute top-3 right-3 p-2 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Copy embed code"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
                  <a
                    href={`/f/${form.public_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  >
                    Open in new tab
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-200 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
