import { useEffect, useMemo } from 'react';
import { useSearchStore } from '../store/searchStore';
import { getAllWords } from '../services/dictionaryService';

export function useTrending() {
  const savedWords = useSearchStore((state) => state.savedWords);
  const searchHistory = useSearchStore((state) => state.searchHistory);
  const updateMasterScore = useSearchStore((state) => state.updateMasterScore);

  const totalWords = getAllWords().length;

  useEffect(() => {
    updateMasterScore(totalWords);
  }, [updateMasterScore, totalWords, savedWords.length]);

  const stats = useMemo(() => {
    const masterScore = totalWords > 0 ? Math.round((savedWords.length / totalWords) * 100) : 0;
    const uniqueSearches = new Set(searchHistory).size;

    return {
      totalWords,
      savedCount: savedWords.length,
      searchedCount: uniqueSearches,
      masterScore,
      learningStreak: 1, // placeholder
    };
  }, [savedWords.length, searchHistory, totalWords]);

  const mostSearched = useMemo(() => {
    const counts: Record<string, number> = {};
    searchHistory.forEach((search) => {
      counts[search] = (counts[search] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);
  }, [searchHistory]);

  const mostSaved = useMemo(() => {
    return savedWords.slice(0, 5).map((w) => w.word);
  }, [savedWords]);

  return { stats, mostSearched, mostSaved };
}

