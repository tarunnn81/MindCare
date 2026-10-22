import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquareHeart, 
  Wind, 
  BookHeart, 
  Calendar, 
  ShieldAlert, 
  ChevronRight, 
  Volume2, 
  TrendingUp, 
  CheckCircle2, 
  Flame,
  Heart
} from 'lucide-react';
import { User, MoodEntry, Appointment } from '../types';
import { DAILY_AFFIRMATIONS } from '../data/mockData';
import { TabType } from '../components/BottomNavigation';

interface HomeViewProps {
  user: User;
  moods: MoodEntry[];
  appointments: Appointment[];
  setActiveTab: (tab: TabType) => void;
  onOpenCrisis: () => void;
  onAddQuickMood: (score: number, emoji: string, label: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  moods,
  appointments,
  setActiveTab,
  onOpenCrisis,
  onAddQuickMood,
}) => {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  // Time-based personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentAffirmation = DAILY_AFFIRMATIONS[affirmationIndex % DAILY_AFFIRMATIONS.length];

  // Play peaceful chime using Web Audio API (no external asset needed)
  const playCalmChime = () => {
    try {
      setIsPlayingChime(true);
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const freqs = [528, 660, 792]; // Solfeggio frequencies for calm
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.25 + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.25);
        osc.stop(ctx.currentTime + idx * 0.25 + 2.0);
      });

      setTimeout(() => setIsPlayingChime(false), 2200);
    } catch {
      setIsPlayingChime(false);
    }
  };

  // Recent mood score average
  const recentScore = moods.length > 0 ? moods[moods.length - 1].score : 7;
  const upcomingAppointment = appointments.find((a) => a.status === 'Confirmed');

  const moodEmojis = [
    { score: 3, emoji: '😔', label: 'Low' },
    { score: 5, emoji: '😐', label: 'Meh' },
    { score: 7, emoji: '😌', label: 'Calm' },
    { score: 9, emoji: '😊', label: 'Good' },
    { score: 10, emoji: '✨', label: 'Great' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 p-6 text-white shadow-xl shadow-purple-900/10">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>MindCare Emotional Space</span>
            </span>
            <div className="flex items-center space-x-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xs">
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{user.streakDays} Days Mindful</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">
              {getGreeting()}, {user.name.split(' ')[0]}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm mt-1 leading-relaxed max-w-md">
              "Your Mind Matters. We're Here to Listen." How does your heart feel today?
            </p>
          </div>

          {/* Quick Check-in Emojis */}
          <div className="pt-2">
            <p className="text-xs font-medium text-purple-100 mb-2">Instant Mood Check-in:</p>
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-2 max-w-md border border-white/15">
              {moodEmojis.map((m) => (
                <button
                  key={m.label}
                  onClick={() => onAddQuickMood(m.score, m.emoji, m.label)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-center group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">{m.emoji}</span>
                  <span className="text-[10px] text-purple-100 mt-1 font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -top-8 w-36 h-36 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Emergency Helpline Notice Card */}
      <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Experiencing acute distress or crisis?</h4>
            <p className="text-[11px] text-rose-700 dark:text-rose-300">
              Free 24/7 tele-support available: Tele-MANAS (14416), AASRA, 988 Lifeline.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenCrisis}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 shadow-xs transition-colors"
        >
          View Hotlines
        </button>
      </div>

      {/* Daily Affirmation with audio tone */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50/40 to-sky-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-purple-100 dark:border-slate-800 shadow-xs relative">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Calming Reflection</span>
            </span>
            <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base font-medium italic leading-relaxed">
              "{currentAffirmation}"
            </p>
          </div>
          <button
            onClick={playCalmChime}
            disabled={isPlayingChime}
            className={`p-2.5 rounded-2xl bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 shadow-xs transition-all ${
              isPlayingChime ? 'scale-110 text-purple-600' : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
            }`}
            title="Play peaceful mindfulness chime"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-purple-100/70 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">Take a full breath and let these words settle in.</span>
          <button
            onClick={() => setAffirmationIndex((prev) => prev + 1)}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Next Reminder →
          </button>
        </div>
      </div>

      {/* 4 Quick Access Grid */}
      <div>
        <h3 className="text-sm font-bold font-heading text-slate-800 dark:text-slate-200 mb-3 px-1">
          Wellness Essentials
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* AI Therapy Chat */}
          <button
            onClick={() => setActiveTab('chat')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">AI Therapy Chat</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Empathetic, confidential conversation and coping tools.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-3 flex items-center space-x-1">
              <span>Start talking</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Guided Breathing */}
          <button
            onClick={() => setActiveTab('wellness')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-sky-700 text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Guided Breathing</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Box breathing &amp; 4-7-8 relaxing visual pulse.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-3 flex items-center space-x-1">
              <span>Breathe now</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Mood Analytics */}
          <button
            onClick={() => setActiveTab('mood')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Mood Trends</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Score tracking, trigger tags, and weekly patterns.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-3 flex items-center space-x-1">
              <span>View chart</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Licensed Therapists */}
          <button
            onClick={() => setActiveTab('therapists')}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Find Therapists</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                Verified psychologists &amp; booking consultations.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-3 flex items-center space-x-1">
              <span>Book session</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Upcoming Appointment Widget */}
      {upcomingAppointment && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Therapy Session</span>
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold">
              {upcomingAppointment.status}
            </span>
          </div>

          <div className="flex items-center space-x-3 mt-2">
            <img
              src={upcomingAppointment.therapistAvatar}
              alt={upcomingAppointment.therapistName}
              className="w-11 h-11 rounded-2xl object-cover border border-purple-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {upcomingAppointment.therapistName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {upcomingAppointment.date} at {upcomingAppointment.timeSlot} • {upcomingAppointment.mode}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('therapists')}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
