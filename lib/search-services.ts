import knownServices from "./known-services.json";

export type KnownService = {
  name: string;
  category: string;
  avgPrice: number;
  color: string;
  initial: string;
};

/**
 * Returns known services whose name matches the query.
 * - Case-insensitive
 * - Matches anywhere in the name (not just the start), so "flix" still finds "Netflix"
 * - Limited to `limit` results so the dropdown doesn't get overwhelming
 */
export function searchServices(query: string, limit = 6): KnownService[] {
  const trimmed = query.trim().toLowerCase();

  if (trimmed.length === 0) {
    return [];
  }

  const matches = (knownServices as KnownService[]).filter((service) =>
    service.name.toLowerCase().includes(trimmed)
  );

  // Prioritize matches where the name STARTS with the query
  // (e.g. typing "net" should show "Netflix" before something like "Internet Insurance")
  matches.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(trimmed);
    const bStarts = b.name.toLowerCase().startsWith(trimmed);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return a.name.localeCompare(b.name);
  });

  return matches.slice(0, limit);
}