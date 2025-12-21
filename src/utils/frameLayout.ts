import type { Frame, CutPreset } from "../store/useEditorStore";

export interface FrameLayout {
  totalWidth: number;
  stageHeight: number;
  frames: {
    id: string;
    x: number; // Position on the master stage
    y: number;
    width: number; // Width of this specific slice
    height: number;
    clipPath?: string; // Future proofing for diagonal
  }[];
}

export function calculateFrameLayout(
  frames: Frame[],
  preset: CutPreset,
  baseWidth: number,
  baseHeight: number
): FrameLayout {
  const count = frames.length;
  if (count === 0) {
    return {
      totalWidth: 0,
      stageHeight: baseHeight,
      frames: [],
    };
  }

  let totalWidth = 0;
  const frameLayouts: FrameLayout["frames"] = [];

  switch (preset) {
    case "overlap": {
      // frames overlap by ~10% of baseWidth
      const overlap = Math.round(baseWidth * 0.12);

      // The visual width of a "slice" is still baseWidth,
      // but the next one starts earlier.
      // Actually, if we want the output to be "connected strip",
      // rendering overlapping non-transparent images requires:
      // either modification of the master stage width OR
      // just shifting the positions.

      // Standard "Overlap" in carousels usually means:
      // Frame 1 shows 100% of itself + 10% of Frame 2?
      // No, tech lead says: "Frames slightly overlap visually... Connected strip illusion"
      // Rules: "Overlap width 8-12%", "Symmetrical".

      // Interpretation:
      // The master canvas is a continuous strip.
      // We are just defining the SLICE regions?
      // No, CanvasStage renders the frames.
      // So if "Overlap", we should position the Frames closer to each other on the stage?
      // YES.
      // x[i] = i * (baseWidth - overlap)

      for (let i = 0; i < count; i++) {
        const x = i * (baseWidth - overlap);
        frameLayouts.push({
          id: frames[i].id,
          x,
          y: 0,
          width: baseWidth, // Each frame keeps full width
          height: baseHeight,
        });
      }

      // Total width is end of last frame
      totalWidth = frameLayouts[count - 1].x + baseWidth;
      break;
    }

    case "hero": {
      // Middle frame is wider (140%), sides are narrower (85%)
      // This mainly affects the slice width if we are "cutting".
      // But for the Stage rendering, it determines how much space each device gets.

      const centerIndex = Math.floor((count - 1) / 2);
      let currentX = 0;

      for (let i = 0; i < count; i++) {
        const isCenter = i === centerIndex;
        // If it's a "Hero" cut, the center slice is wider.
        // We simulate this by allocating more width to the center frame's container
        const sliceWidth = isCenter
          ? Math.round(baseWidth * 1.4)
          : Math.round(baseWidth * 0.85);

        frameLayouts.push({
          id: frames[i].id,
          x: currentX,
          y: 0,
          width: sliceWidth,
          height: baseHeight,
        });

        currentX += sliceWidth;
      }
      totalWidth = currentX;
      break;
    }

    case "even":
    default: {
      // Standard grid - ensure integer coordinates for pixel-perfect cuts
      for (let i = 0; i < count; i++) {
        frameLayouts.push({
          id: frames[i].id,
          x: Math.round(i * baseWidth),
          y: 0,
          width: Math.round(baseWidth),
          height: Math.round(baseHeight),
        });
      }
      totalWidth = Math.round(count * baseWidth);
      break;
    }
  }

  return {
    totalWidth,
    stageHeight: baseHeight,
    frames: frameLayouts,
  };
}
