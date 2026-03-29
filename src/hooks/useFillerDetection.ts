'use client';

import { useCallback, useRef, useState } from 'react';

const FILLER_PATTERNS = [
  { word: 'um', pattern: /\bum\b/gi },
  { word: 'uh', pattern: /\buh\b/gi },
  { word: 'like', pattern: /\blike\b/gi },
  { word: 'basically', pattern: /\bbasically\b/gi },
  { word: 'actually', pattern: /\bactually\b/gi },
  { word: 'you know', pattern: /\byou know\b/gi },
  { word: 'so', pattern: /\bso\b/gi },
];

export function useFillerDetection() {
  const [fillerCounts, setFillerCounts] = useState<Record<string, number>>({});
  const sessionIdRef = useRef<string | null>(null);

  const detectFillers = useCallback((text: string, sessionId: string) => {
    sessionIdRef.current = sessionId;
    const detected: Record<string, number> = {};

    for (const { word, pattern } of FILLER_PATTERNS) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        detected[word] = matches.length;
      }
    }

    if (Object.keys(detected).length > 0) {
      setFillerCounts(prev => {
        const updated = { ...prev };
        for (const [word, count] of Object.entries(detected)) {
          updated[word] = (updated[word] ?? 0) + count;
        }
        return updated;
      });
    }
  }, []);

  const resetFillers = useCallback(() => {
    setFillerCounts({});
  }, []);

  return { fillerCounts, detectFillers, resetFillers };
}
