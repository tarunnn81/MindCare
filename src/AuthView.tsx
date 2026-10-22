import React, { useState } from 'react';
import { Heart, Sparkles, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { User } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isForgotPassword) {
      if (!email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      setRecoverySuccess(true);
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMessage('Please enter your preferred display name.');
      return;
    }

    // Successfully log in
    onLogin({
      id: `usr_${Date.now()}`,
      name: isSignUp ? name.trim() : email.split('@')[0],
      email: email.trim(),
      wellnessGoals: ['Overcoming Stress', 'Quality Sleep', 'Quieting Overthinking'],
      emergencyContact: {
        name: 'Emergency Helpline / Support',
        phone: '14416 (Tele-MANAS) / 988',
        relation: 'Support Hotline',
      },
      streakDays: 1,
    });
  };

  const handleDemoLogin = () => {
    onLogin({
      id: 'demo_alex',
      name: 'Alex Morgan',
      email: 'alex.morgan@mindcare.app',
      wellnessGoals: ['Manage Stress', 'Better Sleep', 'Stop Overthinking'],
      emergencyContact: {
        name: 'Dr. Neha Varma',
        phone: '+91 98201 12345',
        relation: 'Family Counselor',
      },
      streakDays: 6,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50/70 via-sky-50/40 to-emerald-50/40 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-purple-100 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-sky-400 p-0.5 shadow-md shadow-purple-500/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Heart className="w-7 h-7 text-purple-600 dark:text-purple-400 fill-purple-100 dark:fill-purple-950/60" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
            MindCare
          </h1>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            "Your Mind Matters. We're Here to Listen."
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            A safe, calming space for emotional support, mood tracking, and licensed therapy.
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center space-y-1.5">
          <span className="text-[11px] text-purple-900 dark:text-purple-300 font-semibold block">
            Reviewing or Testing the Application?
          </span>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Login (Alex Morgan)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <span className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Or sign in with email
          </span>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900">
            {errorMessage}
          </div>
        )}

        {/* Forgot password success */}
        {recoverySuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 space-y-1">
            <span className="font-semibold block flex items-center space-x-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Password Recovery Sent</span>
            </span>
            <p>If an account exists for {email}, a reset link has been dispatched.</p>
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setRecoverySuccess(false);
              }}
              className="text-emerald-700 font-bold underline mt-1 block"
            >
              Return to Login
            </button>
          </div>
        )}

        {/* Form */}
        {!recoverySuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && !isForgotPassword && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@mindcare.app"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isForgotPassword ? 'Send Recovery Link' : isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Switch */}
        <div className="text-center pt-2">
          {isForgotPassword ? (
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Back to Login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {isSignUp ? (
                <>Already have an account? <span className="font-semibold text-purple-600 dark:text-purple-400">Sign In</span></>
              ) : (
                <>New to MindCare? <span className="font-semibold text-purple-600 dark:text-purple-400">Create Account</span></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
