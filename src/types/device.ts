export type DeviceType = "iphone" | "android" | "tablet" | "desktop";

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

export type ExportPresetKey = "appstore" | "playstore" | "social";

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

export type BackgroundType = "solid" | "gradient";

export interface BackgroundConfig {
  type: BackgroundType;
  color1: string;
  color2: string;
  angle: number;
}

export type TextPreset = "appstore" | "startup" | "bold";

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
