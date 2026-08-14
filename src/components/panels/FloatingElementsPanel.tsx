import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Smile,
  Layers,
  Check,
  Calendar,
  Wand2,
  FileText,
  Clock,
  Zap,
  Shield,
  Rocket,
  Heart,
  MessageSquare,
  Flame,
  BarChart3,
  Star,
  User,
  Sliders,
  RotateCw,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";

const PRESET_3D_ICONS = [
  { id: "gold-coin", name: "Gold Coin", emoji: "🪙", color: "#f59e0b" },
  { id: "rocket", name: "3D Rocket", emoji: "🚀", color: "#f43f5e" },
  { id: "shield", name: "Cyber Shield", emoji: "🔒", color: "#10b981" },
  { id: "diamond", name: "Diamond Gem", emoji: "💎", color: "#38bdf8" },
  { id: "lightning", name: "Lightning Bolt", emoji: "⚡", color: "#eab308" },
  { id: "heart", name: "Glossy Heart", emoji: "❤️", color: "#ec4899" },
  { id: "chart", name: "Growth Chart", emoji: "📈", color: "#6366f1" },
  { id: "star", name: "Golden Star", emoji: "⭐", color: "#f59e0b" },
];

const BAR_ICONS = [
  { id: "calendar", label: "Calendar", icon: Calendar, emoji: "🗓️" },
  { id: "wand", label: "Wand", icon: Wand2, emoji: "🪄" },
  { id: "file", label: "Document", icon: FileText, emoji: "📄" },
  { id: "clock", label: "Clock", icon: Clock, emoji: "⏱️" },
  { id: "check", label: "Check", icon: Check, emoji: "⏱️" },
  { id: "sparkles", label: "Sparkles", icon: Sparkles, emoji: "✨" },
  { id: "zap", label: "Zap", icon: Zap, emoji: "⚡" },
  { id: "shield", label: "Shield", icon: Shield, emoji: "🔒" },
  { id: "rocket", label: "Rocket", icon: Rocket, emoji: "🚀" },
  { id: "heart", label: "Heart", icon: Heart, emoji: "❤️" },
  { id: "chat", label: "Chat", icon: MessageSquare, emoji: "💬" },
  { id: "flame", label: "Flame", icon: Flame, emoji: "🔥" },
  { id: "chart", label: "Chart", icon: BarChart3, emoji: "📈" },
  { id: "star", label: "Star", icon: Star, emoji: "⭐" },
  { id: "user", label: "User", icon: User, emoji: "👤" },
];

