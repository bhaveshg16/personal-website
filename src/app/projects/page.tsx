import ReactMarkdown from "react-markdown";
import { getProjects } from "@/lib/content";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Projects</h1>
      <div className="space-y-10">
        {projects.map((p) => (
          <article
            key={p.id}
            id={p.id}
            className="scroll-mt-20 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <div className="flex gap-3 text-sm">
                {p.repo && (
                  <a
                    href={`https://github.com/${p.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:underline dark:text-sky-400"
                  >
                    Source ↗
                  </a>
                )}
                {p.link && p.link !== "/" && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:underline dark:text-sky-400"
                  >
                    Live ↗
                  </a>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
