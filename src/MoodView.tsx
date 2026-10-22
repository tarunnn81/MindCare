import React, { useState } from 'react';
import { 
  SmilePlus, 
  TrendingUp, 
  Calendar, 
  Tag, 
  FileText, 
  Plus, 
  Check, 
  Trash2, 
  Sparkles, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { MoodEntry } from '../types';

interface MoodViewProps {
  moods: MoodEntry[];
  onAddMood: (newEntry: Omit<MoodEntry, 'id' | 'date'>) => void;
  onDeleteMood: (id: string) => void;
}

export const MoodView: React.FC<MoodViewProps> = ({ moods, onAddMood, onDeleteMood }) => {
  const [score, setScore] = useState<number>(7);
  const [selectedEmoji, setSelectedEmoji] = useState<{ emoji: string; label: string }>({ emoji: '😌', label: 'Calm' });
  const [note, setNote] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sleep']);
  const [timeframe, setTimeframe] = useState<'7days' | '30days'>('7days');
  const [isSuccessToast, setIsSuccessToast] = useState<boolean>(false);

  const emojiOptions = [
    { emoji: '😭', label: 'Overwhelmed', defaultScore: 2 },
    { emoji: '😔', label: 'Down', defaultScore: 3 },
    { emoji: '😰', label: 'Anxious', defaultScore: 4 },
    { emoji: '😐', label: 'Meh', defaultScore: 5 },
    { emoji: '😌', label: 'Calm', defaultScore: 7 },
    { emoji: '😊', label: 'Good', defaultScore: 8 },
    { emoji: '✨', label: 'Ecstatic', defaultScore: 10 },
  ];

  const availableTags = [
    'Work', 'Sleep', 'Exercise', 'Family', 'Relationships', 
    'Study', 'Food', 'Social', 'Weather', 'Rest', 'Mindfulness'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleEmojiSelect = (item: { emoji: string; label: string; defaultScore: number }) => {
    setSelectedEmoji({ emoji: item.emoji, label: item.label });
    setScore(item.defaultScore);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMood({
      score,
      emoji: selectedEmoji.emoji,
      label: selectedEmoji.label,
      tags: selectedTags,
      note: note.trim() || undefined,
    });
    setNote('');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 2500);
  };

  // Calculate mood analytics
  const recentEntries = timeframe === '7days' ? moods.slice(-7) : moods.slice(-30);
  const averageScore = recentEntries.length > 0 
    ? (recentEntries.reduce((acc, m) => acc + m.score, 0) / recentEntries.length).toFixed(1)
    : '7.0';

  // Self-care insight based on recent average
  const getSelfCareSuggestion = (avg: number) => {
    if (avg >= 7.5) {
      return {
        title: "Flourishing Energy",
        tip: "You've had consistent uplifted moments lately. Take a second to note down what gave you energy, so you can revisit these joyful anchors on lower days.",
        badge: "Positive Balance",
      };
    } else if (avg >= 5) {
      return {
        title: "Balanced & Steady",
        tip: "A gentle middle ground. Consider adding a 10-minute walk outside or a screen-free tea break this afternoon to refresh your mind.",
        badge: "Steady Rhythm",
      };
    } else {
      return {
        title: "Tender Care Needed",
        tip: "Your heart has been carrying extra weight lately. Remember that resting is productive. Prioritize gentle sleep hygiene, warm hydration, and lower expectations for today.",
        badge: "Compassion Focus",
      };
    }
  };

  const currentInsight = getSelfCareSuggestion(parseFloat(averageScore));

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-purple-500/10 to-sky-500/10 border border-emerald-100 dark:border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <SmilePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Mood Check-in &amp; Patterns
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your emotional rhythm without judgment. Notice the ebb and flow.
            </p>
          </div>
        </div>
      </div>

      {/* Mood Entry Form Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-5">
        <h3 className="font-bold font-heading text-slate-900 dark:text-white text-base flex items-center justify-between">
          <span>Log Your Current Emotion</span>
          {isSuccessToast && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Mood saved peacefully!</span>
            </span>
          )}
        </h3>

        {/* Emojis Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
            1. Select the emoji that matches your state:
          </label>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {emojiOptions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleEmojiSelect(item)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                  selectedEmoji.label === item.label
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 shadow-xs scale-105'
                    : 'border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium mt-1 truncate max-w-full">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 1 - 10 Scale Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              2. Mood Intensity Scale (1 to 10):
            </span>
            <span className="font-bold text-purple-600 dark:text-purple-400 text-sm bg-purple-100 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">
              {score} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1: Very Challenging</span>
            <span>5: Neutral</span>
            <span>10: Truly Radiant</span>
          </div>
        </div>

        {/* Context Tags */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
            3. What factors influenced your mood? (Optional):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Reflection Note */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
            4. Personal reflection or gratitude note (Optional):
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A quick sentence on what happened or what you noticed..."
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Save Mood Log</span>
        </button>
      </div>

      {/* Mood Trends Chart Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold font-heading text-slate-900 dark:text-white text-base flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Mood Analytics &amp; Trajectory</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Average Score: <strong className="text-purple-600">{averageScore}/10</strong> across {recentEntries.length} check-ins
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl w-fit">
            <button
              onClick={() => setTimeframe('7days')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                timeframe === '7days' ? 'bg-white dark:bg-slate-900 text-purple-600 font-semibold shadow-xs' : 'text-slate-500'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setTimeframe('30days')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                timeframe === '30days' ? 'bg-white dark:bg-slate-900 text-purple-600 font-semibold shadow-xs' : 'text-slate-500'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="pt-4">
          <div className="h-44 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-700/60" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-700/60" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-700/60" />

              {/* Data points calculation */}
              {recentEntries.length > 1 && (() => {
                const step = 500 / (recentEntries.length - 1);
                const points = recentEntries.map((m, i) => {
                  const x = i * step;
                  // Map score 1..10 to y (140 to 20)
                  const y = 140 - ((m.score - 1) / 9) * 120;
                  return { x, y, ...m };
                });

                const pathData = points.reduce((acc, p, i) => {
                  return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                }, '');

                const areaData = `${pathData} L ${points[points.length - 1].x} 150 L 0 150 Z`;

                return (
                  <>
                    {/* Gradient Fill under line */}
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={areaData} fill="url(#moodGradient)" />
                    <path d={pathData} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />

                    {/* Circular nodes with emojis */}
                    {points.map((p, i) => (
                      <g key={p.id || i} className="group cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          className="fill-white dark:fill-slate-900 stroke-purple-600 stroke-[2.5]"
                        />
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          className="text-[12px] opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          {p.emoji}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Earlier entries</span>
            <span>Today</span>
          </div>
        </div>

        {/* Gentle Self-Care Recommendation Banner */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-purple-900 dark:text-purple-200">{currentInsight.title}</span>
              <span className="text-[10px] bg-purple-200/80 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full font-semibold">
                {currentInsight.badge}
              </span>
            </div>
            <p className="text-xs text-purple-950 dark:text-purple-300 leading-relaxed">
              {currentInsight.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Mood History Logs */}
      <div className="space-y-3">
        <h3 className="font-bold font-heading text-slate-900 dark:text-white text-sm px-1">
          Recent Mood Reflections ({moods.length})
        </h3>
        <div className="space-y-2">
          {moods.slice().reverse().map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl p-2 rounded-2xl bg-purple-50 dark:bg-slate-700/60">{entry.emoji}</span>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{entry.label}</span>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
                      Score: {entry.score}/10
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{entry.note}"</p>
                  )}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteMood(entry.id)}
                className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                title="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
