import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { QuickStart } from '@/components/dashboard/QuickStart';
import { subDays } from 'date-fns';

async function getDashboardData(userId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [sessions, totalSessions, improvements] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId, endedAt: { not: null }, startedAt: { gte: thirtyDaysAgo } },
      orderBy: { startedAt: 'desc' },
      take: 30,
    }),
    prisma.practiceSession.count({ where: { userId, endedAt: { not: null } } }),
    prisma.improvementMemory.count({ where: { userId } }),
  ]);

  const totalTime = sessions.reduce((acc, s) => acc + (s.duration ?? 0), 0);
  const avgConfidence = sessions.length
    ? sessions.reduce((acc, s) => acc + (s.confidenceScore ?? 0), 0) / sessions.length
    : 0;

  const fillerTrend = sessions.slice(0, 7).reverse().map((s) => ({
    date: s.startedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fillers: s.fillerCount,
    confidence: s.confidenceScore ?? 0,
    corrections: s.grammarCorrections,
  }));

  return { sessions, totalSessions, totalTime, avgConfidence, improvements, fillerTrend };
}

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session!.user!.id!);

  const stats = [
    {
      label: 'Total Practice Time',
      value: `${Math.floor(data.totalTime / 60)}m`,
      subtext: 'all time',
      trend: '+12%',
      positive: true,
    },
    {
      label: 'Total Sessions',
      value: data.totalSessions.toString(),
      subtext: 'completed',
      trend: '+3 this week',
      positive: true,
    },
    {
      label: 'Avg Confidence',
      value: `${data.avgConfidence.toFixed(1)}/10`,
      subtext: 'last 30 days',
      trend: '+0.8',
      positive: true,
    },
    {
      label: 'Words Learned',
      value: data.improvements.toString(),
      subtext: 'in your memory',
      trend: 'growing',
      positive: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display text-surface-900">
          Welcome back, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-surface-500 mt-1">
          Here's your speaking progress at a glance.
        </p>
      </div>

      <QuickStart />
      <DashboardStats stats={stats} />
      <ProgressCharts data={data.fillerTrend} />
      <RecentSessions sessions={data.sessions} />
    </div>
  );
}
