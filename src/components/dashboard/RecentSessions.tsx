'use client';

import { Clock, MessageSquare, TrendingUp } from 'lucide-react';

interface Session {
  id: string;
  startedAt: Date;
  duration: number | null;
  sentenceCount: number;
  grammarCorrections: number;
  confidenceScore: number | null;
}

export function RecentSessions({ sessions }: { sessions: Session[] }) {
  if (!sessions.length) {
    return (
      <div className="card text-center py-10">
        <p className="text-2xl mb-3">🎙️</p>
        <p className="text-surface-700 font-medium mb-1">No sessions yet</p>
        <p className="text-surface-400 text-sm">Complete your first practice session to see it here.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-surface-800 mb-4">Recent Sessions</h3>
      <div className="space-y-3">
        {sessions.slice(0, 5).map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-primary-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800">
                {new Date(session.startedAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <div className="flex items-center gap-3 text-xs text-surface-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : '—'}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {session.sentenceCount} sentences
                </span>
                <span>{session.grammarCorrections} improvements</span>
              </div>
            </div>
            {session.confidenceScore != null && (
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-display text-surface-900">
                  {session.confidenceScore.toFixed(1)}
                </div>
                <div className="text-xs text-surface-500">/ 10</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
