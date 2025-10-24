// Implemented the LoginScreen component with Supabase auth for login and sign-up.
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { allowedEmails } from '../services/allowedEmails';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      let authResponse;
      if (isLoginView) {
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      } else {
        // Check if the email is in the allowed list before attempting to sign up
        if (!allowedEmails.has(email.toLowerCase())) {
          throw new Error("This email address is not authorized to register.");
        }
        authResponse = await supabase.auth.signUp({ email, password });
        if (!authResponse.error) {
            setMessage("Sign up successful! Please check your email to confirm your account.");
        }
      }
      
      if (authResponse.error) {
        throw authResponse.error;
      }

      // The onAuthStateChanged listener in App.tsx will handle the UI change on success.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl dark:bg-slate-800">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white">
            {isLoginView ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        {message && <p className="text-sm text-center text-green-500">{message}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 text-slate-900 placeholder-slate-500 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 text-slate-900 placeholder-slate-500 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:bg-brand-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : (isLoginView ? 'Sign in' : 'Sign up')}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button
            onClick={() => { setIsLoginView(!isLoginView); setError(null); setMessage(null); }}
            className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
          >
            {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;