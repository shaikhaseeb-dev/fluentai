'use client';

import { motion } from 'framer-motion';
import { Clock, MessageSquare, TrendingUp, RefreshCw, Star, Zap } from 'lucide-react';
import Link from 'next/link';

interface Props {
  summary: {
    duration: number;
    sentenceCount: number;
    grammarCorrections: number;
    fillerCount: number;
    confidenceScore: number;
    strengths: string[];
    improvements: string[];
    recommendedFocus: string;
  };
  onRestart: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function SessionSummary({ summary, onRestart }: Props) {
  const score = summary.confidenceScore;

  const statCards = [
    { icon: Clock, label: 'Duration', value: formatDuration(summary.duration), color: 'text-primary-700 bg-primary-50' },
    { icon: MessageSquare, label: 'Sentences', value: summary.sentenceCount.toString(), color: 'text-accent-700 bg-accent-50' },
    { icon: TrendingUp, label: 'Improvements', value: summary.grammarCorrections.toString(), color: 'text-orange-700 bg-orange-50' },
    { icon: Zap, label: 'Filler Words', value: summary.fillerCount.toString(), color: 'text-purple-700 bg-purple-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-display text-surface-900">Great Session!</h2>
        <p className="text-surface-500 mt-1">Here's your personalized feedback report</p>
      </div>

      {/* Confidence score */}
      <div className="card text-center">
        <p className="text-sm text-surface-500 mb-3">Confidence Score</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < Math.round(score) ? 'text-yellow-400 fill-yellow-400' : 'text-surface-200'}`}
            />
          ))}
        </div>
        <div className="text-4xl font-display text-surface-900">{score.toFixed(1)} / 10</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card text-center py-4">
            <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mx-auto mb-2`}>
              <card.icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-display text-surface-900">{card.value}</div>
            <div className="text-xs text-surface-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Strengths */}
      {summary.strengths.length > 0 && (
        <div className="card border-accent-200 bg-accent-50">
          <h3 className="font-semibold text-accent-800 mb-3 flex items-center gap-2">
            ✨ Your Strengths
          </h3>
          <ul className="space-y-2">
            {summary.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-accent-700">
                <span className="mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement opportunities */}
      {summary.improvements.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-surface-800 mb-3">📈 Growth Opportunities</h3>
          <ul className="space-y-2">
            {summary.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                <span className="mt-0.5 text-primary-500">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended focus */}
      {summary.recommendedFocus && (
        <div className="card bg-primary-50 border-primary-200">
          <h3 className="font-semibold text-primary-800 mb-2">🎯 Recommended Focus</h3>
          <p className="text-sm text-primary-700">{summary.recommendedFocus}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRestart} className="btn-primary flex-1 justify-center">
          <RefreshCw className="w-4 h-4" /> Practice Again
        </button>
        <Link href="/dashboard" className="btn-secondary flex-1 justify-center">
          View Dashboard
        </Link>
      </div>
    </motion.div>
  );
}
