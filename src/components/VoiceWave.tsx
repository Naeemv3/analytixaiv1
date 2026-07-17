import React from 'react';
import { motion } from 'motion/react';

interface VoiceWaveProps {
  status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
}

export default function VoiceWave({ status }: VoiceWaveProps) {
  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';
  const isThinking = status === 'thinking';
  const isActive = isListening || isSpeaking || isThinking;

  // Let's define 10 individual bars, with distinct bounce heights and timings
  const bars = [
    { baseHeight: 8, bounceHeight: 28, delay: 0.1, color: 'bg-violet-500' },
    { baseHeight: 12, bounceHeight: 44, delay: 0.25, color: 'bg-indigo-500' },
    { baseHeight: 16, bounceHeight: 52, delay: 0.15, color: 'bg-purple-500' },
    { baseHeight: 14, bounceHeight: 48, delay: 0.35, color: 'bg-pink-500' },
    { baseHeight: 10, bounceHeight: 36, delay: 0.2, color: 'bg-rose-500' },
    { baseHeight: 16, bounceHeight: 56, delay: 0.45, color: 'bg-emerald-500' },
    { baseHeight: 12, bounceHeight: 40, delay: 0.3, color: 'bg-teal-500' },
    { baseHeight: 18, bounceHeight: 60, delay: 0.5, color: 'bg-cyan-500' },
    { baseHeight: 10, bounceHeight: 32, delay: 0.18, color: 'bg-blue-500' },
    { baseHeight: 6, bounceHeight: 24, delay: 0.28, color: 'bg-violet-400' },
  ];

  return (
    <div className="flex items-end justify-center gap-1.5 h-16 px-4 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-inner max-w-sm mx-auto">
      {bars.map((bar, i) => {
        // Compute animation properties based on active status
        const heightAnimation = isActive
          ? isThinking
            ? [bar.baseHeight, bar.baseHeight + 8, bar.baseHeight] // gentle pulse during thinking
            : [bar.baseHeight, bar.bounceHeight, bar.baseHeight] // high energy bounce during speech/listening
          : bar.baseHeight;

        return (
          <motion.div
            key={i}
            className={`w-1.5 rounded-full ${bar.color} opacity-80`}
            animate={{
              height: heightAnimation,
            }}
            transition={
              isActive
                ? {
                    duration: isThinking ? 0.8 : 0.6,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: bar.delay,
                  }
                : { duration: 0.3 }
            }
            style={{
              height: `${bar.baseHeight}px`,
            }}
          />
        );
      })}
    </div>
  );
}
