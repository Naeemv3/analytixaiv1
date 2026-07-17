export interface SpeechRecognizerHandlers {
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd: () => void;
  onError: (error: any) => void;
  onStart?: () => void;
}

export class SpeechRecognizer {
  private recognition: any | null = null;
  private isListening = false;

  constructor() {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false; // Stop when the user finishes speaking their query
      this.recognition.interimResults = true; // Show results in real-time as they speak
      this.recognition.lang = 'en-US';
    } else {
      console.warn('Web Speech API (SpeechRecognition) is not supported in this browser.');
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(handlers: SpeechRecognizerHandlers): void {
    if (!this.recognition) {
      handlers.onError(new Error('Speech recognition is not supported in this browser.'));
      return;
    }

    if (this.isListening) {
      return;
    }

    this.isListening = true;

    this.recognition.onstart = () => {
      if (handlers.onStart) {
        handlers.onStart();
      }
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment;
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      const activeTranscript = finalTranscript || interimTranscript;
      handlers.onResult(activeTranscript, !!finalTranscript);
    };

    this.recognition.onerror = (event: any) => {
      // Ignore 'no-speech' error if it triggers normally, but pass critical errors through
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error event:', event.error);
        handlers.onError(event);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handlers.onEnd();
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      handlers.onError(err);
      this.isListening = false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
      this.isListening = false;
    }
  }
}

export const speechRecognizerInstance = new SpeechRecognizer();
export default speechRecognizerInstance;
