'use client';

import { motion } from 'framer-motion';
import { X, RefreshCw } from 'lucide-react';
import type { Correction } from '@/types/session';

interface Props {
  correction: Correction;
  onDismiss: () => void;
  onAccept: () => void;
}

export function CorrectionCard({ correction, onDismiss, onAccept }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="card border-red-100 bg-white"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">📝</span>
          <span className="text-sm font-semibold text-surface-800">Improvement Opportunity</span>
        </div>
        <button onClick={onDismiss} className="text-surface-400 hover:text-surface-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="bg-red-50 rounded-lg px-3 py-2">
          <p className="text-xs text-surface-500 mb-0.5">❌ You said:</p>
          <p className="text-sm text-surface-700 italic">"{correction.original}"</p>
        </div>
        <div className="bg-accent-50 rounded-lg px-3 py-2">
          <p className="text-xs text-surface-500 mb-0.5">✅ Better:</p>
          <p className="text-sm text-accent-700 font-medium">"{correction.corrected}"</p>
        </div>
        <div className="bg-surface-50 rounded-lg px-3 py-2">
          <p className="text-xs text-surface-500 mb-0.5">💡 Why:</p>
          <p className="text-xs text-surface-600">{correction.explanation}</p>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-xs text-primary-600 font-medium">
          🎯 Please repeat: "{correction.corrected}"
        </p>
      </div>

      <button
        onClick={onAccept}
        className="btn-primary w-full justify-center text-sm py-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Got it!
      </button>
    </motion.div>
  );
}
