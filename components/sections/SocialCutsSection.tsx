"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { SectionFrame } from "@/components/layout/SectionFrame";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { MicroLabel } from "@/components/ui/MicroLabel";
import { socialBenefits, socialFormats } from "@/lib/auren-data";

export function SocialCutsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-social-item]", {
        y: 42,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 58%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      className="bg-[linear-gradient(90deg,rgba(201,168,76,.06)_1px,transparent_1px),linear-gradient(rgba(201,168,76,.05)_1px,transparent_1px)] bg-[size:5rem_5rem] min-h-screen"
      eyebrow="Social Cuts"
      id="social-cuts"
      index="06"
      ref={sectionRef}
    >
      <div className="gap-10 grid lg:grid-cols-[0.28fr_1fr] mx-auto max-w-7xl">
        <aside className="hidden lg:flex flex-col justify-end gap-5 pl-5 border-gold/18 border-l">
          {socialBenefits.map((benefit) => (
            <p
              className="font-mono text-[0.66rem] text-ivory/46 uppercase leading-5"
              data-social-item
              key={benefit}
            >
              {benefit}
            </p>
          ))}
        </aside>

        <div>
          {/* <div className="mb-9 text-center">
            <MicroLabel>06 / Campaign Deliverables</MicroLabel>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-ivory text-6xl sm:text-7xl leading-[0.88]">
              Built for every screen.
            </h2>
          </div>
          <div className="items-end gap-5 grid md:grid-cols-[0.86fr_1fr_0.9fr]">
            {socialFormats.map((format) => (
              <div data-social-item key={format.title}>
                <DeviceMockup {...format} />
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </SectionFrame>
  );
}
