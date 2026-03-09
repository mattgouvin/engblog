import { mock, describe, test, expect } from "bun:test";

mock.module("../../src/providers", () => ({
  providerRegistry: {
    google: {
      fetch: () =>
        Promise.resolve([
          { title: "Google Tech Post", url: "https://google.com/1", publishedAt: "2026-03-05" },
        ]),
    },
  },
  independentRegistry: {
    latentspace: {
      fetch: () =>
        Promise.resolve([
          { title: "AI in 2026 — Latent Space", url: "https://latentspace.com/1", publishedAt: "2026-03-05" },
          { title: "No matching content here", url: "https://latentspace.com/2", publishedAt: "2026-03-05" },
          { title: "Old AI Article", url: "https://latentspace.com/3", publishedAt: "2026-01-01" },
        ]),
    },
  },
  ALL_INDEPENDENT_SOURCES: ["latentspace"],
  ALL_COMPANIES: ["google"],
}));

mock.module("../../src/dao/cache", () => ({
  getCachedArticles: () => Promise.resolve(null),
  setCachedArticles: () => Promise.resolve(),
}));

import { ProviderArticleRepository } from "../../src/dao/provider-article-repository";
import { ContentFilterIdentifier } from "../../src/constants/filters";

const repo = new ProviderArticleRepository();

const BASE_FILTERS = {
  companies: ["google"] as never[],
  includeFilters: [] as ContentFilterIdentifier[],
  excludeFilters: [] as ContentFilterIdentifier[],
};

describe("ProviderArticleRepository sources filtering", () => {
  // Scenario: Default behavior unchanged
  test("no sources returns both company and independent articles", async () => {
    const articles = await repo.list({ ...BASE_FILTERS });
    const types = articles.map((a) => a.sourceType);
    expect(types).toContain("company");
    expect(types).toContain("independent");
  });

  // Scenario: Community-only results
  test("sources: ['community'] returns only independent articles", async () => {
    const articles = await repo.list({ ...BASE_FILTERS, sources: ["independent"] });
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.sourceType === "independent")).toBe(true);
    expect(articles.some((a) => a.sourceType === "company")).toBe(false);
  });

  // Scenario: Companies-only results
  test("sources: ['companies'] returns only company articles", async () => {
    const articles = await repo.list({ ...BASE_FILTERS, sources: ["companies"] });
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.sourceType === "company")).toBe(true);
    expect(articles.some((a) => a.sourceType === "independent")).toBe(false);
  });

  // Scenario: Both sources (equivalent to default)
  test("sources: ['companies', 'community'] returns both company and independent articles", async () => {
    const articles = await repo.list({ ...BASE_FILTERS, sources: ["companies", "independent"] });
    const types = articles.map((a) => a.sourceType);
    expect(types).toContain("company");
    expect(types).toContain("independent");
  });

  // Scenario: Compatible with date and content filters
  test("sources: ['community'] + date range + include ai returns only matching independent articles", async () => {
    const startDate = new Date("2026-03-02T00:00:00Z");
    const endDate = new Date("2026-03-09T23:59:59Z");

    const articles = await repo.list({
      ...BASE_FILTERS,
      sources: ["independent"],
      startDate,
      endDate,
      includeFilters: [ContentFilterIdentifier.AI],
    });

    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.sourceType === "independent")).toBe(true);
    expect(articles.every((a) => /\bai\b/i.test(a.title))).toBe(true);
    expect(articles.every((a) => a.publishedAt! >= "2026-03-02")).toBe(true);
  });
});
