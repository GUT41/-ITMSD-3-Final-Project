import {
  initDictionary,
  getAllWords,
  getWordByName,
  getWordById,
  searchByPrefix,
  getRandomWord,
} from '../src/services/dictionaryService';

describe('Dictionary Service', () => {
  beforeAll(async () => {
    await initDictionary();
  });

  test('should load all words', () => {
    const words = getAllWords();
    expect(words.length).toBeGreaterThan(0);
    expect(words[0]).toHaveProperty('word');
    expect(words[0]).toHaveProperty('definition');
  });

  test('should find a word by exact name', () => {
    const word = getWordByName('apple');
    expect(word).toBeDefined();
    expect(word?.word).toBe('apple');
  });

  test('should find a word by ID', () => {
    const word = getWordById('apple-0');
    expect(word).toBeDefined();
    expect(word?.id).toBe('apple-0');
  });

  test('should search by prefix', () => {
    const results = searchByPrefix('ab');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].word.toLowerCase().startsWith('ab')).toBe(true);
  });

  test('should return random word', () => {
    const word = getRandomWord();
    expect(word).toBeDefined();
    expect(word?.word).toBeDefined();
  });

  test('should return empty array for empty prefix', () => {
    const results = searchByPrefix('');
    expect(results.length).toBe(0);
  });
});