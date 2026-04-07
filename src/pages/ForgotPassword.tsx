import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSubmitted(true);
      toast.success('Check your inbox for a reset link');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <MailCheck className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Check your email</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>.
        </p>
        <div className="mt-8">
          <Link to="/login" className="inline-flex items-center justify-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reset password</h2>
        <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white transition-all duration-200 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send reset link'}
        </button>
      </form>
      
      <div className="text-center mt-6">
        <Link to="/login" className="inline-flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
