// Implemented the Header component with user info and logout functionality.
import React from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';
import { LogOut, BookOpenCheck, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  user: User;
  onShowGuide: () => void;
  isAdmin: boolean;
  currentView: 'student' | 'admin';
  onToggleView: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onShowGuide, isAdmin, currentView, onToggleView }) => {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="bg-white shadow-sm dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="w-8 h-8 text-brand-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Student Daily Planner
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button
              onClick={onShowGuide}
              className="px-3 py-1 text-sm font-medium text-slate-600 rounded-md dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Supabase Guide
            </button>
            {isAdmin && (
               <button
                  onClick={onToggleView}
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-brand-600 rounded-md dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {currentView === 'student' ? 'Admin View' : 'Student View'}
               </button>
            )}
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 rounded-full dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;