import React, { useState, useEffect, useRef } from 'react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import VoiceButton from './VoiceButton';
import VoiceWave from './VoiceWave';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, X, Terminal, HelpCircle, Send } from 'lucide-react';

export default function VoiceAssistant() {
  const {
    status,
    transcript,
    messages,
    errorMessage,
    startListening,
    stopListening,
    cancelPlayback,
    askAssistant,
    isSupported,
  } = useVoiceAssistant();

  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-open assistant drawer when user starts talking, or auto-scroll to the latest message
  useEffect(() => {
    if (status === 'listening' && !isOpen) {
      setIsOpen(true);
    }
  }, [status]);

  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, transcript, isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Pre-configured chips for user convenience
  const suggestionChips = [
    { label: 'Summarize this dashboard', text: 'Summarize this dashboard' },
    { label: 'Why did revenue dip?', text: 'Why did revenue dip in Q3?' },
    { label: 'Open Reports', text: 'Open Reports' },
    { label: 'Go to Dashboard', text: 'Go to Dashboard' },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50 select-none">
      
      {/* 1. ASSISTANT DRAWER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-80 sm:w-[360px] h-[480px] bg-[#070914]/95 border border-violet-500/15 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(167,139,250,0.18)] flex flex-col overflow-hidden text-white"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-950/20 to-indigo-950/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-sans tracking-wide">Analytix AI Copilot</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      status === 'listening' ? 'bg-emerald-400 animate-pulse' :
                      status === 'thinking' ? 'bg-violet-400 animate-spin' :
                      status === 'speaking' ? 'bg-rose-400 animate-pulse' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-wider">
                      {status === 'listening' ? 'Listening...' :
                       status === 'thinking' ? 'Processing...' :
                       status === 'speaking' ? 'Speaking...' :
                       'Voice Standby'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleToggle}
                className="w-6 h-6 rounded-md hover:bg-white/5 border border-transparent hover:border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Conversation Log & Live Transcription */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !transcript && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/5 border border-violet-500/10 flex items-center justify-center text-violet-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">Autonomous Voice BI Assistant</h4>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[220px] leading-normal font-sans">
                      Click the microphone to voice-command Analytix. Ask questions or navigate your analytics dashboard.
                    </p>
                  </div>
                </div>
              )}

              {/* Scrolling Conversation Log */}
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[8px] font-mono text-white/30 tracking-widest mb-1">
                      {isUser ? 'YOU' : 'COPILOT'}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[11px] font-sans leading-relaxed ${
                        isUser
                          ? 'bg-violet-600 border border-violet-500/20 text-white shadow-md'
                          : 'bg-white/[0.03] border border-white/5 text-gray-100 shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Live transcript shown as the user is speaking */}
              {status === 'listening' && transcript && (
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-mono text-emerald-400/70 tracking-widest mb-1 animate-pulse">
                    RECORDING (LIVE)
                  </span>
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[11px] font-sans bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 italic shadow-sm">
                    {transcript}
                  </div>
                </div>
              )}

              {/* Waiting status dots */}
              {status === 'thinking' && (
                <div className="flex flex-col items-start">
                  <span className="text-[8px] font-mono text-white/30 tracking-widest mb-1">COPILOT • CALCULATING</span>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-3.5 py-3 text-[11px] text-violet-400 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Display descriptive error logs if any */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-300 text-[10px] leading-relaxed font-sans">
                  {errorMessage}
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {/* Quick action chips & wave container */}
            <div className="p-4 bg-white/[0.01] border-t border-white/5 space-y-3 shrink-0">
              
              {/* Show chips only in idle/standby */}
              {status === 'idle' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 px-0.5 text-white/40 text-[9px] font-mono tracking-wider uppercase font-bold">
                    <Terminal className="w-3 h-3 text-white/30" />
                    <span>Try Voice Commands</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => askAssistant(chip.text)}
                        className="px-2.5 py-1 text-[9px] font-sans font-medium text-violet-300 bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/10 hover:border-violet-500/20 rounded-lg transition-all cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Input Fallback */}
              {status === 'idle' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (textInput.trim()) {
                      askAssistant(textInput.trim());
                      setTextInput('');
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type a business question or command..."
                    className="flex-1 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-[#090D1C] border border-white/10 focus:border-violet-500/50 rounded-xl px-3 py-2 text-[11px] placeholder-white/35 focus:outline-none transition-all text-white"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Dynamic waveform visualizer when active */}
              {status !== 'idle' && (
                <div className="space-y-2 animate-fade-in">
                  <VoiceWave status={status} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FLOATING MIC TRIGGER AND INDICATOR */}
      <div className="flex items-center gap-3">
        {/* Helper text shown on first launch when closed */}
        {!isOpen && status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B1220]/90 border border-white/5 text-[10px] text-gray-300 font-sans shadow-lg font-medium pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Speak with your Business Copilot</span>
          </motion.div>
        )}

        <VoiceButton
          status={status}
          isSupported={isSupported}
          onClick={status === 'listening' ? stopListening : startListening}
          onCancel={cancelPlayback}
        />
      </div>
    </div>
  );
}
