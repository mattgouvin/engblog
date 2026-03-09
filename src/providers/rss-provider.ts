import { XMLParser } from "fast-xml-parser";
import type { ArticleData } from "../types";
import type { DataProvider } from "./provider";
import { BaseProvider, USER_AGENT } from "./base-provider";

const RSS_HEADERS = {
  "User-Agent": USER_AGENT,
  Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
} as const;

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function coerceArray<T>(val: T | T[] | undefined): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function extractText(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if (typeof obj["#text"] === "string") return (obj["#text"] as string).trim() || null;
  }
  return null;
}

function extractDate(item: Record<string, unknown>): string | null {
  const pubDate = extractText(item["pubDate"]);
  if (pubDate) return new Date(pubDate).toISOString();
  const updated = extractText(item["updated"]);
  if (updated) return new Date(updated).toISOString();
  const published = extractText(item["published"]);
  if (published) return new Date(published).toISOString();
  return null;
}

function extractLink(item: Record<string, unknown>): string | null {
  const link = item["link"];
  if (typeof link === "string") return link.trim() || null;
  if (typeof link === "object" && link !== null) {
    const linkObj = link as Record<string, unknown>;
    if (typeof linkObj["@_href"] === "string") return linkObj["@_href"].trim() || null;
    const links = Array.isArray(link) ? link : [];
    let fallback: string | null = null;
    for (const l of links) {
      if (typeof l === "object" && l !== null) {
        const lo = l as Record<string, unknown>;
        if (typeof lo["@_href"] === "string") {
          if (lo["@_rel"] === "alternate") return (lo["@_href"] as string).trim();
          if (!fallback) fallback = (lo["@_href"] as string).trim();
        }
      }
    }
    return fallback;
  }
  return null;
}

export class RssProvider extends BaseProvider implements DataProvider {
  constructor(private url: string) {
    super();
  }

  async fetch(): Promise<ArticleData[]> {
    const res = await fetch(this.url, {
      headers: RSS_HEADERS,
      tls: {
        rejectUnauthorized: false,
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${this.url}`);
    const xml = await res.text();
    const parsed = parser.parse(xml);

    const rssItems: unknown[] = coerceArray(parsed?.rss?.channel?.item);
    const atomEntries: unknown[] = coerceArray(parsed?.feed?.entry);
    const raw = [...rssItems, ...atomEntries];

    return raw
      .map((item) => {
        const i = item as Record<string, unknown>;
        return {
          title: extractText(i["title"]) ?? "(no title)",
          url: extractLink(i) ?? "",
          publishedAt: extractDate(i),
        };
      })
      .filter((a) => a.url);
  }
}
