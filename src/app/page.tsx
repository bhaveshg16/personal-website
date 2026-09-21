import Link from "next/link";
import { getExperience, getProjects } from "@/lib/content";
import { siteConfig } from "../../content/site.config";

export default function HomePage() {
  const featured = getProjects().filter((p) => p.featured);
  const latestRole = getExperience()[0];

  return (
    <div className="space-y-16">
      <section className="pt-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hi, I&apos;m {siteConfig.name.split(" ")[0]}.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {siteConfig.tagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
          >
            ✦ Ask my AI anything
          </Link>
          <Link
            href="/projects"
            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium transition hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
          >
            View projects
          </Link>
        </div>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Recruiters: skip the skimming — the AI assistant answers questions about
          my experience and cites its sources.
        </p>
      </section>

      {featured.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Featured projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/projects#${p.id}`}
                className="rounded-2xl border border-zinc-200 p-5 transition hover:border-sky-500 dark:border-zinc-800"
              >
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {p.body.split("\n")[0]}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {latestRole && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Currently</h2>
          <Link
            href={`/experience#${latestRole.id}`}
            className="block rounded-2xl border border-zinc-200 p-5 transition hover:border-sky-500 dark:border-zinc-800"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold">
                {latestRole.role} · {latestRole.company}
              </h3>
              <span className="text-sm text-zinc-500">
                {latestRole.start} – {latestRole.end}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {latestRole.body.split("\n")[0]}
            </p>
          </Link>
        </section>
      )}
    </div>
  );
}
