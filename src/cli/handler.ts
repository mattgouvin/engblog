import type { ParsedFlags } from "../types/cli";
import { ProviderArticleRepository } from "../dao";

const articleRepository = new ProviderArticleRepository();

export async function listArticles(flags: ParsedFlags): Promise<void> {
  const articles = await articleRepository.list(flags);
  console.log(JSON.stringify(articles, null, 2));
}
