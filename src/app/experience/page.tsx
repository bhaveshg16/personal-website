import ReactMarkdown from "react-markdown";
import { getExperience } from "@/lib/content";

export const metadata = { title: "Experience" };

export default function ExperiencePage() {
  const roles = getExperience();
  return (
    <div>
      <h1 className="mb-10 font-display text-4xl text-stone-900">Experience</h1>
      <div className="space-y-12 border-l-2 border-stone-200 pl-7">
        {roles.map((r) => (
          <article key={r.id} id={r.id} className="relative scroll-mt-24">
            <span className="absolute -left-[2.28rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#faf7f2] bg-orange-700" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl text-stone-900">
                {r.role} · {r.company}
              </h2>
              <span className="text-sm text-stone-500">
                {r.start} – {r.end}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
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