export const FloatingElementsPanel: React.FC = () => {
  const {
    frames,
    activeFrameId,
    addFloatingElement,
    removeFloatingElement,
    updateFloatingElement,
    addFloatingBar,
    removeFloatingBar,
    updateFloatingBar,
    loadFloatingBarPreset,
  } = useEditorStore();

  const activeFrame = frames.find((f) => f.id === activeFrameId) || frames[0];
  const elements = activeFrame.floatingElements || [];
  const bars = activeFrame.floatingBars || [];

  // Active tabs within decorations panel
  const [activeSection, setActiveSection] = useState<"action-bars" | "3d-icons">("action-bars");

  // New Floating Bar inputs
  const [newBarText, setNewBarText] = useState("");
  const [newBarIcon, setNewBarIcon] = useState("calendar");
  const [activeBarId, setActiveBarId] = useState<string | null>(bars[0]?.id || null);

  // 3D Icons states
  const [customEmoji, setCustomEmoji] = useState("");
  const [activeElementId, setActiveElementId] = useState<string | null>(
    elements[0]?.id || null
  );

  const selectedBar = bars.find((b) => b.id === activeBarId) || bars[0];
  const selectedEl = elements.find((el) => el.id === activeElementId) || elements[0];

  const handleCreateNewBar = () => {
    const text = newBarText.trim() || "Fitur Keren Baru";
    const count = bars.length;
    const offsetX = count % 2 === 0 ? 0.3 : 0.72;
    const offsetY = 0.7 + Math.floor(count / 2) * 0.09;

    addFloatingBar({
      text,
      icon: newBarIcon,
      x: offsetX,
      y: Math.min(0.92, offsetY),
      depth: 10,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      rotation: 0,
      bgColor: "#ffffff",
      textColor: "#0f172a",
      syncWithPhone3D: false,
    });
    setNewBarText("");
  };

  const handleAddPresetIcon = (presetId: string) => {
    const count = elements.length;
    const offsetX = 0.25 + ((count * 0.17) % 0.5);
    const offsetY = 0.3 + ((count * 0.13) % 0.35);
    addFloatingElement({
      type: "preset",
      value: presetId,
      x: offsetX,
      y: offsetY,
      scale: 1,
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      depth: 10,
    });
  };

  const handleAddEmoji = () => {
    if (!customEmoji.trim()) return;
    addFloatingElement({
      type: "emoji",
      value: customEmoji.trim(),
      x: 0.5,
      y: 0.5,
      scale: 1,
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      depth: 10,
    });
    setCustomEmoji("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        addFloatingElement({
          type: "image",
          value: evt.target?.result as string,
          x: 0.5,
          y: 0.5,
          scale: 1,
          rotation: 0,
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
          depth: 10,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Sub-Navigation Switcher */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
        <button
          onClick={() => setActiveSection("action-bars")}
          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === "action-bars"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layers size={14} />
          <span>3D Floating Bars</span>
          {bars.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-[9px] flex items-center justify-center">
              {bars.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection("3d-icons")}
          className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSection === "3d-icons"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles size={14} />
          <span>3D Icons & Emojis</span>
          {elements.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-[9px] flex items-center justify-center">
              {elements.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: 3D FLOATING ACTION BARS (As in Reference Photo) */}
      {/* ========================================================================= */}
      {activeSection === "action-bars" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* 1. ONE-CLICK PRESET PACKS */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  1-Click Feature Packs
                </h3>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO PHOTO LOOK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: "ai-tasks",
                  title: "🤖 AI Auto-Tasks (Migoo Look)",
                  desc: "5 Tilted 3D Pills (Rencanakan, Buat, Rangkum, dll)",
                },
                {
                  id: "fintech",
                  title: "💳 Fintech & Banking",
                  desc: "Transfer Instan, Investasi, Keamanan",
                },
                {
                  id: "fitness",
                  title: "🏃‍♂️ Health & Workout",
                  desc: "Bakar Kalori, GPS Tracker, Target",
                },
                {
                  id: "social",
                  title: "💬 Social & Creator",
                  desc: "Chat AI, Trending Filter, Komunitas",
                },
              ].map((pack) => (
                <button
                  key={pack.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => loadFloatingBarPreset(pack.id as any)}
                  className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="text-[11px] font-bold text-zinc-200 group-hover:text-amber-300 truncate">
                    {pack.title}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate mt-0.5">
                    {pack.desc}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 2. ADD CUSTOM FLOATING BAR */}
          <section className="space-y-3 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Add Custom Floating Bar
              </h3>
            </div>

            <div className="space-y-2.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBarText}
                  onChange={(e) => setNewBarText(e.target.value)}
                  placeholder="e.g. Rencanakan untukmu"
                  className="flex-1 h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateNewBar();
                  }}
                />
                <button
                  onClick={handleCreateNewBar}
                  className="px-3.5 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>

              {/* Icon Selector Grid */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400">
                  Select Leading Icon:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {BAR_ICONS.map((ic) => (
                    <button
                      key={ic.id}
                      onClick={() => setNewBarIcon(ic.id)}
                      className={`h-8 rounded-lg text-base flex items-center justify-center border transition-all ${
                        newBarIcon === ic.id
                          ? "bg-indigo-600/20 border-indigo-500 text-white scale-105"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                      title={ic.label}
                    >
                      <span>{ic.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. ACTIVE BARS TUNER & 3D PERSPECTIVE DEPTH CONTROLS */}
          {bars.length > 0 && (
            <section className="space-y-3 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Active Floating Bars ({bars.length})
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-500">Click to tune</span>
              </div>

              {/* Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {bars.map((bar, i) => (
                  <button
                    key={bar.id}
                    onClick={() => setActiveBarId(bar.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border shrink-0 transition-all ${
                      (selectedBar?.id === bar.id)
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    <span>
                      {BAR_ICONS.find((ic) => ic.id === bar.icon)?.emoji || "🏷️"}
                    </span>
                    <span className="max-w-28 truncate">{bar.text || `Bar #${i + 1}`}</span>
                  </button>
                ))}
              </div>

              {/* Selected Bar Controls */}
              {selectedBar && (
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{BAR_ICONS.find((ic) => ic.id === selectedBar.icon)?.emoji || "🏷️"}</span>
                      <span>Edit Bar Properties</span>
                    </span>
                    <button
                      onClick={() => removeFloatingBar(selectedBar.id)}
                      className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Text Edit */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-zinc-400">
                      Bar Text
                    </span>
                    <input
                      type="text"
                      value={selectedBar.text}
                      onChange={(e) =>
                        updateFloatingBar(selectedBar.id, { text: e.target.value })
                      }
                      className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-zinc-400">
                        Card Color
                      </span>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                        <input
                          type="color"
                          value={selectedBar.bgColor || "#ffffff"}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              bgColor: e.target.value,
                            })
                          }
                          className="w-6 h-6 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] font-mono uppercase text-zinc-300 truncate">
                          {selectedBar.bgColor || "#ffffff"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-zinc-400">
                        Text Color
                      </span>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                        <input
                          type="color"
                          value={selectedBar.textColor || "#0f172a"}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              textColor: e.target.value,
                            })
                          }
                          className="w-6 h-6 rounded cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] font-mono uppercase text-zinc-300 truncate">
                          {selectedBar.textColor || "#0f172a"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3D PERSPECTIVE & DEPTH TRANSFORMER (MATCHING DEVICE 3D TUNER) */}
                  <div className="space-y-3 pt-2 border-t border-zinc-800/80 bg-zinc-950/40 p-3 rounded-xl border">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                        <RotateCw size={13} /> 3D Perspective & Depth Tuner
                      </span>
                      <button
                        onClick={() =>
                          updateFloatingBar(selectedBar.id, {
                            rotateX: 0,
                            rotateY: 0,
                            rotation: 0,
                            depth: 14,
                          })
                        }
                        className="text-[10px] text-zinc-500 hover:text-white"
                      >
                        Reset 3D
                      </button>
                    </div>

                    {/* Sync Toggle */}
                    <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                      <span className="text-[11px] text-zinc-300 font-medium">
                        Auto-Sync with Phone 3D Angle
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedBar.syncWithPhone3D !== false}
                        onChange={(e) =>
                          updateFloatingBar(selectedBar.id, {
                            syncWithPhone3D: e.target.checked,
                          })
                        }
                        className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                    </label>

                    {/* Quick 3D Tilt Presets */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {[
                        { label: "Tilt Left (Hero)", cfg: { rotateX: 20, rotateY: -15, rotation: -6 } },
                        { label: "Tilt Right", cfg: { rotateX: 20, rotateY: 15, rotation: 6 } },
                        { label: "Flat 2D", cfg: { rotateX: 0, rotateY: 0, rotation: 0, syncWithPhone3D: false } },
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => updateFloatingBar(selectedBar.id, preset.cfg)}
                          className="py-1 px-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-medium text-zinc-300 text-center truncate"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Pitch (Rotate X) & Yaw (Rotate Y) Sliders */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">Pitch (Rotate X)</span>
                          <span className="font-mono text-zinc-500">
                            {selectedBar.rotateX ?? 0}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-60}
                          max={60}
                          step={1}
                          value={selectedBar.rotateX ?? 0}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              rotateX: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">Yaw (Rotate Y)</span>
                          <span className="font-mono text-zinc-500">
                            {selectedBar.rotateY ?? 0}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-60}
                          max={60}
                          step={1}
                          value={selectedBar.rotateY ?? 0}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              rotateY: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* 3D Depth (Chassis Thickness) & 2D Rotation */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">3D Depth (Chassis)</span>
                          <span className="font-mono text-indigo-400 font-bold">
                            {selectedBar.depth ?? 14}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={45}
                          step={1}
                          value={selectedBar.depth ?? 14}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              depth: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">2D Rotation</span>
                          <span className="font-mono text-zinc-500">
                            {selectedBar.rotation ?? 0}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          step={1}
                          value={selectedBar.rotation ?? 0}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              rotation: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Scale */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Scale</span>
                        <span className="font-mono text-zinc-500">
                          {(selectedBar.scale || 1).toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={1.8}
                        step={0.05}
                        value={selectedBar.scale || 1}
                        onChange={(e) =>
                          updateFloatingBar(selectedBar.id, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Position X / Y */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-zinc-400 block">
                      Canvas Position
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">Position X</span>
                          <span className="font-mono text-zinc-500">
                            {Math.round(selectedBar.x * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.02}
                          max={0.98}
                          step={0.01}
                          value={selectedBar.x}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              x: parseFloat(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">Position Y</span>
                          <span className="font-mono text-zinc-500">
                            {Math.round(selectedBar.y * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.02}
                          max={0.98}
                          step={0.01}
                          value={selectedBar.y}
                          onChange={(e) =>
                            updateFloatingBar(selectedBar.id, {
                              y: parseFloat(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 block italic pt-1">
                    💡 Tip: You can also click and drag any floating bar directly on the canvas preview!
                  </span>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: 3D FLOATING ICONS & EMOJIS */}
      {/* ========================================================================= */}
      {activeSection === "3d-icons" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* 1. 3D ICONS PRESET LIBRARY */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                3D Floating Icons Library
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PRESET_3D_ICONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddPresetIcon(item.id)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 transition-all group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    {item.emoji}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium mt-1 truncate max-w-full">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. CUSTOM EMOJI OR TRANSPARENT PNG */}
          <section className="space-y-3 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Custom Emoji or PNG
              </h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                placeholder="Type any emoji, e.g. 🔥 👑 🎯"
                className="flex-1 h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddEmoji();
                }}
              />
              <button
                onClick={handleAddEmoji}
                className="px-3 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Upload Custom PNG */}
            <label className="flex items-center justify-center gap-2 h-11 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-300 font-medium">
                Upload Custom Transparent PNG
              </span>
              <input
                type="file"
                accept="image/png,image/webp,image/svg+xml"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </section>

          {/* 3. ACTIVE ELEMENTS TUNER */}
          {elements.length > 0 && (
            <section className="space-y-3 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Active Icons ({elements.length})
                </h3>
                <span className="text-[10px] text-zinc-500">Select to adjust</span>
              </div>

              {/* Element Picker Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {elements.map((el, i) => (
                  <button
                    key={el.id}
                    onClick={() => setActiveElementId(el.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border shrink-0 transition-all ${
                      (selectedEl?.id === el.id)
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    <span>
                      {el.type === "preset"
                        ? PRESET_3D_ICONS.find((p) => p.id === el.value)?.emoji || "✨"
                        : el.type === "emoji"
                        ? el.value
                        : "🖼️"}
                    </span>
                    <span>#{i + 1}</span>
                  </button>
                ))}
              </div>

              {/* Selected Element Controls */}
              {selectedEl && (
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      Adjust Icon Properties
                    </span>
                    <button
                      onClick={() => removeFloatingElement(selectedEl.id)}
                      className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* 3D Depth & Tilt (Rotate X / Rotate Y / 3D Depth) */}
                  <div className="space-y-3 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                        <RotateCw size={13} /> 3D Tilt & Perspective Depth
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">Pitch (Rotate X)</span>
                          <span className="font-mono text-zinc-500">
                            {selectedEl.rotateX ?? 0}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-60}
                          max={60}
                          step={1}
                          value={selectedEl.rotateX ?? 0}
                          onChange={(e) =>
                            updateFloatingElement(selectedEl.id, {
                              rotateX: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">Yaw (Rotate Y)</span>
                          <span className="font-mono text-zinc-500">
                            {selectedEl.rotateY ?? 0}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-60}
                          max={60}
                          step={1}
                          value={selectedEl.rotateY ?? 0}
                          onChange={(e) =>
                            updateFloatingElement(selectedEl.id, {
                              rotateY: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">3D Depth</span>
                          <span className="font-mono text-zinc-500">
                            {selectedEl.depth ?? 10}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={35}
                          step={1}
                          value={selectedEl.depth ?? 10}
                          onChange={(e) =>
                            updateFloatingElement(selectedEl.id, {
                              depth: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-400">2D Rotation</span>
                          <span className="font-mono text-zinc-500">
                            {Math.round(selectedEl.rotation || 0)}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          step={1}
                          value={selectedEl.rotation || 0}
                          onChange={(e) =>
                            updateFloatingElement(selectedEl.id, {
                              rotation: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scale & Opacity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Scale</span>
                        <span className="font-mono text-zinc-500">
                          {(selectedEl.scale || 1).toFixed(1)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.3}
                        max={2.5}
                        step={0.05}
                        value={selectedEl.scale || 1}
                        onChange={(e) =>
                          updateFloatingElement(selectedEl.id, {
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Opacity</span>
                        <span className="font-mono text-zinc-500">
                          {Math.round((selectedEl.opacity ?? 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={selectedEl.opacity ?? 1}
                        onChange={(e) =>
                          updateFloatingElement(selectedEl.id, {
                            opacity: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Position X / Y */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Position X</span>
                        <span className="font-mono text-zinc-500">
                          {Math.round(selectedEl.x * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={selectedEl.x}
                        onChange={(e) =>
                          updateFloatingElement(selectedEl.id, {
                            x: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Position Y</span>
                        <span className="font-mono text-zinc-500">
                          {Math.round(selectedEl.y * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={selectedEl.y}
                        onChange={(e) =>
                          updateFloatingElement(selectedEl.id, {
                            y: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 block italic pt-1">
                    💡 Tip: You can also click and drag any 3D icon directly on the canvas preview to place it anywhere!
                  </span>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
};
