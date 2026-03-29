export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { openai } = require("@/lib/openai");

  const { sentence } = await req.json();

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an English speaking coach. Detect grammar mistakes and return correction in JSON.",
      },
      {
        role: "user",
        content: sentence,
      },
    ],
    response_format: { type: "json_object" },
  });

  return Response.json(
    JSON.parse(completion.choices[0].message.content || "{}"),
  );
}
