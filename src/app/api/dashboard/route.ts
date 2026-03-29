export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { subDays } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    // 🔥 LAZY IMPORTS (CRITICAL FIX)
    const { prisma } = require("@/lib/prisma");
    const { auth } = require("@/lib/auth");

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id!;
    const thirtyDaysAgo = subDays(new Date(), 30);

    const [sessions, fillerEvents] = await Promise.all([
      prisma.practiceSession.findMany({
        where: {
          userId,
          endedAt: { not: null },
          startedAt: { gte: thirtyDaysAgo },
        },
        orderBy: { startedAt: "asc" },
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
          session: {
            userId,
            startedAt: { gte: thirtyDaysAgo },
          },
        },
        select: { word: true, count: true },
      }),
    ]);

    // 🧠 Aggregate filler totals
    const fillerTotals: Record<string, number> = {};
    for (const e of fillerEvents) {
      fillerTotals[e.word] = (fillerTotals[e.word] ?? 0) + e.count;
    }

    const chartData = sessions.map((s: any) => ({
      date: new Date(s.startedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      confidence: s.confidenceScore ?? 0,
      fillers: s.fillerCount,
      corrections: s.grammarCorrections,
    }));

    return NextResponse.json({
      success: true,
      chartData,
      fillerTotals,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
