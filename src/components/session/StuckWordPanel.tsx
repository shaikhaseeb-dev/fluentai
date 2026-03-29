'use client';

import { motion } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import type { StuckSuggestion } from '@/types/session';

interface Props {
  suggestion: StuckSuggestion;
  onAccept: (word: string) => void;
  onDismiss: () => void;
}

export function StuckWordPanel({ suggestion, onAccept, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="card border-primary-200 bg-primary-50"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-700 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900">Stuck Word Assistant</p>
            <p className="text-xs text-surface-500">Are you looking for…</p>
          </div>
        </div>
        <button onClick={onDismiss} className="text-surface-400 hover:text-surface-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {suggestion.suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onAccept(s)}
            className="w-full text-left bg-white hover:bg-primary-100 border border-primary-200 hover:border-primary-400
                       rounded-xl px-4 py-2.5 text-sm text-surface-800 font-medium transition-all duration-150
                       flex items-center justify-between group"
          >
            <span>"{s}"</span>
            <span className="text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Use this →
            </span>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-surface-400 text-center">
        Tap to use • Accepted words are saved to your vocabulary
      </p>
    </motion.div>
  );
}
