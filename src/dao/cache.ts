import { join } from "path";
import { tmpdir } from "os";
import { mkdir } from "fs/promises";
import type { ArticleData } from "../types";

const CACHE_DIR = join(tmpdir(), "engblog-cache");
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: ArticleData[];
  timestamp: number;
}

function getCachePath(source: string): string {
  return join(CACHE_DIR, `${source}.json`);
}

export async function getCachedArticles(source: string): Promise<ArticleData[] | null> {
  try {
    const entry: CacheEntry = await Bun.file(getCachePath(source)).json();
    if (Date.now() - entry.timestamp >= CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export async function setCachedArticles(source: string, data: ArticleData[]): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    await Bun.write(getCachePath(source), JSON.stringify(entry));
  } catch (err) {
    console.error(`Failed to write cache for ${source}: ${err}`);
  }
}
