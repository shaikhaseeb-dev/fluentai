export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const STUCK_PROMPT = `You are the FluentAI "Stuck Word Assistant". 

A user is speaking English and has paused mid-sentence or is showing hesitation.
Given the sentence fragment or context, predict what vocabulary gap they might have
and suggest 1-3 helpful words or short phrases they might be looking for.

Return JSON:
{
  "suggestions": ["word or phrase", "alternative phrase", "another option"]
}

RULES:
- Suggestions must be contextually appropriate and natural
- Keep suggestions short (1-5 words each)  
- Be helpful, not presumptuous
- If context is unclear, suggest common conversational phrases
- Max 3 suggestions`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if user has Pro plan for this feature
    const user = await prisma.user.findUnique({
      where: { id: session.user.id! },
      select: { plan: true },
    });

    if (user?.plan !== "PRO") {
      return NextResponse.json({ error: "Pro feature" }, { status: 403 });
    }

    const { context, sessionId } = await req.json();

    const result = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: STUCK_PROMPT },
        { role: "user", content: `Context: "${context}"` },
      ],
      response_format: { type: "json_object" },
      max_tokens: 150,
      temperature: 0.6,
    });

    const data = JSON.parse(result.choices[0].message.content ?? "{}");

    // Log stuck event
    if (sessionId && data.suggestions?.length) {
      await prisma.stuckWordEvent.create({
        data: {
          sessionId,
          context,
          suggestions: data.suggestions,
        },
      });
    }

    return NextResponse.json({ suggestions: data.suggestions ?? [] });
  } catch (error) {
    console.error("Stuck word error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
