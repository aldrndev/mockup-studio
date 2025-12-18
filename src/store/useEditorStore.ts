import { create } from "zustand";
import type { DeviceType, ExportPresetKey } from "../types/device";

// Editor Types
export type BackgroundBase = "solid" | "gradient";
export type BackgroundStyle = "none" | "radial" | "spotlight";
export type OverlayPattern = "none" | "noise" | "dots" | "grid";

export interface Background {
  type: BackgroundBase; // Base layer (Solid/Gradient)
  style: BackgroundStyle; // Effect layer (Glow/Spotlight)
  color1: string;
  color2: string; // Used for gradient/radial secondary color
  angle: number; // For linear gradient
  noise: number; // 0-1 opacity
  pattern: OverlayPattern;
}

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

interface EditorState {
  // Canvas State
  screenshot: string | null;
  deviceType: DeviceType;
  background: Background;
  headline: TextOverlay;
  subtitle: TextOverlay;
  textPreset: TextPreset; // Restored
  exportPreset: ExportPresetKey;

  // Actions
  setScreenshot: (src: string | null) => void;
  setDeviceType: (type: DeviceType) => void;
  setBackground: (bg: Partial<Background>) => void;
  setHeadline: (text: Partial<TextOverlay>) => void;
  setSubtitle: (text: Partial<TextOverlay>) => void;
  setTextPreset: (preset: TextPreset) => void; // Restored
  setExportPreset: (preset: ExportPresetKey) => void;
  resetEditor: () => void;
}

const defaultHeadline: TextOverlay = {
  id: "headline",
  text: "",
  x: 0.5,
  y: 0.07, // Aligned to top of dedicated zone
  fontSize: 64, // Larger, dominant
  fontFamily: "Poppins",
  fontWeight: 800,
  fill: "#ffffff",
  type: "headline",
};

const defaultSubtitle: TextOverlay = {
  id: "subtitle",
  text: "",
  x: 0.5,
  y: 0.14, // Clearly separated from headline
  fontSize: 32, // Readable 2-3 lines
  fontFamily: "Inter",
  fontWeight: 500, // Medium weight for readability
  fill: "#e4e4e7", // Zinc-200 for slight contrast
  type: "subtitle",
};

const defaultBackground: Background = {
  type: "gradient", // Base
  style: "none", // Style
  color1: "#18181b", // zinc-950
  color2: "#27272a", // zinc-800
  angle: 135,
  noise: 0,
  pattern: "none",
};

export const useEditorStore = create<EditorState>((set) => ({
  screenshot: null,
  deviceType: "iphone",
  background: defaultBackground,
  headline: defaultHeadline,
  subtitle: defaultSubtitle,
  textPreset: "appstore",
  exportPreset: "appstore",

  setScreenshot: (screenshot) => set({ screenshot }),

  setDeviceType: (deviceType) => set({ deviceType }),

  setBackground: (background) =>
    set((state) => ({
      background: { ...state.background, ...background },
    })),

  setHeadline: (headline) =>
    set((state) => ({
      headline: { ...state.headline, ...headline },
    })),

  setSubtitle: (subtitle) =>
    set((state) => ({
      subtitle: { ...state.subtitle, ...subtitle },
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

    set((state) => ({
      textPreset: preset,
      headline: { ...state.headline, ...presets[preset].headline },
      subtitle: { ...state.subtitle, ...presets[preset].subtitle },
    }));
  },

  setExportPreset: (preset) => set({ exportPreset: preset }),

  resetEditor: () =>
    set({
      screenshot: null,
      deviceType: "iphone",
      background: defaultBackground,
      headline: defaultHeadline,
      subtitle: defaultSubtitle,
      textPreset: "appstore",
      exportPreset: "appstore",
    }),
}));
