export type ChunkType = "profile" | "faq" | "experience" | "project" | "repo";

/** One citable unit of knowledge about the site owner. */
export interface KnowledgeChunk {
  /** Citation key the model emits as [cite:id]. */
  id: string;
  type: ChunkType;
  title: string;
  /** Where a citation link points (site section or external repo URL). */
  url: string;
  text: string;
}

/** Slim id → link map shipped to the client for rendering citations. */
export type CitationMap = Record<string, { title: string; url: string }>;
