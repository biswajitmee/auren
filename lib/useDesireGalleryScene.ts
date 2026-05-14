"use client";

import { create } from "zustand";

type DesireGallerySceneState = {
  progress: number;
  visible: boolean;
  setProgress: (progress: number) => void;
  setVisible: (visible: boolean) => void;
  reset: () => void;
};

export const useDesireGalleryScene = create<DesireGallerySceneState>((set) => ({
  progress: 0,
  visible: false,
  setProgress: (progress) =>
    set({
      progress: Math.max(0, Math.min(1, progress))
    }),
  setVisible: (visible) => set({ visible }),
  reset: () => set({ progress: 0, visible: false })
}));
