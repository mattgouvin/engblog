import { chromium } from "playwright";
import { parse } from "node-html-parser";
import type { ArticleData } from "../types";
import { HtmlProvider } from "./html-provider";

const BROWSER_WAIT_MS = 2000;

export class BrowserProvider extends HtmlProvider {
  override async fetch(): Promise<ArticleData[]> {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      await page.goto(this.url, { waitUntil: "domcontentloaded" });
      await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), BROWSER_WAIT_MS);

      const html = await page.content();
      const root = parse(html);

      return root
        .querySelectorAll(this.selectors.item)
        .map((element) => this.extractArticleFromHtmlElement(element))
        .filter((a) => a.url);
    } finally {
      await browser.close();
    }
  }
}
