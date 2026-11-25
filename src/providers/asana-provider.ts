import { parse } from "node-html-parser";
import type { ArticleData } from "../types";
import type { DataProvider } from "./provider";
import { BaseProvider, USER_AGENT } from "./base-provider";

const URL = "https://asana.com/inside-asana/engineering-spotlight";
const DATE_PATTERN = /[A-Z][a-z]+ \d{1,2}, \d{4}/;

// Each article card ends in an empty overlay link whose aria-labelledby points at the
// element holding the card's title (h5) and "Author · Month D, YYYY" byline.
export class AsanaProvider extends BaseProvider implements DataProvider {
  async fetch(): Promise<ArticleData[]> {
    const res = await fetch(URL, { headers: { "User-Agent": USER_AGENT, Accept: "text/html" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${URL}`);
    const root = parse(await res.text());

    const articles = new Map<string, ArticleData>();
    for (const link of root.querySelectorAll('a[href^="/inside-asana/"][aria-labelledby]')) {
      const href = link.getAttribute("href") ?? "";
      const labelId = link.getAttribute("aria-labelledby") ?? "";
      const label = root.getElementById(labelId);
      const title = label?.querySelector("h5")?.text.trim();
      if (!title || articles.has(href)) continue;

      const date = label?.text.match(DATE_PATTERN)?.[0];
      const parsed = date ? new Date(date) : null;
      articles.set(href, {
        title,
        url: this.resolveUrl(href, URL),
        publishedAt: parsed && !isNaN(parsed.getTime()) ? parsed.toISOString() : null,
      });
    }

    return Array.from(articles.values());
  }
}
