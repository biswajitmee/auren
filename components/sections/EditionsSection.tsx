"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { productEditions } from "@/lib/auren-data";

export function EditionsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-edition-card]", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      className="min-h-screen"
      eyebrow="Editions"
      id="editions"
      index="07"
      ref={sectionRef}
    >
      <SectionTitle
        copy="Three calibrated concentrations, each composed for a different hour of darkness."
        eyebrow="07 / Product Editions"
        title="Product editions."
      />
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {productEditions.map((edition) => (
          <div data-edition-card key={edition.name}>
            <ProductCard {...edition} />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
