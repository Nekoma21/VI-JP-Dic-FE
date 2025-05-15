// types/deck.ts

export interface Card {
  _id: string;
  word: string;
  sentence: string;
  reading: string;
  meaning: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  last_review: string | null; // có thể null
  deckId: string;
  createdBy: string;
  due: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CardE {
  word: string;
  sentence: string;
  reading: string;
  meaning: string;
}

export interface Deck {
  id: string;
  name: string;
  new: number;
  learn: number;
  due: number;
  total: number;
  cards: Card[];
}
