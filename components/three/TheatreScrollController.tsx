"use client";

import { val } from "@theatre/core";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { mainSheet, THEATRE_SCROLL_SEQUENCE_LENGTH } from "@/lib/theatre";
import { useDesireGalleryScene } from "@/lib/useDesireGalleryScene";
import { useScrollProgress } from "@/lib/useScrollProgress";

type TheatreScrollControllerProps = {
  active?: boolean;
  reducedMotion?: boolean;
};

const POSITION_EPSILON = 0.0001;
const PROGRESS_EPSILON = 0.00001;
const SEQUENCE_DAMPING = 3.5;

export function TheatreScrollController({
  active = true,
  reducedMotion = false
}: TheatreScrollControllerProps) {
  const editorControlledRef = useRef(false);
  const lastAppliedPositionRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  useFrame((_, delta) => {
    if (!active || useDesireGalleryScene.getState().visible) {
      return;
    }

    const savedLength = val(mainSheet.sequence.pointer.length);
    const progress = useScrollProgress.getState().progress;
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

    const easedPosition = reducedMotion
      ? nextScrollPosition
      : THREE.MathUtils.damp(currentPosition, nextScrollPosition, SEQUENCE_DAMPING, delta);
    const appliedPosition =
      Math.abs(easedPosition - nextScrollPosition) > POSITION_EPSILON
        ? easedPosition
        : nextScrollPosition;

    if (Math.abs(currentPosition - appliedPosition) > POSITION_EPSILON) {
      mainSheet.sequence.position = appliedPosition;
    }

    lastAppliedPositionRef.current = appliedPosition;
  });

  return null;
}
