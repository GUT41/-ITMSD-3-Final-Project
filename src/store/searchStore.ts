import { create } from 'zustand';
import { Word } from '../types/index';

interface SearchStore {
  searchQuery: string;
  results: Word[];
  savedWords: Word[];
  searchHistory: string[];
  theme: 'light' | 'dark';
  isLoading: boolean;

  setSearchQuery: (query: string) => void;
  setResults: (results: Word[]) => void;
  addSavedWord: (word: Word) => void;
  removeSavedWord: (wordId: string) => void;
  setSavedWords: (words: Word[]) => void;
  addToHistory: (query: string) => void;
  setSearchHistory: (history: string[]) => void;
  clearHistory: () => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  results: [],
  savedWords: [],
  searchHistory: [],
  theme: 'light',
  isLoading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setResults: (results) => set({ results }),
  addSavedWord: (word) =>
    set((state) => ({
      savedWords: [word, ...state.savedWords],
    })),
  removeSavedWord: (wordId) =>
    set((state) => ({
      savedWords: state.savedWords.filter((w) => w.id !== wordId),
    })),
  setSavedWords: (words) => set({ savedWords: words }),
  addToHistory: (query) =>
    set((state) => ({
      searchHistory: [query, ...state.searchHistory.slice(0, 9)],
    })),
  setSearchHistory: (history) => set({ searchHistory: history }),
  clearHistory: () => set({ searchHistory: [] }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));