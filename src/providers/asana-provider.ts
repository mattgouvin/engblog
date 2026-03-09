import { chromium } from "playwright";
import { parse } from "node-html-parser";
import type { ArticleData } from "../types";
import type { DataProvider } from "./provider";
import { BaseProvider } from "./base-provider";

export class AsanaProvider extends BaseProvider implements DataProvider {
  async fetch(): Promise<ArticleData[]> {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto("https://asana.com/inside-asana/engineering-spotlight", {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      const html = await page.content();
      const root = parse(html);

      const imgs = root.querySelectorAll("img[alt]");
      const articles = new Map<string, { title: string; date: string }>();

      imgs.forEach((img) => {
        const alt = img.getAttribute("alt") || "";
        let parent = img;
        let href = "";
        let date = "";

        for (let depth = 0; depth < 20; depth++) {
          parent = parent.parentNode;
          if (!parent) break;

          if (parent.tagName === "A") {
            href = parent.getAttribute("href") || "";
            if (
              href.startsWith("/inside-asana/") &&
              !href.includes("/engineering-spotlight") &&
              !href.includes("/page/")
            ) {
              const parentHtml = parent.toString();
              const dateMatch = parentHtml.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/);
              if (dateMatch) {
                date = dateMatch[1];
              }
              break;
            }
          }
        }

        if (href && alt && !articles.has(href)) {
          articles.set(href, { title: alt, date });
        }
      });

      return Array.from(articles.entries())
        .map(([href, data]) => {
          const articleUrl = this.resolveUrl(href, "https://asana.com");
          let publishedAt: string | null = null;
          if (data.date) {
            try {
              publishedAt = new Date(data.date).toISOString();
            } catch {
              publishedAt = null;
            }
          }

          return {
            title: data.title.trim(),
            url: articleUrl,
            publishedAt,
          };
        })
        .filter((a) => {
          const title = a.title.toLowerCase();
          return (
            a.title.length > 0 &&
            !title.includes("engineering spotlights") &&
            !title.includes("blog thumbnail") &&
            !title.includes("banner image")
          );
        });
    } finally {
      await browser.close();
    }
  }
}
