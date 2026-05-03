"use client";

import r3fExtension from "@theatre/r3f/dist/extension";
import studio from "@theatre/studio";
import type { IExtension, ToolsetConfig } from "@theatre/studio";

import {
  THEATRE_PROJECT_ID,
  THEATRE_STUDIO_PERSISTENCE_KEY
} from "@/lib/theatre";

const globalForTheatre = globalThis as typeof globalThis & {
  __aurenTheatreStudioInitialized?: boolean;
  __AUREN_THEATRE__?: {
    saveState: () => Promise<Record<string, unknown>>;
    getState: () => Record<string, unknown>;
  };
};

async function saveTheatreStateToDisk() {
  const state = studio.createContentOfSaveFile(THEATRE_PROJECT_ID);
  const response = await fetch("/api/theatre-state", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(state)
  });

  if (!response.ok) {
    throw new Error(`Unable to save Theatre state (${response.status})`);
  }

  return state;
}

const aurenSaveExtension: IExtension = {
  id: "auren-theatre-state-tools",
  toolbars: {
    global: (set) => {
      const toolset: ToolsetConfig = [
        {
          type: "Flyout",
          label: "Auren",
          items: [
            {
              label: "Save theatre-state.json",
              onClick: () => {
                void saveTheatreStateToDisk()
                  .then(() => {
                    console.info("Saved Theatre state to lib/theatre-state.json");
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }
          ]
        }
      ];

      set(toolset);

      return () => set([]);
    }
  }
};

export function initializeTheatreStudio() {
  if (
    globalForTheatre.__aurenTheatreStudioInitialized ||
    typeof window === "undefined" ||
    process.env.NODE_ENV !== "development"
  ) {
    return;
  }

  studio.extend(r3fExtension);
  studio.extend(aurenSaveExtension, { __experimental_reconfigure: true });
  studio.initialize({
    persistenceKey: THEATRE_STUDIO_PERSISTENCE_KEY,
    usePersistentStorage: true
  });

  globalForTheatre.__AUREN_THEATRE__ = {
    saveState: saveTheatreStateToDisk,
    getState: () => studio.createContentOfSaveFile(THEATRE_PROJECT_ID)
  };

  globalForTheatre.__aurenTheatreStudioInitialized = true;
}
