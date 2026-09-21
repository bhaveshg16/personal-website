import Chat from "@/components/Chat";
import { siteConfig } from "../../../content/site.config";

export const metadata = { title: "Ask AI" };

export default function ChatPage() {
  return (
    <div>
      <h1 className="mb-3 font-display text-4xl text-stone-900">
        Ask AI about {siteConfig.name.split(" ")[0]}
      </h1>
      <p className="mb-8 max-w-xl leading-relaxed text-stone-600">
        An assistant grounded in curated facts about my work — every answer
        links to the project, repo, or experience backing it. Critical
        questions welcome.
      </p>
      <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-stone-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <Chat />
      </div>
    </div>
  );
}
