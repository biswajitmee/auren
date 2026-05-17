"use client";

import { create } from "zustand";

type DesireGallerySceneState = {
  detailCardIndex: number | null;
  progress: number;
  sceneReduced: boolean;
  visible: boolean;
  closeDetail: () => void;
  openDetail: (cardIndex: number) => void;
  setProgress: (progress: number) => void;
  setSceneReduced: (sceneReduced: boolean) => void;
  setVisible: (visible: boolean) => void;
  reset: () => void;
};

export const useDesireGalleryScene = create<DesireGallerySceneState>((set) => ({
  detailCardIndex: null,
  progress: 0,
  sceneReduced: false,
  visible: false,
  closeDetail: () =>
    set((state) => {
      if (state.detailCardIndex === null) {
        return state;
      }

      return { detailCardIndex: null };
    }),
  openDetail: (cardIndex) =>
    set((state) => {
      if (state.detailCardIndex === cardIndex) {
        return state;
      }

      return { detailCardIndex: cardIndex };
    }),
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

      return { detailCardIndex: visible ? state.detailCardIndex : null, visible };
    }),
  reset: () =>
    set((state) => {
      if (
        state.detailCardIndex === null &&
        state.progress === 0 &&
        !state.sceneReduced &&
        !state.visible
      ) {
        return state;
      }

      return { detailCardIndex: null, progress: 0, sceneReduced: false, visible: false };
    })
}));
