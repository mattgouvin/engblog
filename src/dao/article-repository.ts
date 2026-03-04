import type { Article, Company } from "../types";
import type { ContentFilterIdentifier } from "../constants/filters";

export interface ArticleListFilters {
  companies: Company[];
  startDate?: Date;
  endDate?: Date;
  includeFilters: ContentFilterIdentifier[];
  excludeFilters: ContentFilterIdentifier[];
}

export interface ArticleRepository {
  list(filters: ArticleListFilters): Promise<Article[]>;
}
