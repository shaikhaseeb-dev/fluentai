import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { subDays } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id!;
    const thirtyDaysAgo = subDays(new Date(), 30);

    const [sessions, fillerEvents] = await Promise.all([
      prisma.practiceSession.findMany({
        where: { userId, endedAt: { not: null }, startedAt: { gte: thirtyDaysAgo } },
        orderBy: { startedAt: 'asc' },
        select: {
          startedAt: true,
          duration: true,
          confidenceScore: true,
          grammarCorrections: true,
          fillerCount: true,
          sentenceCount: true,
        },
      }),
      prisma.fillerEvent.findMany({
        where: {
          session: { userId, startedAt: { gte: thirtyDaysAgo } },
        },
        select: { word: true, count: true },
      }),
    ]);

    // Aggregate filler totals by word
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

    return NextResponse.json({ chartData, fillerTotals });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
