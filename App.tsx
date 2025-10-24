import React, { useState, useEffect } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from './services/supabase';
import { User, LogEntry } from './types';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import DailyLogForm from './components/DailyLogForm';
import LogHistory from './components/LogHistory';
import AdminDashboard from './components/AdminDashboard';
import ConfigurationErrorScreen from './components/ConfigurationErrorScreen';
import { LoaderCircle } from 'lucide-react';

// Hardcoded list of admin emails for demo purposes.
// In a real app, this would be managed via roles in your database.
const ADMIN_EMAILS = [
  'winnie@tie.ust',
  'jac@tie.ust',
  'sean@tie.ust',
  'aloysius@tie.ust',
  'admin@tie.ust'
];

const App: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'student' | 'admin'>('student');

  useEffect(() => {
    // Check if Supabase client is configured by checking if the placeholder values have been replaced.
    // FIX: Cast to string to avoid TypeScript error about non-overlapping types when credentials are provided.
    if ((supabaseUrl as string) !== 'YOUR_PROJECT_URL' && (supabaseAnonKey as string) !== 'YOUR_ANON_KEY') {
        setIsConfigured(true);
    } else {
        setLoading(false); // Stop loading if not configured
    }
  }, []);

  useEffect(() => {
    if (!isConfigured) return;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ? { id: session.user.id, email: session.user.email } : null;
      setUser(currentUser);
      setIsAdmin(!!currentUser && ADMIN_EMAILS.includes(currentUser.email || ''));
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ? { id: session.user.id, email: session.user.email } : null;
      setUser(currentUser);
      setIsAdmin(!!currentUser && ADMIN_EMAILS.includes(currentUser.email || ''));
      if (_event === 'SIGNED_IN' && currentUser) {
        setCurrentView('student');
      }
      if (!session) {
        setLogs([]); // Clear logs on logout
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isConfigured]);

  const fetchUserLogs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('userId', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedLogs: LogEntry[] = data.map(log => ({
            id: log.id,
            userId: log.userId,
            plan: log.plan,
            achievement: log.achievement,
            date: new Date(log.created_at).toISOString().split('T')[0],
        }));
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error("Error fetching logs: ", error);
    }
  };

  useEffect(() => {
    if (isConfigured && user) {
      fetchUserLogs(user.id);
      
      const channel = supabase
        .channel(`public:logs:userId=eq.${user.id}`)
        .on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: 'logs', filter: `userId=eq.${user.id}` }, 
          () => fetchUserLogs(user.id)
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isConfigured]);
  
  const handleToggleView = () => {
    setCurrentView(prev => prev === 'student' ? 'admin' : 'student');
  };

  if (!isConfigured) {
    return (
        <ConfigurationErrorScreen />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoaderCircle className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
      {!user ? (
        <LoginScreen />
      ) : (
        <>
          <Header 
            user={user} 
            isAdmin={isAdmin}
            currentView={currentView}
            onToggleView={handleToggleView}
          />
          <main className="container mx-auto p-4 md:p-6">
            {currentView === 'student' ? (
              <div className="max-w-2xl mx-auto">
                <DailyLogForm user={user} />
                <LogHistory logs={logs} />
              </div>
            ) : (
              isAdmin ? <AdminDashboard /> : <div className="text-center p-8 text-slate-600 dark:text-slate-300">You are not authorized to view this page.</div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default App;