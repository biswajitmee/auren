"use client";

import { create } from "zustand";

import { aurenHeroPreset, AurenHeroPreset } from "@/lib/auren-hero-preset";

type AurenSceneStore = AurenHeroPreset & {
  setControls: (controls: AurenHeroPreset) => void;
  resetControls: () => void;
};

export const useAurenSceneStore = create<AurenSceneStore>((set) => ({
  ...aurenHeroPreset,
  setControls: (controls) =>
    set(() => ({
      ...controls
    })),
  resetControls: () =>
    set(() => ({
      ...aurenHeroPreset
    }))
}));

export function getAurenSceneSnapshot(): AurenHeroPreset {
  const { setControls, resetControls, ...snapshot } = useAurenSceneStore.getState();
  void setControls;
  void resetControls;
  return snapshot;
}
