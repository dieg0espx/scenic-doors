"use client";

import SlidingDoorAnimation from "@/components/SlidingDoorAnimation";
import BifoldDoorAnimation from "@/components/BifoldDoorAnimation";
import SlideStackDoorAnimation from "@/components/SlideStackDoorAnimation";

const SLUG_MAP: Record<string, string> = {
  "multi-slide-pocket": "sliding",
  "ultra-slim": "sliding",
  "bi-fold": "bifold",
  "slide-stack": "slidestack",
};

const NAME_MAP: Record<string, string> = {
  "multi-slide & pocket": "sliding",
  "ultra slim multi-slide": "sliding",
  "bi-fold doors": "bifold",
  "slide-&-stack": "slidestack",
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
}

export default function DoorTypeAnimation({ doorType, compact = true }: DoorTypeAnimationProps) {
  const type = resolveType(doorType);
  if (!type) return null;

  switch (type) {
    case "sliding":
      return <SlidingDoorAnimation compact={compact} />;
    case "bifold":
      return <BifoldDoorAnimation />;
    case "slidestack":
      return <SlideStackDoorAnimation compact={compact} />;
    default:
      return null;
  }
}
