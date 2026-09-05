import knownServices from "./known-services.json";

export type KnownService = {
  name: string;
  category: string;
  avgPrice: number;
  color: string;
  initial: string;
  aliases?: string[];
};

/**
 * Returns known services whose name OR any alias matches the query.
 * - Case-insensitive
 * - Matches anywhere in the name/alias (not just the start), so "flix" still finds "Netflix"
 * - Limited to `limit` results so the dropdown doesn't get overwhelming
 */
export function searchServices(query: string, limit = 6): KnownService[] {
  const trimmed = query.trim().toLowerCase();

  if (trimmed.length === 0) {
    return [];
  }

  const matches = (knownServices as KnownService[]).filter((service) => {
    const nameMatches = service.name.toLowerCase().includes(trimmed);
    const aliasMatches = service.aliases?.some((alias) =>
      alias.toLowerCase().includes(trimmed)
    );
    return nameMatches || aliasMatches;
  });

  // Prioritize matches where the name OR an alias STARTS with the query
  // (e.g. typing "net" should show "Netflix" before something like "Internet Insurance")
  const startsWithQuery = (service: KnownService) => {
    const nameStarts = service.name.toLowerCase().startsWith(trimmed);
    const aliasStarts = service.aliases?.some((alias) =>
      alias.toLowerCase().startsWith(trimmed)
    );
    return nameStarts || aliasStarts;
  };

  matches.sort((a, b) => {
    const aStarts = startsWithQuery(a);
    const bStarts = startsWithQuery(b);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.name.localeCompare(b.name);
  });

  return matches.slice(0, limit);
}