import ReactMarkdown from "react-markdown";
import { getProjects } from "@/lib/content";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <div>
      <h1 className="mb-10 font-display text-4xl text-stone-900">Projects</h1>
      <div className="space-y-8">
        {projects.map((p) => (
          <article
            key={p.id}
            id={p.id}
            className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl text-stone-900">{p.title}</h2>
              <div className="flex gap-4 text-sm">
                {p.repo && (
                  <a
                    href={`https://github.com/${p.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-800 underline decoration-orange-300 underline-offset-2 hover:decoration-orange-800"
                  >
                    Source ↗
                  </a>
                )}
                {p.link && p.link !== "/" && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-800 underline decoration-orange-300 underline-offset-2 hover:decoration-orange-800"
                  >
                    Live ↗
                  </a>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="prose-content mt-4">
              <ReactMarkdown>{p.body}</ReactMarkdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
