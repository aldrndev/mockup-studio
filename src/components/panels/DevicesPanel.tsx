import React from "react";
import {
  Smartphone,
  RotateCw,
  Eye,
  Layers,
  Sparkles,
  Upload,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import type { DeviceType, DeviceStyle, DeviceColor } from "../../types/device";

const DEVICE_MODELS: { type: DeviceType; label: string; sub: string }[] = [
  { type: "android", label: "Galaxy S25 Ultra", sub: "Flagship Android" },
  { type: "iphone", label: "iPhone 16 Pro", sub: "Titanium Chassis" },
  { type: "tablet", label: "Tablet / iPad", sub: "10-inch Display" },
  { type: "desktop", label: "MacBook Pro", sub: "Laptop View" },
];

const DEVICE_STYLES: { id: DeviceStyle; label: string }[] = [
  { id: "realistic", label: "Realistic 3D Metal" },
  { id: "clay", label: "Minimalist 3D Clay" },
];

const COLOR_FINISHES: { id: DeviceColor; name: string; hex: string }[] = [
  { id: "titanium-dark", name: "Dark Titanium", hex: "#38383b" },
  { id: "titanium-natural", name: "Natural Titanium", hex: "#6b6b70" },
  { id: "silver", name: "Silver Frost", hex: "#a1a1aa" },
  { id: "gold", name: "Desert Gold", hex: "#b45309" },
  { id: "deep-blue", name: "Deep Blue", hex: "#1e3a8a" },
  { id: "midnight-black", name: "Midnight Black", hex: "#18181b" },
];

const ANGLE_PRESETS = [
  { id: "front", label: "Front 0°", icon: "📱" },
  { id: "isometric-left", label: "3D Left", icon: "📐" },
  { id: "isometric-right", label: "3D Right", icon: "📐" },
  { id: "floating-hero", label: "Hero Tilt", icon: "✨" },
  { id: "perspective-tilt", label: "Perspective", icon: "⚡" },
] as const;

function SliderItem({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-zinc-400 font-medium">{label}</span>
        <span className="font-mono text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
          {Number.isInteger(value) ? value : value.toFixed(1)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 hover:accent-indigo-400 cursor-pointer"
      />
    </div>
  );
}

export const DevicesPanel: React.FC = () => {
  const {
    frames,
    activeFrameId,
    deviceStyle,
    deviceColor,
    setDeviceType,
    setDeviceStyle,
    setDeviceColor,
    setFrameProperties,
    toggleFrameDevice,
    applyAnglePreset,
    setScreenshot,
  } = useEditorStore();

  const activeFrame = frames.find((f) => f.id === activeFrameId) || frames[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* 1. SCREENSHOT UPLOAD */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              App Screenshot
            </h3>
          </div>
          {activeFrame.screenshot && (
            <button
              onClick={() => setScreenshot(null)}
              className="text-[10px] text-red-400 hover:underline"
            >
              Remove
            </button>
          )}
        </div>

        <label className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-indigo-500/60 cursor-pointer transition-all p-3 group">
          {activeFrame.screenshot ? (
            <div className="flex items-center gap-3 w-full">
              <img
                src={activeFrame.screenshot}
                alt="Uploaded"
                className="w-12 h-16 object-cover rounded-lg border border-zinc-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  Screenshot Loaded
                </span>
                <span className="text-[10px] text-zinc-400">
                  Click to replace image
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-indigo-300 group-hover:scale-110 transition-all">
                <Upload size={16} />
              </div>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-300 font-medium">
                Click or Drop Screenshot here
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </section>

      {/* 2. DEVICE MODEL SELECTION */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Device Model
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEVICE_MODELS.map((m) => (
            <button
              key={m.type}
              onClick={() => setDeviceType(m.type)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeFrame.deviceType === m.type
                  ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/20"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="text-xs font-bold text-white mb-0.5 truncate">
                {m.label}
              </div>
              <div className="text-[10px] text-zinc-500">{m.sub}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. MATERIAL & 3D FINISH */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            3D Finish & Color
          </h3>
        </div>

        {/* Style switch */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 gap-1">
          {DEVICE_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setDeviceStyle(s.id)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                (activeFrame.deviceStyle || deviceStyle) === s.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Color Palette Swatches */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Chassis Color
          </span>
          <div className="grid grid-cols-6 gap-1.5">
            {COLOR_FINISHES.map((c) => (
              <button
                key={c.id}
                onClick={() => setDeviceColor(c.id)}
                className={`h-8 rounded-lg border relative flex items-center justify-center transition-all ${
                  (activeFrame.deviceColor || deviceColor) === c.id
                    ? "border-indigo-400 ring-2 ring-indigo-500/30 scale-105"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent rounded-lg pointer-events-none" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 1-CLICK 3D ANGLE PRESETS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              3D Angle Presets
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {ANGLE_PRESETS.map((ang) => (
            <button
              key={ang.id}
              onClick={() => applyAnglePreset(ang.id)}
              className="px-2 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-800/80 text-zinc-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>{ang.icon}</span>
              <span>{ang.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. MANUAL 3D TRANSFORM SLIDERS */}
      <section className="space-y-4 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              3D Transform Tuner
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Show/Hide Device Toggle */}
            <button
              onClick={() => toggleFrameDevice(activeFrame.id)}
              className={`p-1.5 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all ${
                activeFrame.showDevice
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-zinc-800 text-zinc-500"
              }`}
              title="Toggle Device Visibility"
            >
              <Eye size={12} />
              <span>{activeFrame.showDevice ? "Visible" : "Hidden"}</span>
            </button>

            {/* Reset */}
            <button
              onClick={() =>
                setFrameProperties({
                  scale: 1.05,
                  rotation: 0,
                  rotateX: 0,
                  rotateY: 0,
                  skewX: 0,
                  skewY: 0,
                  offsetX: 0,
                  offsetY: 0,
                })
              }
              className="text-[10px] text-zinc-500 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {activeFrame.showDevice && (
          <div className="space-y-3.5 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/60">
            <div className="grid grid-cols-2 gap-3">
              <SliderItem
                label="Pitch (Rotate X)"
                value={activeFrame.rotateX || 0}
                min={-60}
                max={60}
                unit="°"
                onChange={(val) => setFrameProperties({ rotateX: val })}
              />
              <SliderItem
                label="Yaw (Rotate Y)"
                value={activeFrame.rotateY || 0}
                min={-60}
                max={60}
                unit="°"
                onChange={(val) => setFrameProperties({ rotateY: val })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SliderItem
                label="3D Depth (Thickness)"
                value={activeFrame.depth || 52}
                min={20}
                max={100}
                step={2}
                unit="px"
                onChange={(val) => setFrameProperties({ depth: val })}
              />
              <SliderItem
                label="Rotation"
                value={activeFrame.rotation || 0}
                min={-180}
                max={180}
                unit="°"
                onChange={(val) => setFrameProperties({ rotation: val })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SliderItem
                label="Scale"
                value={activeFrame.scale || 1}
                min={0.3}
                max={2.5}
                step={0.05}
                unit="x"
                onChange={(val) => setFrameProperties({ scale: val })}
              />
              <SliderItem
                label="Offset X"
                value={activeFrame.offsetX || 0}
                min={-600}
                max={600}
                step={10}
                onChange={(val) => setFrameProperties({ offsetX: val })}
              />
              <SliderItem
                label="Offset Y"
                value={activeFrame.offsetY || 0}
                min={-600}
                max={600}
                step={10}
                onChange={(val) => setFrameProperties({ offsetY: val })}
              />
            </div>

            {/* Shadow & Reflection Toggles */}
            <div className="pt-2 border-t border-zinc-800/60 grid grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <span className="text-[11px] font-semibold text-zinc-300">Drop Shadow</span>
                <input
                  type="checkbox"
                  checked={activeFrame.showShadow !== false}
                  onChange={(e) =>
                    setFrameProperties({ showShadow: e.target.checked })
                  }
                  className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 cursor-pointer">
                <span className="text-[11px] font-semibold text-zinc-300">Floor Reflection</span>
                <input
                  type="checkbox"
                  checked={activeFrame.showReflection === true}
                  onChange={(e) =>
                    setFrameProperties({ showReflection: e.target.checked })
                  }
                  className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </section>

      {/* 5. SCREEN GLASS GLARE & SPECULAR SHEEN */}
      <section className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Screen Glass Glare
            </h3>
          </div>
          <input
            type="checkbox"
            checked={activeFrame.screenGlare?.enabled === true}
            onChange={(e) =>
              useEditorStore
                .getState()
                .setScreenGlare({ enabled: e.target.checked })
            }
            className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-0 cursor-pointer"
          />
        </div>

        {activeFrame.screenGlare?.enabled && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <SliderItem
              label="Glass Glare Opacity"
              value={activeFrame.screenGlare?.opacity ?? 0.35}
              min={0.05}
              max={0.9}
              step={0.05}
              unit=""
              onChange={(val) =>
                useEditorStore.getState().setScreenGlare({ opacity: val })
              }
            />

            <div className="space-y-1.5">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Reflection Style
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "diagonal-curved", label: "Curved Glass" },
                  { id: "linear-streak", label: "Studio Streak" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      useEditorStore
                        .getState()
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .setScreenGlare({ style: s.id as any })
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      (activeFrame.screenGlare?.style || "diagonal-curved") === s.id
                        ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. DUAL DEVICE COMPOSITION (SECONDARY PHONE) */}
      <section className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Dual Phone (2nd Device)
            </h3>
          </div>
          <input
            type="checkbox"
            checked={activeFrame.secondaryDevice?.enabled === true}
            onChange={(e) =>
              useEditorStore
                .getState()
                .setSecondaryDevice(
                  e.target.checked
                    ? { enabled: true, deviceType: activeFrame.deviceType }
                    : null
                )
            }
            className="rounded bg-zinc-800 border-zinc-700 text-indigo-500 focus:ring-0 cursor-pointer"
          />
        </div>

        {activeFrame.secondaryDevice?.enabled && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            {/* Quick Layout Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Dual Phone Layout
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "behind-left",
                    label: "Behind Left",
                    cfg: { offsetX: -220, offsetY: 60, scale: 0.88, rotateY: -15, rotateX: 8, rotation: -6 },
                  },
                  {
                    id: "behind-right",
                    label: "Behind Right",
                    cfg: { offsetX: 220, offsetY: 60, scale: 0.88, rotateY: 15, rotateX: 8, rotation: 6 },
                  },
                  {
                    id: "side-by-side",
                    label: "Side by Side",
                    cfg: { offsetX: -250, offsetY: 0, scale: 0.92, rotateY: 0, rotateX: 0, rotation: 0 },
                  },
                  {
                    id: "overlap-tilt",
                    label: "Overlap Hero",
                    cfg: { offsetX: -180, offsetY: 80, scale: 0.84, rotateY: -25, rotateX: 12, rotation: -12 },
                  },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() =>
                      useEditorStore
                        .getState()
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .setSecondaryDevice({ layout: preset.id as any, ...preset.cfg })
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      (activeFrame.secondaryDevice?.layout || "behind-left") === preset.id
                        ? "bg-indigo-500/20 border-indigo-500/60 text-indigo-300"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2nd Phone Model */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-zinc-400 font-medium block">
                2nd Phone Model
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "iphone", label: "iPhone 16 Pro" },
                  { id: "android", label: "Galaxy S25 Ultra" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      useEditorStore
                        .getState()
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .setSecondaryDevice({ deviceType: m.id as any })
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      activeFrame.secondaryDevice?.deviceType === m.id
                        ? "bg-zinc-800 border-zinc-600 text-white"
                        : "bg-zinc-900/80 border-zinc-800/80 text-zinc-400"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2nd Phone Screenshot Upload */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-zinc-400 font-medium block">
                2nd Phone Screenshot
              </span>
              <label className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900 hover:bg-zinc-800/60 cursor-pointer">
                {activeFrame.secondaryDevice?.screenshot ? (
                  <img
                    src={activeFrame.secondaryDevice.screenshot}
                    alt="2nd screenshot"
                    className="w-8 h-12 object-cover rounded border border-zinc-700"
                  />
                ) : (
                  <Upload className="w-4 h-4 text-zinc-400" />
                )}
                <span className="text-xs text-zinc-300 font-medium truncate">
                  {activeFrame.secondaryDevice?.screenshot
                    ? "Change 2nd Screenshot"
                    : "Upload 2nd Screenshot"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        useEditorStore.getState().setSecondaryDevice({
                          screenshot: evt.target?.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Sliders for 2nd Phone */}
            <div className="space-y-3 pt-2 border-t border-zinc-800/60">
              <SliderItem
                label="2nd Phone Scale"
                value={activeFrame.secondaryDevice?.scale ?? 0.88}
                min={0.5}
                max={1.5}
                step={0.02}
                unit="x"
                onChange={(val) =>
                  useEditorStore.getState().setSecondaryDevice({ scale: val })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <SliderItem
                  label="Offset X"
                  value={activeFrame.secondaryDevice?.offsetX ?? -220}
                  min={-500}
                  max={500}
                  step={10}
                  onChange={(val) =>
                    useEditorStore.getState().setSecondaryDevice({ offsetX: val })
                  }
                />
                <SliderItem
                  label="Offset Y"
                  value={activeFrame.secondaryDevice?.offsetY ?? 60}
                  min={-500}
                  max={500}
                  step={10}
                  onChange={(val) =>
                    useEditorStore.getState().setSecondaryDevice({ offsetY: val })
                  }
                />
              </div>
              <span className="text-[10px] text-zinc-500 block italic pt-1">
                💡 Tip: You can also drag both phones directly on the canvas preview to reposition them anywhere!
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
