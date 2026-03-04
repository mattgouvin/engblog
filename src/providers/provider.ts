import type { ArticleData } from "../types";

/**
 * Data provider interface - knows how to fetch articles
 */
export interface DataProvider {
  fetch(): Promise<ArticleData[]>;
}
