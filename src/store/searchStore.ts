import { create } from 'zustand';
import { Word } from '../types/index';

interface SearchStore {
  searchQuery: string;
  results: Word[];
  savedWords: Word[];
  searchHistory: string[];

  setSearchQuery: (query: string) => void;
  setResults: (results: Word[]) => void;
  setSavedWords: (words: Word[]) => void;
  setSearchHistory: (history: string[]) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  results: [],
  savedWords: [],
  searchHistory: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setResults: (results) => set({ results }),
  setSavedWords: (words) => set({ savedWords: words }),
  setSearchHistory: (history) => set({ searchHistory: history }),
}));