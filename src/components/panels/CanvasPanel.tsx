import React, { useState } from "react";
import {
  Maximize2,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Layers,
  Grid,
  ArrowLeftRight,
  Tv,
  Store,
  Apple,
  Info,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import type { CutPreset } from "../../store/useEditorStore";
import type { DeviceType } from "../../types/device";

export interface CanvasPresetItem {
  id: string;
  label: string;
  sub: string;
  width: number;
  height: number;
  aspect: string;
  category: "Google Play" | "Apple App Store" | "Tablets" | "Web & Social";
  icon: React.ElementType;
  targetDeviceType?: DeviceType;
  badge?: string;
  badgeColor?: string;
}

const CANVAS_SIZE_PRESETS: CanvasPresetItem[] = [
  // 1. GOOGLE PLAY STORE OFFICIAL REQUIREMENTS
  {
    id: "gp-phone-16-9",
    label: "Google Play (9:16 HD)",
    sub: "1080 × 1920 px • Rasio 9:16 (Min. 1080px tiap sisi)",
    width: 1080,
    height: 1920,
    aspect: "9:16",
    category: "Google Play",
    icon: Smartphone,
    targetDeviceType: "android",
    badge: "Syarat Promosi Play Store",
    badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
  },
  {
    id: "gp-phone-9-20",
    label: "Google Play (9:20 Tall)",
    sub: "1080 × 2400 px • Rasio 9:20 (Android Layar Panjang)",
    width: 1080,
    height: 2400,
    aspect: "9:20",
    category: "Google Play",
    icon: Smartphone,
    targetDeviceType: "android",
    badge: "Android Modern",
    badgeColor: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
  },
  {
    id: "gp-feature-graphic",
    label: "Google Play Feature Graphic",
    sub: "1024 × 500 px • Header Banner Toko Aplikasi",
    width: 1024,
    height: 500,
    aspect: "1024:500",
    category: "Google Play",
    icon: Monitor,
    targetDeviceType: "android",
    badge: "Banner Wajib",
    badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800/40",
  },
  {
    id: "gp-icon",
    label: "Google Play App Icon",
    sub: "512 × 512 px • Format 32-bit PNG",
    width: 512,
    height: 512,
    aspect: "1:1",
    category: "Google Play",
    icon: Store,
    targetDeviceType: "android",
    badge: "Ikon 512px",
    badgeColor: "text-zinc-400 bg-zinc-800 border-zinc-700",
  },

  // 2. APPLE APP STORE CONNECT REQUIREMENTS
  {
    id: "apple-6-9-6-7",
    label: "App Store 6.9\" & 6.7\" Display",
    sub: "1320 × 2868 px • iPhone 16 Pro Max / 15 / 14 Pro Max",
    width: 1320,
    height: 2868,
    aspect: "9:19.5",
    category: "Apple App Store",
    icon: Smartphone,
    targetDeviceType: "iphone",
    badge: "Wajib App Store",
    badgeColor: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
  },
  {
    id: "apple-6-5",
    label: "App Store 6.5\" Display",
    sub: "1242 × 2688 px • iPhone 11 Pro Max / XS Max",
    width: 1242,
    height: 2688,
    aspect: "9:19.5",
    category: "Apple App Store",
    icon: Smartphone,
    targetDeviceType: "iphone",
    badge: "Wajib App Store",
    badgeColor: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
  },
  {
    id: "apple-6-3-6-1",
    label: "App Store 6.3\" & 6.1\" Display",
    sub: "1206 × 2622 px • iPhone 16 Pro / 15 Pro / 14",
    width: 1206,
    height: 2622,
    aspect: "9:19.5",
    category: "Apple App Store",
    icon: Smartphone,
    targetDeviceType: "iphone",
  },
  {
    id: "apple-5-5",
    label: "App Store 5.5\" Display",
    sub: "1242 × 2208 px • iPhone 8 Plus / 7 Plus",
    width: 1242,
    height: 2208,
    aspect: "9:16",
    category: "Apple App Store",
    icon: Smartphone,
    targetDeviceType: "iphone",
  },
  {
    id: "apple-icon",
    label: "App Store Master Icon",
    sub: "1024 × 1024 px • App Store Connect Icon",
    width: 1024,
    height: 1024,
    aspect: "1:1",
    category: "Apple App Store",
    icon: Apple,
    targetDeviceType: "iphone",
    badge: "Ikon 1024px",
    badgeColor: "text-zinc-400 bg-zinc-800 border-zinc-700",
  },

  // 3. TABLET REQUIREMENTS (GOOGLE PLAY & APPLE)
  {
    id: "tablet-7-playstore",
    label: "Tablet 7 Inci (Play Store 9:16)",
    sub: "1080 × 1920 px • Rasio 9:16 Resmi Play Store",
    width: 1080,
    height: 1920,
    aspect: "9:16",
    category: "Tablets",
    icon: Tablet,
    targetDeviceType: "tablet",
    badge: "Play Store 7\"",
    badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
  },
  {
    id: "tablet-10-playstore",
    label: "Tablet 10 Inci (Play Store 9:16)",
    sub: "1080 × 1920 px • Rasio 9:16 (Min. 1080px)",
    width: 1080,
    height: 1920,
    aspect: "9:16",
    category: "Tablets",
    icon: Tablet,
    targetDeviceType: "tablet",
    badge: "Play Store 10\"",
    badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
  },
  {
    id: "tablet-7-wide",
    label: "Tablet 7 Inci (16:10 Kompak)",
    sub: "1200 × 1920 px • Standar Layar Tablet 7\"",
    width: 1200,
    height: 1920,
    aspect: "10:16",
    category: "Tablets",
    icon: Tablet,
    targetDeviceType: "tablet",
  },
  {
    id: "tablet-10-wide",
    label: "Tablet 10 Inci (16:10 Widescreen)",
    sub: "1600 × 2560 px • Layar Resolusi Tinggi 10\"",
    width: 1600,
    height: 2560,
    aspect: "10:16",
    category: "Tablets",
    icon: Tablet,
    targetDeviceType: "tablet",
  },
  {
    id: "ipad-pro-13",
    label: "iPad Pro 13\" & 12.9\" Display",
    sub: "2048 × 2732 px • Wajib Resmi App Store iPad",
    width: 2048,
    height: 2732,
    aspect: "3:4",
    category: "Tablets",
    icon: Tablet,
    targetDeviceType: "tablet",
    badge: "Wajib iPad Pro",
    badgeColor: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
  },
  {
    id: "ipad-pro-11",
    label: "iPad Pro 11\" & iPad Air",
    sub: "1668 × 2388 px • Standar Layar iPad Air",
    width: 1668,
    height: 2388,
    aspect: "1:1.43",
    category: "Tablets",
    icon: Tablet,
    targetDeviceType: "tablet",
  },

  // 4. WEB, DESKTOP & SOCIAL MEDIA
  {
    id: "desktop-fhd",
    label: "Desktop Web (1080p FHD)",
    sub: "1920 × 1080 px • Showcase Web & SaaS (16:9)",
    width: 1920,
    height: 1080,
    aspect: "16:9",
    category: "Web & Social",
    icon: Tv,
    targetDeviceType: "desktop",
  },
  {
    id: "social-square",
    label: "Square Post (1:1 Ratio)",
    sub: "1080 × 1080 px • Instagram Feed & Portfolio",
    width: 1080,
    height: 1080,
    aspect: "1:1",
    category: "Web & Social",
    icon: Sparkles,
  },
  {
    id: "social-portrait",
    label: "Portrait Post (4:5 Ratio)",
    sub: "1080 × 1350 px • Instagram Portrait Feed",
    width: 1080,
    height: 1350,
    aspect: "4:5",
    category: "Web & Social",
    icon: Sparkles,
  },
  {
    id: "social-story",
    label: "Story & Reels (9:16)",
    sub: "1080 × 1920 px • Instagram Story & TikTok",
    width: 1080,
    height: 1920,
    aspect: "9:16",
    category: "Web & Social",
    icon: Sparkles,
  },
];

const STORE_CATEGORIES = [
  "All",
  "Google Play",
  "Apple App Store",
  "Tablets",
  "Web & Social",
] as const;

const CUT_PRESETS: {
  key: CutPreset;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { key: "even", label: "Individual Frame Grid", desc: "Evenly spaced standalone screenshots", icon: Grid },
  { key: "overlap", label: "Connected Panorama Strip", desc: "Seamless continuous flow across screenshots", icon: Layers },
  { key: "hero", label: "Hero Center Spotlight", desc: "Center screenshot prominently enlarged", icon: Monitor },
];

export const CanvasPanel: React.FC = () => {
  const {
    canvasWidth,
    canvasHeight,
    canvasPresetId,
    deviceType,
    setCanvasSize,
    cutPreset,
    setCutPreset,
    frames,
    addFrame,
    removeFrame,
  } = useEditorStore();

  const [activeCategory, setActiveCategory] = useState<string>("All");

  const currentW = canvasWidth ?? 1080;
  const currentH = canvasHeight ?? 2400;

  const filteredPresets =
    activeCategory === "All"
      ? CANVAS_SIZE_PRESETS
      : CANVAS_SIZE_PRESETS.filter((p) => p.category === activeCategory);

  const handleSwapOrientation = () => {
    setCanvasSize(currentH, currentW);
  };

  return (
    <div className="p-4 space-y-5 select-none font-sans">
      {/* 1. STORE GUIDELINES SUMMARY ACCORDION / BADGE */}
      <div className="p-3 rounded-xl bg-linear-to-r from-indigo-950/40 via-purple-950/20 to-zinc-900 border border-indigo-800/40 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
          <Info size={14} className="text-indigo-400 shrink-0" />
          <span>Standar Requirement Toko Aplikasi</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Semua ukuran preset telah disesuaikan agar <span className="text-zinc-200 font-semibold">memenuhi syarat promosi</span> Google Play (rasio 9:16 / 16:9, min. 1080px) dan Apple App Store Connect.
        </p>
      </div>

      {/* 2. CUSTOM CANVAS DIMENSIONS */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Canvas Dimensions
            </h3>
          </div>
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/50">
            {currentW} × {currentH} px
          </span>
        </div>

        {/* Custom Width & Height Inputs */}
        <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800/90 space-y-2.5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-zinc-400">
                Width
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={320}
                  max={7680}
                  step={10}
                  value={currentW}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1080;
                    setCanvasSize(val, currentH);
                  }}
                  className="w-24 h-7 px-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-white text-right outline-none focus:border-indigo-500 font-bold"
                />
                <span className="text-[11px] font-mono text-zinc-500">px</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-zinc-400">
                Height
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={320}
                  max={7680}
                  step={10}
                  value={currentH}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 2400;
                    setCanvasSize(currentW, val);
                  }}
                  className="w-24 h-7 px-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-white text-right outline-none focus:border-indigo-500 font-bold"
                />
                <span className="text-[11px] font-mono text-zinc-500">px</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSwapOrientation}
            className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-[11px] font-semibold text-zinc-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeftRight size={12} className="text-indigo-400" />
            <span>
              Flip to {currentW > currentH ? "Portrait (Vertical)" : "Landscape (Horizontal)"}
            </span>
          </button>
        </div>
      </section>

      {/* 3. OFFICIAL STORE PRESET SYSTEM */}
      <section className="space-y-2.5 pt-1 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Store Presets
          </span>
          <span className="text-[10px] text-zinc-500">1-Click Apply</span>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap gap-1">
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Compact 1-Column Preset Stack */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-0.5">
          {filteredPresets.map((preset) => {
            const isSelected =
              canvasPresetId === preset.id ||
              (!canvasPresetId &&
                preset.width === currentW &&
                preset.height === currentH &&
                (!preset.targetDeviceType || preset.targetDeviceType === deviceType));
            const Icon = preset.icon;

            return (
              <button
                key={preset.id}
                onClick={() =>
                  setCanvasSize(preset.width, preset.height, {
                    deviceType: preset.targetDeviceType,
                    presetId: preset.id,
                  })
                }
                className={`w-full px-2.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all group text-left cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/40 shadow-sm"
                    : "bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-300"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-indigo-500/30 text-indigo-300"
                      : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-200"
                  }`}
                >
                  <Icon size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? "text-white" : "text-zinc-200 group-hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                      {preset.aspect}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                    {preset.sub}
                  </div>
                  {preset.badge && (
                    <div className="mt-1">
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border inline-block ${
                          preset.badgeColor || "text-zinc-400 bg-zinc-800 border-zinc-700"
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MULTI-FRAME PANORAMA FLOW / CUT PRESET */}
      <section className="space-y-2 pt-1 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Carousel Layout
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {frames.length} Frame{frames.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-1.5">
          {CUT_PRESETS.map((preset) => {
            const isSelected = cutPreset === preset.key;
            const Icon = preset.icon;

            return (
              <button
                key={preset.key}
                onClick={() => setCutPreset(preset.key)}
                className={`w-full p-2 rounded-xl border flex items-start gap-2.5 transition-all text-left group cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/40"
                    : "bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80 text-zinc-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 text-zinc-400 group-hover:text-white"
                  }`}
                >
                  <Icon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-zinc-200 block">
                    {preset.label}
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                    {preset.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. TOTAL FRAME COUNT (1 TO 4) */}
      <section className="space-y-2 pt-1 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Frame Count (Max 4)
          </h3>
          <span className="text-xs font-mono font-bold text-indigo-400">
            {frames.length} / 4
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => {
                const diff = num - frames.length;
                if (diff > 0) {
                  for (let i = 0; i < diff; i++) addFrame();
                } else if (diff < 0) {
                  for (let i = 0; i < Math.abs(diff); i++) {
                    const last = frames[frames.length - 1 - i];
                    if (last && frames.length > 1) removeFrame(last.id);
                  }
                }
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                frames.length === num
                  ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/40"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80"
              }`}
            >
              {num} {num === 1 ? "Slide" : "Slides"}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
