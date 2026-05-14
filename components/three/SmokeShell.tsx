"use client";

import { FragranceSmokeRibbons } from "@/components/three/FragranceSmokeRibbons";
import { PerformanceTier } from "@/lib/detectPerformanceTier";

type SmokeShellProps = {
  tier: PerformanceTier;
};

export function SmokeShell({ tier }: SmokeShellProps) {
  return <FragranceSmokeRibbons tier={tier} />;
}
