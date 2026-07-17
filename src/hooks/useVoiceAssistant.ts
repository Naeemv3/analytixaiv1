import { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../services/dashboardContext';
import { speechRecognizerInstance } from '../services/speechRecognition';
import { askGemini } from '../services/geminiService';
import { synthesizeSpeech } from '../services/murfService';
import { ChatMessage } from '../types';

export type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export function useVoiceAssistant() {
  const {
    filename,
    schema,
    kpis,
    insights,
    anomalies,
    recommendations,
    activeTab,
    setActiveTab,
  } = useDashboard();

  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognizer = speechRecognizerInstance;

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      speechRecognizer.stop();
    };
  }, []);

  // Helper to match speech with client-side navigation commands
  const checkNavigationCommand = (speech: string): string | null => {
    const s = speech.toLowerCase().trim();
    if (s.includes('open reports') || s.includes('go to reports') || s.includes('view reports') || s.includes('show reports')) {
      return 'reports';
    }
    if (s.includes('go to dashboard') || s.includes('open dashboard') || s.includes('view dashboard') || s.includes('show dashboard')) {
      return 'dashboard';
    }
    if (s.includes('show alerts') || s.includes('open alerts') || s.includes('view alerts') || s.includes('go to alerts')) {
      return 'dashboard-alerts';
    }
    if (s.includes('open root cause') || s.includes('run root cause') || s.includes('view root cause') || s.includes('show root cause')) {
      return 'dashboard-root-cause';
    }
    if (s.includes('open settings') || s.includes('go to settings') || s.includes('view settings')) {
      return 'settings';
    }
    if (s.includes('open ai lab') || s.includes('go to ai lab') || s.includes('open scenario simulator') || s.includes('go to simulator')) {
      return 'ai-lab';
    }
    if (s.includes('open data sources') || s.includes('go to data sources') || s.includes('upload page')) {
      return 'data-sources';
    }
    return null;
  };

  // Helper to play speech using native SpeechSynthesis as fallback
  const playNativeSpeechFallback = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return reject(new Error('Browser SpeechSynthesis is not supported'));
      }

      // Cancel any active speech
      window.speechSynthesis.cancel();

      // Clean text of markdown or special characters
      const cleanText = text.replace(/[*#_`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Look for natural en-US female or modern voices
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Microsoft'))
      ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Native speech utterance error:', e);
        if (e.error === 'interrupted' || e.error === 'canceled') {
          resolve();
        } else {
          reject(new Error(`Speech fallback error: ${e.error}`));
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Helper to synthesize and play spoken responses
  const playSpokenResponse = async (text: string) => {
    setStatus('speaking');
    try {
      // 1. Synthesize Speech using Murf AI server-side proxy
      const audioUrl = await synthesizeSpeech(text);

      // 2. Play the generated audio track
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setStatus('idle');
        audioRef.current = null;
      };

      audio.onerror = async (e) => {
        console.warn('Audio playback failed, falling back to browser SpeechSynthesis:', e);
        try {
          await playNativeSpeechFallback(text);
          setStatus('idle');
        } catch (fallbackErr: any) {
          console.error('Fallback speech synthesis failed:', fallbackErr);
          setStatus('error');
          setErrorMessage('Failed to play synthesized speech.');
          setTimeout(() => setStatus('idle'), 3000);
        }
      };

      await audio.play();
    } catch (err: any) {
      console.warn('Murf AI TTS failed, falling back to native SpeechSynthesis:', err);
      try {
        await playNativeSpeechFallback(text);
        setStatus('idle');
      } catch (fallbackErr: any) {
        console.error('Fallback speech synthesis failed:', fallbackErr);
        setStatus('error');
        setErrorMessage('Speech synthesis failed. Please configure VITE_MURF_API_KEY in settings or check browser speech support.');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }
  };

  // Trigger ask assistant programmatically (for suggestion chips)
  const askAssistant = async (text: string) => {
    if (status === 'speaking' || status === 'thinking') {
      return;
    }

    setErrorMessage('');
    setStatus('thinking');

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: 'voice-user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 2. Check navigation command
    const targetTab = checkNavigationCommand(text);
    if (targetTab) {
      let spokenAnswer = '';
      if (targetTab === 'dashboard-alerts') {
        setActiveTab('dashboard');
        spokenAnswer = 'Opening the dashboard overview. Let me scroll you straight down to the anomalies and metrics alert pane.';
        setTimeout(() => {
          const el = document.getElementById('anomaly-alerts') || document.getElementById('alerts-section');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
      } else if (targetTab === 'dashboard-root-cause') {
        setActiveTab('dashboard');
        spokenAnswer = 'Opening the main dashboard view. Centering your workspace on the root cause turnaround analysis card.';
        setTimeout(() => {
          const el = document.getElementById('root-cause-section') || document.getElementById('root-cause-analysis');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
      } else {
        setActiveTab(targetTab);
        spokenAnswer = `Opening the ${targetTab.replace('-', ' ')} view for you.`;
      }

      const botMsg: ChatMessage = {
        id: 'voice-bot-' + Date.now(),
        sender: 'assistant',
        text: spokenAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      await playSpokenResponse(spokenAnswer);
      return;
    }

    // 3. Hit Gemini & Synthesize Murf
    try {
      const dashboardContextPayload = {
        filename,
        schema,
        kpis,
        insights,
        anomalies,
        recommendations,
      };

      const answer = await askGemini(text, dashboardContextPayload);

      const botMsg: ChatMessage = {
        id: 'voice-bot-' + Date.now(),
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);

      await playSpokenResponse(answer);
    } catch (err: any) {
      console.error('Error processing programmatic voice query:', err);
      const fallbackText = "I couldn't find that information in the uploaded business data.";
      
      const botMsg: ChatMessage = {
        id: 'voice-bot-' + Date.now(),
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      await playSpokenResponse(fallbackText);
    }
  };

  // Start Voice Assistant Voice Ingest
  const startListening = () => {
    if (status === 'speaking' || status === 'thinking') {
      return; // Block actions while assistant is active
    }

    setTranscript('');
    setErrorMessage('');
    setStatus('listening');

    speechRecognizer.start({
      onStart: () => {
        setStatus('listening');
      },
      onResult: (text: string, isFinal: boolean) => {
        setTranscript(text);
      },
      onEnd: () => {
        // Speech ended, trigger query analysis if transcript has content
        setStatus((prevStatus) => {
          if (prevStatus === 'listening') {
            return 'thinking';
          }
          return prevStatus;
        });
      },
      onError: (err: any) => {
        console.error('Speech recognition runtime error:', err);
        setStatus('error');
        setErrorMessage(`Speech recognition blocked inside iframe. Please click the "Open in new tab" link to run voice controls! (Error: ${err.error || 'not-allowed'})`);
        setTimeout(() => setStatus('idle'), 8000);
      },
    });
  };

  // Stop Listening manually
  const stopListening = () => {
    if (status === 'listening') {
      speechRecognizer.stop();
    }
  };

  // Process the final transcribed user query
  useEffect(() => {
    if (status !== 'thinking' || !transcript.trim()) {
      return;
    }

    const processQuery = async () => {
      const userText = transcript.trim();
      
      // 1. Add user message to conversation history
      const userMsg: ChatMessage = {
        id: 'voice-user-' + Date.now(),
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);

      // 2. Check for navigation commands first (client-side route matching)
      const targetTab = checkNavigationCommand(userText);
      if (targetTab) {
        let spokenAnswer = '';
        if (targetTab === 'dashboard-alerts') {
          setActiveTab('dashboard');
          spokenAnswer = 'Opening the dashboard overview. Let me scroll you straight down to the anomalies and metrics alert pane.';
          setTimeout(() => {
            const el = document.getElementById('anomaly-alerts') || document.getElementById('alerts-section');
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        } else if (targetTab === 'dashboard-root-cause') {
          setActiveTab('dashboard');
          spokenAnswer = 'Opening the main dashboard view. Centering your workspace on the root cause turnaround analysis card.';
          setTimeout(() => {
            const el = document.getElementById('root-cause-section') || document.getElementById('root-cause-analysis');
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        } else {
          setActiveTab(targetTab);
          spokenAnswer = `Opening the ${targetTab.replace('-', ' ')} view for you.`;
        }

        // Add assistant message & play voice directly
        const botMsg: ChatMessage = {
          id: 'voice-bot-' + Date.now(),
          sender: 'assistant',
          text: spokenAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        await playSpokenResponse(spokenAnswer);
        return;
      }

      // 3. Fallback: Query Gemini on server with complete dashboard context
      try {
        const dashboardContextPayload = {
          filename,
          schema,
          kpis,
          insights,
          anomalies,
          recommendations,
        };

        const answer = await askGemini(userText, dashboardContextPayload);

        // Add assistant answer to message logs
        const botMsg: ChatMessage = {
          id: 'voice-bot-' + Date.now(),
          sender: 'assistant',
          text: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);

        // Synthesize and play response
        await playSpokenResponse(answer);
      } catch (err: any) {
        console.error('Error processing voice query:', err);
        const fallbackText = "I couldn't find that information in the uploaded business data.";
        
        const botMsg: ChatMessage = {
          id: 'voice-bot-' + Date.now(),
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        await playSpokenResponse(fallbackText);
      }
    };

    processQuery();
  }, [status, transcript]);

  // Cancel currently speaking assistant or active processes
  const cancelPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    speechRecognizer.stop();
    setStatus('idle');
  };

  return {
    status,
    transcript,
    messages,
    errorMessage,
    startListening,
    stopListening,
    cancelPlayback,
    askAssistant,
    isSupported: speechRecognizer.isSupported(),
  };
}
