import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Moon, 
  Sun, 
  PhoneCall, 
  Bell, 
  Heart, 
  LogOut, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { User, MoodEntry, Appointment } from '../types';

interface ProfileViewProps {
  user: User;
  moods: MoodEntry[];
  appointments: Appointment[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onUpdateUser: (updated: Partial<User>) => void;
  onClearAllData: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  moods,
  appointments,
  isDarkMode,
  setIsDarkMode,
  onUpdateUser,
  onClearAllData,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [emergencyName, setEmergencyName] = useState(user.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContact.phone);
  const [emergencyRelation, setEmergencyRelation] = useState(user.emergencyContact.relation);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: emergencyRelation,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  const handleExportData = () => {
    const dataToExport = {
      userProfile: user,
      moodLogs: moods,
      appointments: appointments,
      exportDate: new Date().toISOString(),
      disclaimer: "Exported from MindCare Mental Wellness App. Strictly confidential.",
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindcare-wellness-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-purple-500/20 shrink-0">
          {user.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white truncate">
            {user.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
          <div className="flex items-center space-x-2 mt-1.5">
            <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-full">
              {user.streakDays} Day Mindful Habit
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
              {moods.length} Mood Reflections
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
            Personal Information &amp; Contacts
          </h3>
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
            Display Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        {/* Emergency Contact */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Trusted Emergency Contact
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            A trusted family member, close friend, or family therapist whom you can quickly notify in distress.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="e.g. Dr. Neha / Maya"
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Phone Number</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 / +1 ..."
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Relationship</label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                placeholder="e.g. Sister / Doctor"
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          Update Settings
        </button>
      </form>

      {/* App Preferences */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white mb-2">
          App Preferences
        </h3>

        {/* Dark Mode toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center space-x-2.5">
            {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Dark Mode</span>
              <span className="text-[10px] text-slate-400">Gentle on eyes during night and bedtime wind-down</span>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              isDarkMode ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Notifications toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2.5">
            <Bell className="w-4 h-4 text-sky-500" />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Daily Mindful Reminders
              </span>
              <span className="text-[10px] text-slate-400">Gentle notifications for breathing and hydration</span>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              notificationsEnabled ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* Privacy, Data Control & Right to be Forgotten */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
            Privacy &amp; Data Sovereignty
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          MindCare respects your mental health confidentiality. We never sell your personal wellness notes or chat logs. You have the right to review, download, or permanently erase your data at any moment.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={handleExportData}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            <span>Export My Wellness History (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All Stored Data</span>
          </button>
        </div>
      </div>

      {/* Safety & Ethics Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300 block">
          MindCare Clinical Ethics &amp; Safety Notice:
        </span>
        <p>
          MindCare AI is an emotional wellness support tool and does not provide psychiatric diagnoses, clinical prescriptions, or crisis intervention. In case of acute emergency or thoughts of self-harm, please immediately contact emergency services or national helplines (such as Tele-MANAS 14416 or 988).
        </p>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-slate-300 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of MindCare</span>
      </button>

      {/* Confirm Data Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-rose-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete All Personal Data?</h3>
              <p className="text-xs text-slate-500">
                This will permanently delete your mood logs, private reflections, and local preferences. This action cannot be reversed.
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Keep My Data
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
