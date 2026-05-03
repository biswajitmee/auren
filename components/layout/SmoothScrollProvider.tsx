"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ReactNode, useEffect } from "react";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScrollProgress } from "@/lib/useScrollProgress";

type SmoothScrollProviderProps = {
  children: ReactNode;
  enabled?: boolean;
};

export function SmoothScrollProvider({
  children,
  enabled = true
}: SmoothScrollProviderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const setProgress = useScrollProgress((state) => state.setProgress);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | undefined;
    let ticker: ((time: number) => void) | undefined;

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: 1.18,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.82,
        touchMultiplier: 1.08
      });

      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const progressTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress)
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    ScrollTrigger.refresh();

    return () => {
      progressTrigger.kill();
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);

      if (ticker) {
        gsap.ticker.remove(ticker);
      }

      lenis?.destroy();
    };
  }, [enabled, reducedMotion, setProgress]);

  return <>{children}</>;
}
