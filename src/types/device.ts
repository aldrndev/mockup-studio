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
  | "synthwave-grid"
  | "honeycomb-hex"
  | "speed-vortex"
  | "organic-blobs"
  | "stardust-particles"
  | "audio-equalizer"
  | "sunburst-rays"
  | "geometric-shards"
  | "circle-ripples";

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
  ratingX?: number; // 0 to 1 relative to frame width
  ratingY?: number; // 0 to 1 relative to frame height

  showDownloads: boolean;
  downloadCount: string; // e.g. "1M+ Downloads"
  downloadIcon: "download" | "users" | "trophy" | "shield" | "flame";
  downloadsX?: number;
  downloadsY?: number;

  showFeaturePills: boolean;
  featurePills: FeaturePill[];
  pillsX?: number;
  pillsY?: number;

  // 3D Floating Holographic Shield Badge (as seen in Cyber Anti-Spam style)
  showFloatingShield?: boolean;
  shieldScore?: string; // e.g. "98%"
  shieldTitle?: string; // e.g. "Protection Score"
  shieldIcon?: "shield-check" | "phone-slash" | "lock" | "sparkles";
  shieldColor?: string;
  shieldX?: number;
  shieldY?: number;
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

// -------------------------------------------------------------
// STUDIO PRO FEATURES TYPES
// -------------------------------------------------------------

export interface SecondaryDeviceConfig {
  enabled: boolean;
  deviceType: DeviceType;
  deviceColor: DeviceColor;
  screenshot: string | null;
  layout: "behind-left" | "behind-right" | "side-by-side" | "overlap-tilt" | "custom";
  scale: number;
  offsetX: number;
  offsetY: number;
  rotateY: number;
  rotateX: number;
  rotation: number;
  depth?: number;
}

export interface ScreenGlareConfig {
  enabled: boolean;
  opacity: number;
  style: "diagonal-curved" | "linear-streak" | "studio-soft";
}

export interface AppIconConfig {
  enabled: boolean;
  url: string | null;
  size: number;
  shape: "squircle" | "circle";
  glow?: boolean;
  x?: number; // 0 to 1 relative to frame width (default: 0.5)
  y?: number; // 0 to 1 relative to frame height (default: 0.04)
}

export type StoreBadgeType = "none" | "google-play" | "app-store" | "both";

export interface StoreBadgeConfig {
  type: StoreBadgeType;
  x?: number; // 0 to 1 relative to frame width (default: 0.5)
  y?: number; // 0 to 1 relative to frame height (default: 0.94)
  scale?: number;
}

export interface PromoStickerConfig {
  enabled: boolean;
  text: string;
  subtext?: string;
  icon: "trophy" | "star" | "award" | "flame" | "shield" | "discount";
  theme: "gold" | "indigo" | "emerald" | "rose" | "cyber";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "above-device" | "custom";
  x?: number; // 0 to 1 relative (default: 0.5)
  y?: number; // 0 to 1 relative (default: 0.42)
  depth?: number; // 3D Extrusion Depth
  rotateX?: number; // 3D Pitch
  rotateY?: number; // 3D Yaw
  rotation?: number; // 2D Rotation
}

export interface TestimonialConfig {
  enabled: boolean;
  name: string;
  handle?: string;
  review: string;
  rating: number;
  avatarEmoji?: string;
  x?: number; // 0 to 1 relative (default: 0.5)
  y?: number; // 0 to 1 relative (default: 0.88)
  depth?: number; // 3D Extrusion Depth
  rotateX?: number; // 3D Pitch
  rotateY?: number; // 3D Yaw
  rotation?: number; // 2D Rotation
}

export interface FloatingElementConfig {
  id: string;
  type: "emoji" | "preset" | "image";
  value: string; // preset ID ("gold-coin", "rocket", "shield", "diamond", "lightning", "shopping-bag", "heart", "chart", "star"), emoji or data URL
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  blur?: number;
  depth?: number; // 3D extrusion depth
  rotateX?: number;
  rotateY?: number;
}

export interface FloatingBarItem {
  id: string;
  text: string;
  icon?: string; // "calendar", "wand", "file", "clock", "check", "sparkles", "zap", "shield", "rocket", "heart", "chat", "brain", "star", "flame", "search", "bell", "user", "mail"
  bgColor?: string; // default: "#ffffff"
  textColor?: string; // default: "#0f172a"
  borderColor?: string; // default: "rgba(255,255,255,0.7)"
  x: number; // 0 to 1 relative to frame width
  y: number; // 0 to 1 relative to frame height
  scale?: number; // default: 1
  depth?: number; // 3D Extrusion thickness in px (default: 14)
  rotation?: number; // 2D rotation angle
  rotateX?: number; // 3D Pitch
  rotateY?: number; // 3D Yaw
  syncWithPhone3D?: boolean; // match phone's 3D angle (default: true)
}
