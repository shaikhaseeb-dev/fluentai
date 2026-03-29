import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { subDays } from 'date-fns';

export default async function ProgressPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const sessions = await prisma.practiceSession.findMany({
    where: { userId, endedAt: { not: null }, startedAt: { gte: subDays(new Date(), 30) } },
    orderBy: { startedAt: 'asc' },
  });

  const fillerEvents = await prisma.fillerEvent.findMany({
    where: { session: { userId } },
    select: { word: true, count: true },
  });

  const fillerTotals: Record<string, number> = {};
  for (const e of fillerEvents) {
    fillerTotals[e.word] = (fillerTotals[e.word] ?? 0) + e.count;
  }

  const chartData = sessions.map((s) => ({
    date: s.startedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    confidence: s.confidenceScore ?? 0,
    fillers: s.fillerCount,
    corrections: s.grammarCorrections,
  }));

  const topFillers = Object.entries(fillerTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display text-surface-900">Progress</h1>
        <p className="text-surface-500 mt-1">Track your improvement over the last 30 days.</p>
      </div>

      <ProgressCharts data={chartData} />

      {topFillers.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-surface-800 mb-4">Most Common Filler Words</h3>
          <div className="space-y-3">
            {topFillers.map(([word, count]) => (
              <div key={word} className="flex items-center gap-3">
                <span className="text-sm font-medium text-surface-700 w-24">"{word}"</span>
                <div className="flex-1 bg-surface-100 rounded-full h-2">
                  <div
                    className="bg-correction h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((count / (topFillers[0][1] || 1)) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm text-surface-500 w-16 text-right">{count}× total</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
