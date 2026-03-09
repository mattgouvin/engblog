import type { Article, Company } from "../types";
import type { ArticleRepository, ArticleListFilters } from "./article-repository";
import { providerRegistry, independentRegistry, ALL_INDEPENDENT_SOURCES } from "../providers";
import { filterRegistry } from "../filters";
import type { ContentFilterIdentifier } from "../constants/filters";
import { SourceType } from "../constants/sources";
import { getCachedArticles, setCachedArticles } from "./cache";

export class ProviderArticleRepository implements ArticleRepository {
  async list(filters: ArticleListFilters): Promise<Article[]> {
    const articles = await this.fetchArticles(filters.companies, filters.sources);
    const filtered = this.filterArticles(articles, filters);
    return this.sortArticles(filtered);
  }

  private async fetchArticles(companies: Company[], sources?: SourceType[]): Promise<Article[]> {
    const includeCompanies = !sources || sources.includes(SourceType.Companies);
    const includeIndependent = !sources || sources.includes(SourceType.Independent);
    const fetchCompanies = includeCompanies ? companies : [];
    const independentSources = includeIndependent ? ALL_INDEPENDENT_SOURCES : [];

    const companyPromises: Promise<Article[]>[] = fetchCompanies.map(async (company): Promise<Article[]> => {
      const cached = await getCachedArticles(company);
      if (cached) {
        return cached.map(article => ({ ...article, source: company, sourceType: "company" as const }));
      }
      const articles = await providerRegistry[company].fetch();
      await setCachedArticles(company, articles);
      return articles.map(article => ({ ...article, source: company, sourceType: "company" as const }));
    });

    const independentPromises: Promise<Article[]>[] = independentSources.map(async (source): Promise<Article[]> => {
      const cached = await getCachedArticles(source);
      if (cached) {
        return cached.map(article => ({ ...article, source, sourceType: "independent" as const }));
      }
      const articles = await independentRegistry[source].fetch();
      await setCachedArticles(source, articles);
      return articles.map(article => ({ ...article, source, sourceType: "independent" as const }));
    });

    const allSources = [...fetchCompanies, ...independentSources];
    const results = await Promise.allSettled([...companyPromises, ...independentPromises]);

    return results.flatMap((result, i) => {
      if (result.status === "fulfilled") return result.value;
      console.error(`Failed to fetch ${allSources[i]}: ${result.reason}`);
      return [];
    });
  }

  private isWithinDateRange(
    publishedAt: string | null,
    startDate?: Date,
    endDate?: Date
  ): boolean {
    if (!publishedAt) return false;
    const date = new Date(publishedAt);
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  }

  private filterArticles(
    articles: Article[],
    filters: ArticleListFilters
  ): Article[] {
    let filtered = articles
      .filter((a) => a.publishedAt !== null)
      .filter((a) =>
        this.isWithinDateRange(a.publishedAt, filters.startDate, filters.endDate)
      );

    filtered = this.applyIncludeFilters(filtered, filters.includeFilters);
    filtered = this.applyExcludeFilters(filtered, filters.excludeFilters);

    return filtered;
  }

  private applyIncludeFilters(
    articles: Article[],
    filters: ContentFilterIdentifier[]
  ): Article[] {
    if (filters.length === 0) return articles;
    const impls = filters.map((f) => filterRegistry[f]).filter(Boolean);
    return articles.filter((article) => impls.some((f) => f.matches(article)));
  }

  private applyExcludeFilters(
    articles: Article[],
    filters: ContentFilterIdentifier[]
  ): Article[] {
    if (filters.length === 0) return articles;
    const impls = filters.map((f) => filterRegistry[f]).filter(Boolean);
    return articles.filter((article) => !impls.some((f) => f.matches(article)));
  }

  private sortArticles(articles: Article[]): Article[] {
    return articles.sort((a, b) => {
      if (!a.publishedAt && !b.publishedAt) return 0;
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }
}
