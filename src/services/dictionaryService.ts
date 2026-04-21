import { Word } from '../types/index';
import { Trie } from '../algorithms/trie';
import { fuzzySearch as fuzzySearchLevenshtein } from '../algorithms/levenshtein';
import wordData from '../../data/words.json';

let trie: Trie | null = null;
let wordList: Word[] = [];
let wordMap: Map<string, Word> = new Map();

export async function initDictionary(): Promise<void> {
  try {
    wordList = (wordData as Word[]).sort((a, b) =>
      a.word.localeCompare(b.word)
    );

    trie = new Trie();
    for (const word of wordList) {
      trie.insert(word.word);
      wordMap.set(word.id, word);
    }

    console.log(`✓ Dictionary initialized: ${wordList.length} words`);
  } catch (error) {
    console.error('✗ Dictionary init failed:', error);
    throw error;
  }
}

export function getAllWords(): Word[] {
  return wordList;
}

export function searchByTrie(prefix: string): Word[] {
  if (!trie || !prefix) return [];
  const matches = trie.startsWith(prefix);
  return matches
    .map((word) => wordList.find((w) => w.word === word)!)
    .filter(Boolean);
}

export function searchByLevenshtein(query: string, threshold: number = 2): Word[] {
  if (!trie) return [];
  const matches = fuzzySearchLevenshtein(
    query,
    wordList.map((w) => w.word),
    threshold
  );
  return matches
    .map((match) => wordList.find((w) => w.word === match.word)!)
    .filter(Boolean);
}

export function getWordById(id: string): Word | undefined {
  return wordMap.get(id);
}