import { searchByTrie, searchByLevenshtein, initDictionary } from '../src/services/dictionaryService';

describe('Search Functions', () => {
  beforeAll(async () => {
    await initDictionary(); // Initialize dictionary before tests
  });
  test('Trie search finds words by prefix', () => {
    const results = searchByTrie('ab');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].word.toLowerCase().startsWith('ab')).toBe(true);
  });

  test('Trie search returns empty for no match', () => {
    const results = searchByTrie('xyz123');
    expect(results.length).toBe(0);
  });

  test('Levenshtein search finds similar words', () => {
    const results = searchByLevenshtein('aple', 2); // Typo
    expect(results.length).toBeGreaterThan(0);
  });

  test('Levenshtein respects threshold', () => {
    const results = searchByLevenshtein('qwertyuiop', 1); // Way off
    expect(results.length).toBe(0);
  });

  test('Empty query returns empty', () => {
    const results = searchByTrie('');
    expect(results.length).toBe(0);
  });
});