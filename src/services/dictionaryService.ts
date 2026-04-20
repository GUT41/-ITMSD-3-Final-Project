import { Word } from '../types/index';

let wordList: Word[] = [];

export async function initDictionary(): Promise<void> {
  try {
    console.log('Dictionary initialized');
  } catch (error) {
    console.error('Error initializing dictionary:', error);
  }
}

export function search(query: string): Word[] {
  return [];
}

export function fuzzySearch(query: string, threshold?: number): Word[] {
  return [];
}