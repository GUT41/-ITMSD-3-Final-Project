import { Word } from '../types/index';
import { Trie } from '../algorithms/trie';
import { fuzzySearch as fuzzySearchLevenshtein } from '../algorithms/levenshtein';
import wordData from '../../data/words.json';

let trie: Trie | null = null;
let wordList: Word[] = [];
let wordMap: Map<string, Word> = new Map();
let isInitialized = false;

export async function initDictionary(): Promise<void> {
  try {
    isInitialized = false;
    wordMap.clear();
    wordList = (wordData as Word[])
      .map((w) => ({ ...w, word: w.word.toLowerCase() }))
      .sort((a, b) => a.word.localeCompare(b.word));

    trie = new Trie();
    for (const word of wordList) {
      trie.insert(word.word);
      wordMap.set(word.id, word);
    }

    isInitialized = true;
    console.log(`✓ Dictionary initialized: ${wordList.length} words`);
  } catch (error) {
    isInitialized = false;
    console.error('✗ Dictionary init failed:', error);
    throw error;
  }
}

export function isDictionaryReady(): boolean {
  return isInitialized;
}

export function getAllWords(): Word[] {
  return wordList;
}

export function searchByTrie(prefix: string): Word[] {
  if (!trie || !prefix) return [];
  const normalized = prefix.trim().toLowerCase();
  if (!normalized) return [];
  const matches = trie.startsWith(normalized);
  return matches
    .map((word) => wordList.find((w) => w.word === word)!)
    .filter(Boolean);
}

export function searchByLevenshtein(query: string, threshold: number = 2): Word[] {
  if (!trie) return [];
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const matches = fuzzySearchLevenshtein(
    normalized,
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

export function getWordsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Word[] {
  return wordList.filter((w) => w.difficulty === difficulty);
}

export function getWordsByCategory(category: string): Word[] {
  return wordList.filter((w) => (w.category ?? '').toLowerCase() === category.toLowerCase());
}

export function getWordsByTag(tag: string): Word[] {
  const normalized = tag.toLowerCase();
  return wordList.filter((w) => (w.tags ?? []).some((t) => t.toLowerCase() === normalized));
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const w of wordList) {
    if (w.category) categories.add(w.category);
  }
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const w of wordList) {
    for (const t of w.tags ?? []) tags.add(t);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export function getRelatedWords(wordId: string): Word[] {
  const word = getWordById(wordId);
  if (!word?.relatedWords?.length) return [];
  return word.relatedWords
    .map((name) => wordList.find((w) => w.word === name.toLowerCase()))
    .filter(Boolean) as Word[];
}

export function getRandomWord(): Word {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

export function getWordOfTheDay(): Word | null {
  if (wordList.length === 0) return null;
  const today = new Date().toDateString();
  const hash = today.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a | 0;
  }, 0);
  return wordList[Math.abs(hash) % wordList.length];
}