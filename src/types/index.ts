export interface Word {
  id: string;
  word: string;
  definition: string;
  example?: string;
  partOfSpeech: string;
  pronunciation?: string;
}

export interface SearchResult extends Word {
  distance?: number;
}

export interface StorageData {
  savedWords: Word[];
  searchHistory: string[];
}