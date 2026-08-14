import type { VectorBackgroundType } from "../types/device";

export interface AuroraOrb {
  xRatio: number;
  yRatio: number;
  radiusRatio: number;
  color: string;
  opacity: number;
}

export const DEFAULT_AURORA_ORBS: AuroraOrb[] = [
  { xRatio: 0.15, yRatio: 0.2, radiusRatio: 0.45, color: "#d946ef", opacity: 0.35 },
  { xRatio: 0.85, yRatio: 0.35, radiusRatio: 0.5, color: "#06b6d4", opacity: 0.35 },
  { xRatio: 0.5, yRatio: 0.75, radiusRatio: 0.55, color: "#8b5cf6", opacity: 0.25 },
  { xRatio: 0.2, yRatio: 0.85, radiusRatio: 0.4, color: "#3b82f6", opacity: 0.2 },
];

export interface WaveDefinition {
  d: string;
  opacity: number;
  fill?: string;
  stroke?: string;
}

/**
 * Generates dynamic SVG wave paths based on canvas dimensions
 */
export function generateWavePaths(
  width: number,
  height: number,
  scale = 1,
  positionY = 0.5
): WaveDefinition[] {
  const centerY = height * positionY;
  const amp1 = 60 * scale;
  const amp2 = 40 * scale;

  // Wave 1: Top Fluid Flow
  const p1 = `
    M 0,${centerY - amp1}
    C ${width * 0.25},${centerY - amp1 * 2} ${width * 0.4},${centerY + amp1 * 1.5} ${width * 0.7},${centerY - amp1 * 0.8}
    C ${width * 0.85},${centerY - amp1 * 2} ${width * 0.95},${centerY + amp1 * 0.5} ${width},${centerY}
    L ${width},${height}
    L 0,${height}
    Z
  `;

  // Wave 2: Middle Smooth Curve
  const p2 = `
    M 0,${centerY + amp2}
    C ${width * 0.3},${centerY - amp2 * 1.8} ${width * 0.6},${centerY + amp2 * 2.2} ${width * 0.85},${centerY - amp2}
    C ${width * 0.95},${centerY - amp2 * 2} ${width},${centerY - amp2} ${width},${centerY + amp2}
    L ${width},${height}
    L 0,${height}
    Z
  `;

  // Wave 3: Subtle Ribbon Accent (Top arc)
  const p3 = `
    M 0,${centerY - amp1 * 2.2}
    Q ${width * 0.5},${centerY + amp1 * 2} ${width},${centerY - amp1 * 1.5}
    L ${width},${centerY - amp1 * 1.3}
    Q ${width * 0.5},${centerY + amp1 * 2.2} 0,${centerY - amp1 * 2}
    Z
  `;

  return [
    { d: p1.trim(), opacity: 0.15 },
    { d: p2.trim(), opacity: 0.25 },
    { d: p3.trim(), opacity: 0.4 },
  ];
}

/**
 * Generates cyber circuit PCB tracks & glowing nodes (Image 2 style)
 */
export interface CircuitTrack {
  points: number[];
  color?: string;
  width?: number;
  opacity?: number;
}

export interface CircuitNode {
  x: number;
  y: number;
  radius: number;
  color?: string;
}

export function generateCyberCircuit(width: number, height: number): {
  tracks: CircuitTrack[];
  nodes: CircuitNode[];
} {
  const tracks: CircuitTrack[] = [
    // Top-Left Circuit Traces
    { points: [0, height * 0.18, width * 0.15, height * 0.18, width * 0.25, height * 0.25, width * 0.25, height * 0.38] },
    { points: [0, height * 0.24, width * 0.1, height * 0.24, width * 0.18, height * 0.3, width * 0.18, height * 0.45] },
    { points: [width * 0.05, 0, width * 0.05, height * 0.1, width * 0.12, height * 0.15, width * 0.3, height * 0.15] },
    { points: [width * 0.18, 0, width * 0.18, height * 0.08, width * 0.28, height * 0.14] },

    // Top-Right Circuit Traces
    { points: [width, height * 0.15, width * 0.82, height * 0.15, width * 0.72, height * 0.22, width * 0.72, height * 0.35] },
    { points: [width, height * 0.22, width * 0.88, height * 0.22, width * 0.8, height * 0.28, width * 0.8, height * 0.42] },
    { points: [width * 0.92, 0, width * 0.92, height * 0.12, width * 0.85, height * 0.18, width * 0.68, height * 0.18] },

    // Bottom-Left Angled Traces
    { points: [0, height * 0.65, width * 0.12, height * 0.65, width * 0.22, height * 0.72, width * 0.22, height * 0.88] },
    { points: [0, height * 0.78, width * 0.08, height * 0.78, width * 0.16, height * 0.84, width * 0.3, height * 0.84] },

    // Bottom-Right Angled Traces
    { points: [width, height * 0.68, width * 0.85, height * 0.68, width * 0.75, height * 0.76, width * 0.75, height * 0.9] },
    { points: [width, height * 0.82, width * 0.88, height * 0.82, width * 0.8, height * 0.88, width * 0.65, height * 0.88] },
  ];

  const nodes: CircuitNode[] = [
    { x: width * 0.25, y: height * 0.38, radius: 4.5 },
    { x: width * 0.18, y: height * 0.45, radius: 3.5 },
    { x: width * 0.3, y: height * 0.15, radius: 4 },
    { x: width * 0.28, y: height * 0.14, radius: 3.5 },
    { x: width * 0.72, y: height * 0.35, radius: 4.5 },
    { x: width * 0.8, y: height * 0.42, radius: 3.5 },
    { x: width * 0.68, y: height * 0.18, radius: 4 },
    { x: width * 0.22, y: height * 0.88, radius: 4.5 },
    { x: width * 0.3, y: height * 0.84, radius: 3.5 },
    { x: width * 0.75, y: height * 0.9, radius: 4.5 },
    { x: width * 0.65, y: height * 0.88, radius: 3.5 },
  ];

  return { tracks, nodes };
}

