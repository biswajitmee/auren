import { writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const THEATRE_STATE_VERSION = "0.4.0";

function isTheatreState(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).definitionVersion === THEATRE_STATE_VERSION &&
    typeof (value as Record<string, unknown>).sheetsById === "object"
  );
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Theatre state can only be written in development." },
      { status: 403 }
    );
  }

  const state = await request.json();

  if (!isTheatreState(state)) {
    return NextResponse.json(
      { error: "Invalid Theatre state payload." },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), "lib", "theatre-state.json");
  await writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");

  return NextResponse.json({ ok: true });
}
