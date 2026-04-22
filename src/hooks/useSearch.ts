import { useCallback, useRef } from 'react';
import { searchByTrie, searchByLevenshtein } from '../services/dictionaryService';
import { useSearchStore } from '../store/searchStore';

export function useSearch() {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setResults = useSearchStore((state) => state.setResults);

  const search = useCallback((query: string) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      setResults([]);
      return;
    }

    // Try Trie search first (exact prefix match)
    const trieResults = searchByTrie(normalizedQuery);
    
    if (trieResults.length > 0) {
      setResults(trieResults);
      return;
    }

    // Fall back to Levenshtein (fuzzy match)
    const fuzzyResults = searchByLevenshtein(normalizedQuery, 2);
    setResults(fuzzyResults.slice(0, 10)); // Limit to 10 results
  }, [setResults]);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      search(query);
    }, 300); // 300ms debounce
  }, [search]);

  return { search, debouncedSearch };
}