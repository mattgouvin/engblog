export enum Company {
  Google = "google",
  Meta = "meta",
  Netflix = "netflix",
  Airbnb = "airbnb",
  Stripe = "stripe",
  GitHub = "github",
  Ramp = "ramp",
  Anthropic = "anthropic",
  Ona = "ona",
  Cursor = "cursor",
  YCombinator = "ycombinator",
  LangChain = "langchain",
  Asana = "asana",
  Atlassian = "atlassian",
  Canva = "canva",
  Dropbox = "dropbox",
  Instagram = "instagram",
  KhanAcademy = "khanacademy",
  LinkedIn = "linkedin",
  Lyft = "lyft",
  Medium = "medium",
  NewYorkTimes = "newyorktimes",
  Postman = "postman",
  Slack = "slack",
  Spotify = "spotify",
  InstaCart = "instacart",
  Tinder = "tinder",
  OpenAI = "openai",
}

export interface ArticleData {
  title: string;
  url: string;
  publishedAt: string | null;
}

export interface Article extends ArticleData {
  company: Company;
}

export interface HtmlSelectors {
  /** Selector for each article container */
  item: string;
  /** Selector (within item) for title text */
  title: string;
  /** Selector (within item) for link href, or "self" if item is the anchor */
  link: string;
  /** Optional selector for date */
  date?: string;
}
