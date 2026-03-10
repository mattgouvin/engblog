import { IndependentSource } from "../types";
import type { DataProvider } from "./provider";
import { RssProvider } from "./rss-provider";

export const independentRegistry: Record<IndependentSource, DataProvider> = {
  [IndependentSource.LatentSpace]: new RssProvider("https://www.latent.space/feed.xml"),
  [IndependentSource.LennysNewsletter]: new RssProvider("https://www.lennysnewsletter.com/feed.xml"),
  [IndependentSource.RobinSloan]: new RssProvider("https://www.robinsloan.com/lab.xml"),
};

export const ALL_INDEPENDENT_SOURCES = Object.values(IndependentSource);
