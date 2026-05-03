"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { useScrollProgress } from "@/lib/useScrollProgress";

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const progress = useScrollProgress((state) => state.progress);

  useEffect(() => {
    const canHover = window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768;
    setEnabled(canHover);

    if (!canHover || !outerRef.current || !innerRef.current) {
      return;
    }

    gsap.set([outerRef.current, innerRef.current], { opacity: 0 });

    const moveOuterX = gsap.quickTo(outerRef.current, "x", {
      duration: 0.45,
      ease: "power3.out"
    });
    const moveOuterY = gsap.quickTo(outerRef.current, "y", {
      duration: 0.45,
      ease: "power3.out"
    });
    const moveInnerX = gsap.quickTo(innerRef.current, "x", {
      duration: 0.12,
      ease: "power3.out"
    });
    const moveInnerY = gsap.quickTo(innerRef.current, "y", {
      duration: 0.12,
      ease: "power3.out"
    });
    const fadeIn = gsap.quickTo([outerRef.current, innerRef.current], "opacity", {
      duration: 0.25,
      ease: "power2.out"
    });

    const onMove = (event: PointerEvent) => {
      fadeIn(1);
      moveOuterX(event.clientX - 18);
      moveOuterY(event.clientY - 18);
      moveInnerX(event.clientX - 3);
      moveInnerY(event.clientY - 3);
    };

    window.addEventListener("pointermove", onMove);

    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 rounded-full border border-gold/50 opacity-0 mix-blend-difference"
        ref={outerRef}
        style={{ display: progress < 0.055 ? "none" : undefined }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[71] h-1.5 w-1.5 rounded-full bg-gold opacity-0"
        ref={innerRef}
        style={{ display: progress < 0.055 ? "none" : undefined }}
      />
    </>
  );
}
