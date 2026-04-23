import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types/index';

const SAVED_WORDS_KEY = '@lexisearch/savedWords';

export async function getSavedWords(): Promise<Word[]> {
  try {
    const data = await AsyncStorage.getItem(SAVED_WORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Storage error:', error);
    return [];
  }
}

export async function saveSavedWords(words: Word[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving words:', error);
  }
}

export async function addSavedWord(word: Word): Promise<void> {
  const saved = await getSavedWords();
  const updated = [word, ...saved.filter((w) => w.id !== word.id)];
  await saveSavedWords(updated);
}

export async function removeSavedWord(wordId: string): Promise<void> {
  const saved = await getSavedWords();
  const updated = saved.filter((w) => w.id !== wordId);
  await saveSavedWords(updated);
}

export async function getSearchHistory(): Promise<string[]> {
  return [];
}

export async function saveSearchHistory(history: string[]): Promise<void> {
  console.log('History:', history.length);
}