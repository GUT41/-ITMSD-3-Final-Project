import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { Word } from '../types/index';

const isNative = typeof window !== 'undefined' && !!window.navigator?.product;

export async function getSavedWords(): Promise<Word[]> {
  if (!isNative && typeof window !== 'undefined') {
    return [];
  }
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_WORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

export async function addSavedWord(word: Word): Promise<void> {
  if (!isNative && typeof window !== 'undefined') {
    return;
  }
  try {
    const saved = await getSavedWords();
    const updated = [word, ...saved.filter((w) => w.id !== word.id)];
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(updated));
  } catch (error) {
  }
}

export async function removeSavedWord(wordId: string): Promise<void> {
  if (!isNative && typeof window !== 'undefined') {
    return;
  }
  try {
    const saved = await getSavedWords();
    const updated = saved.filter((w) => w.id !== wordId);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(updated));
  } catch (error) {
  }
}

export async function getSearchHistory(): Promise<string[]> {
  if (!isNative && typeof window !== 'undefined') {
    return [];
  }
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

export async function addToSearchHistory(query: string): Promise<void> {
  if (!isNative && typeof window !== 'undefined') {
    return;
  }
  try {
    const history = await getSearchHistory();
    const updated = [query, ...history.filter((q) => q !== query)].slice(0, 10);
    await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  } catch (error) {
  }
}

export async function clearSearchHistory(): Promise<void> {
  if (!isNative && typeof window !== 'undefined') {
    return;
  }
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  } catch (error) {
  }
}