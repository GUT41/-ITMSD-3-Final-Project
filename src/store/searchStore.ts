import { create } from 'zustand';
import { Word, SearchResult } from '../types/index';

export type DifficultyFilter = 'beginner' | 'intermediate' | 'advanced' | 'all';

interface SearchStore {
  searchQuery: string;
  results: SearchResult[];
  savedWords: Word[];
  searchHistory: string[];

  // Advanced feature filters/stats
  masterScore: number;
  learningStreak: number;
  mostSearchedWords: string[];
  mostSavedWords: string[];
  currentDifficulty: DifficultyFilter;
  currentCategory: string | null;
  currentTag: string | null;

  setSearchQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setSavedWords: (words: Word[]) => void;
  setSearchHistory: (history: string[]) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;

  updateMasterScore: (totalWords: number) => void;
  updateLearningStreak: (streak: number) => void;
  setDifficulty: (difficulty: DifficultyFilter) => void;
  setCategory: (category: string | null) => void;
  setTag: (tag: string | null) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  results: [],
  savedWords: [],
  searchHistory: [],

  masterScore: 0,
  learningStreak: 0,
  mostSearchedWords: [],
  mostSavedWords: [],
  currentDifficulty: 'all',
  currentCategory: null,
  currentTag: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setResults: (results) => set({ results }),
  setSavedWords: (words) => set({ savedWords: words }),
  setSearchHistory: (history) => set({ searchHistory: history }),
  addToHistory: (query) =>
    set((state) => {
      const trimmed = query.trim();
      if (!trimmed) {
        return state;
      }
      const deduped = [trimmed, ...state.searchHistory.filter((item) => item !== trimmed)];
      return { searchHistory: deduped.slice(0, 10) };
    }),
  clearHistory: () => set({ searchHistory: [] }),

  updateMasterScore: (totalWords) =>
    set((state) => ({
      masterScore: totalWords > 0 ? Math.round((state.savedWords.length / totalWords) * 100) : 0,
    })),
  updateLearningStreak: (streak) => set({ learningStreak: streak }),
  setDifficulty: (difficulty) => set({ currentDifficulty: difficulty }),
  setCategory: (category) => set({ currentCategory: category }),
  setTag: (tag) => set({ currentTag: tag }),
}));