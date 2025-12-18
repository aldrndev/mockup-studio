import { useEditorStore } from "../store/useEditorStore";
import {
  PaintBucket,
  Palette,
  Zap,
  Grid3X3,
  Droplets,
  LayoutGrid,
  CircleOff,
  Lightbulb,
  Sun,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
  Monitor,
  ScanLine,
} from "lucide-react";
import type { BackgroundStyle } from "../store/useEditorStore";
import { GRADIENT_PRESETS } from "../store/useEditorStore";

export function BackgroundPicker() {
  const { background, setBackground } = useEditorStore();

  // Local state for texture toggle (derived from store but controls UI visibility)
  const isTextureActive = background.noise > 0 || background.pattern !== "none";

  const handleTextureToggle = (active: boolean) => {
    if (active) {
      // Set safe defaults behavior
      setBackground({ noise: 0.02, pattern: "none" }); // 2% recommended start
    } else {
      setBackground({ noise: 0, pattern: "none" });
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {" "}
      {/* 32px gap between sections */}
      {/* 1. BASE LAYER */}
      <section>
        <div className="flex items-center gap-2 !mb-2 !mt-1 px-1">
          {" "}
          {/* 20px bottom margin from title */}
          <div className="w-1 h-3 bg-white/40 rounded-full !mt-2 !mb-2" />
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest !mt-2 !mb-2">
            Base Layer
          </h3>
        </div>

        {/* Content Group - Type Selector */}
        <div className="flex gap-3 mb-4">
          {" "}
          {/* 12px gap between buttons */}
          <button
            onClick={() => setBackground({ type: "solid" })}
            className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-[13px] font-medium transition-all px-3 border ${
              background.type === "solid"
                ? "bg-zinc-800 border-zinc-600 text-white shadow-sm ring-1 ring-white/10"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
            }`}
          >
            <PaintBucket size={18} />
            Solid
          </button>
          <button
            onClick={() => setBackground({ type: "gradient" })}
            className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-[13px] font-medium transition-all px-3 border ${
              background.type === "gradient"
                ? "bg-zinc-800 border-zinc-600 text-white shadow-sm ring-1 ring-white/10"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
            }`}
          >
            <Palette size={18} />
            Gradient
          </button>
        </div>

        {/* Base Controls */}
        <div className="space-y-4">
          {" "}
          {/* 16px vertical spacing between groups */}
          {/* Custom Color Pickers */}
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2 !mt-4">
              <label className="text-[10px] font-medium text-zinc-500">
                Primary
              </label>
              <div className="relative group !mt-1">
                <input
                  type="color"
                  value={background.color1}
                  onChange={(e) => setBackground({ color1: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button
                  className="h-10 w-full rounded-xl border border-zinc-700/50 flex items-center justify-center relative overflow-hidden transition-all group-hover:border-zinc-500"
                  style={{ background: background.color1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </button>
              </div>
            </div>

            {background.type === "gradient" && (
              <div className="flex-1 space-y-2 !mt-4">
                <label className="text-[10px] font-medium text-zinc-500">
                  Secondary
                </label>
                <div className="relative group !mt-1">
                  <input
                    type="color"
                    value={background.color2}
                    onChange={(e) => setBackground({ color2: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button
                    className="h-10 w-full rounded-xl border border-zinc-700/50 flex items-center justify-center relative overflow-hidden transition-all group-hover:border-zinc-500"
                    style={{ background: background.color2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Gradient Presets (New) */}
          {background.type === "gradient" && (
            <div className="!mt-4">
              <label className="!mb-1 text-[10px] font-medium text-zinc-500 block">
                Curated Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() =>
                      setBackground({ color1: preset.c1, color2: preset.c2 })
                    }
                    className="h-8 rounded-xl border border-white/5 relative overflow-hidden group transition-all hover:scale-[1.02] hover:border-white/20"
                    title={preset.name}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})`,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Gradient Direction Presets */}
          {background.type === "gradient" && (
            <div className="pt-1 !mt-4">
              <label className="text-[10px] font-medium text-zinc-500 mb-2 block ml-1">
                Gradient Direction
              </label>
              <div className="grid grid-cols-4 gap-2 !mt-1">
                {[
                  { angle: 90, icon: ArrowRight, label: "Right" },
                  { angle: 180, icon: ArrowDown, label: "Down" },
                  { angle: 135, icon: ArrowDownRight, label: "Diag 1" },
                  { angle: 45, icon: ArrowUpRight, label: "Diag 2" },
                ].map((preset) => (
                  <button
                    key={preset.angle}
                    onClick={() => setBackground({ angle: preset.angle })}
                    className={`h-10 flex items-center justify-center rounded-xl border transition-all ${
                      background.angle === preset.angle
                        ? "bg-zinc-800 border-zinc-600 text-white shadow-sm"
                        : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
                    }`}
                    title={`${preset.label}`}
                  >
                    <preset.icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Divider */}
      <div className="h-px bg-zinc-800/50 w-full" />
      {/* 2. STYLE LAYER */}
      <section>
        <div className="flex items-center gap-2 !mb-2  px-1">
          <div className="w-1 h-3 bg-violet-500/50 rounded-full !mb-2" />
          <h3 className="!mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Lighting Style
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {" "}
          {/* 2x2 Grid for 4 options */}
          {[
            { id: "none", label: "None", icon: CircleOff, desc: "Flat" },
            { id: "radial", label: "Glow", icon: Sun, desc: "Soft" },
            { id: "spotlight", label: "Spot", icon: Lightbulb, desc: "Beam" },
            { id: "beam", label: "Beam", icon: ScanLine, desc: "Strip" },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() =>
                setBackground({ style: style.id as BackgroundStyle })
              }
              className={`h-10 flex items-center justify-center gap-2 rounded-xl border text-center transition-all px-2 relative group ${
                background.style === style.id
                  ? "bg-zinc-800 border-violet-500/50 text-white ring-1 ring-violet-500/20"
                  : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              <style.icon
                size={18}
                className={`transition-colors ${
                  background.style === style.id ? "text-violet-400" : ""
                }`}
              />
              <span className="text-[13px] font-medium">{style.label}</span>
            </button>
          ))}
        </div>
      </section>
      {/* 2b. FINISHING (Vignette & Backdrop) */}
      <section>
        <div className="flex items-center gap-2 !mb-2 px-1">
          <div className="w-1 h-3 bg-blue-500/50 rounded-full !mb-2" />
          <h3 className="!mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Finishing Touches
          </h3>
        </div>

        <div className="!space-y-2 bg-zinc-900/40 rounded-lg !p-2">
          {/* Vignette Toggle */}
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-md ${
                  background.vignette
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-zinc-800/50 text-zinc-600"
                }`}
              >
                <Monitor size={14} />
              </div>
              <span className="text-[13px] font-medium text-zinc-400">
                Soft Vignette
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right">
              <input
                type="checkbox"
                checked={background.vignette}
                onChange={(e) => setBackground({ vignette: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-500 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-800 peer-checked:after:bg-blue-500 peer-checked:after:border-blue-500"></div>
            </label>
          </div>

          {/* Backdrop Panel Toggle */}
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-md ${
                  background.backdrop
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-zinc-800/50 text-zinc-600"
                }`}
              >
                <LayoutGrid size={14} />
              </div>
              <span className="text-[13px] font-medium text-zinc-400">
                Backdrop Panel
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right">
              <input
                type="checkbox"
                checked={background.backdrop}
                onChange={(e) => setBackground({ backdrop: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-500 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-800 peer-checked:after:bg-blue-500 peer-checked:after:border-blue-500"></div>
            </label>
          </div>
        </div>
      </section>
      {/* Divider */}
      <div className="h-px bg-zinc-800/50 w-full" />
      {/* 3. TEXTURE LAYER */}
      <section>
        <div className="flex items-center justify-between !mb-3 px-1">
          <div className="flex items-center gap-2">
            <div
              className={`w-1 h-3 rounded-full transition-colors ${
                isTextureActive ? "bg-amber-400" : "bg-zinc-700"
              }`}
            />
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Texture
            </h3>
          </div>

          <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right">
            <input
              type="checkbox"
              checked={isTextureActive}
              onChange={(e) => handleTextureToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-500 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-800 peer-checked:after:bg-amber-400 peer-checked:after:border-amber-400"></div>
          </label>
        </div>

        {isTextureActive && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Pattern Selector */}
            <div className="mb-6">
              {/* Spacing between groups */}
              <span className="!mb-1 !mt-1 text-[10px] font-medium text-zinc-500 ml-1 mb-2 block">
                Pattern
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "none", label: "None", icon: LayoutGrid },
                  { id: "dots", label: "Dots", icon: Droplets },
                  { id: "grid", label: "Grid", icon: Grid3X3 },
                ].map((pat) => (
                  <button
                    key={pat.id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setBackground({ pattern: pat.id as any })}
                    className={`h-10 flex items-center justify-center gap-2 rounded-xl border transition-all px-2 ${
                      background.pattern === pat.id
                        ? "bg-zinc-800 border-amber-500/30 text-white shadow-sm"
                        : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
                    }`}
                  >
                    <pat.icon
                      size={18}
                      className={
                        background.pattern === pat.id ? "text-amber-400" : ""
                      }
                    />
                    <span className="text-[13px] font-medium">{pat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Noise Slider */}
            <div className="px-1 mt-6">
              {" "}
              {/* 24px top margin approx (16+8) */}
              <div className="flex justify-between items-end !mb-2 !mt-4">
                {" "}
                {/* 12px bottom spacing */}
                <label className="text-[10px] font-medium text-zinc-500 flex items-center gap-1.5">
                  <Zap size={12} />
                  Grain Intensity
                </label>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {(background.noise * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.06"
                step="0.01"
                value={background.noise}
                onChange={(e) =>
                  setBackground({ noise: Number(e.target.value) })
                }
                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-amber-400 cursor-pointer hover:accent-amber-300 block mb-3"
              />
              <p className="text-[9px] text-zinc-600 text-center !mt-2">
                Recommended: 2–3%
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
