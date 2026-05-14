"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ReactNode, useEffect } from "react";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScrollProgress } from "@/lib/useScrollProgress";

type SmoothScrollProviderProps = {
  children: ReactNode;
  enabled?: boolean;
};

function isGalleryInWheelRange() {
  const gallery = document.getElementById("campaign-gallery");

  if (!gallery) {
    return false;
  }

  const rect = gallery.getBoundingClientRect();

  return rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5;
}

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

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    let refreshFrame: number | undefined;
    let isAnimatingScroll = false;
    let smoothTarget = window.scrollY;

    const progressTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress)
    });

    const refresh = () => {
      if (refreshFrame !== undefined) {
        cancelAnimationFrame(refreshFrame);
      }

      refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        refreshFrame = undefined;
      });
    };

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const syncTarget = () => {
      if (!isAnimatingScroll) {
        smoothTarget = window.scrollY;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        reducedMotion ||
        event.ctrlKey ||
        event.defaultPrevented ||
        isGalleryInWheelRange()
      ) {
        return;
      }

      event.preventDefault();

      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      smoothTarget = Math.max(0, Math.min(getMaxScroll(), smoothTarget + delta * 0.82));
      isAnimatingScroll = true;

      gsap.to(window, {
        duration: 0.56,
        ease: "power3.out",
        overwrite: "auto",
        scrollTo: { y: smoothTarget, autoKill: false },
        onComplete: () => {
          isAnimatingScroll = false;
          smoothTarget = window.scrollY;
        },
        onInterrupt: () => {
          isAnimatingScroll = false;
          smoothTarget = window.scrollY;
        },
        onUpdate: ScrollTrigger.update
      });
    };

    const initialRefresh = window.setTimeout(refresh, 120);

    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    refresh();

    return () => {
      window.clearTimeout(initialRefresh);
      if (refreshFrame !== undefined) {
        cancelAnimationFrame(refreshFrame);
      }

      progressTrigger.kill();
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", syncTarget);
      window.removeEventListener("wheel", handleWheel);
      gsap.killTweensOf(window);
    };
  }, [enabled, reducedMotion, setProgress]);

  return <>{children}</>;
}
