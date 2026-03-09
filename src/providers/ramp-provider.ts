import { chromium } from "playwright";
import { parse } from "node-html-parser";
import type { ArticleData } from "../types";
import type { DataProvider } from "./provider";
import { BaseProvider } from "./base-provider";

export class RampProvider extends BaseProvider implements DataProvider {
  async fetch(): Promise<ArticleData[]> {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto("https://builders.ramp.com/", { waitUntil: "networkidle" });
      await page.waitForLoadState("domcontentloaded");
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

      const html = await page.content();
      const root = parse(html);

      return root
        .querySelectorAll("a[href*='/post/']")
        .map((el) => {
          const href = el.getAttribute("href") ?? "";

          // Structure: <a><div><div>Title</div><div></div><div>Description</div><div></div><div>Author(s)–Date</div></div></a>
          const wrapper = el.querySelector("div");
          const children = wrapper?.childNodes.filter(n => n.nodeType === 1) ?? [];

          const title = children[0]?.text.trim() ?? "";
          const authorDateDiv = children[4];

          let publishedAt: string | null = null;

          if (authorDateDiv && "querySelectorAll" in authorDateDiv) {
            // Extract date from the author–Date text
            const authorDateText = (authorDateDiv).text.trim();
            const dashIndex = authorDateText.lastIndexOf("–");
            if (dashIndex !== -1) {
              const dateStr = authorDateText.substring(dashIndex + 1).trim();
              const dateMatch = dateStr.match(/\w+\s+\d{1,2},\s+\d{4}/);
              if (dateMatch) {
                publishedAt = new Date(dateMatch[0]).toISOString();
              }
            }
          }

          const articleUrl = this.resolveUrl(href, "https://builders.ramp.com");

          return { title, url: articleUrl, publishedAt };
        })
        .filter((a) => a.url);
    } finally {
      await browser.close();
    }
  }
}
