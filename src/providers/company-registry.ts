import { Company } from "../types";
import type { DataProvider } from "./provider";
import { RssProvider } from "./rss-provider";
import { BrowserProvider } from "./browser-provider";
import { AsanaProvider } from "./asana-provider";
import { RampProvider } from "./ramp-provider";

/**
 * Consolidated registry of all data providers
 * Add new companies here instead of creating separate files
 */
export const providerRegistry: Record<Company, DataProvider> = {
  // RSS-based providers
  [Company.Airbnb]: new RssProvider("https://medium.com/feed/airbnb-engineering"),
  [Company.Atlassian]: new RssProvider("https://atlassianblog.wpengine.com/feed"),
  [Company.Canva]: new RssProvider("https://www.canva.dev/blog/engineering/feed.xml"),
  [Company.Dropbox]: new RssProvider("https://dropbox.tech/feed"),
  [Company.GitHub]: new RssProvider("https://github.blog/engineering/feed/"),
  [Company.Google]: new RssProvider("https://research.google/blog/rss/"),
  [Company.InstaCart]: new RssProvider("https://tech.instacart.com/feed"),
  [Company.Instagram]: new RssProvider("https://instagram-engineering.com/feed"),
  [Company.KhanAcademy]: new RssProvider("https://blog.khanacademy.org/engineering/feed/"),
  [Company.LangChain]: new RssProvider("https://blog.langchain.com/rss/"),
  [Company.Lyft]: new RssProvider("https://eng.lyft.com/feed"),
  [Company.Medium]: new RssProvider("https://medium.engineering/feed"),
  [Company.Meta]: new RssProvider("https://engineering.fb.com/feed/"),
  [Company.Netflix]: new RssProvider("https://medium.com/feed/netflix-techblog"),
  [Company.NewYorkTimes]: new RssProvider("https://open.nytimes.com/feed"),
  [Company.Ona]: new RssProvider("https://ona.com/stories/feed"),
  [Company.Postman]: new RssProvider("https://blog.postman.com/feed/"),
  [Company.Slack]: new RssProvider("https://slack.engineering/feed/"),
  [Company.Spotify]: new RssProvider("https://engineering.atspotify.com/feed"),
  [Company.Tinder]: new RssProvider("https://medium.com/feed/tinder"),
  [Company.YCombinator]: new RssProvider("https://www.ycombinator.com/blog/feed"),
  [Company.OpenAI]: new RssProvider("https://openai.com/news/rss.xml"),

  // Browser-based providers (require JavaScript rendering)
  [Company.Anthropic]: new BrowserProvider(
    "https://www.anthropic.com/engineering",
    {
      item: "a.ArticleList-module-scss-module___tpu-a__cardLink",
      title: "h2, h3",
      link: "self",
      date: ".ArticleList-module-scss-module___tpu-a__date",
    }
  ),
  [Company.Cursor]: new BrowserProvider(
    "https://cursor.com/blog",
    {
      item: "a.card.card--text",
      title: "p.type-base:first-of-type",
      link: "self",
      date: "time",
    }
  ),
  [Company.LinkedIn]: new BrowserProvider(
    "https://www.linkedin.com/blog/engineering",
    {
      item: "li.post-list__item.grid-post",
      title: ".grid-post__title a",
      link: ".grid-post__title a",
      date: ".grid-post__date",
    }
  ),
  [Company.Stripe]: new BrowserProvider(
    "https://stripe.dev/blog",
    {
      item: "li.ListItem_listItem__RdyDp",
      title: "div.text-md",
      link: "a",
      date: "span.text-smallcaps",
    }
  ),

  // Custom providers (complex logic)
  [Company.Asana]: new AsanaProvider(),
  [Company.Ramp]: new RampProvider(),
};

export const ALL_COMPANIES = Object.values(Company);
