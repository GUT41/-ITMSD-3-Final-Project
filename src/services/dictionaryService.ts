import { Word } from '../types/index';
import { Trie } from '../algorithms/trie';
import { fuzzySearch as fuzzySearchLevenshtein } from '../algorithms/levenshtein';

const WORDS: Word[] = [
  {"id":"apple-0","word":"apple","definition":"a round fruit","example":"She ate an apple.","partOfSpeech":"noun","pronunciation":"AP-ul"},
  {"id":"abandon-1","word":"abandon","definition":"to leave permanently","example":"They abandoned the house.","partOfSpeech":"verb","pronunciation":"uh-BAN-dun"},
  {"id":"ability-2","word":"ability","definition":"the skill or power","example":"She has the ability to speak.","partOfSpeech":"noun","pronunciation":"uh-BIL-uh-tee"},
  {"id":"about-3","word":"about","definition":"concerning or regarding","example":"We talked about the weather.","partOfSpeech":"preposition","pronunciation":"uh-BOWT"},
  {"id":"above-4","word":"above","definition":"at a higher level","example":"The plane flew above clouds.","partOfSpeech":"preposition","pronunciation":"uh-BUV"},
  {"id":"abroad-5","word":"abroad","definition":"in a foreign country","example":"She traveled abroad.","partOfSpeech":"adverb","pronunciation":"uh-BRAWD"},
  {"id":"absence-6","word":"absence","definition":"state of being away","example":"His absence was noticed.","partOfSpeech":"noun","pronunciation":"AB-sens"},
  {"id":"absolute-7","word":"absolute","definition":"complete or total","example":"We need absolute silence.","partOfSpeech":"adjective","pronunciation":"AB-suh-loot"},
  {"id":"absorb-8","word":"absorb","definition":"to take in or soak up","example":"Paper absorbed water.","partOfSpeech":"verb","pronunciation":"ub-ZORB"},
  {"id":"abstract-9","word":"abstract","definition":"existing in thought only","example":"Love is abstract.","partOfSpeech":"adjective","pronunciation":"AB-strakt"}
];

interface DictionaryState {
  trie: Trie | null;
  wordList: Word[];
  wordMap: Map<string, Word>;
  isInitialized: boolean;
}

const state: DictionaryState = {
  trie: null,
  wordList: [],
  wordMap: new Map(),
  isInitialized: false,
};

function sanitizeQueryInput(value: string): string {
  return value.trim().toLowerCase();
}

export async function initDictionary(): Promise<void> {
  try {
    state.isInitialized = false;
    state.wordMap.clear();
    state.wordList = [...WORDS].sort((a, b) => a.word.localeCompare(b.word));

    state.trie = new Trie();
    for (const word of state.wordList) {
      state.trie.insert(word.word);
      state.wordMap.set(word.id, word);
    }

    state.isInitialized = true;
    console.log(`✓ Dictionary initialized: ${state.wordList.length} words`);
  } catch (error) {
    state.isInitialized = false;
    console.error('✗ Dictionary init failed:', error);
    throw error;
  }
}

export function isDictionaryReady(): boolean {
  return state.isInitialized;
}

export function getAllWords(): Word[] {
  return state.wordList;
}

export function searchByTrie(prefix: string): Word[] {
  const sanitizedPrefix = sanitizeQueryInput(prefix);
  if (!state.trie || !sanitizedPrefix) return [];
  const matches = state.trie.startsWith(sanitizedPrefix);
  return matches
    .map((word) => state.wordList.find((w) => w.word === word)!)
    .filter(Boolean);
}

export function searchByLevenshtein(query: string, threshold: number = 2): Word[] {
  const sanitizedQuery = sanitizeQueryInput(query);
  if (!state.trie || !sanitizedQuery) return [];
  const matches = fuzzySearchLevenshtein(
    sanitizedQuery,
    state.wordList.map((w) => w.word),
    threshold
  );
  return matches
    .map((match) => state.wordList.find((w) => w.word === match.word)!)
    .filter(Boolean);
}

export function getWordById(id: string): Word | undefined {
  return state.wordMap.get(id);
}