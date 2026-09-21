import ReactMarkdown from "react-markdown";
import { getFaq, getProfile } from "@/lib/content";
import { siteConfig } from "../../../content/site.config";

export const metadata = { title: "About" };

export default function AboutPage() {
  const profile = getProfile();
  const faq = getFaq();
  return (
    <div className="space-y-12">
      <section>
        <h1 className="mb-6 text-3xl font-bold tracking-tight">{profile.title}</h1>
        <div className="prose-content">
          <ReactMarkdown>{profile.body}</ReactMarkdown>
        </div>
      </section>
      <section id="faq">
        <h2 className="mb-6 text-2xl font-semibold">{faq.title}</h2>
        <div className="prose-content">
          <ReactMarkdown>{faq.body}</ReactMarkdown>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Get in touch</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Email{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sky-600 hover:underline dark:text-sky-400"
          >
            {siteConfig.email}
          </a>{" "}
          or find me on{" "}
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 hover:underline dark:text-sky-400"
          >
            LinkedIn
          </a>
          .
        </p>
      </section>
    </div>
  );
}
