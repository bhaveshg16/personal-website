"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import citationMap from "@/generated/citation-map.json";
import { renderCitations } from "@/lib/citations";
import type { CitationMap } from "@/lib/knowledge-types";
import { siteConfig } from "../../content/site.config";

const CITATIONS = citationMap as CitationMap;

function AssistantText({ text }: { text: string }) {
  const { text: rendered, sources } = renderCitations(text, CITATIONS);
  return (
    <div>
      <div className="prose-chat">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="font-medium text-orange-800 no-underline hover:underline"
              >
                {children}
              </a>
            ),
          }}
        >
          {rendered}
        </ReactMarkdown>
      </div>
      {sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-stone-100 pt-2.5">
          {sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 transition hover:bg-orange-100 hover:text-orange-900"
            >
              {s.n}. {s.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Chat({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, clearError } = useChat();
  const busy = status === "submitted" || status === "streaming";

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    clearError();
    void sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div>
            <p className="mb-4 text-sm leading-relaxed text-stone-500">
              Ask me anything about {siteConfig.name}&apos;s work, skills, or
              projects — including the critical questions. Answers cite their
              sources.
            </p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="rounded-full border border-stone-300 bg-white px-3.5 py-1.5 text-left text-sm text-stone-700 transition hover:border-orange-700 hover:text-orange-900"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-stone-900 px-4 py-2.5 text-sm leading-relaxed text-stone-50"
                  : "max-w-[95%] rounded-2xl rounded-bl-sm border border-stone-200 bg-[#faf7f2] px-4 py-3 text-sm leading-relaxed text-stone-800"
              }
            >
              {m.parts.map((part, i) =>
                part.type === "text" ? (
                  m.role === "assistant" ? (
                    <AssistantText key={i} text={part.text} />
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                ) : null,
              )}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="px-1 text-sm text-stone-400">Thinking…</div>
        )}
        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            {error.message || "Something went wrong — please try again in a moment."}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2 border-t border-stone-200 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder={`Ask about ${siteConfig.name.split(" ")[0]}…`}
          className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500"
          aria-label="Your question"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-stone-50 transition hover:bg-stone-700 disabled:opacity-40"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>

      {!compact && (
        <p className="bg-white px-3 pb-2.5 text-center text-xs text-stone-400">
          AI-generated from curated sources — answers link to their evidence.
        </p>
      )}
    </div>
  );
}
