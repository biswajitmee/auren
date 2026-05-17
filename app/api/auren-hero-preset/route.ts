import { writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import type { AurenHeroPreset } from "@/lib/auren-hero-preset";
import { serializeAurenHeroPreset } from "@/lib/serializeAurenHeroPreset";

const REQUIRED_SECTIONS = [
  "environment",
  "bottle",
  "spotlight",
  "rim",
  "beam",
  "particles",
  "goldHelix",
  "smoke",
  "floor",
  "postfx",
  "debug"
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAurenHeroPreset(value: unknown): value is AurenHeroPreset {
  return (
    isObject(value) &&
    typeof value.enableLevaOverrides === "boolean" &&
    REQUIRED_SECTIONS.every((section) => isObject(value[section]))
  );
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Auren hero preset can only be written in development." },
      { status: 403 }
    );
  }

  const preset = await request.json();

  if (!isAurenHeroPreset(preset)) {
    return NextResponse.json(
      { error: "Invalid Auren hero preset payload." },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), "lib", "auren-hero-preset.ts");
  await writeFile(filePath, serializeAurenHeroPreset(preset), "utf8");

  return NextResponse.json({ ok: true });
}
