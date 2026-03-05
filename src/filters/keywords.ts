import type { Article } from "../types";
import type { Filter } from "./filter";

/**
 * Filter that matches articles based on keyword presence in title
 */
export class KeywordFilter implements Filter {
  private phraseKeywords: readonly string[];
  private singleKeywordRegexes: readonly RegExp[];

  constructor(keywords: readonly string[]) {
    this.phraseKeywords = keywords
      .filter((k) => k.includes(" "))
      .map((k) => k.toLowerCase());

    this.singleKeywordRegexes = keywords
      .filter((k) => !k.includes(" "))
      .map((k) => {
        const lower = k.toLowerCase();
        const plural = lower.endsWith("y") ? lower.slice(0, -1) + "ies" : lower + "s";
        return new RegExp(`\\b(${lower}|${plural})\\b`, "i");
      });
  }

  matches(article: Article): boolean {
    const lower = article.title.toLowerCase();
    if (this.phraseKeywords.some((keyword) => lower.includes(keyword))) return true;
    return this.singleKeywordRegexes.some((regex) => regex.test(article.title));
  }
}
