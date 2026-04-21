import { levenshtein, fuzzySearch } from '../src/algorithms/levenshtein';

describe('Levenshtein', () => {
  test('distance calculation', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('hello', 'hello')).toBe(0);
    expect(levenshtein('', 'abc')).toBe(3);
  });

  test('fuzzy search', () => {
    const words = ['apple', 'application', 'apples'];
    const results = fuzzySearch('aple', words, 2);
    expect(results.length).toBeGreaterThan(0);
  });

  test('distance ranking', () => {
    const words = ['hello', 'hallo', 'hullo'];
    const results = fuzzySearch('hello', words);
    expect(results[0].distance).toBe(0);
  });
});