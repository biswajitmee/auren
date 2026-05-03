"use client";

import { create } from "zustand";

type ScrollProgressState = {
  progress: number;
  setProgress: (progress: number) => void;
};

export const useScrollProgress = create<ScrollProgressState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress })
}));
