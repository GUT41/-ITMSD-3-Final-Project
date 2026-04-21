import { Word, SearchResult } from '../types/index';
import wordData from '../../data/words.json';

let wordList: Word[] = [];
let isInitialized = false;

export async function initDictionary(): Promise<void> {
  try {
    if (isInitialized) {
      console.log('Dictionary already initialized');
      return;
    }

    wordList = wordData as Word[];
    wordList.sort((a, b) => a.word.localeCompare(b.word));

    isInitialized = true;
    console.log(`Dictionary initialized with ${wordList.length} words`);
  } catch (error) {
    console.error('Error initializing dictionary:', error);
    throw error;
  }
}

export function getAllWords(): Word[] {
  return wordList;
}

export function getWordByName(word: string): Word | undefined {
  return wordList.find((w) => w.word.toLowerCase() === word.toLowerCase());
}

export function getWordById(id: string): Word | undefined {
  return wordList.find((w) => w.id === id);
}

export function searchByPrefix(prefix: string): Word[] {
  if (!prefix || prefix.length === 0) {
    return [];
  }

  const lowerPrefix = prefix.toLowerCase();
  return wordList.filter((w) => w.word.toLowerCase().startsWith(lowerPrefix));
}

export function getRandomWord(): Word | undefined {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

export function search(query: string): SearchResult[] {
  return searchByPrefix(query).slice(0, 10);
}

export function fuzzySearch(query: string, threshold?: number): SearchResult[] {
  return searchByPrefix(query).slice(0, 10);
}