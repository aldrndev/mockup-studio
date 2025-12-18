import { create } from "zustand";
import type {
  DeviceType,
  BackgroundConfig,
  TextOverlay,
  ExportPresetKey,
  TextPreset,
} from "../types/device";

interface EditorState {
  screenshot: string | null;
  deviceType: DeviceType;
  background: BackgroundConfig;
  headline: TextOverlay;
  subtitle: TextOverlay;
  textPreset: TextPreset;
  exportPreset: ExportPresetKey;

  setScreenshot: (screenshot: string | null) => void;
  setDeviceType: (deviceType: DeviceType) => void;
  setBackground: (background: Partial<BackgroundConfig>) => void;
  setHeadline: (headline: Partial<TextOverlay>) => void;
  setSubtitle: (subtitle: Partial<TextOverlay>) => void;
  setTextPreset: (preset: TextPreset) => void;
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

const defaultBackground: BackgroundConfig = {
  type: "gradient",
  color1: "#1a1a2e",
  color2: "#16213e",
  angle: 135,
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
