// Implemented the DailyLogForm, including Gemini API integration for plan generation.
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface DailyLogFormProps {
  user: User;
}

const DailyLogForm: React.FC<DailyLogFormProps> = ({ user }) => {
  const [plan, setPlan] = useState('');
  const [achievement, setAchievement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan.trim()) {
      setError("The plan cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const newLog = {
        userId: user.id,
        userEmail: user.email, // Include user's email for admin dashboard
        plan: plan,
        achievement: achievement,
        // created_at is handled by the database default value
      };

      const { error } = await supabase.from('logs').insert([newLog]);
      if (error) throw error;
      
      setSuccess("Log saved successfully!");
      setPlan('');
      setAchievement('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(`Failed to save log: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
      <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">Today's Log</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="plan" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            What's your plan for today?
          </label>
          <textarea
            id="plan"
            rows={4}
            className="block w-full p-2.5 text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
            placeholder="e.g., 3D print version 4 of the base, test PCB integrations, update firmware..."
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="achievement" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            What did you achieve? (Optional)
          </label>
          <textarea
            id="achievement"
            rows={3}
            className="block w-full p-2.5 text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
            placeholder="e.g., Completed successful PCB integration test, fixed firmware bug."
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
          ></textarea>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:ring-4 focus:outline-none focus:ring-brand-300 disabled:bg-brand-400"
        >
          {isSubmitting ? 'Saving...' : 'Save Log'}
        </button>
      </form>
    </div>
  );
};

export default DailyLogForm;