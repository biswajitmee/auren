"use client";

import { getProject } from "@theatre/core";
import type { IProjectConfig } from "@theatre/core";

import theatreState from "@/lib/theatre-state.json";

export const THEATRE_PROJECT_ID = "AUREN_NOIR";
export const THEATRE_SHEET_ID = "Main Scene";
export const THEATRE_SCROLL_SEQUENCE_LENGTH = 10;
export const THEATRE_STUDIO_PERSISTENCE_KEY = "auren-noir:theatre-studio:v1";

const hasSavedState = Object.keys(theatreState as Record<string, unknown>).length > 0;

export const theatreProject = getProject(
  THEATRE_PROJECT_ID,
  hasSavedState
    ? {
        state: theatreState as IProjectConfig["state"]
      }
    : undefined
);

export const mainSheet = theatreProject.sheet(THEATRE_SHEET_ID);
