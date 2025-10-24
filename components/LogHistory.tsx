// Implemented the LogHistory component to display past logs.
import React from 'react';
import { LogEntry } from '../types';
import { Calendar } from 'lucide-react';

interface LogHistoryProps {
  logs: LogEntry[];
}

const LogHistory: React.FC<LogHistoryProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="p-6 mt-6 text-center bg-white rounded-lg shadow-md dark:bg-slate-800">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">No logs yet!</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Fill out the form above to start tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
       <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Log History</h2>
       {logs.map((log) => (
        <div key={log.id} className="p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4" />
                <span>{log.date}</span>
             </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Today's Achievement:</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap dark:text-slate-300">{log.achievement}</p>
          </div>
          {log.plan && (
            <div className="mt-2">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200">Plan for Tomorrow:</h4>
              <p className="text-sm text-slate-600 whitespace-pre-wrap dark:text-slate-300">{log.plan}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LogHistory;