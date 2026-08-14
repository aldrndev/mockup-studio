import { create } from "zustand";
import type {
  DeviceType,
  DeviceStyle,
  DeviceColor,
  ExportPresetKey,
  VectorOverlayConfig,
  PlayStoreBadgesConfig,
  TextOverlay,
} from "../types/device";
import { PLAYSTORE_TEMPLATES } from "../utils/playstoreTemplates";

// Editor Types
export type BackgroundBase = "solid" | "gradient" | "image";
export type BackgroundStyle = "none" | "radial" | "spotlight" | "beam";
export type OverlayPattern = "none" | "noise" | "dots" | "grid";
export type EditorTab = "templates" | "devices" | "backgrounds" | "marketing" | "canvas";

export interface Background {
  type: BackgroundBase; // Base layer (Solid/Gradient/Image)
  style: BackgroundStyle; // Effect layer (Glow/Spotlight/Beam)
  color1: string;
  color2: string; // Used for gradient secondary color
  angle: number; // For linear gradient
  noise: number; // 0-1 opacity
  pattern: OverlayPattern;
  vignette: boolean; // Subtle edge darkening
  backdrop: boolean; // Soft panel behind device
  imageUrl?: string | null;
}

export const GRADIENT_PRESETS = [
  { name: "Indigo Slate", c1: "#4f46e5", c2: "#0f172a" },
  { name: "Obsidian Purple", c1: "#6366f1", c2: "#020617" },
  { name: "Deep Charcoal", c1: "#27272a", c2: "#09090b" },
  { name: "Neon Cyberpunk", c1: "#ec4899", c2: "#1e1b4b" },
  { name: "Emerald Tech", c1: "#059669", c2: "#022c22" },
  { name: "Sunset Flame", c1: "#ea580c", c2: "#1c1917" },
  { name: "Royal Violet", c1: "#7c3aed", c2: "#1e1b4b" },
  { name: "Ocean Teal", c1: "#0284c7", c2: "#042f2e" },
  { name: "Minimal Frost", c1: "#334155", c2: "#0f172a" },
];

import type { TextPreset } from "../types/device";
export type CutPreset = "even" | "overlap" | "hero" | "diagonal";
export type EditorMode = "standard" | "custom";

export interface Frame {
  id: string;
  deviceType: DeviceType;
  deviceStyle: DeviceStyle;
  deviceColor: DeviceColor;
  screenshot: string | null;
  headline: TextOverlay;
  subtitle: TextOverlay;
  scale: number;
  rotation: number;
  rotateX: number; // 3D Rotation X (Pitch)
  rotateY: number; // 3D Rotation Y (Yaw)
  depth?: number; // 3D Chassis Thickness in px (default: 54)
  skewX: number; // Skew X
  skewY: number; // Skew Y
  flipX: boolean;
  flipY: boolean;
  offsetX: number;
  offsetY: number;
  showDevice: boolean;
  showShadow?: boolean;
  showReflection?: boolean;
  engine?: "three-3d" | "vector";
}

interface EditorState {
  // Navigation & View
  activeTab: EditorTab;
  canvasZoom: number; // Scale factor for zoom preview (0.25 to 2)

  // Global Shared State
  deviceType: DeviceType;
  deviceStyle: DeviceStyle;
  deviceColor: DeviceColor;
  background: Background;
  vectorOverlay: VectorOverlayConfig;
  badges: PlayStoreBadgesConfig;
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

  // History & Undo / Redo
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
  undo: () => void;
  redo: () => void;
  resetAll: () => void;

  // Actions - Navigation & View
  setActiveTab: (tab: EditorTab) => void;
  setCanvasZoom: (zoom: number | ((prev: number) => number)) => void;

  // Actions - Global
  setDeviceType: (type: DeviceType) => void;
  setDeviceStyle: (style: DeviceStyle) => void;
  setDeviceColor: (color: DeviceColor) => void;
  setBackground: (bg: Partial<Background>) => void;
  setVectorOverlay: (vector: Partial<VectorOverlayConfig>) => void;
  setBadges: (badges: Partial<PlayStoreBadgesConfig>) => void;
  setTextPreset: (preset: TextPreset) => void;
  setCutPreset: (preset: CutPreset) => void;
  setExportPreset: (preset: ExportPresetKey) => void;
  setEditorMode: (mode: EditorMode) => void;
  setCanvasSize: (width: number | null, height: number | null) => void;

