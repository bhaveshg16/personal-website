import Chat from "@/components/Chat";
import { siteConfig } from "../../../content/site.config";

export const metadata = { title: "Ask AI" };

export default function ChatPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Ask AI about {siteConfig.name.split(" ")[0]}
      </h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        An assistant grounded in curated facts about my work — every answer
        links to the project, repo, or experience backing it.
      </p>
      <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <Chat />
      </div>
    </div>
  );
}
