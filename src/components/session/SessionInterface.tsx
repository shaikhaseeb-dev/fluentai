'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Settings, Volume2 } from 'lucide-react';
import { CorrectionCard } from './CorrectionCard';
import { StuckWordPanel } from './StuckWordPanel';
import { FillerCounter } from './FillerCounter';
import { TranscriptArea } from './TranscriptArea';
import { SessionSummary } from './SessionSummary';
import { CorrectionModeSelector } from './CorrectionModeSelector';
import { useSessionStore } from '@/store/sessionStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useFillerDetection } from '@/hooks/useFillerDetection';
import { useAudio } from '@/hooks/useAudio';
import type { Correction, StuckSuggestion, TranscriptEntry } from '@/types/session';

const FILLER_WORDS = ['um', 'uh', 'like', 'basically', 'actually', 'you know', 'so'];

export function SessionInterface({ userId }: { userId: string }) {
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCorrection, setCurrentCorrection] = useState<Correction | null>(null);
  const [stuckSuggestion, setStuckSuggestion] = useState<StuckSuggestion | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [correctionMode, setCorrectionMode] = useState<'LIGHT' | 'STRICT' | 'FLUENCY'>('LIGHT');

  const { fillerCounts, detectFillers, resetFillers } = useFillerDetection();
  const { speak, isSpeaking } = useAudio();
  const startTimeRef = useRef<Date | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserTextRef = useRef('');
  const stuckCooldownRef = useRef(false);

  const handleSpeechResult = useCallback(async (text: string) => {
    if (!text.trim() || !sessionId) return;

    // Clear pause timer (user spoke)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    stuckCooldownRef.current = false;

    lastUserTextRef.current = text;

    // Detect fillers
    detectFillers(text, sessionId);

    // Add to transcript
    const userEntry: TranscriptEntry = { role: 'USER', content: text, timestamp: new Date() };
    setTranscript(prev => [...prev, userEntry]);

    setIsProcessing(true);

    try {
      // Send to AI conversation API
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          correctionMode,
          history: transcript.slice(-10),
        }),
      });

      const data = await res.json();

      if (data.correction && correctionMode !== 'FLUENCY') {
        setCurrentCorrection(data.correction);
      }

      if (data.reply) {
        const aiEntry: TranscriptEntry = { role: 'AI', content: data.reply, timestamp: new Date() };
        setTranscript(prev => [...prev, aiEntry]);
        await speak(data.reply);
      }

      // Set pause detection timer for Stuck Word Assistant
      pauseTimerRef.current = setTimeout(() => {
        if (!stuckCooldownRef.current && lastUserTextRef.current) {
          triggerStuckWordAssistant(lastUserTextRef.current);
        }
      }, 3500);

    } catch (err) {
      console.error('Conversation error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, correctionMode, transcript, detectFillers, speak]);

  const handleSpeechPartial = useCallback((partialText: string) => {
    // Detect hesitation patterns: "uh... uh..." or "um... um..."
    const hesitationPattern = /\b(uh|um)\b.*\b(uh|um)\b/i;
    if (hesitationPattern.test(partialText) && !stuckCooldownRef.current) {
      triggerStuckWordAssistant(partialText);
    }
  }, []);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onPartialResult: handleSpeechPartial,
  });

  async function triggerStuckWordAssistant(context: string) {
    if (stuckCooldownRef.current || !sessionId) return;
    stuckCooldownRef.current = true;

    try {
      const res = await fetch('/api/stuck-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, sessionId }),
      });
      const data = await res.json();
      if (data.suggestions?.length) {
        setStuckSuggestion({ context, suggestions: data.suggestions });
      }
    } catch (err) {
      console.error('Stuck word error:', err);
    }

    // Reset cooldown after 35 seconds
    setTimeout(() => { stuckCooldownRef.current = false; }, 35000);
  }

  async function startSession() {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    startTimeRef.current = new Date();
    setIsActive(true);
    resetFillers();
    setTranscript([{
      role: 'AI',
      content: "Hello! I'm your FluentAI coach. Let's have a conversation to help you practice English. What would you like to talk about today?",
      timestamp: new Date(),
    }]);
    await speak("Hello! I'm your FluentAI coach. Let's have a conversation to help you practice English. What would you like to talk about today?");
    startListening();
  }

  async function endSession() {
    stopListening();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsActive(false);

    if (!sessionId || !startTimeRef.current) return;

    const duration = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);

    const res = await fetch(`/api/session/${sessionId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration, fillerCounts }),
    });
    const data = await res.json();
    setSessionSummary(data.summary);
    setIsEnded(true);
  }

  function acceptStuckSuggestion(word: string) {
    setStuckSuggestion(null);
    // Store in improvement memory
    fetch('/api/improvement-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, word, context: lastUserTextRef.current }),
    });
  }

  if (isEnded && sessionSummary) {
    return <SessionSummary summary={sessionSummary} onRestart={() => {
      setIsEnded(false);
      setSessionSummary(null);
      setTranscript([]);
    }} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Main session panel */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        {/* Header controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display text-surface-900">Practice Session</h2>
            <p className="text-sm text-surface-500">
              {isActive ? (isListening ? '🎙️ Listening...' : '💭 AI is thinking...') : 'Ready to start'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CorrectionModeSelector value={correctionMode} onChange={setCorrectionMode} disabled={isActive} />
            {isActive && (
              <button onClick={endSession} className="btn-secondary text-sm gap-2">
                <Square className="w-4 h-4 text-correction" /> End Session
              </button>
            )}
          </div>
        </div>

        {/* Mic area */}
        <div className="card flex flex-col items-center py-10 gap-6">
          {!isActive ? (
            <>
              <p className="text-surface-500 text-sm text-center max-w-xs">
                Click the button below to start your practice session. Make sure your microphone is ready.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startSession}
                className="w-24 h-24 bg-primary-700 rounded-full flex items-center justify-center shadow-glow cursor-pointer hover:bg-primary-800 transition-colors"
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.button>
              <p className="text-primary-700 font-medium">Start Session</p>
            </>
          ) : (
            <>
              {/* Active mic with animated rings */}
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <>
                    <div className="absolute w-28 h-28 rounded-full bg-primary-200 mic-pulse-ring" />
                    <div className="absolute w-36 h-36 rounded-full bg-primary-100 mic-pulse-ring" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-glow transition-colors ${
                  isListening ? 'bg-primary-700' : isProcessing ? 'bg-surface-400' : 'bg-surface-300'
                }`}>
                  {isListening ? (
                    <Mic className="w-9 h-9 text-white" />
                  ) : (
                    <Volume2 className="w-9 h-9 text-white" />
                  )}
                </div>
              </div>

              {/* Waveform */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 h-8"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="wave-bar w-1.5 bg-primary-500 rounded-full" style={{ height: '24px' }} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filler counter */}
              <FillerCounter counts={fillerCounts} />
            </>
          )}
        </div>

        {/* Transcript */}
        <TranscriptArea entries={transcript} isProcessing={isProcessing} />
      </div>

      {/* Right sidebar - correction/stuck word cards */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {currentCorrection && (
            <CorrectionCard
              key={currentCorrection.id}
              correction={currentCorrection}
              onDismiss={() => setCurrentCorrection(null)}
              onAccept={() => setCurrentCorrection(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stuckSuggestion && (
            <StuckWordPanel
              key="stuck"
              suggestion={stuckSuggestion}
              onAccept={acceptStuckSuggestion}
              onDismiss={() => setStuckSuggestion(null)}
            />
          )}
        </AnimatePresence>

        {/* Tips card when idle */}
        {!currentCorrection && !stuckSuggestion && (
          <div className="card bg-surface-50 border-dashed">
            <h3 className="font-medium text-surface-700 mb-3 text-sm">💡 Tips for better practice</h3>
            <ul className="space-y-2 text-xs text-surface-500">
              <li>• Speak at a natural pace — don't rush</li>
              <li>• Complete your thoughts fully</li>
              <li>• It's okay to pause and think</li>
              <li>• Focus on clarity over speed</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
