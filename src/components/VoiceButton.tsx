import React from 'react';
import { Mic, MicOff, RefreshCw, Volume2, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { VoiceStatus } from '../hooks/useVoiceAssistant';

interface VoiceButtonProps {
  status: VoiceStatus;
  isSupported: boolean;
  onClick: () => void;
  onCancel: () => void;
}

export default function VoiceButton({ status, isSupported, onClick, onCancel }: VoiceButtonProps) {
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';
  const isError = status === 'error';

  // Disable microphone clicking when thinking or speaking as per requirement 7
  const isDisabled = isThinking || isSpeaking;

  if (!isSupported) {
    return (
      <button
        disabled
        title="Voice Speech Recognition is not supported on this browser"
        className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/20 text-red-400 flex items-center justify-center cursor-not-allowed opacity-50 shadow-lg shrink-0"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative group select-none shrink-0">
      {/* Decorative pulse ring when idle or active */}
      {!isDisabled && (
        <span className={`absolute -inset-1.5 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition duration-300 ${
          isListening ? 'bg-emerald-500 animate-ping' : 'bg-violet-600 animate-pulse'
        }`} />
      )}

      {/* Main Trigger Button */}
      <motion.button
        whileHover={!isDisabled ? { scale: 1.06 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        onClick={isDisabled ? onCancel : onClick}
        className={`w-14 h-14 rounded-full flex items-center justify-center relative shadow-[0_0_25px_rgba(167,139,250,0.3)] border transition-all duration-300 z-10 ${
          isListening
            ? 'bg-emerald-500 border-emerald-400 text-white cursor-pointer'
            : isSpeaking
              ? 'bg-rose-500 border-rose-400 text-white cursor-pointer'
              : isThinking
                ? 'bg-[#101726] border-violet-500/50 text-violet-400 cursor-not-allowed'
                : isError
                  ? 'bg-rose-950 border-rose-600 text-rose-400 cursor-pointer'
                  : 'bg-[#C3B5FD] border-[#A78BFA]/30 text-[#050816] hover:bg-[#b5a3fc] cursor-pointer'
        }`}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Mic className="w-5 h-5 fill-white/10" />
          </motion.div>
        ) : isSpeaking ? (
          // Playback cancel action
          <Square className="w-4 h-4 fill-white" />
        ) : isThinking ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>

      {/* Compact hover/active badge */}
      <span className="absolute bottom-16 right-1/2 translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#0B1220] border border-white/5 text-white text-[9px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap">
        {isListening
          ? 'Listening...'
          : isSpeaking
            ? 'Click to stop speaking'
            : isThinking
              ? 'Analyzing...'
              : 'Voice Copilot'}
      </span>
    </div>
  );
}
