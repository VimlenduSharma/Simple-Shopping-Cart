const NON_LATIN        = /[^\p{Letter}\p{Number}]+/gu;
const LEADING_TRAILING = /^-+|-+$/g;

export function slugify(text: string): string {
  return text
    .normalize('NFD')               // separate accents from letters
    .replace(/[\u0300-\u036f]/g, '')// drop all diacritics
    .replace(NON_LATIN, '-')        // spaces & symbols → hyphen
    .replace(LEADING_TRAILING, '')  // trim -
    .toLowerCase();
}

export async function generateUniqueSlug(
  text: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(text);
  let candidate = base;
  let i = 2;

  while (await exists(candidate)) {
    candidate = `${base}-${i++}`;
  }
  return candidate;
}