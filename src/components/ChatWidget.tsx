"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Chat from "./Chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The /chat page already shows the full chat — no widget there.
  if (pathname === "/chat") return null;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[520px] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <span className="text-sm font-semibold">Ask AI about me</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ✕
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <Chat compact />
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-2xl text-white shadow-lg transition hover:bg-sky-500"
      >
        {open ? "✕" : "✦"}
      </button>
    </>
  );
}
