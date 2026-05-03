import { ReactNode } from "react";

import { MicroLabel } from "@/components/ui/MicroLabel";
import { cn } from "@/lib/cn";

type SectionTitleProps = {
  eyebrow: string;
  title: ReactNode;
  copy?: ReactNode;
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  copy,
  align = "left"
}: SectionTitleProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <MicroLabel>{eyebrow}</MicroLabel>
      <h2 className="mt-4 font-display text-5xl font-medium leading-[0.95] text-ivory sm:text-6xl lg:text-7xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-6 max-w-2xl text-base leading-7 text-ivory/62 sm:text-lg">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
