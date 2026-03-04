import type { Article } from "../types";
import type { Filter } from "./filter";

/**
 * Filter that matches articles based on keyword presence in title
 */
export class KeywordFilter implements Filter {
  private keywords: readonly string[];

  constructor(keywords: readonly string[]) {
    this.keywords = keywords;
  }

  private pluralize(word: string): string {
    if (word.endsWith("y")) return word.slice(0, -1) + "ies";
    return word + "s";
  }

  matches(article: Article): boolean {
    const lower = article.title.toLowerCase();

    // Check multi-word keywords first (exact substring match)
    const phraseKeywords = this.keywords
      .filter((k) => k.includes(" "))
      .map((k) => k.toLowerCase());
    if (phraseKeywords.some((keyword) => lower.includes(keyword))) {
      return true;
    }

    // Check single-word keywords (with plural variants) using word boundaries
    const singleKeywords = this.keywords
      .filter((k) => !k.includes(" "))
      .map((k) => k.toLowerCase());
    for (const keyword of singleKeywords) {
      const plural = this.pluralize(keyword);
      const regex = new RegExp(`\\b(${keyword}|${plural})\\b`, "i");
      if (regex.test(article.title)) {
        return true;
      }
    }

    return false;
  }
}
