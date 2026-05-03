"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "medium" | "low";

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") {
    return "medium";
  }

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const narrowScreen = window.innerWidth < 768;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || narrowScreen || memory <= 3 || cores <= 4) {
    return "low";
  }

  if (memory <= 6 || cores <= 6 || window.innerWidth < 1200) {
    return "medium";
  }

  return "high";
}

export function usePerformanceTier() {
  const [tier, setTier] = useState<PerformanceTier>("medium");

  useEffect(() => {
    const update = () => setTier(detectPerformanceTier());

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}
