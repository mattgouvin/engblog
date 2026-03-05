import { join } from "path";
import { tmpdir } from "os";
import { mkdir } from "fs/promises";
import type { ArticleData, Company } from "../types";

const CACHE_DIR = join(tmpdir(), "engblog-cache");
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: ArticleData[];
  timestamp: number;
}

function getCachePath(company: Company): string {
  return join(CACHE_DIR, `${company}.json`);
}

export async function getCachedArticles(company: Company): Promise<ArticleData[] | null> {
  try {
    const entry: CacheEntry = await Bun.file(getCachePath(company)).json();
    if (Date.now() - entry.timestamp >= CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export async function setCachedArticles(company: Company, data: ArticleData[]): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    await Bun.write(getCachePath(company), JSON.stringify(entry));
  } catch (err) {
    console.error(`Failed to write cache for ${company}: ${err}`);
  }
}
