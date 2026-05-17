"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ReactNode, useEffect } from "react";

import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
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

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    let refreshFrame: number | undefined;
    let scrollTween: ReturnType<typeof gsap.to> | null = null;
    let lastWheelDirection = 0;
    let smoothTarget = window.scrollY;
    const wheelListenerOptions: AddEventListenerOptions = {
      capture: true,
      passive: false
    };
    const scrollLockListenerOptions: AddEventListenerOptions = {
      capture: true,
      passive: false
    };

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
      if (!scrollTween) {
        smoothTarget = window.scrollY;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (useDesireGalleryScene.getState().detailCardIndex !== null) {
        event.preventDefault();
        event.stopPropagation();
        scrollTween?.kill();
        scrollTween = null;
        smoothTarget = window.scrollY;
        lastWheelDirection = 0;
        return;
      }

      if (reducedMotion || event.ctrlKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const wheelDirection = Math.sign(delta);

      if (
        scrollTween &&
        wheelDirection !== 0 &&
        lastWheelDirection !== 0 &&
        wheelDirection !== lastWheelDirection
      ) {
        smoothTarget = window.scrollY;
      }

      smoothTarget = Math.max(0, Math.min(getMaxScroll(), smoothTarget + delta * 0.82));
      lastWheelDirection = wheelDirection;

      scrollTween?.kill();
      scrollTween = gsap.to(window, {
        duration: 0.56,
        ease: "power3.out",
        overwrite: true,
        scrollTo: { y: smoothTarget, autoKill: false },
        onComplete: () => {
          scrollTween = null;
          lastWheelDirection = 0;
          smoothTarget = window.scrollY;
        },
        onUpdate: ScrollTrigger.update
      });
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (useDesireGalleryScene.getState().detailCardIndex !== null) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const initialRefresh = window.setTimeout(refresh, 120);

    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("wheel", handleWheel, wheelListenerOptions);
    window.addEventListener("touchmove", handleTouchMove, scrollLockListenerOptions);
    refresh();

    return () => {
      window.clearTimeout(initialRefresh);
      if (refreshFrame !== undefined) {
        cancelAnimationFrame(refreshFrame);
      }

      progressTrigger.kill();
      scrollTween?.kill();
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", syncTarget);
      window.removeEventListener("wheel", handleWheel, wheelListenerOptions);
      window.removeEventListener("touchmove", handleTouchMove, scrollLockListenerOptions);
      gsap.killTweensOf(window);
    };
  }, [enabled, reducedMotion, setProgress]);

  return <>{children}</>;
}
