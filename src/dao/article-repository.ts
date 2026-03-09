import type { Article, Company } from "../types";
import type { ContentFilterIdentifier } from "../constants/filters";
import type { SourceType } from "../constants/sources";

export interface ArticleListFilters {
  companies: Company[];
  startDate?: Date;
  endDate?: Date;
  includeFilters: ContentFilterIdentifier[];
  excludeFilters: ContentFilterIdentifier[];
  sources?: SourceType[];
}

export interface ArticleRepository {
  list(filters: ArticleListFilters): Promise<Article[]>;
}
