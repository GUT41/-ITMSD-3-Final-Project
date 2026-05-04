import { useEffect, useState } from 'react';
import { getAllWords, getWordOfTheDay, initDictionary } from '../services/dictionaryService';
import { Word } from '../types/index';

export function useWordOfDay() {
  const [word, setWord] = useState<Word | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (getAllWords().length === 0) {
          await initDictionary();
        }
        const w = getWordOfTheDay();
        if (!cancelled) setWord(w);
      } catch {
        if (!cancelled) setWord(null);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { word };
}

