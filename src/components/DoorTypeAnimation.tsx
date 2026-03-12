"use client";

import SlidingDoorAnimation from "@/components/SlidingDoorAnimation";
import SlideStackDoorAnimation from "@/components/SlideStackDoorAnimation";

const SLUG_MAP: Record<string, string> = {
  "multi-slide-pocket": "sliding",
  "ultra-slim": "sliding",
  "bi-fold": "bifold",
  "slide-stack": "slidestack",
};

const NAME_MAP: Record<string, string> = {
  "multi-slide & pocket": "sliding",
  "multi-slide & pocket systems": "sliding",
  "ultra slim multi-slide": "sliding",
  "ultra slim multi-slide & pocket systems": "sliding",
  "bi-fold doors": "bifold",
  "bi-fold": "bifold",
  "slide-&-stack": "slidestack",
  "slide & stack": "slidestack",
};

function resolveType(doorType: string): string | null {
  const lower = doorType.toLowerCase().trim();
  if (SLUG_MAP[lower]) return SLUG_MAP[lower];
  if (NAME_MAP[lower]) return NAME_MAP[lower];
  if (lower.includes("slide") && lower.includes("pocket")) return "sliding";
  if (lower.includes("ultra") && lower.includes("slim")) return "sliding";
  if (lower.includes("bi-fold") || lower.includes("bifold")) return "bifold";
  if (lower.includes("slide") && lower.includes("stack")) return "slidestack";
  return null;
}

interface DoorTypeAnimationProps {
  doorType: string;
  compact?: boolean;
  panelCount?: number;
  panelLayout?: string;
}

export default function DoorTypeAnimation({ doorType, compact = true, panelCount, panelLayout }: DoorTypeAnimationProps) {
  const type = resolveType(doorType);
  if (!type) return null;

  switch (type) {
    case "sliding":
      return (
        <SlidingDoorAnimation
          compact={compact}
          panelCountOverride={panelCount}
          panelLayoutOverride={panelLayout}
        />
      );
    case "bifold":
      return (
        <SlideStackDoorAnimation
          compact={compact}
          panelCountOverride={panelCount}
          stackSideOverride={
            panelLayout
              ? panelLayout.toLowerCase().includes('+') ? 'split'
                : panelLayout.toLowerCase().includes('l') ? 'left'
                : panelLayout.toLowerCase().includes('r') ? 'right'
                : undefined
              : undefined
          }
        />
      );
    case "slidestack": {
      // Derive stack side from panel layout string if available
      let stackSide: "left" | "right" | "split" | undefined;
      if (panelLayout) {
        const lower = panelLayout.toLowerCase();
        if (lower.includes("+")) stackSide = "split";
        else if (lower.includes("l")) stackSide = "left";
        else if (lower.includes("r")) stackSide = "right";
      }
      return (
        <SlideStackDoorAnimation
          compact={compact}
          panelCountOverride={panelCount}
          stackSideOverride={stackSide}
        />
      );
    }
    default:
      return null;
  }
}
