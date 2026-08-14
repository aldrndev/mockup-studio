import { create } from "zustand";
import type {
  DeviceType,
  DeviceStyle,
  DeviceColor,
  ExportPresetKey,
  VectorOverlayConfig,
  PlayStoreBadgesConfig,
  TextOverlay,
  SecondaryDeviceConfig,
  ScreenGlareConfig,
  AppIconConfig,
  StoreBadgeType,
  PromoStickerConfig,
  TestimonialConfig,
  FloatingElementConfig,
  FloatingBarItem,
} from "../types/device";
import { PLAYSTORE_TEMPLATES } from "../utils/playstoreTemplates";

// Editor Types
export type BackgroundBase = "solid" | "gradient" | "image";
export type BackgroundStyle = "none" | "radial" | "spotlight" | "beam";
export type OverlayPattern = "none" | "noise" | "dots" | "grid";
export type EditorTab =
  | "canvas"
  | "templates"
  | "devices"
  | "backgrounds"
  | "marketing"
  | "decorations"
  | "export";

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

  // Studio Pro Features
  secondaryDevice?: SecondaryDeviceConfig | null;
  screenGlare?: ScreenGlareConfig;
  appIcon?: AppIconConfig;
  storeBadge?: StoreBadgeType;
  storeBadgeX?: number; // 0 to 1 relative (default: 0.5)
  storeBadgeY?: number; // 0 to 1 relative (default: 0.94)
  promoSticker?: PromoStickerConfig;
  testimonial?: TestimonialConfig;
  floatingElements?: FloatingElementConfig[];
  floatingBars?: FloatingBarItem[];
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
  canvasPresetId: string | null;

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
  setCanvasSize: (
    width: number | null,
    height: number | null,
    options?: {
      deviceType?: DeviceType;
      autoScale?: boolean;
      presetId?: string;
    }
  ) => void;

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

  // Studio Pro Actions
  setSecondaryDevice: (config: Partial<SecondaryDeviceConfig> | null) => void;
  setScreenGlare: (config: Partial<ScreenGlareConfig>) => void;
  setAppIcon: (config: Partial<AppIconConfig>) => void;
  setStoreBadge: (badge: StoreBadgeType) => void;
  setStoreBadgePosition: (x: number, y: number) => void;
  setPromoSticker: (config: Partial<PromoStickerConfig>) => void;
  setTestimonial: (config: Partial<TestimonialConfig>) => void;
  addFloatingElement: (element: Omit<FloatingElementConfig, "id">) => void;
  removeFloatingElement: (id: string) => void;
  updateFloatingElement: (id: string, updates: Partial<FloatingElementConfig>) => void;
  addFloatingBar: (bar: Omit<FloatingBarItem, "id">) => void;
  removeFloatingBar: (id: string) => void;
  updateFloatingBar: (id: string, updates: Partial<FloatingBarItem>) => void;
  setFloatingBars: (bars: FloatingBarItem[]) => void;
  loadFloatingBarPreset: (presetName: "ai-tasks" | "fintech" | "fitness" | "social") => void;
  exportProjectJson: () => string;
  importProjectJson: (jsonString: string) => boolean;

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
  depth: 52,
  skewX: 0,
  skewY: 0,
  flipX: false,
  flipY: false,
  offsetX: 0,
  offsetY: 0,
  showDevice: true,
  showShadow: true,
  showReflection: false,
  secondaryDevice: null,
  screenGlare: { enabled: false, opacity: 0.35, style: "diagonal-curved" },
  appIcon: { enabled: false, url: null, size: 84, shape: "squircle", glow: false, x: 0.5, y: 0.04 },
  storeBadge: "none",
  storeBadgeX: 0.5,
  storeBadgeY: 0.94,
  promoSticker: { enabled: false, text: "#1 Top App", icon: "trophy", theme: "gold", position: "above-device", x: 0.5, y: 0.42 },
  testimonial: { enabled: false, name: "Alex R.", handle: "Verified User", review: "Incredible app experience!", rating: 5, avatarEmoji: "⭐", x: 0.5, y: 0.88 },
  floatingElements: [],
  floatingBars: [],
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
  activeTab: "canvas",
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
  canvasPresetId: "gp-phone-9-20",

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
        activeTab: "canvas",
        deviceType: "iphone",
        deviceStyle: "realistic",
        deviceColor: "titanium-dark",
        background: { ...emptyBackground },
        vectorOverlay: { ...emptyVectorOverlay },
        badges: { ...emptyBadges },
        canvasWidth: 1080,
        canvasHeight: 2400,
        canvasPresetId: "gp-phone-9-20",
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
  setCanvasSize: (width, height, options) => {
    const currentState = get();
    const snapshot = getSnapshot(currentState);

    const w = width ?? 1080;
    const h = height ?? 2400;

    // Determine target device type (explicitly passed or inferred)
    let targetDeviceType: DeviceType = options?.deviceType || currentState.deviceType;
    if (!options?.deviceType) {
      if (w === 1920 && h === 1080) {
        targetDeviceType = "desktop";
      } else if ((w === 1200 && h === 1920) || (w === 1600 && h === 2560) || (w === 2048 && h === 2732) || (w === 1668 && h === 2388)) {
        targetDeviceType = "tablet";
      }
    }

    // Calculate optimal proportional scale to perfectly fit new canvas
    let optimalScale = 1.65;
    if (targetDeviceType === "desktop") {
      optimalScale = Math.round(Math.min((w * 0.82) / 800, (h * 0.72) / 540) * 100) / 100;
    } else if (targetDeviceType === "tablet") {
      optimalScale = Math.round(Math.min((w * 0.8) / 560, (h * 0.76) / 752) * 100) / 100;
    } else {
      // Phone (iPhone / Android)
      const isLandscape = w > h;
      if (isLandscape) {
        optimalScale = Math.round(((h * 0.76) / 932) * 100) / 100;
      } else if (w === h) {
        optimalScale = Math.round(((h * 0.68) / 932) * 100) / 100;
      } else {
        optimalScale = Math.round(((h * 0.72) / 932) * 100) / 100;
      }
    }

    set((state) => ({
      past: [...state.past, snapshot].slice(-30),
      future: [],
      canvasWidth: width,
      canvasHeight: height,
      canvasPresetId: options?.presetId ?? null,
      deviceType: targetDeviceType,
      frames: state.frames.map((frame) => ({
        ...frame,
        deviceType: targetDeviceType,
        scale: optimalScale,
      })),
    }));
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
      if (state.frames.length >= 4) return state;
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

  // Studio Pro Actions
  setSecondaryDevice: (config) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                secondaryDevice: config
                  ? {
                      enabled: true,
                      deviceType: c.deviceType,
                      deviceColor: c.deviceColor,
                      screenshot: null,
                      layout: "behind-left",
                      scale: 0.88,
                      offsetX: -220,
                      offsetY: 60,
                      rotateY: -15,
                      rotateX: 8,
                      rotation: -6,
                      depth: 48,
                      ...c.secondaryDevice,
                      ...config,
                    }
                  : null,
              }
            : c
        ),
      };
    }),

  setScreenGlare: (config) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                screenGlare: {
                  enabled: true,
                  opacity: 0.35,
                  style: "diagonal-curved",
                  ...c.screenGlare,
                  ...config,
                },
              }
            : c
        ),
      };
    }),

  setAppIcon: (config) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                appIcon: {
                  enabled: true,
                  url: null,
                  size: 84,
                  shape: "squircle",
                  glow: false,
                  ...c.appIcon,
                  ...config,
                },
              }
            : c
        ),
      };
    }),

  setStoreBadge: (badge) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId ? { ...c, storeBadge: badge } : c
        ),
      };
    }),

  setStoreBadgePosition: (x, y) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? { ...c, storeBadgeX: x, storeBadgeY: y }
            : c
        ),
      };
    }),

  setPromoSticker: (config) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                promoSticker: {
                  enabled: true,
                  text: "#1 Top App",
                  icon: "trophy",
                  theme: "gold",
                  position: "above-device",
                  ...c.promoSticker,
                  ...config,
                },
              }
            : c
        ),
      };
    }),

  setTestimonial: (config) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                testimonial: {
                  enabled: true,
                  name: "Alex R.",
                  handle: "Verified User",
                  review: "Incredible app experience!",
                  rating: 5,
                  avatarEmoji: "⭐",
                  ...c.testimonial,
                  ...config,
                },
              }
            : c
        ),
      };
    }),

  addFloatingElement: (element) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      const newEl: FloatingElementConfig = {
        ...element,
        id: crypto.randomUUID(),
      };
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingElements: [...(c.floatingElements || []), newEl],
              }
            : c
        ),
      };
    }),

  removeFloatingElement: (id) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingElements: (c.floatingElements || []).filter((el) => el.id !== id),
              }
            : c
        ),
      };
    }),

  updateFloatingElement: (id, updates) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingElements: (c.floatingElements || []).map((el) =>
                  el.id === id ? { ...el, ...updates } : el
                ),
              }
            : c
        ),
      };
    }),

  addFloatingBar: (bar) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      const newBar: FloatingBarItem = {
        ...bar,
        id: crypto.randomUUID(),
        depth: bar.depth ?? 10,
        scale: bar.scale ?? 1,
        rotateX: bar.rotateX ?? 0,
        rotateY: bar.rotateY ?? 0,
        rotation: bar.rotation ?? 0,
        bgColor: bar.bgColor ?? "#ffffff",
        textColor: bar.textColor ?? "#0f172a",
        syncWithPhone3D: bar.syncWithPhone3D ?? false,
      };
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingBars: [...(c.floatingBars || []), newBar],
              }
            : c
        ),
      };
    }),

  removeFloatingBar: (id) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingBars: (c.floatingBars || []).filter((b) => b.id !== id),
              }
            : c
        ),
      };
    }),

  updateFloatingBar: (id, updates) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingBars: (c.floatingBars || []).map((b) =>
                  b.id === id ? { ...b, ...updates } : b
                ),
              }
            : c
        ),
      };
    }),

  setFloatingBars: (bars) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingBars: bars,
              }
            : c
        ),
      };
    }),

  loadFloatingBarPreset: (presetName) =>
    set((state) => {
      const snapshot = getSnapshot(state);
      let presetBars: FloatingBarItem[] = [];

      if (presetName === "ai-tasks") {
        presetBars = [
          {
            id: crypto.randomUUID(),
            text: "Rencanakan untukmu",
            icon: "calendar",
            x: 0.28,
            y: 0.72,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Buat untukmu",
            icon: "wand",
            x: 0.72,
            y: 0.72,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Rangkum untukmu",
            icon: "file",
            x: 0.32,
            y: 0.81,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Pantau untukmu",
            icon: "clock",
            x: 0.74,
            y: 0.81,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Lakukan untukmu",
            icon: "check",
            x: 0.52,
            y: 0.90,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
        ];
      } else if (presetName === "fintech") {
        presetBars = [
          {
            id: crypto.randomUUID(),
            text: "Transfer Instan 0%",
            icon: "zap",
            x: 0.3,
            y: 0.74,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Investasi Cerdas",
            icon: "chart",
            x: 0.72,
            y: 0.74,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Keamanan Enkripsi 256-bit",
            icon: "shield",
            x: 0.5,
            y: 0.86,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
        ];
      } else if (presetName === "fitness") {
        presetBars = [
          {
            id: crypto.randomUUID(),
            text: "Bakar 500+ Kalori",
            icon: "flame",
            x: 0.3,
            y: 0.74,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Lacak GPS & Heart Rate",
            icon: "heart",
            x: 0.72,
            y: 0.74,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Target Workout Selesai",
            icon: "check",
            x: 0.5,
            y: 0.86,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
        ];
      } else if (presetName === "social") {
        presetBars = [
          {
            id: crypto.randomUUID(),
            text: "Chat AI Super Cepat",
            icon: "chat",
            x: 0.3,
            y: 0.74,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Filter Efek Trending",
            icon: "sparkles",
            x: 0.72,
            y: 0.74,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Komunitas 1M+ Kreator",
            icon: "user",
            x: 0.5,
            y: 0.86,
            depth: 10,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            bgColor: "#ffffff",
            textColor: "#0f172a",
            syncWithPhone3D: false,
          },
        ];
      }

      return {
        past: [...state.past, snapshot].slice(-30),
        future: [],
        frames: state.frames.map((c) =>
          c.id === state.activeFrameId
            ? {
                ...c,
                floatingBars: presetBars,
              }
            : c
        ),
      };
    }),

  exportProjectJson: () => {
    const state = get();
    const projectData = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      deviceType: state.deviceType,
      deviceStyle: state.deviceStyle,
      deviceColor: state.deviceColor,
      background: state.background,
      vectorOverlay: state.vectorOverlay,
      badges: state.badges,
      textPreset: state.textPreset,
      frames: state.frames,
    };
    return JSON.stringify(projectData, null, 2);
  },

  importProjectJson: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.frames || !Array.isArray(data.frames)) return false;
      const snapshot = getSnapshot(get());
      set({
        past: [...get().past, snapshot].slice(-30),
        future: [],
        canvasWidth: data.canvasWidth || 1080,
        canvasHeight: data.canvasHeight || 2400,
        deviceType: data.deviceType || "iphone",
        deviceStyle: data.deviceStyle || "realistic",
        deviceColor: data.deviceColor || "titanium-dark",
        background: data.background || emptyBackground,
        vectorOverlay: data.vectorOverlay || emptyVectorOverlay,
        badges: data.badges || emptyBadges,
        textPreset: data.textPreset || "playstore-hero",
        frames: data.frames,
        activeFrameId: data.frames[0]?.id || crypto.randomUUID(),
      });
      return true;
    } catch {
      return false;
    }
  },

  resetEditor: () => get().resetAll(),
}));
