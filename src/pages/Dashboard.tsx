import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiFetch } from '../lib/api';
import { Form } from '../types/form.types';
import toast from 'react-hot-toast';
import { Plus, FileText, Settings, Trash2, ExternalLink, Search, LayoutTemplate, Loader2, LogOut, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, signOut } = useAuthStore();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const data = await apiFetch('/forms');
      setForms(data);
    } catch (error: any) {
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const createForm = async () => {
    setIsCreating(true);
    try {
      const newForm = await apiFetch('/forms', {
        method: 'POST',
        body: JSON.stringify({ title: 'Untitled Form' })
      });
      navigate(`/builder/${newForm.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create form');
      setIsCreating(false);
    }
  };

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    try {
      await apiFetch(`/forms/${id}`, { method: 'DELETE' });
      setForms(forms.filter(f => f.id !== id));
      toast.success('Form deleted');
    } catch (error: any) {
      toast.error('Failed to delete form');
    }
  };

  const filteredForms = forms.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-green-100 selection:text-green-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Formify</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                  {initial}
                </div>
                <span className="text-sm font-medium text-gray-700">{displayName}</span>
              </div>
              <button 
                onClick={signOut} 
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Forms</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and view responses for all your forms.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <button
              onClick={createForm}
              disabled={isCreating}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap font-medium text-sm"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Form
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2 w-2/3">
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                  <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded w-1/3 mt-6 mb-6"></div>
                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded bg-gray-100"></div>
                    <div className="w-8 h-8 rounded bg-gray-100"></div>
                  </div>
                  <div className="w-8 h-8 rounded bg-gray-100"></div>
                </div>
              </div>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No forms yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              You haven't created any forms yet. Start building your first form to collect data from your users.
            </p>
            <div className="mt-8">
              <button
                onClick={createForm}
                disabled={isCreating}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all shadow-sm hover:shadow-md disabled:opacity-70"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Create your first form
              </button>
            </div>
          </motion.div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-20">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No matching forms</h3>
            <p className="mt-1 text-sm text-gray-500">We couldn't find any forms matching "{searchQuery}"</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredForms.map((form) => (
              <motion.div 
                key={form.id} 
                variants={itemVariants}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-green-300 p-6 transition-all duration-200 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                      {form.title || 'Untitled Form'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                      Created {new Date(form.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full border ${
                    form.is_published 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {form.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div className="mt-4 mb-6 flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{form.response_count}</span>
                      <span className="text-gray-500 ml-1">responses</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-4">
                  <div className="flex space-x-1">
                    <Link
                      to={`/builder/${form.id}`}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Form"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/forms/${form.id}/responses`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Responses"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                    {form.is_published && (
                      <a
                        href={`/f/${form.public_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Open Public Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Form"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
