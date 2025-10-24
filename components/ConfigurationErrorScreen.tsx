import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfigurationErrorScreenProps {}

const ConfigurationErrorScreen: React.FC<ConfigurationErrorScreenProps> = () => {
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
          It looks like the application is not connected to a Supabase backend. Please configure your project credentials in <code>services/supabase.ts</code>.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-4">
            If you've just updated your credentials, you may need to restart the development server.
        </p>
      </div>
    </div>
  );
};

export default ConfigurationErrorScreen;