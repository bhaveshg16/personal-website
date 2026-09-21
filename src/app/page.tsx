import Link from "next/link";
import { getExperience, getProjects } from "@/lib/content";
import { siteConfig } from "../../content/site.config";

export default function HomePage() {
  const featured = getProjects().filter((p) => p.featured);
  const latestRole = getExperience()[0];

  return (
    <div className="space-y-20">
      <section className="pt-10">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-stone-500">
          {siteConfig.role} · {siteConfig.location}
        </p>
        <h1 className="font-display text-5xl leading-tight text-stone-900 sm:text-6xl">
          Hi, I&apos;m {siteConfig.name.split(" ")[0]}.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
          {siteConfig.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/chat"
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
          >
            Ask my AI anything
          </Link>
          <Link
            href="/projects"
            className="text-sm font-medium text-orange-800 underline decoration-orange-300 underline-offset-4 transition hover:decoration-orange-800"
          >
            View projects
          </Link>
        </div>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-stone-500">
          Recruiters: skip the skimming. The assistant answers questions about my
          experience — critically, and with citations.
        </p>
      </section>

      {featured.length > 0 && (
        <section>
          <h2 className="mb-5 font-display text-2xl text-stone-900">
            Featured projects
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/projects#${p.id}`}
                className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(41,37,36,0.08)]"
              >
                <h3 className="font-display text-lg text-stone-900 group-hover:text-orange-900">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
                  {p.body.split("\n")[0]}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
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
          <h2 className="mb-5 font-display text-2xl text-stone-900">Currently</h2>
          <Link
            href={`/experience#${latestRole.id}`}
            className="block rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(41,37,36,0.08)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg text-stone-900">
                {latestRole.role} · {latestRole.company}
              </h3>
              <span className="text-sm text-stone-500">
                {latestRole.start} – {latestRole.end}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
              {latestRole.body.split("\n")[0]}
            </p>
          </Link>
        </section>
      )}
    </div>
  );
}
