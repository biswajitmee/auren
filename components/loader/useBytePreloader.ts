"use client";

import { useEffect, useMemo, useState } from "react";

type PreloadState = {
  loadedBytes: number;
  totalBytes: number;
  progress: number;
  currentAsset: string;
  isDone: boolean;
  skippedAssets: string[];
};

type AssetMeta = {
  url: string;
  totalBytes: number;
};

const initialState: PreloadState = {
  loadedBytes: 0,
  totalBytes: 0,
  progress: 0,
  currentAsset: "Preparing assets",
  isDone: false,
  skippedAssets: []
};

function uniqueAssets(assets: string[]) {
  return Array.from(new Set(assets.filter(Boolean)));
}

function withTimeout(timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => window.clearTimeout(timeout)
  };
}

async function getAssetMeta(url: string): Promise<AssetMeta> {
  const timeout = withTimeout(8000);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "force-cache",
      signal: timeout.signal
    });

    if (!response.ok) {
      return { url, totalBytes: 0 };
    }

    const length = Number(response.headers.get("content-length") ?? 0);

    return { url, totalBytes: Number.isFinite(length) ? length : 0 };
  } catch {
    return { url, totalBytes: 0 };
  } finally {
    timeout.clear();
  }
}

export function useBytePreloader(assets: string[]) {
  const assetList = useMemo(() => uniqueAssets(assets), [assets]);
  const [state, setState] = useState<PreloadState>(initialState);

  useEffect(() => {
    let cancelled = false;

    async function preload() {
      if (assetList.length === 0) {
        setState({ ...initialState, progress: 1, isDone: true });
        return;
      }

      setState({
        ...initialState,
        totalBytes: assetList.length,
        currentAsset: "Reading asset manifest"
      });

      const meta = await Promise.all(assetList.map((asset) => getAssetMeta(asset)));

      if (cancelled) {
        return;
      }

      const knownAssets = meta.filter((asset) => asset.totalBytes > 0);
      const unknownAssets = meta.filter((asset) => asset.totalBytes === 0);
      const knownTotal = knownAssets.reduce((sum, asset) => sum + asset.totalBytes, 0);
      const totalSlots = meta.length;
      const knownWeight = knownAssets.length / totalSlots;
      const unknownWeight = unknownAssets.length / totalSlots;

      let loadedKnownBytes = 0;
      let completedUnknownAssets = 0;
      let completedAssets = 0;
      const skippedAssets: string[] = [];

      const updateProgress = (currentAsset: string) => {
        const knownProgress = knownTotal > 0 ? loadedKnownBytes / knownTotal : 0;
        const unknownProgress =
          unknownAssets.length > 0 ? completedUnknownAssets / unknownAssets.length : 0;
        const progress =
          knownAssets.length === 0
            ? completedAssets / totalSlots
            : knownProgress * knownWeight + unknownProgress * unknownWeight;

        setState({
          loadedBytes: knownTotal > 0 ? Math.min(loadedKnownBytes, knownTotal) : completedAssets,
          totalBytes: knownTotal > 0 ? knownTotal : totalSlots,
          progress: Math.max(0, Math.min(1, progress)),
          currentAsset,
          isDone: false,
          skippedAssets: [...skippedAssets]
        });
      };

      for (const asset of meta) {
        if (cancelled) {
          return;
        }

        updateProgress(asset.url);

        const timeout = withTimeout(18000);

        try {
          const response = await fetch(asset.url, {
            cache: "force-cache",
            signal: timeout.signal
          });

          if (!response.ok) {
            throw new Error(`Skipped ${asset.url}`);
          }

          if (response.body && asset.totalBytes > 0) {
            const reader = response.body.getReader();

            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                break;
              }

              loadedKnownBytes += value.byteLength;
              updateProgress(asset.url);
            }
          } else {
            await response.arrayBuffer();
            completedUnknownAssets += 1;
          }
        } catch {
          skippedAssets.push(asset.url);

          if (asset.totalBytes > 0) {
            loadedKnownBytes += asset.totalBytes;
          } else {
            completedUnknownAssets += 1;
          }
        } finally {
          timeout.clear();
          completedAssets += 1;
          updateProgress(asset.url);
        }
      }

      if (!cancelled) {
        setState({
          loadedBytes: knownTotal > 0 ? knownTotal : totalSlots,
          totalBytes: knownTotal > 0 ? knownTotal : totalSlots,
          progress: 1,
          currentAsset: "Experience ready",
          isDone: true,
          skippedAssets
        });
      }
    }

    preload();

    return () => {
      cancelled = true;
    };
  }, [assetList]);

  return state;
}