  // Actions - Templates & 3D Presets
  applyTemplate: (templateId: string) => void;
  applyAnglePreset: (preset: "front" | "isometric-left" | "isometric-right" | "floating-hero" | "perspective-tilt") => void;

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
    depth?: number;
    skewX?: number;
    skewY?: number;
    flipX?: boolean;
    flipY?: boolean;
    offsetX?: number;
    offsetY?: number;
    deviceType?: DeviceType;
    deviceStyle?: DeviceStyle;
    deviceColor?: DeviceColor;
    showShadow?: boolean;
    showReflection?: boolean;
    engine?: "three-3d" | "vector";
  }) => void;
  toggleFrameDevice: (id: string) => void;

  resetEditor: () => void;
}

export interface CanvasSnapshot {
  frames: Frame[];
  activeFrameId: string;
  deviceType: DeviceType;
  deviceStyle: DeviceStyle;
  deviceColor: DeviceColor;
  background: Background;
  vectorOverlay: VectorOverlayConfig;
  badges: PlayStoreBadgesConfig;
  textPreset: TextPreset;
  canvasWidth: number | null;
  canvasHeight: number | null;
}

const emptyHeadline: TextOverlay = {
  id: "headline",
  text: "",
  x: 0.5,
  y: 0.08,
  fontSize: 56,
  fontFamily: "Poppins",
  fontWeight: 800,
  fill: "#ffffff",
  type: "headline",
  glow: false,
};

const emptySubtitle: TextOverlay = {
  id: "subtitle",
  text: "",
  x: 0.5,
  y: 0.15,
  fontSize: 24,
  fontFamily: "Inter",
  fontWeight: 400,
  fill: "#94a3b8",
  type: "subtitle",
};

const emptyBackground: Background = {
  type: "solid",
  style: "none",
  color1: "#0a0d14",
  color2: "#0a0d14",
  angle: 180,
  noise: 0,
  pattern: "none",
  vignette: false,
  backdrop: false,
  imageUrl: null,
};

const emptyVectorOverlay: VectorOverlayConfig = {
  type: "none",
  color: "#6366f1",
  secondaryColor: "#38bdf8",
  opacity: 0,
  scale: 1,
  positionY: 0.5,
};

const emptyBadges: PlayStoreBadgesConfig = {
  showRating: false,
  ratingScore: 5.0,
  ratingCount: "",
  ratingStyle: "google-play",
  ratingPosition: "top",
  showDownloads: false,
  downloadCount: "",
  downloadIcon: "download",
  showFeaturePills: false,
  featurePills: [],
  showFloatingShield: false,
};

const initialFrameId = crypto.randomUUID();

const createInitialFrame = (id: string = initialFrameId): Frame => ({
  id,
  deviceType: "iphone",
  deviceStyle: "realistic",
  deviceColor: "titanium-dark",
  screenshot: null,
  headline: { ...emptyHeadline },
  subtitle: { ...emptySubtitle },
  scale: 1.38,
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
  showShadow: true,
  showReflection: false,
});

const getSnapshot = (state: EditorState): CanvasSnapshot => ({
  frames: JSON.parse(JSON.stringify(state.frames)),
  activeFrameId: state.activeFrameId,
  deviceType: state.deviceType,
  deviceStyle: state.deviceStyle,
  deviceColor: state.deviceColor,
  background: { ...state.background },
  vectorOverlay: { ...state.vectorOverlay },
  badges: JSON.parse(JSON.stringify(state.badges)),
  textPreset: state.textPreset,
  canvasWidth: state.canvasWidth,
  canvasHeight: state.canvasHeight,
});

