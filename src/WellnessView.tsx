import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Sparkles, 
  Eye, 
  Hand, 
  Ear, 
  Flower2, 
  Utensils, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  BookHeart, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun,
  ShieldCheck
} from 'lucide-react';
import { JOURNAL_PROMPTS } from '../data/mockData';

export const WellnessView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'breathing' | 'grounding' | 'checklist' | 'journal'>('breathing');

  // Breathing Circle State
  const [breathingPattern, setBreathingPattern] = useState<'box' | 'relax' | 'deep'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [completedBreaths, setCompletedBreaths] = useState<number>(0);

  // Audio Ambient Generator (Web Audio API)
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // 5-4-3-2-1 Grounding step
  const [groundingStep, setGroundingStep] = useState<number>(0);

  // Daily Self Care Checklist
  const [checklist, setChecklist] = useState<Array<{ id: string; label: string; done: boolean }>>([
    { id: 'c1', label: 'Drank a glass of fresh water upon waking', done: true },
    { id: 'c2', label: 'Stepped outside or opened window for natural light', done: true },
    { id: 'c3', label: 'Practiced 5 minutes of conscious breathing', done: false },
    { id: 'c4', label: 'Stretched neck, shoulders, and spine', done: false },
    { id: 'c5', label: 'Wrote down 1 sincere thing I am grateful for', done: false },
    { id: 'c6', label: 'Turned off work notifications 1 hour before bed', done: false },
  ]);

  // Guided Journaling State
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number>(0);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [savedJournalToast, setSavedJournalToast] = useState<boolean>(false);

  // Breathing timer loop
  useEffect(() => {
    if (!isBreathingActive) return;

    // Durations for each technique:
    // Box: Inhale 4s, Hold 4s, Exhale 4s, Rest 4s
    // Relax (4-7-8): Inhale 4s, Hold 7s, Exhale 8s, Rest 1s
    // Deep: Inhale 5s, Hold 2s, Exhale 5s, Rest 1s
    const config = {
      box: { Inhale: 4, Hold: 4, Exhale: 4, Rest: 4 },
      relax: { Inhale: 4, Hold: 7, Exhale: 8, Rest: 1 },
      deep: { Inhale: 5, Hold: 2, Exhale: 5, Rest: 1 },
    }[breathingPattern];

    const timer = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition to next phase
        if (breathPhase === 'Inhale') {
          setBreathPhase('Hold');
          return config.Hold;
        } else if (breathPhase === 'Hold') {
          setBreathPhase('Exhale');
          return config.Exhale;
        } else if (breathPhase === 'Exhale') {
          if (config.Rest > 0) {
            setBreathPhase('Rest');
            return config.Rest;
          } else {
            setCompletedBreaths((c) => c + 1);
            setBreathPhase('Inhale');
            return config.Inhale;
          }
        } else {
          setCompletedBreaths((c) => c + 1);
          setBreathPhase('Inhale');
          return config.Inhale;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathingPattern]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setBreathPhase('Inhale');
      setPhaseSecondsLeft(breathingPattern === 'deep' ? 5 : 4);
    }
    setIsBreathingActive(!isBreathingActive);
  };

  // Ambient sound synthesizer using Web Audio API (white noise filtered for gentle summer rain & Tibetan chime harmonics)
  const toggleAmbientSound = () => {
    if (isSoundPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsSoundPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Create pink noise buffer for soft rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.04;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Lowpass filter for muffled cozy rain
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNodeRef.current = gainNode;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        setIsSoundPlaying(true);
      } catch (e) {
        console.error('Ambient audio not supported', e);
      }
    }
  };

  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.done).length;

  // Grounding 5-4-3-2-1 steps data
  const groundingSteps = [
    {
      step: 5,
      icon: Eye,
      title: '5 Things You Can SEE',
      prompt: 'Look around your room or space. Notice 5 distinct colors, patterns, shadows, or items.',
      examples: 'e.g., A ray of light on the wall, the grain of wood on a desk, a plant leaf, a mug.',
    },
    {
      step: 4,
      icon: Hand,
      title: '4 Things You Can FEEL',
      prompt: 'Bring attention to tactile sensations. Touch 4 different textures.',
      examples: 'e.g., The texture of your shirt, the cool surface of your phone, feet on the rug, gentle air.',
    },
    {
      step: 3,
      icon: Ear,
      title: '3 Things You Can HEAR',
      prompt: 'Close your eyes for 5 seconds and listen to background noises you usually tune out.',
      examples: 'e.g., Distant traffic, a humming fan, birds outside, the sound of your own quiet breath.',
    },
    {
      step: 2,
      icon: Flower2,
      title: '2 Things You Can SMELL',
      prompt: 'Inhale through your nose. Notice subtle aromas in the air.',
      examples: 'e.g., Fresh coffee, lotion on your hands, fresh rain, or clean laundry.',
    },
    {
      step: 1,
      icon: Utensils,
      title: '1 Thing You Can TASTE',
      prompt: 'Notice any lingering flavor in your mouth, or take a gentle sip of cold water.',
      examples: 'e.g., Mint toothpaste, warm herbal tea, or simply the neutral coolness of water.',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Sub Navigation Bar */}
      <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-purple-100 dark:border-slate-800 overflow-x-auto gap-1">
        {[
          { id: 'breathing', label: 'Breathing Circle', icon: Wind },
          { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Sparkles },
          { id: 'checklist', label: 'Self-Care Checklist', icon: CheckCircle2 },
          { id: 'journal', label: 'Journaling', icon: BookHeart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: GUIDED BREATHING CIRCLE */}
      {activeSection === 'breathing' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              Guided Breath Regulation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronize your breath to activate the parasympathetic nervous system and lower cortisol.
            </p>
          </div>

          {/* Pattern selector */}
          <div className="flex justify-center gap-2">
            {[
              { id: 'box', label: 'Box Breathing (4-4-4-4)' },
              { id: 'relax', label: '4-7-8 Relaxing Breath' },
              { id: 'deep', label: 'Deep Calm (5-5)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setBreathingPattern(p.id as any);
                  setIsBreathingActive(false);
                  setBreathPhase('Inhale');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  breathingPattern === p.id
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Animated Breath Visualizer */}
          <div className="relative py-8 flex items-center justify-center">
            {/* Outer pulsating glow rings */}
            <div
              className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out relative ${
                isBreathingActive && breathPhase === 'Inhale'
                  ? 'scale-110 bg-purple-500/15'
                  : isBreathingActive && breathPhase === 'Hold'
                  ? 'scale-110 bg-indigo-500/20'
                  : isBreathingActive && breathPhase === 'Exhale'
                  ? 'scale-90 bg-sky-500/15'
                  : 'scale-100 bg-purple-50 dark:bg-slate-700/40'
              }`}
            >
              {/* Inner core circle */}
              <div
                className={`w-44 h-44 rounded-full shadow-lg flex flex-col items-center justify-center text-white transition-all duration-1000 ease-in-out ${
                  breathPhase === 'Inhale'
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-purple-500/30'
                    : breathPhase === 'Hold'
                    ? 'bg-gradient-to-tr from-indigo-600 to-sky-600 shadow-indigo-500/30'
                    : breathPhase === 'Exhale'
                    ? 'bg-gradient-to-tr from-sky-500 to-emerald-500 shadow-sky-500/30'
                    : 'bg-gradient-to-tr from-slate-600 to-slate-700'
                }`}
              >
                <span className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">
                  {isBreathingActive ? breathPhase : 'Ready'}
                </span>
                <span className="text-4xl font-extrabold font-heading">
                  {isBreathingActive ? phaseSecondsLeft : 'Breathe'}
                </span>
                <span className="text-[10px] opacity-75 mt-1">
                  {breathPhase === 'Inhale'
                    ? 'Expand belly'
                    : breathPhase === 'Hold'
                    ? 'Keep still'
                    : breathPhase === 'Exhale'
                    ? 'Release tension'
                    : 'Soft pause'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={toggleBreathing}
              className={`px-6 py-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition-all ${
                isBreathingActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
              }`}
            >
              {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isBreathingActive ? 'Pause Session' : 'Begin Breathing'}</span>
            </button>

            <button
              onClick={toggleAmbientSound}
              className={`p-3 rounded-2xl border transition-colors ${
                isSoundPlaying
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
              }`}
              title={isSoundPlaying ? 'Mute soothing rain ambient sound' : 'Play soft rain ambient sound'}
            >
              {isSoundPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Completed Cycles: <strong className="text-purple-600">{completedBreaths}</strong>
          </div>
        </div>
      )}

      {/* SECTION 2: 5-4-3-2-1 GROUNDING TECHNIQUE */}
      {activeSection === 'grounding' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                5-4-3-2-1 Sensory Grounding
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground yourself in the physical present to stop racing anxiety or panic loops.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full">
              Step {groundingStep + 1} of 5
            </span>
          </div>

          {/* Active Grounding Card */}
          {(() => {
            const current = groundingSteps[groundingStep];
            const StepIcon = current.icon;
            return (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-sky-50 dark:from-slate-900/60 dark:to-slate-900/30 border border-purple-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Sensory Anchor {current.step}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{current.title}</h4>
                  </div>
                </div>

                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {current.prompt}
                </p>

                <div className="p-3 bg-white/70 dark:bg-slate-800/80 rounded-2xl text-xs text-slate-600 dark:text-slate-300 italic border border-purple-100/50 dark:border-slate-700">
                  {current.examples}
                </div>

                {/* Navigation through steps */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setGroundingStep((prev) => Math.max(0, prev - 1))}
                    disabled={groundingStep === 0}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  {groundingStep < 4 ? (
                    <button
                      onClick={() => setGroundingStep((prev) => Math.min(4, prev + 1))}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                    >
                      Next Sensory Anchor →
                    </button>
                  ) : (
                    <button
                      onClick={() => setGroundingStep(0)}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed! Start Fresh</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SECTION 3: DAILY SELF-CARE CHECKLIST */}
      {activeSection === 'checklist' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                Daily Gentle Self-Care Rituals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Small, nourishing acts that gently refill your inner reserves.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              {completedCount} / {checklist.length} Done
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / checklist.length) * 100}%` }}
            />
          </div>

          {/* Items */}
          <div className="space-y-2.5">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                  item.done
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-300'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${item.done ? 'line-through opacity-80' : ''}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: GUIDED JOURNALING */}
      {activeSection === 'journal' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              Guided Mindful Journaling
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unpack emotional tangles onto the page. No one is grading your words.
            </p>
          </div>

          {/* Prompt Selector */}
          <div className="flex flex-wrap gap-2">
            {JOURNAL_PROMPTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedPromptIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedPromptIndex === idx
                    ? 'bg-purple-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Active Prompt Box */}
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs sm:text-sm text-purple-950 dark:text-purple-200 font-medium">
            "{JOURNAL_PROMPTS[selectedPromptIndex].prompt}"
          </div>

          <textarea
            rows={5}
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Write your honest, uncensored thoughts here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50"
          />

          <div className="flex items-center justify-between">
            {savedJournalToast ? (
              <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reflection saved to private device!</span>
              </span>
            ) : <span />}

            <button
              onClick={() => {
                if (!journalEntry.trim()) return;
                setSavedJournalToast(true);
                setTimeout(() => {
                  setSavedJournalToast(false);
                  setJournalEntry('');
                }, 2200);
              }}
              disabled={!journalEntry.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors"
            >
              Save Reflection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
