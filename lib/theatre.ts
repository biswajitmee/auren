"use client";

import { getProject } from "@theatre/core";
import type { IProjectConfig } from "@theatre/core";

import theatreState from "@/lib/theatre-state.json";

const hasSavedState = Object.keys(theatreState as Record<string, unknown>).length > 0;

export const theatreProject = getProject(
  "AUREN_NOIR",
  hasSavedState
    ? {
        // Replace lib/theatre-state.json with a Studio export to restore tuned values.
        state: theatreState as IProjectConfig["state"]
      }
    : undefined
);

export const mainSheet = theatreProject.sheet("Main Scene");

const globalForTheatre = globalThis as typeof globalThis & {
  __aurenTheatreStudioInitialized?: boolean;
};

export async function initializeTheatreStudio() {
  if (
    globalForTheatre.__aurenTheatreStudioInitialized ||
    typeof window === "undefined" ||
    process.env.NODE_ENV !== "development"
  ) {
    return;
  }

  const [{ default: studio }, { default: r3fExtension }] = await Promise.all([
    import("@theatre/studio"),
    import("@theatre/r3f/dist/extension")
  ]);

  studio.extend(r3fExtension);
  studio.initialize();
  globalForTheatre.__aurenTheatreStudioInitialized = true;
}
