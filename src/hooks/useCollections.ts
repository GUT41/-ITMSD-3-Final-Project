import { useMemo } from 'react';
import { useSearchStore } from '../store/searchStore';
import { getAllWords } from '../services/dictionaryService';
import { Word } from '../types/index';

export function useCollections() {
  const difficulty = useSearchStore((state) => state.currentDifficulty);
  const category = useSearchStore((state) => state.currentCategory);
  const tag = useSearchStore((state) => state.currentTag);

  const filteredWords = useMemo(() => {
    let words: Word[] = getAllWords();

    if (difficulty && difficulty !== 'all') {
      words = words.filter((w) => w.difficulty === difficulty);
    }

    if (category) {
      const normalized = category.toLowerCase();
      words = words.filter((w) => (w.category ?? '').toLowerCase() === normalized);
    }

    if (tag) {
      const normalized = tag.toLowerCase();
      words = words.filter((w) => (w.tags ?? []).some((t) => t.toLowerCase() === normalized));
    }

    return words;
  }, [difficulty, category, tag]);

  return { filteredWords };
}