export const useEditorStore = create<EditorState>((set, get) => ({
  activeTab: "devices",
  canvasZoom: 1,

  // History Stacks
  past: [],
  future: [],

  deviceType: "iphone",
  deviceStyle: "realistic",
  deviceColor: "titanium-dark",
  background: emptyBackground,
  vectorOverlay: emptyVectorOverlay,
  badges: emptyBadges,
  textPreset: "playstore-hero",
  cutPreset: "even",
  exportPreset: "playstore-phone",
  editorMode: "standard",
  canvasWidth: 1080,
  canvasHeight: 2400,

  frames: [createInitialFrame(initialFrameId)],
  activeFrameId: initialFrameId,

  // Undo / Redo / Reset Actions
  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const prevSnapshot = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      const currentSnapshot = getSnapshot(state);

      return {
        ...prevSnapshot,
        past: newPast,
        future: [currentSnapshot, ...state.future].slice(0, 30),
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const nextSnapshot = state.future[0];
      const newFuture = state.future.slice(1);
      const currentSnapshot = getSnapshot(state);

      return {
        ...nextSnapshot,
        past: [...state.past, currentSnapshot].slice(-30),
        future: newFuture,
      };
    }),

  resetAll: () =>
    set((state) => {
      const currentSnapshot = getSnapshot(state);
      const newId = crypto.randomUUID();
      return {
        past: [...state.past, currentSnapshot].slice(-30),
        future: [],
        activeTab: "devices",
        deviceType: "iphone",
        deviceStyle: "realistic",
        deviceColor: "titanium-dark",
        background: { ...emptyBackground },
        vectorOverlay: { ...emptyVectorOverlay },
        badges: { ...emptyBadges },
        canvasWidth: 1080,
        canvasHeight: 2400,
        frames: [createInitialFrame(newId)],
        activeFrameId: newId,
      };
    }),

  // Navigation & View Actions
  setActiveTab: (activeTab) => set({ activeTab }),
  setCanvasZoom: (zoom) =>
    set((state) => ({
      canvasZoom: typeof zoom === "function" ? zoom(state.canvasZoom) : zoom,
    })),

  // Global Setters with History Tracking
  setDeviceType: (deviceType) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        deviceType,
        frames: state.frames.map((f) =>
          f.id === state.activeFrameId ? { ...f, deviceType } : f
        ),
      };
    }),

  setDeviceStyle: (deviceStyle) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        deviceStyle,
        frames: state.frames.map((f) =>
          f.id === state.activeFrameId ? { ...f, deviceStyle } : f
        ),
      };
    }),

  setDeviceColor: (deviceColor) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        deviceColor,
        frames: state.frames.map((f) =>
          f.id === state.activeFrameId ? { ...f, deviceColor } : f
        ),
      };
    }),

  setBackground: (background) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        background: { ...state.background, ...background },
      };
    }),

  setVectorOverlay: (vector) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        vectorOverlay: { ...state.vectorOverlay, ...vector },
      };
    }),

  setBadges: (badges) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        badges: { ...state.badges, ...badges },
      };
    }),

  setTextPreset: (preset) => {
    const presets: Record<
      TextPreset,
      { headline: Partial<TextOverlay>; subtitle: Partial<TextOverlay> }
    > = {
      "playstore-hero": {
        headline: {
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 52,
          fill: "#ffffff",
          highlightColor: "#818cf8",
        },
        subtitle: {
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: 26,
          fill: "#94a3b8",
        },
      },
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
          fontFamily: "Outfit",
          fontWeight: 800,
          fontSize: 52,
          fill: "#ffffff",
        },
        subtitle: {
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 24,
          fill: "#cbd5e1",
        },
      },
      bold: {
        headline: {
          fontFamily: "Poppins",
          fontWeight: 900,
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
      minimal: {
        headline: {
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 44,
          fill: "#ffffff",
        },
        subtitle: {
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: 22,
          fill: "#71717a",
        },
      },
      "neon-glow": {
        headline: {
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 58,
          fill: "#ffffff",
          glow: true,
          glowColor: "#d946ef",
        },
        subtitle: {
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 26,
          fill: "#e2e8f0",
        },
      },
      "cyber-cyan": {
        headline: {
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 60,
          fill: "#ffffff",
          glow: true,
          glowColor: "#06b6d4",
        },
        subtitle: {
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 26,
          fill: "#93c5fd",
        },
      },
    };

    set((state) => {
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
  setCanvasSize: (width, height) => {
    const snapshot = getSnapshot(get());
    set({
      past: [...get().past, snapshot].slice(-30),
      future: [],
      canvasWidth: width,
      canvasHeight: height,
    });
  },

  // 1-Click Template Applier with History
  applyTemplate: (templateId) => {
    const template = PLAYSTORE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const snapshot = getSnapshot(get());
    set((state) => {
      const updatedFrames = state.frames.map((frame) =>
        frame.id === state.activeFrameId
          ? {
              ...frame,
              deviceType: template.deviceType,
              deviceStyle: template.deviceStyle,
              deviceColor: template.deviceColor,
              headline: {
                ...frame.headline,
                ...template.headline,
                text: template.headline.text ?? frame.headline.text,
              },
              subtitle: {
                ...frame.subtitle,
                ...template.subtitle,
                text: template.subtitle.text ?? frame.subtitle.text,
              },
              ...template.frameProps,
            }
          : frame
      );

      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        deviceType: template.deviceType,
        deviceStyle: template.deviceStyle,
        deviceColor: template.deviceColor,
        background: { ...template.background },
        vectorOverlay: { ...template.vectorOverlay },
        badges: { ...template.badges },
        canvasWidth: template.canvasWidth,
        canvasHeight: template.canvasHeight,
        frames: updatedFrames,
      };
    });
  },

  // 3D Angle Preset Applier with History
  applyAnglePreset: (preset) => {
    const angles = {
      front: {
        rotation: 0,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      },
      "isometric-left": {
        rotation: -4,
        rotateX: 12,
        rotateY: -16,
        skewX: -2,
        skewY: 2,
        scale: 1.05,
        offsetX: 0,
        offsetY: 40,
      },
      "isometric-right": {
        rotation: 4,
        rotateX: 12,
        rotateY: 16,
        skewX: 2,
        skewY: -2,
        scale: 1.05,
        offsetX: 0,
        offsetY: 40,
      },
      "floating-hero": {
        rotation: 0,
        rotateX: 16,
        rotateY: 0,
        skewX: 0,
        skewY: 0,
        scale: 1.08,
        offsetX: 0,
        offsetY: 30,
      },
      "perspective-tilt": {
        rotation: -8,
        rotateX: 18,
        rotateY: -22,
        skewX: -4,
        skewY: 4,
        scale: 1.1,
        offsetX: 0,
        offsetY: 50,
      },
    };

    const snapshot = getSnapshot(get());
    set((state) => ({
      past: [...state.past, snapshot].slice(-30),
      future: [],
      frames: state.frames.map((frame) =>
        frame.id === state.activeFrameId
          ? { ...frame, ...angles[preset] }
          : frame
      ),
    }));
  },

  // Frame Management with History
  addFrame: (overrideDeviceType) =>
    set((state) => {
      if (state.frames.length >= 8) return state;
      const snapshot = getSnapshot(state);
      const newId = crypto.randomUUID();
      const currentActive = state.frames.find((f) => f.id === state.activeFrameId) || state.frames[0];

      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: [
          ...state.frames,
          {
            id: newId,
            deviceType: overrideDeviceType || state.deviceType,
            deviceStyle: state.deviceStyle,
            deviceColor: state.deviceColor,
            screenshot: null,
            headline: {
              ...emptyHeadline,
              ...currentActive.headline,
              text: "",
            },
            subtitle: {
              ...emptySubtitle,
              ...currentActive.subtitle,
              text: "",
            },
            scale: currentActive.scale,
            rotation: currentActive.rotation,
            rotateX: currentActive.rotateX,
            rotateY: currentActive.rotateY,
            skewX: currentActive.skewX,
            skewY: currentActive.skewY,
            flipX: false,
            flipY: false,
            offsetX: 0,
            offsetY: currentActive.offsetY,
            showDevice: true,
          },
        ],
        activeFrameId: newId,
      };
    }),

  removeFrame: (id) =>
    set((state) => {
      if (state.frames.length <= 1) return state;
      const snapshot = getSnapshot(state);
      const newFrames = state.frames.filter((c) => c.id !== id);
      const newActiveId =
        state.activeFrameId === id
          ? newFrames[newFrames.length - 1].id
          : state.activeFrameId;
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: newFrames,
        activeFrameId: newActiveId,
      };
    }),

  setActiveFrame: (id) => set({ activeFrameId: id }),

  reorderFrame: (fromIndex, toIndex) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      const newFrames = [...state.frames];
      const [moved] = newFrames.splice(fromIndex, 1);
      newFrames.splice(toIndex, 0, moved);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: newFrames,
      };
    }),

  // Active Frame Actions with History
  setScreenshot: (src) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId ? { ...c, screenshot: src } : c
        ),
      };
    }),

  setHeadline: (text) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? { ...c, headline: { ...c.headline, ...text } }
            : c
        ),
      };
    }),

  setSubtitle: (text) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? { ...c, subtitle: { ...c.subtitle, ...text } }
            : c
        ),
      };
    }),

  setFrameProperties: (props) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId ? { ...c, ...props } : c
        ),
      };
    }),

  toggleFrameDevice: (id) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === id ? { ...c, showDevice: !c.showDevice } : c
        ),
      };
    }),

  resetEditor: () => get().resetAll(),
}));
