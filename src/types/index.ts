export interface Word {
  id: string;
  word: string;
  definition: string;
  example?: string;
  partOfSpeech: string;
  pronunciation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  tags?: string[];
  relatedWords?: string[];
  etymology?: string;
}

export interface SearchResult extends Word {
  distance?: number;
}