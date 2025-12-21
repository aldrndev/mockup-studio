import { create } from "zustand";
import type { DeviceType, ExportPresetKey } from "../types/device";

// Editor Types
export type BackgroundBase = "solid" | "gradient" | "image";
export type BackgroundStyle = "none" | "radial" | "spotlight" | "beam";
export type OverlayPattern = "none" | "noise" | "dots" | "grid";

export interface Background {
  type: BackgroundBase; // Base layer (Solid/Gradient)
  style: BackgroundStyle; // Effect layer (Glow/Spotlight/Beam)
  color1: string;
  color2: string; // Used for gradient/radial secondary color
  angle: number; // For linear gradient
  noise: number; // 0-1 opacity
  pattern: OverlayPattern;
  vignette: boolean; // New: Subtle edge darkening
  backdrop: boolean; // New: Soft panel behind device
  imageUrl?: string | null;
}

export const GRADIENT_PRESETS = [
  { name: "Indigo Navy", c1: "#4f46e5", c2: "#1e1b4b" }, // Indigo-600 -> Indigo-950
  { name: "Purple Slate", c1: "#9333ea", c2: "#0f172a" }, // Purple-600 -> Slate-900
  { name: "Charcoal", c1: "#27272a", c2: "#09090b" }, // Zinc-800 -> Zinc-950
  { name: "Blue Teal", c1: "#2563eb", c2: "#0f766e" }, // Blue-600 -> Teal-700
  { name: "Midnight", c1: "#1e293b", c2: "#020617" }, // Slate-800 -> Slate-950
  { name: "Royal", c1: "#4338ca", c2: "#2e1065" }, // Indigo-700 -> Violet-950
];

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  fill: string;
  type: "headline" | "subtitle";
}

// Text Presets (Restored)
export type TextPreset = "appstore" | "startup" | "bold";

export type CutPreset = "even" | "overlap" | "hero" | "diagonal";

// Editor Modes
export type EditorMode = "standard" | "custom";

export interface Frame {
  id: string;
  deviceType: DeviceType; // Per-frame device type
  screenshot: string | null;
  headline: TextOverlay;
  subtitle: TextOverlay;
  scale: number;
  rotation: number;
  rotateX: number; // 3D Rotation (scale-based foreshortening)
  rotateY: number; // 3D Rotation (scale-based foreshortening)
  skewX: number; // Tilt X (skew-based distortion)
  skewY: number; // Tilt Y (skew-based distortion)
  flipX: boolean; // New: Horizontal Flip
  flipY: boolean; // New: Vertical Flip
  offsetX: number;
  offsetY: number;
  showDevice: boolean; // New: Controls if device body is rendered
}

interface EditorState {
  // Global Shared State
  deviceType: DeviceType;
  background: Background;
  textPreset: TextPreset;
  cutPreset: CutPreset;
  exportPreset: ExportPresetKey;
  editorMode: EditorMode;
  // Custom Canvas Size (null = auto from device)
  canvasWidth: number | null;
  canvasHeight: number | null;

  // Frame Sequence State
  frames: Frame[];
  activeFrameId: string;

  // Actions
  // Global
  setDeviceType: (type: DeviceType) => void;
  setBackground: (bg: Partial<Background>) => void;
  setTextPreset: (preset: TextPreset) => void;
  setCutPreset: (preset: CutPreset) => void;
  setExportPreset: (preset: ExportPresetKey) => void;
  setEditorMode: (mode: EditorMode) => void;
  setCanvasSize: (width: number | null, height: number | null) => void;

  // Frame Management
  addFrame: (deviceType?: DeviceType) => void;
  removeFrame: (id: string) => void;
  setActiveFrame: (id: string) => void;
  reorderFrame: (fromIndex: number, toIndex: number) => void;

  // Active Frame Actions (Proxies)
  setScreenshot: (src: string | null) => void;
  setHeadline: (text: Partial<TextOverlay>) => void;
  setSubtitle: (text: Partial<TextOverlay>) => void;
  setFrameProperties: (props: {
    scale?: number;
    rotation?: number;
    rotateX?: number;
    rotateY?: number;
    skewX?: number;
    skewY?: number;
    flipX?: boolean;
    flipY?: boolean;
    offsetX?: number;
    offsetY?: number;
  }) => void;
  toggleFrameDevice: (id: string) => void; // New action to show/hide device manually

  resetEditor: () => void;
}

const defaultHeadline: TextOverlay = {
  id: "headline",
  text: "",
  x: 0.5,
  y: 0.07,
  fontSize: 48,
  fontFamily: "Poppins",
  fontWeight: 700,
  fill: "#ffffff",
  type: "headline",
};

const defaultSubtitle: TextOverlay = {
  id: "subtitle",
  text: "",
  x: 0.5,
  y: 0.14,
  fontSize: 24,
  fontFamily: "Inter",
  fontWeight: 400,
  fill: "#a1a1aa",
  type: "subtitle",
};

const defaultBackground: Background = {
  type: "gradient",
  style: "none",
  color1: "#27272a",
  color2: "#09090b",
  angle: 135,
  noise: 0,
  pattern: "none",
  vignette: true,
  backdrop: false,
};

const initialFrameId = crypto.randomUUID();

