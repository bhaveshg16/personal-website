import ReactMarkdown from "react-markdown";
import { getExperience } from "@/lib/content";

export const metadata = { title: "Experience" };

export default function ExperiencePage() {
  const roles = getExperience();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Experience</h1>
      <div className="space-y-10 border-l border-zinc-200 pl-6 dark:border-zinc-800">
        {roles.map((r) => (
          <article key={r.id} id={r.id} className="relative scroll-mt-20">
            <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full bg-sky-600" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">
                {r.role} · {r.company}
              </h2>
              <span className="text-sm text-zinc-500">
                {r.start} – {r.end}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="prose-content mt-4">
              <ReactMarkdown>{r.body}</ReactMarkdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
