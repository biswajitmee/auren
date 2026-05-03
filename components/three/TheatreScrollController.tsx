"use client";

import { val } from "@theatre/core";
import { useFrame } from "@react-three/fiber";

import { mainSheet, THEATRE_SCROLL_SEQUENCE_LENGTH } from "@/lib/theatre";
import { useScrollProgress } from "@/lib/useScrollProgress";

type TheatreScrollControllerProps = {
  active?: boolean;
  reducedMotion?: boolean;
};

export function TheatreScrollController({
  active = true,
  reducedMotion = false
}: TheatreScrollControllerProps) {
  const progress = useScrollProgress((state) => state.progress);

  useFrame(() => {
    if (!active) {
      return;
    }

    const savedLength = val(mainSheet.sequence.pointer.length);
    const sequenceLength =
      Number.isFinite(savedLength) && savedLength > 0
        ? savedLength
        : THEATRE_SCROLL_SEQUENCE_LENGTH;

    mainSheet.sequence.position = reducedMotion ? 0 : progress * sequenceLength;
  });

  return null;
}
