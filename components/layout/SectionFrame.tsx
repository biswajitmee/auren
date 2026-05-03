import { forwardRef, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionFrameProps = HTMLAttributes<HTMLElement> & {
  id: string;
  index: string;
  eyebrow: string;
  children: ReactNode;
};

export const SectionFrame = forwardRef<HTMLElement, SectionFrameProps>(
  ({ id, index, eyebrow, children, className, ...props }, ref) => (
    <section
      className={cn("section-shell overflow-hidden", className)}
      data-section={id}
      id={id}
      ref={ref}
      {...props}
    >
      <div className="pointer-events-none absolute left-5 top-24 z-10 hidden items-center gap-3 text-[0.66rem] uppercase text-gold/65 md:flex">
        <span>{index}</span>
        <span className="h-px w-12 bg-gold/30" />
        <span>{eyebrow}</span>
      </div>
      {children}
    </section>
  )
);

SectionFrame.displayName = "SectionFrame";
