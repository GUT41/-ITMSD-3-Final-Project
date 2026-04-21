import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types/index';

const SAVED_WORDS_KEY = '@lexisearch/savedWords';
const SEARCH_HISTORY_KEY = '@lexisearch/history';

let storageAvailable = true;

export async function getSavedWords(): Promise<Word[]> {
  try {
    if (!storageAvailable) return [];
    const data = await AsyncStorage.getItem(SAVED_WORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    storageAvailable = false;
    return [];
  }
}

export async function saveSavedWords(words: Word[]): Promise<void> {
  try {
    if (!storageAvailable) return;
    await AsyncStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(words));
  } catch (error) {
    storageAvailable = false;
  }
}

export async function getSearchHistory(): Promise<string[]> {
  try {
    if (!storageAvailable) return [];
    const data = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    storageAvailable = false;
    return [];
  }
}

export async function saveSearchHistory(history: string[]): Promise<void> {
  try {
    if (!storageAvailable) return;
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    storageAvailable = false;
  }
}