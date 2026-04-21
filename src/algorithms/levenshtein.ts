export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
      }
    }
  }

  return dp[m][n];
}

export function fuzzySearch(
  query: string,
  words: string[],
  threshold: number = 2
): Array<{ word: string; distance: number }> {
  return words
    .map((word) => ({
      word,
      distance: levenshtein(query.toLowerCase(), word.toLowerCase()),
    }))
    .filter((item) => item.distance <= threshold)
    .sort((a, b) => a.distance - b.distance);
}