import { initDictionary, getAllWords } from '../src/services/dictionaryService';

const PLACEHOLDER = /^Definition for ".+" - a common English word/;
const GENERIC_EXAMPLE = /^Example with the word ".+"\./;

describe('offline dictionary data', () => {
  beforeAll(async () => {
    await initDictionary();
  });

  test('loads a large local vocabulary', () => {
    const words = getAllWords();
    expect(words.length).toBeGreaterThan(9000);
  });

  test('has no placeholder definitions or generic examples', () => {
    const words = getAllWords();
    const bad = words.filter(
      (w) =>
        PLACEHOLDER.test(w.definition) ||
        GENERIC_EXAMPLE.test(w.example ?? '') ||
        !w.definition ||
        !w.example ||
        !w.partOfSpeech ||
        !w.difficulty ||
        !w.category ||
        !(w.tags?.length)
    );
    expect(bad).toEqual([]);
  });
});
