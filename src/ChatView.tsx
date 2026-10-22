import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Trash2, 
  ShieldAlert, 
  Info, 
  HeartHandshake, 
  Copy, 
  Check, 
  Compass, 
  Smile,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatViewProps {
  onOpenCrisis: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onOpenCrisis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'model',
      content: `Hello, I'm **MindCare AI**, your emotional wellness companion.\n\nWhatever is weighing on your mind—whether it's quiet stress, racing thoughts, relationships, or just needing a listening ear—you have a safe, non-judgmental space here.\n\n*How are you feeling in your mind and body right now?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedPrompts = [
    "I'm feeling stressed today.",
    "I can't stop overthinking.",
    "I need someone to talk to.",
    "Help me relax before sleeping.",
  ];

  const topics = [
    { id: 'all', label: 'All Topics' },
    { id: 'stress', label: 'Stress & Anxiety' },
    { id: 'overthinking', label: 'Overthinking' },
    { id: 'sleep', label: 'Sleep & Rest' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'confidence', label: 'Self-Confidence' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: selectedTopic !== 'all' ? selectedTopic : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          topic: selectedTopic,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        content: data.reply || "I'm right here with you. Take a slow breath, and feel free to share whatever you're comfortable with.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisisWarning: data.crisisDetected || false,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai_fallback_${Date.now()}`,
        role: 'model',
        content: `I hear you, and thank you for taking this moment to share what you are carrying. Even when words feel heavy or technology encounters a hiccup, please know your feelings are recognized and valid.\n\nTake a slow, deep breath in... and gently let it out. What feels like the kindest thing you could do for yourself in this next hour?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'model',
        content: `Welcome back to a fresh conversation. I'm MindCare AI.\n\nWhenever you're ready, take your time and let me know what is resting on your mind today.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl border border-purple-100/60 dark:border-slate-800 overflow-hidden shadow-xs">
      {/* Chat Sub-Header */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-purple-100/60 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">MindCare AI Companion</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active & Ready" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Non-judgmental emotional support &amp; coping tools</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={resetChat}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            title="Start New Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="px-4 py-1.5 bg-purple-50/80 dark:bg-purple-950/30 border-b border-purple-100/40 dark:border-purple-900/30 flex items-center justify-between text-[11px] text-purple-900 dark:text-purple-300">
        <span className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="truncate">AI companion is for emotional support, not clinical diagnosis.</span>
        </span>
        <button
          onClick={onOpenCrisis}
          className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0 ml-2"
        >
          Crisis Helplines
        </button>
      </div>

      {/* Topic Filter Chips */}
      <div className="px-3 py-2 bg-white/70 dark:bg-slate-900/70 border-b border-purple-100/30 dark:border-slate-800 overflow-x-auto flex space-x-1.5 scrollbar-none shrink-0">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
              selectedTopic === t.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <HeartHandshake className="w-12 h-12 text-purple-300 dark:text-purple-700 mb-2" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Your conversation was cleared</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Tap any prompt below or type in the box to begin a fresh, calm reflection.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-purple-100/70 dark:border-slate-700/80 rounded-tl-xs'
                  }`}
                >
                  {/* Crisis Alert Banner inside AI Message if flagged */}
                  {msg.isCrisisWarning && (
                    <div className="mb-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Immediate Support Available:</span>
                        Please reach out to a trusted loved one or contact Tele-MANAS (14416 in India) or 988 Lifeline.
                        <button
                          onClick={onOpenCrisis}
                          className="mt-1 block font-semibold text-rose-700 dark:text-rose-300 underline"
                        >
                          View 24/7 Crisis Helplines →
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Message footer: timestamp & copy */}
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-purple-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => copyMessage(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs py-2 px-3 bg-white dark:bg-slate-800 rounded-2xl border border-purple-100 dark:border-slate-700 w-fit animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin" />
            <span>MindCare is reflecting on a gentle response...</span>
            <div className="flex space-x-1 ml-1">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 pt-2 pb-1 bg-white dark:bg-slate-900 border-t border-purple-100/40 dark:border-slate-800 overflow-x-auto flex space-x-2 scrollbar-none shrink-0">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-slate-800/80 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 text-xs font-medium whitespace-nowrap transition-colors border border-purple-200/50 dark:border-slate-700 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-purple-100/60 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type what is on your mind... (Shift+Enter for new line)"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm border-none focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 resize-none max-h-24"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-600/20 transition-all shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
