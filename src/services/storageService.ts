import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types/index';

const SAVED_WORDS_KEY = '@lexisearch/savedWords';
const SEARCH_HISTORY_KEY = '@lexisearch/history';

export async function getSavedWords(): Promise<Word[]> {
  try {
    const data = await AsyncStorage.getItem(SAVED_WORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('⚠️ Failed to get saved words', error);
    return [];
  }
}

export async function saveSavedWords(words: Word[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(words));
  } catch (error) {
    console.warn('⚠️ Failed to save saved words', error);
  }
}

export async function getSearchHistory(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('⚠️ Failed to get search history', error);
    return [];
  }
}

export async function saveSearchHistory(history: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('⚠️ Failed to save search history', error);
  }
}