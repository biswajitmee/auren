"use client";

import { create } from "zustand";

type ScrollProgressState = {
  progress: number;
  setProgress: (progress: number) => void;
};

export const useScrollProgress = create<ScrollProgressState>((set) => ({
  progress: 0,
  setProgress: (progress) =>
    set((state) => {
      const nextProgress = Math.max(0, Math.min(1, progress));

      if (Math.abs(state.progress - nextProgress) < 0.0005) {
        return state;
      }

      return { progress: nextProgress };
    })
}));
