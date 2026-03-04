import type { Filter } from "./filter";
import { ContentFilterIdentifier } from "../constants/filters";
import { KeywordFilter } from "./keywords";
import { AI_KEYWORDS } from "../constants/ai-keywords";

/**
 * Registry mapping ContentFilterIdentifier enums to Filter implementations
 * Add new filters here to extend filtering capabilities
 */
export const filterRegistry: Record<ContentFilterIdentifier, Filter> = {
  [ContentFilterIdentifier.AI]: new KeywordFilter(AI_KEYWORDS),
};
