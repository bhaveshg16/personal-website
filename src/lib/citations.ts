import type { CitationMap } from "./knowledge-types";

export interface CitationSource {
  n: number;
  id: string;
  title: string;
  url: string;
}

export interface RenderedText {
  /** Markdown with [cite:id] markers replaced by numbered links. */
  text: string;
  /** Sources cited, in first-appearance order. */
  sources: CitationSource[];
}

const CITE_RE = /\s*\[cite:([a-zA-Z0-9_-]+)\]/g;

/**
 * Replace [cite:id] markers in model output with numbered markdown links
 * resolved against the citation map. The same id always gets the same number;
 * ids not present in the map are silently dropped (hallucination safety).
 */
export function renderCitations(text: string, map: CitationMap): RenderedText {
  const sources: CitationSource[] = [];
  const numberById = new Map<string, number>();

  const rendered = text.replace(CITE_RE, (_match, id: string) => {
    const entry = map[id];
    if (!entry) return "";
    let n = numberById.get(id);
    if (n === undefined) {
      n = numberById.size + 1;
      numberById.set(id, n);
      sources.push({ n, id, title: entry.title, url: entry.url });
    }
    return ` [[${n}]](${entry.url})`;
  });

  return { text: rendered, sources };
}
