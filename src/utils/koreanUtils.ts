/**
 * Korean Grammar & Particle (조사) Utilities
 * Accurately selects Korean postpositions (은/는, 이/가, 을/를, 과/와) based on final consonant (받침).
 */

export function hasBatchim(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(char.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

export function getJosa(word: string, type: '은/는' | '이/가' | '을/를' | '과/와'): string {
  if (!word) return '';
  const batchim = hasBatchim(word);

  switch (type) {
    case '은/는':
      return batchim ? '은' : '는';
    case '이/가':
      return batchim ? '이' : '가';
    case '을/를':
      return batchim ? '을' : '를';
    case '과/와':
      return batchim ? '과' : '와';
  }
}

export function appendJosa(word: string, type: '은/는' | '이/가' | '을/를' | '과/와'): string {
  return `${word}${getJosa(word, type)}`;
}
