import { parse, type HTMLElement } from "node-html-parser";
import type { ArticleData, HtmlSelectors } from "../types";
import type { DataProvider } from "./provider";
import { BaseProvider, USER_AGENT } from "./base-provider";

const HTML_HEADERS = {
  "User-Agent": USER_AGENT,
  Accept: "text/html",
} as const;

export class HtmlProvider extends BaseProvider implements DataProvider {
  constructor(
    protected url: string,
    protected selectors: HtmlSelectors
  ) {
    super();
  }

  protected parseDate(rawDate: string | null): string | null {
    if (!rawDate) return null;
    try {
      return new Date(rawDate).toISOString();
    } catch {
      return rawDate;
    }
  }

  protected extractArticleFromHtmlElement(element: HTMLElement): ArticleData {
    const titleElement = element.querySelector(this.selectors.title);
    const title = titleElement?.text.trim() ?? "(no title)";

    let articleUrl;
    if (this.selectors.link === "self") {
      articleUrl = element.getAttribute("href") ?? "";
    } else {
      const linkElement = element.querySelector(this.selectors.link);
      articleUrl = linkElement?.getAttribute("href") ?? linkElement?.text.trim() ?? "";
    }
    articleUrl = this.resolveUrl(articleUrl, this.url);

    const dateElement = this.selectors.date ? element.querySelector(this.selectors.date) : null;
    const rawDate = dateElement?.getAttribute("datetime") ?? dateElement?.text.trim() ?? null;
    const publishedAt = this.parseDate(rawDate);

    return { title, url: articleUrl, publishedAt };
  }

  async fetch(): Promise<ArticleData[]> {
    const res = await fetch(this.url, { headers: HTML_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${this.url}`);
    const html = await res.text();
    const root = parse(html);

    return root
      .querySelectorAll(this.selectors.item)
      .map((element) => this.extractArticleFromHtmlElement(element))
      .filter((a) => a.url);
  }
}
