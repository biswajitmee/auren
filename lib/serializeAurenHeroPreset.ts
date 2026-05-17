import type { AurenHeroPreset } from "@/lib/auren-hero-preset";

export function serializeAurenHeroPreset(preset: AurenHeroPreset) {
  const serialized = JSON.stringify(preset, null, 2)
    .replace(/"([A-Za-z_$][\w$]*)":/g, "$1:")
    .replace(
      /(performanceMode: )"([^"]+)"/,
      '$1"$2" as "high" | "medium" | "low"'
    );

  return `export const aurenHeroPreset = ${serialized};\n\nexport type AurenHeroPreset = typeof aurenHeroPreset;\n`;
}
