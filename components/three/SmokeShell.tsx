"use client";

import { FragranceSmokeRibbons } from "@/components/three/FragranceSmokeRibbons";
import { PerformanceTier } from "@/lib/detectPerformanceTier";

type SmokeShellProps = {
  active?: boolean;
  tier: PerformanceTier;
};

export function SmokeShell({ active = true, tier }: SmokeShellProps) {
  return <FragranceSmokeRibbons active={active} tier={tier} />;
}
