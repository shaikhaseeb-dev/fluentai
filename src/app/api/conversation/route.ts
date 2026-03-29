import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const MOCK_MODE = process.env.MOCK_MODE === "true";

const SYSTEM_PROMPT = `You are FluentAI, a warm and encouraging English speaking coach.

- Keep responses short (2-4 sentences)
- Be engaging and ask follow-up questions
- Stay positive and supportive
`;

const GRAMMAR_SYSTEM = `Analyze grammar and return JSON:
{
  "hasError": boolean,
  "original": "...",
  "corrected": "...",
  "explanation": "...",
  "severity": "MINOR|MODERATE|MAJOR"
}`;

export async function POST(req: NextRequest) {
  const start = Date.now();

  try {
    // 🔐 Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, message, correctionMode, history } = await req.json();

    // 🧹 Clean history
    const trimmedHistory = (history || [])
      .slice(-6)
      .filter((h: any) => h?.content && h.content.length < 300)
      .map((h: any) => ({
        role: h.role === "AI" ? "assistant" : "user",
        content: h.content,
      }));

    // 💾 Save user message (safe)
    try {
      await prisma.transcript.create({
        data: { sessionId, role: "USER", content: message },
      });
    } catch (e) {
      console.error("DB write (user) failed:", e);
    }

    let reply = "";
    let correction = null;

    // 🧪 MOCK MODE (for demo / resume)
    if (MOCK_MODE) {
      reply =
        "That's a great topic! Gold prices are rising due to inflation and global uncertainty. What do you think is driving it most?";

      correction = {
        id: "mock-id",
        original: message,
        corrected:
          "I would like to talk about gold prices and why they are increasing.",
        explanation: "Try forming a complete and clear sentence.",
      };
    } else {
      try {
        const [grammarResult, conversationResult] = await Promise.all([
          // 🧠 Grammar check
          openai.chat.completions.create({
            model: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
            messages: [
              {
                role: "system",
                content: GRAMMAR_SYSTEM + `\nMode: ${correctionMode}`,
              },
              { role: "user", content: `Analyze: "${message}"` },
            ],
            response_format: { type: "json_object" },
            max_tokens: 300,
            temperature: 0.1,
          }),

          // 💬 Conversation
          openai.chat.completions.create({
            model: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...trimmedHistory,
              { role: "user", content: message },
            ],
            max_tokens: 200,
            temperature: 0.8,
          }),
        ]);

        reply =
          conversationResult.choices?.[0]?.message?.content ??
          "That’s interesting! Can you tell me more?";

        // 🔍 Parse grammar
        try {
          const grammarData = JSON.parse(
            grammarResult.choices?.[0]?.message?.content ?? "{}",
          );

          if (grammarData.hasError && correctionMode !== "FLUENCY") {
            const dbCorrection = await prisma.grammarCorrection.create({
              data: {
                sessionId,
                original: grammarData.original || message,
                corrected: grammarData.corrected,
                explanation: grammarData.explanation,
                severity: grammarData.severity || "MODERATE",
              },
            });

            correction = {
              id: dbCorrection.id,
              original: dbCorrection.original,
              corrected: dbCorrection.corrected,
              explanation: dbCorrection.explanation,
            };

            await prisma.practiceSession.update({
              where: { id: sessionId },
              data: {
                grammarCorrections: { increment: 1 },
                sentenceCount: { increment: 1 },
              },
            });
          } else {
            await prisma.practiceSession.update({
              where: { id: sessionId },
              data: { sentenceCount: { increment: 1 } },
            });
          }
        } catch (e) {
          console.error("Grammar parse error:", e);
        }
      } catch (err) {
        console.error("OpenAI failed:", err);

        // 🛟 FAIL-SAFE RESPONSE
        reply =
          "I'm having a small issue right now, but let's continue. Can you try saying that again in a different way?";
      }
    }

    // 💾 Save AI response (safe)
    try {
      await prisma.transcript.create({
        data: { sessionId, role: "AI", content: reply },
      });
    } catch (e) {
      console.error("DB write (AI) failed:", e);
    }

    console.log("⏱ Response time:", Date.now() - start, "ms");

    return NextResponse.json({
      success: true,
      reply,
      correction,
    });
  } catch (error) {
    console.error("Conversation API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