export const useEditorStore = create<EditorState>((set) => ({
  deviceType: "iphone",
  background: defaultBackground,
  textPreset: "appstore",
  cutPreset: "even",
  exportPreset: "appstore",
  editorMode: "standard",
  canvasWidth: null, // null = auto from device
  canvasHeight: null,

  frames: [
    {
      id: initialFrameId,
      deviceType: "iphone",
      screenshot: null,
      headline: defaultHeadline,
      subtitle: defaultSubtitle,
      scale: 1,
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      offsetX: 0,
      offsetY: 0,
      showDevice: true, // Auto-show for initial
    },
  ],
  activeFrameId: initialFrameId,

  // Set device type for active frame only (per-frame device selection)
  setDeviceType: (deviceType) =>
    set((state) => ({
      deviceType, // Keep global for new frames
      frames: state.frames.map((frame) =>
        frame.id === state.activeFrameId
          ? { ...frame, deviceType }
          : frame
      ),
    })),

  setBackground: (background) =>
    set((state) => ({
      background: { ...state.background, ...background },
    })),

  setTextPreset: (preset) => {
    const presets: Record<
      TextPreset,
      { headline: Partial<TextOverlay>; subtitle: Partial<TextOverlay> }
    > = {
      appstore: {
        headline: {
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: 48,
          fill: "#ffffff",
        },
        subtitle: {
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: 24,
          fill: "#a1a1aa",
        },
      },
      startup: {
        headline: {
          fontFamily: "Inter",
          fontWeight: 800,
          fontSize: 52,
          fill: "#ffffff",
        },
        subtitle: {
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 22,
          fill: "#d4d4d8",
        },
      },
      bold: {
        headline: {
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 56,
          fill: "#fbbf24",
        },
        subtitle: {
          fontFamily: "Poppins",
          fontWeight: 600,
          fontSize: 26,
          fill: "#ffffff",
        },
      },
    };

    set((state) => {
      // Update ONLY active frame with new text style presets
      const updatedFrames = state.frames.map((frame) =>
        frame.id === state.activeFrameId
          ? {
              ...frame,
              headline: { ...frame.headline, ...presets[preset].headline },
              subtitle: { ...frame.subtitle, ...presets[preset].subtitle },
            }
          : frame
      );

      return {
        textPreset: preset,
        frames: updatedFrames,
      };
    });
  },

  setCutPreset: (preset) => set({ cutPreset: preset }),
  setExportPreset: (preset) => set({ exportPreset: preset }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),

  // Frame Management
  addFrame: (overrideDeviceType?: DeviceType) =>
    set((state) => {
      if (state.frames.length >= 8) return state; // Guardrail
      const newId = crypto.randomUUID();
      const showDevice = state.editorMode === "standard"; // Auto-show only in Standard

      return {
        frames: [
          ...state.frames,
          {
            id: newId,
            deviceType: overrideDeviceType || state.deviceType, // Inherit current global device
            screenshot: null,
            headline: {
              ...defaultHeadline,
              ...state.frames[0].headline,
              text: "",
            }, // Copy style but clear text
            subtitle: {
              ...defaultSubtitle,
              ...state.frames[0].subtitle,
              text: "",
            },
            scale: 1,
            rotation: 0,
            rotateX: 0,
            rotateY: 0,
            skewX: 0,
            skewY: 0,
            flipX: false,
            flipY: false,
            offsetX: 0,
            offsetY: 0,
            showDevice: showDevice,
          },
        ],
        activeFrameId: newId, // Switch to new frame
      };
    }),

  removeFrame: (id) =>
    set((state) => {
      if (state.frames.length <= 1) return state; // Guardrail
      const newFrames = state.frames.filter((c) => c.id !== id);
      // If active frame removed, switch to last one
      const newActiveId =
        state.activeFrameId === id
          ? newFrames[newFrames.length - 1].id
          : state.activeFrameId;
      return {
        frames: newFrames,
        activeFrameId: newActiveId,
      };
    }),

  setActiveFrame: (id) => set({ activeFrameId: id }),

  reorderFrame: (fromIndex, toIndex) =>
    set((state) => {
      const newFrames = [...state.frames];
      const [moved] = newFrames.splice(fromIndex, 1);
      newFrames.splice(toIndex, 0, moved);
      return { frames: newFrames };
    }),

  // Active Frame Actions (Proxies)
  setScreenshot: (src) =>
    set((state) => ({
      frames: state.frames.map((c) =>
        c.id === state.activeFrameId ? { ...c, screenshot: src } : c
      ),
    })),

  setHeadline: (text) =>
    set((state) => ({
      frames: state.frames.map((c) =>
        c.id === state.activeFrameId
          ? { ...c, headline: { ...c.headline, ...text } }
          : c
      ),
    })),

  setSubtitle: (text) =>
    set((state) => ({
      frames: state.frames.map((c) =>
        c.id === state.activeFrameId
          ? { ...c, subtitle: { ...c.subtitle, ...text } }
          : c
      ),
    })),

  setFrameProperties: (props) =>
    set((state) => ({
      frames: state.frames.map((c) =>
        c.id === state.activeFrameId ? { ...c, ...props } : c
      ),
    })),

  toggleFrameDevice: (id) =>
    set((state) => ({
      frames: state.frames.map((c) =>
        c.id === id ? { ...c, showDevice: !c.showDevice } : c
      ),
    })),

  resetEditor: () => {
    const newId = crypto.randomUUID();
    set({
      deviceType: "iphone",
      background: defaultBackground,
      textPreset: "appstore",
      exportPreset: "appstore",
      editorMode: "standard",
      frames: [
        {
          id: newId,
          deviceType: "iphone",
          screenshot: null,
          headline: defaultHeadline,
          subtitle: defaultSubtitle,
          scale: 1,
          rotation: 0,
          rotateX: 0,
          rotateY: 0,
          skewX: 0,
          skewY: 0,
          flipX: false,
          flipY: false,
          offsetX: 0,
          offsetY: 0,
          showDevice: true,
        },
      ],
      activeFrameId: newId,
    });
  },
}));
