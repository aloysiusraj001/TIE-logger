import React from 'react';
import { AlertTriangle, BookOpenCheck } from 'lucide-react';

interface ConfigurationErrorScreenProps {
  onShowGuide: () => void;
}

const ConfigurationErrorScreen: React.FC<ConfigurationErrorScreenProps> = ({ onShowGuide }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 text-center bg-white rounded-2xl shadow-xl dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="flex justify-center">
            <AlertTriangle className="w-12 h-12 text-brand-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Configuration Required
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          It looks like the application is not connected to a Supabase backend. Please follow the integration guide to set up your project credentials.
        </p>
        <div className="mt-8">
            <button
              onClick={onShowGuide}
              className="inline-flex items-center gap-2 justify-center w-full sm:w-auto px-6 py-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm group bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <BookOpenCheck className="w-5 h-5" />
              Show Setup Guide
            </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-4">
            If you've just updated your credentials in <code>services/supabase.ts</code>, you may need to restart the development server.
        </p>
      </div>
    </div>
  );
};

export default ConfigurationErrorScreen;
