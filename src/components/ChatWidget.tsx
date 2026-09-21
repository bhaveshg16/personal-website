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
        <div className="fixed bottom-24 right-4 z-50 flex h-[520px] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_16px_48px_rgba(41,37,36,0.18)]">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3.5">
            <span className="font-display text-sm text-stone-900">
              Ask AI about me
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-stone-400 transition hover:text-stone-700"
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
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-xl text-stone-50 shadow-[0_8px_24px_rgba(41,37,36,0.25)] transition hover:bg-stone-700"
      >
        {open ? "✕" : "✦"}
      </button>
    </>
  );
}
