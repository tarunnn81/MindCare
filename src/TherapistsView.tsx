import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  X, 
  Info, 
  ShieldCheck, 
  Award, 
  Languages, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { Therapist, Appointment } from '../types';
import { MOCK_THERAPISTS } from '../data/mockData';

interface TherapistsViewProps {
  appointments: Appointment[];
  onBookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onCancelAppointment: (id: string) => void;
}

export const TherapistsView: React.FC<TherapistsViewProps> = ({
  appointments,
  onBookAppointment,
  onCancelAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'my_bookings'>('directory');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedTherapistForBooking, setSelectedTherapistForBooking] = useState<Therapist | null>(null);

  // Booking form state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationMode, setConsultationMode] = useState<'Video Call' | 'In-Person Clinic' | 'Audio Call'>('Video Call');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);

  // Filter therapists
  const allSpecialties = ['All', 'Anxiety Disorders', 'Overthinking', 'CBT', 'Depression', 'Sleep Disorders', 'Relationship Dynamics', 'Burnout'];

  const filteredTherapists = MOCK_THERAPISTS.filter((th) => {
    const matchesSearch =
      th.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      th.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      th.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === 'All' || th.specialties.includes(selectedSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  const handleOpenBooking = (th: Therapist) => {
    setSelectedTherapistForBooking(th);
    setSelectedTime(th.availableSlots[0] || '10:00 AM');
  };

  const handleConfirmBooking = () => {
    if (!selectedTherapistForBooking) return;

    onBookAppointment({
      therapistId: selectedTherapistForBooking.id,
      therapistName: selectedTherapistForBooking.name,
      therapistTitle: selectedTherapistForBooking.title,
      therapistAvatar: selectedTherapistForBooking.avatarUrl,
      date: selectedDate,
      timeSlot: selectedTime,
      mode: consultationMode,
      fee: selectedTherapistForBooking.consultationFee,
      currency: selectedTherapistForBooking.currency,
      status: 'Confirmed',
      notes: sessionNotes.trim() || undefined,
    });

    setSelectedTherapistForBooking(null);
    setBookingSuccessModal(true);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Top Banner with Demo Distinction */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/10 border border-indigo-100 dark:border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Therapist Directory &amp; Consultations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connect with verified psychologists, clinical therapists, and psychiatrists.
            </p>
          </div>
        </div>

        {/* Demo Mode Clear Badge */}
        <div className="mt-3 inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-3 py-1.5 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            <strong>Simulation / Demo Notice:</strong> Therapist profiles and calendar bookings shown here are representative for student review and application testing.
          </span>
        </div>
      </div>

      {/* Tabs: Directory vs My Appointments */}
      <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Verified Practitioners ({filteredTherapists.length})
          </button>
          <button
            onClick={() => setActiveTab('my_bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'my_bookings'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Bookings ({appointments.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: THERAPIST DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialty (e.g. CBT, anxiety), or language..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="overflow-x-auto flex space-x-1.5 scrollbar-none pb-1 sm:pb-0">
              {allSpecialties.slice(0, 5).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSelectedSpecialty(sp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedSpecialty === sp
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-semibold'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Therapist Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTherapists.map((th) => (
              <div
                key={th.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-purple-200 dark:hover:border-purple-800 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={th.avatarUrl}
                      alt={th.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-purple-100 dark:border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {th.name}
                        </h4>
                        {th.isVerified && (
                          <span title="Verified Practitioner">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                        {th.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{th.qualifications}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-3 leading-relaxed">
                    {th.bio}
                  </p>

                  {/* Badges: Experience, Rating, Languages */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{th.rating} ({th.reviewsCount})</span>
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg">
                      {th.experienceYears}+ years exp
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg flex items-center space-x-1">
                      <Languages className="w-3 h-3 text-slate-400" />
                      <span>{th.languages.join(', ')}</span>
                    </span>
                  </div>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {th.specialties.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Fee & Book Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {th.currency}{th.consultationFee} <span className="text-[10px] font-normal text-slate-400">/ 50-min</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(th)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MY BOOKINGS */}
      {activeTab === 'my_bookings' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
              <Calendar className="w-10 h-10 text-purple-300 dark:text-purple-600 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Appointments Scheduled</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our directory of verified practitioners to schedule your first consultation.
              </p>
              <button
                onClick={() => setActiveTab('directory')}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Browse Therapists
              </button>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <img
                    src={apt.therapistAvatar}
                    alt={apt.therapistName}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{apt.therapistName}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400">{apt.therapistTitle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
                      <span>📅 {apt.date}</span>
                      <span>•</span>
                      <span>⏰ {apt.timeSlot}</span>
                      <span>•</span>
                      <span>🎥 {apt.mode}</span>
                    </p>
                    {apt.notes && (
                      <p className="text-xs text-slate-500 italic mt-1">Goal: "{apt.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onCancelAppointment(apt.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    Cancel Session
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedTherapistForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold font-heading text-base text-slate-900 dark:text-white">
                Book Consultation with {selectedTherapistForBooking.name}
              </h3>
              <button
                onClick={() => setSelectedTherapistForBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode selection */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
                1. Select Consultation Mode:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Video Call', 'In-Person Clinic', 'Audio Call'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setConsultationMode(m)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      consultationMode === m
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
                2. Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
                3. Available Time Slots:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedTherapistForBooking.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedTime === slot
                        ? 'border-purple-600 bg-purple-600 text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Goals Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
                4. Primary Focus / Goals for Session (Optional):
              </label>
              <textarea
                rows={2}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="e.g. Managing workplace burnout, coping with sleep anxiety..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              />
            </div>

            {/* Fee Summary */}
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-purple-900 dark:text-purple-200 font-medium">Session Fee (50 mins):</span>
              <span className="font-bold text-sm text-purple-700 dark:text-purple-300">
                {selectedTherapistForBooking.currency}{selectedTherapistForBooking.consultationFee}
              </span>
            </div>

            {/* Confirmation actions */}
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTherapistForBooking(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Dialog */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-emerald-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Consultation Confirmed!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your appointment is locked in. A calendar invitation and secure video consultation room link have been generated.
            </p>
            <button
              onClick={() => {
                setBookingSuccessModal(false);
                setActiveTab('my_bookings');
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
