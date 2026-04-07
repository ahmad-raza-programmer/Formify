import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Form, FormResponse } from '../types/form.types';
import toast from 'react-hot-toast';
import { Download, ArrowLeft, Inbox, Clock, FileText, Loader2, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function FormResponses() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!id) return;
    
    fetchData(id);
    
    const channel = supabase
      .channel(`responses:${id}:${Date.now()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'responses',
        filter: `form_id=eq.${id}`
      }, (payload) => {
        setResponses(prev => [payload.new as FormResponse, ...prev]);
        toast.success('New response received!');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchData = async (formId: string) => {
    try {
      const [formData, responsesData] = await Promise.all([
        apiFetch(`/forms/${formId}`),
        apiFetch(`/responses/${formId}`)
      ]);
      setForm(formData);
      setResponses(responsesData);
    } catch (error) {
      toast.error('Failed to load responses');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/responses/${id}/export`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form?.title || 'form'}-responses.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export successful!');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-7xl mx-auto w-full">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!form) return <div className="flex h-screen items-center justify-center text-gray-500">Form not found</div>;

  const dataFields = form.fields.filter(f => f.type !== 'heading' && f.type !== 'divider');
  const totalPages = Math.ceil(responses.length / itemsPerPage);
  const paginatedResponses = responses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate stats
  const latestResponse = responses.length > 0 ? new Date(responses[0].submitted_at) : null;
  const fieldsCount = dataFields.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-green-100 selection:text-green-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <Link 
              to={`/builder/${form.id}`} 
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-3 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 hover:border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Builder
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{form.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and analyze your form submissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              disabled={responses.length === 0}
              className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Responses</p>
              <h3 className="text-2xl font-bold text-gray-900">{responses.length}</h3>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Latest Submission</p>
              <h3 className="text-lg font-bold text-gray-900">
                {latestResponse ? latestResponse.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
              </h3>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Data Fields</p>
              <h3 className="text-2xl font-bold text-gray-900">{fieldsCount}</h3>
            </div>
          </motion.div>
        </motion.div>

        {/* Data Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden"
        >
          {responses.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No responses yet</h3>
              <p className="text-gray-500 max-w-sm mb-6">
                Share your form link to start collecting data. Responses will appear here in real-time.
              </p>
              <Link 
                to={`/builder/${form.id}`}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                Go to Builder
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 z-10 shadow-[1px_0_0_0_#e5e7eb]">
                        Submitted At
                      </th>
                      {dataFields.map(field => (
                        <th key={field.id} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    <AnimatePresence>
                      {paginatedResponses.map((response, index) => (
                        <motion.tr 
                          key={response.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 sticky left-0 bg-white group-hover:bg-gray-50/50 transition-colors shadow-[1px_0_0_0_#e5e7eb] z-10">
                            {new Date(response.submitted_at).toLocaleString(undefined, {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                          {dataFields.map(field => (
                            <td key={field.id} className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                              {field.type === 'file_upload' && response.data[field.id] ? (
                                <a 
                                  href={response.data[field.id]} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium text-xs transition-colors"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </a>
                              ) : Array.isArray(response.data[field.id]) 
                                ? (
                                  <div className="flex flex-wrap gap-1">
                                    {response.data[field.id].map((item: string, i: number) => (
                                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                )
                                : response.data[field.id]?.toString() || <span className="text-gray-300">-</span>}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, responses.length)}</span> of <span className="font-semibold text-gray-900">{responses.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {/* Simple pagination logic for display */}
                        {[...Array(totalPages)].map((_, i) => {
                          // Show first, last, current, and adjacent pages
                          if (
                            i === 0 || 
                            i === totalPages - 1 || 
                            (i >= currentPage - 2 && i <= currentPage)
                          ) {
                            return (
                              <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                                  currentPage === i + 1
                                    ? 'z-10 bg-green-50 border-green-500 text-green-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {i + 1}
                              </button>
                            );
                          } else if (
                            i === 1 && currentPage > 3 ||
                            i === totalPages - 2 && currentPage < totalPages - 2
                          ) {
                            return (
                              <span key={i} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                  
                  {/* Mobile pagination */}
                  <div className="flex items-center justify-between w-full sm:hidden">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
