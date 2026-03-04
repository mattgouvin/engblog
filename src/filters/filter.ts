import type { Article } from "../types";

/**
 * Interface for content filters that determine if an article matches criteria
 */
export interface Filter {
  matches(article: Article): boolean;
}
