"use client";

import { create } from "zustand";

type DesireGallerySceneState = {
  progress: number;
  sceneReduced: boolean;
  visible: boolean;
  setProgress: (progress: number) => void;
  setSceneReduced: (sceneReduced: boolean) => void;
  setVisible: (visible: boolean) => void;
  reset: () => void;
};

export const useDesireGalleryScene = create<DesireGallerySceneState>((set) => ({
  progress: 0,
  sceneReduced: false,
  visible: false,
  setProgress: (progress) =>
    set((state) => {
      const nextProgress = Math.max(0, Math.min(1, progress));

      if (Math.abs(state.progress - nextProgress) < 0.0005) {
        return state;
      }

      return { progress: nextProgress };
    }),
  setSceneReduced: (sceneReduced) =>
    set((state) => {
      if (state.sceneReduced === sceneReduced) {
        return state;
      }

      return { sceneReduced };
    }),
  setVisible: (visible) =>
    set((state) => {
      if (state.visible === visible) {
        return state;
      }

      return { visible };
    }),
  reset: () =>
    set((state) => {
      if (state.progress === 0 && !state.sceneReduced && !state.visible) {
        return state;
      }

      return { progress: 0, sceneReduced: false, visible: false };
    })
}));
