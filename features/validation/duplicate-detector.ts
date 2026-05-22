/**
 * Duplicate Detector — Fuzzy matching for census entries
 * Uses Levenshtein distance to detect potential duplicate houses.
 */

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= la; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= lb; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[la][lb];
}

/**
 * Calculate similarity ratio between two strings (0–1, where 1 is identical)
 */
function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Normalize a string for comparison: lowercase, remove extra spaces, trim
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

export interface DuplicateCandidate {
  id: string;
  house_number: string;
  address: string;
  head_of_family: string;
}

export interface DuplicateMatch {
  source: DuplicateCandidate;
  match: DuplicateCandidate;
  score: number; // 0–1 similarity
  matchedOn: ('house_number' | 'address' | 'head_of_family')[];
}

interface DuplicateDetectorOptions {
  /** Similarity threshold (0–1). Default: 0.75 */
  threshold?: number;
  /** Weight for house_number match. Default: 0.4 */
  houseNumberWeight?: number;
  /** Weight for address match. Default: 0.35 */
  addressWeight?: number;
  /** Weight for head_of_family match. Default: 0.25 */
  headOfFamilyWeight?: number;
}

/**
 * Find potential duplicate entries from a list of houses.
 * Returns pairs of entries with similarity above the threshold.
 */
export function findDuplicates(
  houses: DuplicateCandidate[],
  options: DuplicateDetectorOptions = {}
): DuplicateMatch[] {
  const {
    threshold = 0.75,
    houseNumberWeight = 0.4,
    addressWeight = 0.35,
    headOfFamilyWeight = 0.25,
  } = options;

  const matches: DuplicateMatch[] = [];

  for (let i = 0; i < houses.length; i++) {
    for (let j = i + 1; j < houses.length; j++) {
      const a = houses[i];
      const b = houses[j];

      const houseNumSim = similarity(
        normalize(a.house_number),
        normalize(b.house_number)
      );
      const addressSim = similarity(
        normalize(a.address),
        normalize(b.address)
      );
      const headSim = similarity(
        normalize(a.head_of_family),
        normalize(b.head_of_family)
      );

      const weightedScore =
        houseNumSim * houseNumberWeight +
        addressSim * addressWeight +
        headSim * headOfFamilyWeight;

      if (weightedScore >= threshold) {
        const matchedOn: DuplicateMatch['matchedOn'] = [];
        if (houseNumSim >= 0.8) matchedOn.push('house_number');
        if (addressSim >= 0.8) matchedOn.push('address');
        if (headSim >= 0.8) matchedOn.push('head_of_family');

        matches.push({
          source: a,
          match: b,
          score: Math.round(weightedScore * 100) / 100,
          matchedOn,
        });
      }
    }
  }

  // Sort by highest similarity first
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Check a single house against an existing list for potential duplicates.
 * Useful when adding a new house entry.
 */
export function checkForDuplicate(
  newHouse: DuplicateCandidate,
  existingHouses: DuplicateCandidate[],
  options: DuplicateDetectorOptions = {}
): DuplicateMatch[] {
  const {
    threshold = 0.75,
    houseNumberWeight = 0.4,
    addressWeight = 0.35,
    headOfFamilyWeight = 0.25,
  } = options;

  const matches: DuplicateMatch[] = [];

  for (const existing of existingHouses) {
    if (existing.id === newHouse.id) continue;

    const houseNumSim = similarity(
      normalize(newHouse.house_number),
      normalize(existing.house_number)
    );
    const addressSim = similarity(
      normalize(newHouse.address),
      normalize(existing.address)
    );
    const headSim = similarity(
      normalize(newHouse.head_of_family),
      normalize(existing.head_of_family)
    );

    const weightedScore =
      houseNumSim * houseNumberWeight +
      addressSim * addressWeight +
      headSim * headOfFamilyWeight;

    if (weightedScore >= threshold) {
      const matchedOn: DuplicateMatch['matchedOn'] = [];
      if (houseNumSim >= 0.8) matchedOn.push('house_number');
      if (addressSim >= 0.8) matchedOn.push('address');
      if (headSim >= 0.8) matchedOn.push('head_of_family');

      matches.push({
        source: newHouse,
        match: existing,
        score: Math.round(weightedScore * 100) / 100,
        matchedOn,
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}
