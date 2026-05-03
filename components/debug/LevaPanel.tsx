"use client";

import { Leva } from "leva";

import { useAurenLevaControls } from "@/lib/useAurenLevaControls";

const levaEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_AUREN_LEVA !== "false";

export function LevaPanel() {
  if (!levaEnabled) {
    return null;
  }

  return <LevaPanelInner />;
}

function LevaPanelInner() {
  useAurenLevaControls(true);

  return (
    <Leva
      collapsed
      flat={false}
      oneLineLabels
      titleBar={{ drag: true, filter: true, title: "AUREN NOIR" }}
    />
  );
}
