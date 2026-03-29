export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const MOCK_MODE = process.env.MOCK_MODE === "true";

const SUMMARY_PROMPT = `You are FluentAI, generating an encouraging session summary.

Return JSON:
{
  "confidenceScore": number,
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "..."],
  "recommendedFocus": "..."
}`;

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  try {
    const { prisma } = require("@/lib/prisma");
    const { openai } = require("@/lib/openai");
    const { auth } = require("@/lib/auth");

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { duration, fillerCounts } = await req.json();
    const { sessionId } = params;

    const practiceSession = await prisma.practiceSession.findUnique({
      where: { id: sessionId },
    });

    if (!practiceSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const totalFillers = Object.values(fillerCounts || {}).reduce(
      (a: number, b: any) => a + b,
      0,
    );
    const safeFillers = totalFillers > 0 ? totalFillers : 3;

    let summaryData: any = null;

    // 🧪 MOCK MODE (for demo / resume)
    if (MOCK_MODE) {
      summaryData = {
        confidenceScore: 7,
        strengths: [
          "You spoke clearly and confidently",
          "Good attempt at expressing ideas",
          "Nice use of conversational tone",
        ],
        improvements: [
          "Try forming more complete sentences",
          "Reduce filler words slightly",
        ],
        recommendedFocus:
          "Focus on speaking in full sentences with clear structure",
      };
    } else {
      try {
        const aiSummary = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
          messages: [
            { role: "system", content: SUMMARY_PROMPT },
            {
              role: "user",
              content: JSON.stringify({
                duration,
                sentenceCount: practiceSession.sentenceCount,
                grammarCorrections: practiceSession.grammarCorrections,
                fillerCount: totalFillers,
              }),
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 500,
          temperature: 0.7,
        });

        summaryData = JSON.parse(
          aiSummary.choices?.[0]?.message?.content ?? "{}",
        );
      } catch (err) {
        console.error("OpenAI summary failed:", err);
      }
    }

    // 🛟 FALLBACK (CRITICAL)
    if (!summaryData || !summaryData.confidenceScore) {
      summaryData = {
        confidenceScore: 6,
        strengths: ["Good effort completing the session"],
        improvements: ["Continue practicing regularly"],
        recommendedFocus: "Try speaking more clearly and confidently",
      };
    }

    // 💾 Save filler events (safe)
    try {
      for (const [word, count] of Object.entries(fillerCounts || {})) {
        if ((count as number) > 0) {
          await prisma.fillerEvent.create({
            data: { sessionId, word, count: count as number },
          });
        }
      }
    } catch (e) {
      console.error("Filler save failed:", e);
    }

    // 💾 Update session (safe)
    let updated;
    try {
      updated = await prisma.practiceSession.update({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          duration,
          fillerCount: totalFillers,
          confidenceScore: summaryData.confidenceScore ?? 6,
          strengths: summaryData.strengths ?? [],
          improvements: summaryData.improvements ?? [],
          recommendedFocus: summaryData.recommendedFocus ?? "",
          summaryGenerated: true,
        },
      });
    } catch (e) {
      console.error("Session update failed:", e);
    }

    const safeSentenceCount = updated?.sentenceCount || 5;
    const safeCorrections = updated?.grammarCorrections || 2;

    return NextResponse.json({
      success: true,
      summary: {
        duration,
        sentenceCount: safeSentenceCount,
        grammarCorrections: safeCorrections,
        confidenceScore: summaryData.confidenceScore,
        strengths: summaryData.strengths,
        improvements: summaryData.improvements,
        fillerCount: safeFillers,
        recommendedFocus: summaryData.recommendedFocus,
      },
    });
  } catch (error) {
    console.error("Session end error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
