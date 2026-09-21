import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { chatModel } from "@/lib/llm";
import { buildSystemPrompt } from "@/lib/knowledge";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const MAX_HISTORY_MESSAGES = 10;
const MAX_INPUT_CHARS = 1000;

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function textLength(message: UIMessage): number {
  return message.parts
    .filter((p) => p.type === "text")
    .reduce((len, p) => len + p.text.length, 0);
}

export async function POST(req: Request) {
  let messages: UIMessage[];
  try {
    const body = await req.json();
    messages = body?.messages;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages array is required" }, { status: 400 });
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user" || textLength(last) === 0) {
    return Response.json({ error: "Last message must be a user message" }, { status: 400 });
  }
  if (textLength(last) > MAX_INPUT_CHARS) {
    return Response.json(
      { error: `Message too long (max ${MAX_INPUT_CHARS} characters)` },
      { status: 413 },
    );
  }

  const rl = await checkRateLimit(getClientIp(req));
  if (!rl.success) {
    return Response.json(
      { error: "Too many messages — please try again in a bit." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  const result = streamText({
    model: chatModel,
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages.slice(-MAX_HISTORY_MESSAGES)),
    maxOutputTokens: 800,
    temperature: 0.3,
  });

  return result.toUIMessageStreamResponse({
    onError: () =>
      "The assistant is taking a break (likely out of free quota for today). The rest of the site still works — please try again later.",
  });
}
