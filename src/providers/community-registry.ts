import { IndependentSource } from "../types";
import type { DataProvider } from "./provider";
import { RssProvider } from "./rss-provider";

export const communityRegistry: Record<IndependentSource, DataProvider> = {
  [IndependentSource.LatentSpace]: new RssProvider("https://www.latent.space/feed.xml"),
};

export const ALL_INDEPENDENT_SOURCES = Object.values(IndependentSource);
