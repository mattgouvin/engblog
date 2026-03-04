export abstract class BaseProvider {
  protected resolveUrl(articleUrl: string, baseUrl: string): string {
    if (articleUrl && articleUrl.startsWith("/")) {
      const base = new URL(baseUrl);
      return `${base.origin}${articleUrl}`;
    }
    return articleUrl;
  }
}
