import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  collectedCoins: [], // array of collected coin indices
  addScore: (points) => set((state) => ({ score: state.score + points })),
  collectCoin: (coinIndex) => set((state) => ({
    collectedCoins: [...state.collectedCoins, coinIndex],
  })),
})); 