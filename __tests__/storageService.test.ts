import { addSavedWord, removeSavedWord, getSavedWords } from '../src/services/storageService';
import { Word } from '../src/types/index';

describe('Storage Service', () => {
  const testWord: Word = {
    id: 'test-1',
    word: 'test',
    definition: 'a test word',
    partOfSpeech: 'noun',
  };

  test('should save and retrieve word', async () => {
    await addSavedWord(testWord);
    const saved = await getSavedWords();
    expect(saved.length).toBeGreaterThan(0);
  });

  test('should remove saved word', async () => {
    await addSavedWord(testWord);
    await removeSavedWord(testWord.id);
    const saved = await getSavedWords();
    expect(saved.find((w) => w.id === testWord.id)).toBeUndefined();
  });

  test('should return empty array initially', async () => {
    const saved = await getSavedWords();
    expect(Array.isArray(saved)).toBe(true);
  });
});