import { describe, expect, it } from "vitest";
import { renderCitations } from "./citations";
import type { CitationMap } from "./knowledge-types";

const map: CitationMap = {
  profile: { title: "About Bhavesh", url: "/about" },
  "repo-x": { title: "GitHub: x", url: "https://github.com/u/x" },
};

describe("renderCitations", () => {
  it("replaces markers with numbered links and collects sources", () => {
    const { text, sources } = renderCitations(
      "He works at myKaarma. [cite:profile] He built X. [cite:repo-x]",
      map,
    );
    expect(text).toBe(
      "He works at myKaarma. [[1]](/about) He built X. [[2]](https://github.com/u/x)",
    );
    expect(sources).toEqual([
      { n: 1, id: "profile", title: "About Bhavesh", url: "/about" },
      { n: 2, id: "repo-x", title: "GitHub: x", url: "https://github.com/u/x" },
    ]);
  });

  it("reuses the same number for a repeated id", () => {
    const { text, sources } = renderCitations(
      "A. [cite:profile] B. [cite:profile]",
      map,
    );
    expect(text).toBe("A. [[1]](/about) B. [[1]](/about)");
    expect(sources).toHaveLength(1);
  });

  it("drops markers with unknown ids (hallucination safety)", () => {
    const { text, sources } = renderCitations("Claim. [cite:made-up]", map);
    expect(text).toBe("Claim.");
    expect(sources).toHaveLength(0);
  });

  it("leaves text without markers untouched", () => {
    const input = "No citations here, just [a normal link](https://example.com).";
    expect(renderCitations(input, map).text).toBe(input);
  });
});
