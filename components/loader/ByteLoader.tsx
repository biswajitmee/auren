"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { useBytePreloader } from "@/components/loader/useBytePreloader";
import { aurenAssets } from "@/lib/auren-assets";

type ByteLoaderProps = {
  assets: string[];
  onComplete: () => void;
};

function formatAssetLabel(asset: string) {
  const leaf = asset.split("/").pop() ?? asset;

  try {
    return decodeURIComponent(leaf);
  } catch {
    return leaf;
  }
}

export function ByteLoader({ assets, onComplete }: ByteLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const [dismissed, setDismissed] = useState(false);
  const { progress, currentAsset, loadedBytes, totalBytes, isDone, skippedAssets } =
    useBytePreloader(assets);

  const percentage = Math.round(progress * 100);
  const assetLabel = useMemo(() => formatAssetLabel(currentAsset), [currentAsset]);

  useEffect(() => {
    if (!isDone || dismissed || !rootRef.current) {
      return;
    }

    const finish = () => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;
      setDismissed(true);
      onComplete();
    };

    const fallbackTimer = window.setTimeout(finish, 1900);
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          delay: 0.2,
          onComplete: finish
        })
        .to("[data-loader-mark]", {
          y: -18,
          opacity: 0,
          duration: 0.72,
          ease: "power3.inOut"
        })
        .to(
          "[data-loader-liquid]",
          {
            y: 18,
            opacity: 0,
            duration: 0.7,
            ease: "power3.inOut"
          },
          "<"
        )
        .to(
          rootRef.current,
          {
            opacity: 0,
            duration: 0.72,
            ease: "power2.inOut"
          },
          "-=0.15"
        );
    }, rootRef);

    return () => {
      window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, [dismissed, isDone, onComplete]);

  if (dismissed) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed inset-0 z-[90] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian text-ivory"
      ref={rootRef}
    >
      <Image
        alt=""
        className="absolute inset-0 object-cover opacity-24"
        fill
        priority
        sizes="100vw"
        src={aurenAssets.images.loading}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(139,69,19,.24),transparent_26rem),linear-gradient(180deg,rgba(10,8,6,.72),rgba(10,8,6,.95))]" />

      <div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center"
        data-loader-mark
      >
        <p className="font-display text-5xl uppercase text-gold/88 sm:text-7xl">
          AUREN NOIR
        </p>
        <div className="mt-6 h-px w-48 bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
        <p className="mt-5 font-mono text-[0.66rem] uppercase text-ivory/48">
          Liquid Architecture
        </p>
      </div>

      <div
        className="absolute bottom-10 left-1/2 z-10 w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2"
        data-loader-liquid
      >
        <svg
          aria-hidden
          className="h-20 w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 1000 120"
        >
          <path
            d="M0 76 C150 114 254 34 398 72 C550 112 655 22 804 64 C900 92 944 78 1000 56"
            fill="none"
            pathLength="1"
            stroke="rgba(201,168,76,.24)"
            strokeWidth="2"
          />
          <path
            d="M0 76 C150 114 254 34 398 72 C550 112 655 22 804 64 C900 92 944 78 1000 56"
            fill="none"
            pathLength="1"
            stroke="url(#loaderGold)"
            strokeDasharray={`${progress} 1`}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="loaderGold" x1="0" x2="1" y1="0" y2="0">
              <stop stopColor="#8B4513" />
              <stop offset="0.5" stopColor="#C9A84C" />
              <stop offset="1" stopColor="#F5F0E8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="-mt-2 flex items-end justify-between gap-6 font-mono text-[0.66rem] uppercase text-ivory/50">
          <span className="truncate">{assetLabel}</span>
          <span className="text-gold/85">{percentage}%</span>
        </div>
        <div className="mt-2 flex justify-between font-mono text-[0.6rem] text-ivory/30">
          <span>
            {loadedBytes.toLocaleString()} / {totalBytes.toLocaleString()} bytes
          </span>
          <span>{skippedAssets.length > 0 ? "Skipped optional asset" : "Streaming"}</span>
        </div>
      </div>
    </div>
  );
}
