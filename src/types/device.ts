export type DeviceType = "iphone" | "android" | "tablet" | "desktop";
export type DeviceStyle = "realistic" | "clay" | "minimal-dark" | "flat-outline";
export type DeviceColor = "titanium-dark" | "titanium-natural" | "silver" | "gold" | "deep-blue" | "midnight-black";

export interface ScreenArea {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export interface ExportPreset {
  width: number;
  height: number;
}

export interface DeviceMeta {
  name: string;
  type: DeviceType;
  frameWidth: number;
  frameHeight: number;
  screen: ScreenArea;
  exportPresets: {
    appstore: ExportPreset;
    playstore: ExportPreset;
    social: ExportPreset;
  };
}

export type ExportPresetKey = 
  | "playstore-phone"
  | "playstore-feature"
  | "playstore-tablet-7"
  | "playstore-tablet-10"
  | "appstore"
  | "social"
  | "custom";

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
  highlightWord?: string;
  highlightColor?: string;
  glow?: boolean;
  glowColor?: string;
  gradient?: [string, string];
}

export type BackgroundType = "solid" | "gradient" | "image";

// Vector Overlay Types for Modern Play Store Graphics
export type VectorBackgroundType = 
  | "none"
  | "cyber-circuit"
  | "neon-beams"
  | "studio-floor"
  | "waves"
  | "aurora"
  | "dot-matrix"
  | "modern-grid"
  | "isometric-cards"
  | "stage-podium"
  | "diagonal-stripes"
  | "geometric-3d";

export interface VectorOverlayConfig {
  type: VectorBackgroundType;
  color: string;
  secondaryColor?: string;
  opacity: number;
  scale: number;
  positionY: number; // 0 (top) to 1 (bottom)
  wireframe?: boolean;
}

// Play Store Marketing & Social Proof Badges
export interface FeaturePill {
  id: string;
  text: string;
  icon?: "zap" | "shield" | "sparkles" | "star" | "check" | "lock" | "rocket" | "heart";
  bg?: string;
  textFill?: string;
}

export interface PlayStoreBadgesConfig {
  showRating: boolean;
  ratingScore: number; // e.g. 4.9
  ratingCount: string; // e.g. "120K+ Reviews"
  ratingStyle: "google-play" | "gold-star" | "compact-pill";
  ratingPosition: "top" | "bottom" | "above-device";

  showDownloads: boolean;
  downloadCount: string; // e.g. "1M+ Downloads"
  downloadIcon: "download" | "users" | "trophy" | "shield" | "flame";

  showFeaturePills: boolean;
  featurePills: FeaturePill[];

  // 3D Floating Holographic Shield Badge (as seen in Cyber Anti-Spam style)
  showFloatingShield?: boolean;
  shieldScore?: string; // e.g. "98%"
  shieldTitle?: string; // e.g. "Protection Score"
  shieldIcon?: "shield-check" | "phone-slash" | "lock" | "sparkles";
  shieldColor?: string;
}

export type TextPreset = "appstore" | "startup" | "bold" | "minimal" | "playstore-hero" | "neon-glow" | "cyber-cyan";

export interface TextPresetConfig {
  name: string;
  headlineFont: string;
  headlineWeight: number;
  headlineSize: number;
  subtitleFont: string;
  subtitleWeight: number;
  subtitleSize: number;
  headlineColor: string;
  subtitleColor: string;
}
