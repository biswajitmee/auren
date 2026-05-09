"use client";

import { val } from "@theatre/core";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { mainSheet, THEATRE_SCROLL_SEQUENCE_LENGTH } from "@/lib/theatre";
import { useScrollProgress } from "@/lib/useScrollProgress";

type TheatreScrollControllerProps = {
  active?: boolean;
  reducedMotion?: boolean;
};

const POSITION_EPSILON = 0.0001;
const PROGRESS_EPSILON = 0.00001;

export function TheatreScrollController({
  active = true,
  reducedMotion = false
}: TheatreScrollControllerProps) {
  const progress = useScrollProgress((state) => state.progress);
  const editorControlledRef = useRef(false);
  const lastAppliedPositionRef = useRef<number | null>(null);
  const lastProgressRef = useRef(progress);

  useFrame(() => {
    if (!active) {
      return;
    }

    const savedLength = val(mainSheet.sequence.pointer.length);
    const sequenceLength =
      Number.isFinite(savedLength) && savedLength > 0
        ? savedLength
        : THEATRE_SCROLL_SEQUENCE_LENGTH;
    const nextScrollPosition = reducedMotion ? 0 : progress * sequenceLength;
    const currentPosition = mainSheet.sequence.position;
    const lastAppliedPosition = lastAppliedPositionRef.current;
    const progressMoved = Math.abs(progress - lastProgressRef.current) > PROGRESS_EPSILON;

    lastProgressRef.current = progress;

    if (
      lastAppliedPosition !== null &&
      !progressMoved &&
      Math.abs(currentPosition - lastAppliedPosition) > POSITION_EPSILON
    ) {
      editorControlledRef.current = true;
    }

    if (progressMoved) {
      editorControlledRef.current = false;
    }

    if (editorControlledRef.current) {
      return;
    }

    if (Math.abs(currentPosition - nextScrollPosition) > POSITION_EPSILON) {
      mainSheet.sequence.position = nextScrollPosition;
    }

    lastAppliedPositionRef.current = nextScrollPosition;
  });

  return null;
}
