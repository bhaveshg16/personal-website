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
                className="font-medium text-sky-600 no-underline hover:underline dark:text-sky-400"
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
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 hover:border-sky-500 hover:text-sky-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-sky-400"
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
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div>
            <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
              Ask me anything about {siteConfig.name}&apos;s work, skills, or
              projects. Answers cite their sources.
            </p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="rounded-full border border-zinc-300 px-3 py-1.5 text-left text-sm text-zinc-700 transition hover:border-sky-500 hover:text-sky-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-sky-400"
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
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-sky-600 px-4 py-2 text-sm text-white"
                  : "max-w-[95%] rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-3 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
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
          <div className="px-4 text-sm text-zinc-400 dark:text-zinc-500">Thinking…</div>
        )}
        {error && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
            {error.message || "Something went wrong — please try again in a moment."}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder={`Ask about ${siteConfig.name.split(" ")[0]}…`}
          className="flex-1 rounded-xl border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-sky-500 dark:border-zinc-700"
          aria-label="Your question"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-40"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>

      {!compact && (
        <p className="px-3 pb-2 text-center text-xs text-zinc-400 dark:text-zinc-600">
          AI-generated from curated sources — answers link to their evidence.
        </p>
      )}
    </div>
  );
}
