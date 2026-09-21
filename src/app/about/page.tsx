import ReactMarkdown from "react-markdown";
import { getFaq, getProfile } from "@/lib/content";
import { siteConfig } from "../../../content/site.config";

export const metadata = { title: "About" };

export default function AboutPage() {
  const profile = getProfile();
  const faq = getFaq();
  return (
    <div className="space-y-14">
      <section>
        <h1 className="mb-6 font-display text-4xl text-stone-900">
          {profile.title}
        </h1>
        <div className="prose-content text-[1.05rem]">
          <ReactMarkdown>{profile.body}</ReactMarkdown>
        </div>
      </section>
      <section id="faq" className="scroll-mt-24">
        <h2 className="mb-6 font-display text-2xl text-stone-900">{faq.title}</h2>
        <div className="prose-content rounded-2xl border border-stone-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <ReactMarkdown>{faq.body}</ReactMarkdown>
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl text-stone-900">Get in touch</h2>
        <p className="leading-relaxed text-stone-600">
          Email{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-orange-800 underline decoration-orange-300 underline-offset-2 hover:decoration-orange-800"
          >
            {siteConfig.email}
          </a>{" "}
          or find me on{" "}
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-orange-800 underline decoration-orange-300 underline-offset-2 hover:decoration-orange-800"
          >
            LinkedIn
          </a>
          .
        </p>
      </section>
    </div>
  );
}
