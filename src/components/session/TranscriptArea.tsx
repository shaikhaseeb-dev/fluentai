'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { TranscriptEntry } from '@/types/session';

interface Props {
  entries: TranscriptEntry[];
  isProcessing: boolean;
}

export function TranscriptArea({ entries, isProcessing }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, isProcessing]);

  return (
    <div className="card flex-1 min-h-0 overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold text-surface-700 mb-4">Conversation Transcript</h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {entries.length === 0 && (
          <p className="text-sm text-surface-400 text-center py-8">
            Your conversation will appear here...
          </p>
        )}
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${entry.role === 'USER' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              entry.role === 'AI'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-surface-200 text-surface-600'
            }`}>
              {entry.role === 'AI' ? 'AI' : 'You'}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              entry.role === 'AI'
                ? 'bg-surface-100 text-surface-800 rounded-tl-none'
                : 'bg-primary-700 text-white rounded-tr-none'
            }`}>
              {entry.content}
            </div>
          </motion.div>
        ))}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
              AI
            </div>
            <div className="bg-surface-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 bg-surface-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
