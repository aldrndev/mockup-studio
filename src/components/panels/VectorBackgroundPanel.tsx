import React, { useState } from "react";
import {
  PaintBucket,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Sun,
  Lightbulb,
  ScanLine,
  CircleOff,
  Zap,
  Sliders,
} from "lucide-react";
import { useEditorStore, GRADIENT_PRESETS } from "../../store/useEditorStore";
import { VECTOR_PRESETS } from "../../utils/vectorBackgrounds";
import type { VectorCategory } from "../../utils/vectorBackgrounds";
import type { VectorBackgroundType, BackgroundType } from "../../types/device";
import type { BackgroundStyle } from "../../store/useEditorStore";

export const VectorBackgroundPanel: React.FC = () => {
  const {
    background,
    setBackground,
    vectorOverlay,
    setVectorOverlay,
  } = useEditorStore();

  const [activeCategory, setActiveCategory] = useState<VectorCategory>("all");

  const filteredPresets = VECTOR_PRESETS.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  return (
    <div className="p-4 space-y-6">
      {/* 1. BASE BACKGROUND LAYER */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            1. Base Background
          </h3>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-3 gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {(["gradient", "solid", "image"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setBackground({ type: t as BackgroundType })}
              className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${
                background.type === t
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t === "gradient" && <Palette size={13} />}
              {t === "solid" && <PaintBucket size={13} />}
              {t === "image" && <ImageIcon size={13} />}
              <span>{t}</span>
            </button>
          ))}
        </div>

        {/* Color Pickers */}
        {background.type !== "image" && (
          <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
            <div className="grid grid-cols-2 gap-3">
              {/* Primary Color */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400">
                  Primary Color
                </span>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg">
                  <input
                    type="color"
                    value={background.color1}
                    onChange={(e) => setBackground({ color1: e.target.value })}
                    className="w-7 h-7 rounded-md cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={background.color1}
                    onChange={(e) => setBackground({ color1: e.target.value })}
                    className="w-full text-[11px] font-mono uppercase bg-transparent text-zinc-300 outline-none"
                  />
                </div>
              </div>

              {/* Secondary Color (for Gradient) */}
              {background.type === "gradient" && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-400">
                    Secondary Color
                  </span>
                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg">
                    <input
                      type="color"
                      value={background.color2}
                      onChange={(e) => setBackground({ color2: e.target.value })}
                      className="w-7 h-7 rounded-md cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={background.color2}
                      onChange={(e) => setBackground({ color2: e.target.value })}
                      className="w-full text-[11px] font-mono uppercase bg-transparent text-zinc-300 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Curated Gradient Swatches */}
            {background.type === "gradient" && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Curated Palettes
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        setBackground({ color1: p.c1, color2: p.c2 })
                      }
                      className="h-7 rounded-lg border border-white/10 relative overflow-hidden transition-all hover:scale-105 hover:border-white/30"
                      title={p.name}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Image Upload */}
        {background.type === "image" && (
          <div className="space-y-2">
            {background.imageUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-700">
                <img
                  src={background.imageUrl}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setBackground({ imageUrl: null })}
                  className="absolute top-2 right-2 px-2 py-1 bg-black/70 hover:bg-red-600/80 text-white rounded text-[10px] font-semibold backdrop-blur-sm transition-colors"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/40 cursor-pointer p-3 group transition-all">
                <ImageIcon size={18} className="text-zinc-400 group-hover:text-indigo-400" />
                <span className="text-xs text-zinc-400 font-medium">
                  Upload Wallpaper Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setBackground({
                          imageUrl: ev.target?.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        )}
      </section>

      {/* 2. VECTOR BACKGROUND OVERLAYS (EXPANDED TO 20 STYLES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              2. Vector Graphics & Overlays
            </h3>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {VECTOR_PRESETS.length} STYLES
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All" },
            { id: "cyber", label: "⚡ Cyber & Neon" },
            { id: "fluid", label: "🌊 Fluid & Glow" },
            { id: "geometric", label: "📐 Geometric" },
            { id: "minimal", label: "✨ Minimal" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as VectorCategory)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-all ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vector Preset Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-90 overflow-y-auto pr-1 scrollbar-thin">
          {filteredPresets.map((vp) => (
            <button
              key={vp.type}
              onClick={() =>
                setVectorOverlay({
                  type: vp.type as VectorBackgroundType,
                  color: vp.defaultColor,
                  secondaryColor: vp.defaultSecondary,
                  opacity: vp.type === "none" ? 0 : vp.defaultOpacity,
                })
              }
              className={`p-2.5 rounded-xl border text-left transition-all ${
                vectorOverlay.type === vp.type
                  ? "bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="text-[11px] font-bold mb-0.5 truncate">
                {vp.label}
              </div>
              <div className="text-[9px] text-zinc-500 line-clamp-2">
                {vp.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Vector Controls when active */}
        {vectorOverlay.type !== "none" && (
          <div className="space-y-3.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 animate-in fade-in duration-200">
            {/* Color Accents */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400">
                  Vector Primary
                </span>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg">
                  <input
                    type="color"
                    value={vectorOverlay.color}
                    onChange={(e) =>
                      setVectorOverlay({ color: e.target.value })
                    }
                    className="w-6 h-6 rounded cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={vectorOverlay.color}
                    onChange={(e) =>
                      setVectorOverlay({ color: e.target.value })
                    }
                    className="w-full text-[10px] font-mono uppercase bg-transparent text-zinc-300 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400">
                  Vector Secondary
                </span>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg">
                  <input
                    type="color"
                    value={vectorOverlay.secondaryColor || "#38bdf8"}
                    onChange={(e) =>
                      setVectorOverlay({ secondaryColor: e.target.value })
                    }
                    className="w-6 h-6 rounded cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={vectorOverlay.secondaryColor || "#38bdf8"}
                    onChange={(e) =>
                      setVectorOverlay({ secondaryColor: e.target.value })
                    }
                    className="w-full text-[10px] font-mono uppercase bg-transparent text-zinc-300 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-400 font-medium">Vector Opacity</span>
                <span className="font-mono text-zinc-400">
                  {Math.round(vectorOverlay.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={vectorOverlay.opacity}
                onChange={(e) =>
                  setVectorOverlay({ opacity: parseFloat(e.target.value) })
                }
                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Scale Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-400 font-medium">Vector Scale</span>
                <span className="font-mono text-zinc-400">
                  {vectorOverlay.scale.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={vectorOverlay.scale}
                onChange={(e) =>
                  setVectorOverlay({ scale: parseFloat(e.target.value) })
                }
                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Position Y Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-400 font-medium">Vertical Position</span>
                <span className="font-mono text-zinc-400">
                  {Math.round(vectorOverlay.positionY * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={vectorOverlay.positionY}
                onChange={(e) =>
                  setVectorOverlay({ positionY: parseFloat(e.target.value) })
                }
                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </section>

      {/* 3. LIGHTING & ATMOSPHERE FX */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            3. Lighting & Atmosphere
          </h3>
        </div>

        {/* Lighting Styles */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "none", label: "Flat", icon: CircleOff },
            { id: "radial", label: "Soft Glow", icon: Sun },
            { id: "spotlight", label: "Spotlight", icon: Lightbulb },
            { id: "beam", label: "Laser Beam", icon: ScanLine },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setBackground({ style: item.id as BackgroundStyle })
              }
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
                background.style === item.id
                  ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <item.icon size={14} className="text-indigo-400" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="space-y-2 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
          {/* Vignette Toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-300 font-medium">
              Soft Edge Vignette
            </span>
            <input
              type="checkbox"
              checked={background.vignette}
              onChange={(e) => setBackground({ vignette: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          {/* Backdrop Panel Toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-300 font-medium">
              Device Backdrop Glow Panel
            </span>
            <input
              type="checkbox"
              checked={background.backdrop}
              onChange={(e) => setBackground({ backdrop: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </label>

          {/* Film Grain Intensity */}
          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-400 font-medium flex items-center gap-1">
                <Zap size={11} /> Film Grain Texture
              </span>
              <span className="font-mono text-zinc-400">
                {Math.round(background.noise * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.06"
              step="0.01"
              value={background.noise}
              onChange={(e) =>
                setBackground({ noise: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
