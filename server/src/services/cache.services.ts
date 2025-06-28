import { LRUCache } from "../utils/lrucache";

export const cache = new LRUCache(100, 60 * 1000 * 5);

cache.deleteExpiredItems(60 * 1000 * 2);
