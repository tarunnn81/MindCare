/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNavigation, TabType } from './components/BottomNavigation';
import { CrisisModal } from './components/CrisisModal';
import { FlutterCodeViewerModal } from './components/FlutterCodeViewerModal';
import { HomeView } from './views/HomeView';
import { ChatView } from './views/ChatView';
import { MoodView } from './views/MoodView';
import { WellnessView } from './views/WellnessView';
import { TherapistsView } from './views/TherapistsView';
import { ProfileView } from './views/ProfileView';
import { AuthView } from './views/AuthView';
import { User, MoodEntry, Appointment } from './types';
import { INITIAL_USER, INITIAL_MOODS, INITIAL_APPOINTMENTS } from './data/mockData';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState<boolean>(false);
  const [isFlutterCodeModalOpen, setIsFlutterCodeModalOpen] = useState<boolean>(false);

  // App persistent states
  const [moods, setMoods] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem('mindcare_moods');
      return saved ? JSON.parse(saved) : INITIAL_MOODS;
    } catch {
      return INITIAL_MOODS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('mindcare_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save moods to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mindcare_moods', JSON.stringify(moods));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [moods]);

  // Save appointments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mindcare_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [appointments]);

  const handleAddMood = (newEntry: Omit<MoodEntry, 'id' | 'date'>) => {
    const entry: MoodEntry = {
      ...newEntry,
      id: `m_${Date.now()}`,
      date: new Date().toISOString(),
    };
    setMoods((prev) => [...prev, entry]);
  };

  const handleQuickMood = (score: number, emoji: string, label: string) => {
    handleAddMood({
      score,
      emoji,
      label,
      tags: ['Daily Check-in'],
      note: 'Quick check-in from MindCare dashboard',
    });
    setActiveTab('mood');
  };

  const handleDeleteMood = (id: string) => {
    setMoods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleBookAppointment = (aptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateUser = (updated: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  const handleClearAllData = () => {
    setMoods([]);
    setAppointments([]);
    try {
      localStorage.removeItem('mindcare_moods');
      localStorage.removeItem('mindcare_appointments');
    } catch {}
  };

  const handleLogout = () => {
    setUser(null);
  };

  // If user is not authenticated, show welcoming authentication screen
  if (!user) {
    return <AuthView onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  // Active view content switcher
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            user={user}
            moods={moods}
            appointments={appointments}
            setActiveTab={setActiveTab}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
            onAddQuickMood={handleQuickMood}
          />
        );
      case 'chat':
        return <ChatView onOpenCrisis={() => setIsCrisisModalOpen(true)} />;
      case 'mood':
        return (
          <MoodView
            moods={moods}
            onAddMood={handleAddMood}
            onDeleteMood={handleDeleteMood}
          />
        );
      case 'wellness':
        return <WellnessView />;
      case 'therapists':
        return (
          <TherapistsView
            appointments={appointments}
            onBookAppointment={handleBookAppointment}
            onCancelAppointment={handleCancelAppointment}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            moods={moods}
            appointments={appointments}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onUpdateUser={handleUpdateUser}
            onClearAllData={handleClearAllData}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FE] dark:bg-slate-950 transition-colors flex flex-col font-sans">
      {/* Top Application Bar */}
      <Header
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        onOpenFlutterCode={() => setIsFlutterCodeModalOpen(true)}
        activeTab={activeTab}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex justify-center items-start p-2 sm:p-6 overflow-x-hidden">
        {isMobileFrame ? (
          /* Mobile Device Frame (Flutter Simulation Container) */
          <div className="w-full max-w-[430px] bg-white dark:bg-slate-900 rounded-[44px] shadow-2xl border-[10px] border-slate-800 dark:border-slate-800 flex flex-col overflow-hidden relative min-h-[780px] max-h-[880px]">
            {/* Mobile Device Status Bar */}
            <div className="h-10 bg-white dark:bg-slate-900 px-6 flex items-center justify-between text-slate-800 dark:text-slate-200 text-xs font-semibold shrink-0 select-none border-b border-purple-50/50 dark:border-slate-800/40">
              <span>9:41</span>
              {/* Dynamic Island / Notch Pill */}
              <div className="w-20 h-4 bg-slate-900 dark:bg-slate-800 rounded-full mx-auto" />
              <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 scrollbar-none">
              {renderActiveView()}
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        ) : (
          /* Responsive Fullscreen View */
          <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100/60 dark:border-slate-800 mb-6">
              {renderActiveView()}
            </div>
            {/* Desktop / Fullscreen Navigation Dock */}
            <div className="sticky bottom-4 z-30 max-w-md mx-auto w-full shadow-xl rounded-3xl overflow-hidden border border-purple-100 dark:border-slate-800">
              <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        )}
      </main>

      {/* 24/7 Crisis Helpline Support Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      {/* Flutter & Dart Project Source Explorer Modal */}
      <FlutterCodeViewerModal
        isOpen={isFlutterCodeModalOpen}
        onClose={() => setIsFlutterCodeModalOpen(false)}
      />
    </div>
  );
}
