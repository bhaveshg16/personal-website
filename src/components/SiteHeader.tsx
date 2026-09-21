import Link from "next/link";
import { siteConfig } from "../../content/site.config";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#faf7f2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-lg text-stone-900">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm text-stone-500">
          {siteConfig.nav.map((item) =>
            item.href === "/chat" ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-stone-900 px-3.5 py-1.5 text-stone-50 transition hover:bg-stone-700"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-stone-900"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
