import { create } from 'zustand';
import { Word, SearchResult } from '../types/index';

interface SearchStore {
  searchQuery: string;
  results: SearchResult[];
  savedWords: Word[];
  searchHistory: string[];

  setSearchQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
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