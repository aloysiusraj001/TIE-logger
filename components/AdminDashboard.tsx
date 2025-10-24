import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { LogEntry } from '../types';
import { LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const LOGS_PER_PAGE = 10;

const AdminDashboard: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async (currentPage: number) => {
        setIsLoading(true);
        try {
            const from = (currentPage - 1) * LOGS_PER_PAGE;
            const to = from + LOGS_PER_PAGE - 1;

            const { data, error, count } = await supabase
                .from('logs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // This might fail if RLS is not set up correctly for admins.
                // The guide explains how to set this up.
                console.error("Error fetching logs for admin:", error);
                throw error;
            }
            
            if (data) {
                const newLogs: LogEntry[] = data.map(log => ({
                    id: log.id,
                    userId: log.userId,
                    userEmail: log.userEmail || 'N/A',
                    plan: log.plan,
                    achievement: log.achievement,
                    date: new Date(log.created_at).toISOString().split('T')[0] || 'N/A',
                }));
                setLogs(newLogs);
            }
            
            if (count) {
                setTotalPages(Math.ceil(count / LOGS_PER_PAGE));
            }

        } catch (error) {
            console.error("Error fetching logs: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchLogs(page);
    }, [page]);
    
    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
            <h2 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Dashboard: All Team Logs</h2>
            
            {isLoading ? (
                 <div className="flex items-center justify-center h-64">
                    <LoaderCircle className="w-8 h-8 text-brand-500 animate-spin" />
                </div>
            ) : logs.length === 0 ? (
                <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">No logs found.</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        When team members start submitting logs, they will appear here.
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Team Member</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Date</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Today's Achievement</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Plan for Tomorrow</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-800 dark:divide-slate-700">
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{log.userEmail}</td>
                                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.date}</td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><p className="w-64 truncate">{log.achievement || '–'}</p></td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300"><p className="w-64 truncate">{log.plan || '–'}</p></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white dark:text-slate-300 dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200 dark:ring-slate-600"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white dark:text-slate-300 dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-slate-200 dark:ring-slate-600"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;