/**
 * Generates geometric isometric floating cards definition
 */
export function generateFloatingCards(width: number, height: number, scale = 1) {
  const s = ((Math.min(width, height) / 1000) * scale);
  return [
    // Top-left floating glass card
    {
      x: width * 0.08,
      y: height * 0.2,
      width: 180 * s,
      height: 110 * s,
      rotation: -12,
      radius: 16 * s,
      opacity: 0.2,
    },
    // Top-right floating glass pill
    {
      x: width * 0.78,
      y: height * 0.15,
      width: 140 * s,
      height: 70 * s,
      rotation: 15,
      radius: 20 * s,
      opacity: 0.18,
    },
    // Bottom-right large card
    {
      x: width * 0.75,
      y: height * 0.72,
      width: 220 * s,
      height: 130 * s,
      rotation: 8,
      radius: 18 * s,
      opacity: 0.22,
    },
  ];
}

export const VECTOR_PRESETS: {
  type: VectorBackgroundType;
  label: string;
  desc: string;
  defaultColor: string;
  defaultSecondary?: string;
  defaultOpacity: number;
}[] = [
  {
    type: "none",
    label: "Clean Minimal",
    desc: "Solid gradient without overlays",
    defaultColor: "#6366f1",
    defaultOpacity: 0,
  },
  {
    type: "studio-floor",
    label: "Studio Podium & Horizon",
    desc: "Neon horizon line with glossy floor reflection",
    defaultColor: "#d946ef",
    defaultSecondary: "#06b6d4",
    defaultOpacity: 0.85,
  },
  {
    type: "cyber-circuit",
    label: "Cyber Circuit PCB",
    desc: "High-tech PCB traces and glowing nodes",
    defaultColor: "#06b6d4",
    defaultSecondary: "#818cf8",
    defaultOpacity: 0.45,
  },
  {
    type: "neon-beams",
    label: "Neon Laser Beams",
    desc: "Vibrant laser streaks cutting across corners",
    defaultColor: "#d946ef",
    defaultSecondary: "#06b6d4",
    defaultOpacity: 0.65,
  },
  {
    type: "aurora",
    label: "Aurora Mesh Glow",
    desc: "Soft ambient multi-color glow blobs",
    defaultColor: "#8b5cf6",
    defaultSecondary: "#38bdf8",
    defaultOpacity: 0.4,
  },
  {
    type: "waves",
    label: "Fluid Wave Ribbons",
    desc: "Smooth flowing vector curved ribbons",
    defaultColor: "#6366f1",
    defaultSecondary: "#ec4899",
    defaultOpacity: 0.35,
  },
  {
    type: "stage-podium",
    label: "Glowing Podium Stage",
    desc: "Illuminated stage dome behind phone",
    defaultColor: "#4f46e5",
    defaultSecondary: "#a855f7",
    defaultOpacity: 0.5,
  },
  {
    type: "modern-grid",
    label: "Cyber Tech Grid",
    desc: "Subtle isometric matrix grid",
    defaultColor: "#6366f1",
    defaultOpacity: 0.25,
  },
  {
    type: "dot-matrix",
    label: "Digital Dot Matrix",
    desc: "Geometric dot array pattern",
    defaultColor: "#94a3b8",
    defaultOpacity: 0.2,
  },
  {
    type: "isometric-cards",
    label: "Floating 3D Tiles",
    desc: "Glassmorphism cards floating in 3D",
    defaultColor: "#818cf8",
    defaultSecondary: "#c084fc",
    defaultOpacity: 0.3,
  },
];
