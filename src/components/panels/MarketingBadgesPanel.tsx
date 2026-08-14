import React, { useState } from "react";
import {
  Type,
  Star,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import type { TextPreset } from "../../types/device";

const FONT_FAMILIES = [
  "Poppins",
  "Inter",
  "Outfit",
  "Montserrat",
  "SF Pro Display",
  "Roboto",
  "Lato",
];

const TEXT_STYLES: { key: TextPreset; label: string }[] = [
  { key: "playstore-hero", label: "Showcase Hero" },
  { key: "startup", label: "Modern Startup" },
  { key: "bold", label: "Bold Accent" },
  { key: "minimal", label: "Minimalist" },
];

export const MarketingBadgesPanel: React.FC = () => {
  const {
    frames,
    activeFrameId,
    badges,
    setBadges,
    setHeadline,
    setSubtitle,
    textPreset,
    setTextPreset,
  } = useEditorStore();

  const activeFrame = frames.find((f) => f.id === activeFrameId) || frames[0];
  const { headline, subtitle } = activeFrame;

  const [showTypographySettings, setShowTypographySettings] = useState(false);
  const [newPillText, setNewPillText] = useState("");

  const handleAddFeaturePill = () => {
    if (!newPillText.trim()) return;
    const newPills = [
      ...(badges.featurePills || []),
      {
        id: crypto.randomUUID(),
        text: newPillText.trim(),
        icon: "zap" as const,
        bg: "rgba(99,102,241,0.25)",
        textFill: "#e0e7ff",
      },
    ];
    setBadges({ featurePills: newPills });
    setNewPillText("");
  };

  const handleRemovePill = (id: string) => {
    const updated = badges.featurePills.filter((p) => p.id !== id);
    setBadges({ featurePills: updated });
  };

  return (
    <div className="p-4 space-y-6">
      {/* 1. HEADLINE & SUBTITLE */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Type className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Headline & Subtitle
          </h3>
        </div>

        {/* Style presets */}
        <div className="grid grid-cols-2 gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {TEXT_STYLES.map((ts) => (
            <button
              key={ts.key}
              onClick={() => setTextPreset(ts.key)}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all truncate px-2 ${
                textPreset === ts.key
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {ts.label}
            </button>
          ))}
        </div>

        {/* Headline Input */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400 font-semibold">Headline</span>
            <span className="font-mono text-[10px] text-zinc-500">
              {headline.text.length}/90
            </span>
          </div>
          <input
            id="headline-input"
            type="text"
            value={headline.text}
            onChange={(e) => setHeadline({ text: e.target.value.slice(0, 90) })}
            placeholder="e.g. ATURAN POLA & SARAN AI"
            className="w-full h-10 px-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500 font-semibold transition-all"
          />
        </div>

        {/* Neon Glow Toggle & Color Selection */}
        <div className="space-y-2 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Neon Text Glow</span>
            <input
              type="checkbox"
              checked={headline.glow !== false}
              onChange={(e) => setHeadline({ glow: e.target.checked })}
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
            />
          </div>

          {headline.glow !== false && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Glow Color
              </span>
              <div className="flex gap-2">
                {[
                  { color: "#06b6d4", label: "Cyan" },
                  { color: "#d946ef", label: "Magenta" },
                  { color: "#8b5cf6", label: "Purple" },
                  { color: "#fbbf24", label: "Gold" },
                  { color: "#10b981", label: "Emerald" },
                ].map((sw) => (
                  <button
                    key={sw.color}
                    onClick={() => setHeadline({ glowColor: sw.color })}
                    className={`flex-1 h-7 rounded-lg border text-[10px] font-bold transition-all ${
                      headline.glowColor === sw.color
                        ? "border-white text-white shadow-md ring-1 ring-white/20"
                        : "border-transparent text-zinc-400 hover:text-white"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${sw.color}33, ${sw.color}66)`,
                      boxShadow: headline.glowColor === sw.color ? `0 0 12px ${sw.color}66` : undefined,
                    }}
                  >
                    {sw.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subtitle Input */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-400 font-semibold">Subtitle</span>
            <span className="font-mono text-[10px] text-zinc-500">
              {subtitle.text.length}/180
            </span>
          </div>
          <textarea
            id="subtitle-input"
            value={subtitle.text}
            onChange={(e) =>
              setSubtitle({ text: e.target.value.slice(0, 180) })
            }
            placeholder="Describe your killer features clearly..."
            rows={2}
            className="w-full p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none transition-all"
          />
        </div>

        {/* Advanced Font & Color Toggle */}
        <button
          onClick={() => setShowTypographySettings(!showTypographySettings)}
          className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors pt-1"
        >
          <Sliders size={12} />
          <span>Detailed Font & Color Settings</span>
          {showTypographySettings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showTypographySettings && (
          <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 animate-in fade-in duration-150">
            {/* Headline Settings */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Headline Typography
              </span>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={headline.fontFamily}
                  onChange={(e) => setHeadline({ fontFamily: e.target.value })}
                  className="col-span-2 h-8 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none"
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={headline.fontSize}
                  onChange={(e) =>
                    setHeadline({ fontSize: Number(e.target.value) })
                  }
                  className="h-8 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 text-center font-mono outline-none"
                  title="Font Size"
                />
              </div>
            </div>

            {/* Subtitle Settings */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Subtitle Typography
              </span>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={subtitle.fontFamily}
                  onChange={(e) => setSubtitle({ fontFamily: e.target.value })}
                  className="col-span-2 h-8 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none"
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={subtitle.fontSize}
                  onChange={(e) =>
                    setSubtitle({ fontSize: Number(e.target.value) })
                  }
                  className="h-8 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 text-center font-mono outline-none"
                  title="Font Size"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. PLAY STORE ⭐ 4.9 RATING BADGE */}
      <section id="badges-section" className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Google Play Rating Badge
            </h3>
          </div>
          <input
            type="checkbox"
            checked={badges.showRating}
            onChange={(e) => setBadges({ showRating: e.target.checked })}
            className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
          />
        </div>

        {badges.showRating && (
          <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 animate-in fade-in duration-150">
            {/* Rating Style */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "google-play" as const, label: "Google Play" },
                { id: "gold-star" as const, label: "Gold Glow" },
                { id: "compact-pill" as const, label: "Compact" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setBadges({ ratingStyle: st.id })}
                  className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    badges.ratingStyle === st.id
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Score & Reviews */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium">Score</span>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={badges.ratingScore}
                  onChange={(e) =>
                    setBadges({ ratingScore: parseFloat(e.target.value) || 4.9 })
                  }
                  className="w-full h-8 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-center text-white outline-none"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium">Review Count</span>
                <input
                  type="text"
                  value={badges.ratingCount}
                  onChange={(e) => setBadges({ ratingCount: e.target.value })}
                  placeholder="e.g. 120K+ Ratings"
                  className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. DOWNLOAD & SOCIAL PROOF BADGE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Downloads & Trust Badge
            </h3>
          </div>
          <input
            type="checkbox"
            checked={badges.showDownloads}
            onChange={(e) => setBadges({ showDownloads: e.target.checked })}
            className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
          />
        </div>

        {badges.showDownloads && (
          <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 animate-in fade-in duration-150">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-medium">Badge Text</span>
              <input
                type="text"
                value={badges.downloadCount}
                onChange={(e) => setBadges({ downloadCount: e.target.value })}
                placeholder="e.g. 1M+ Downloads or Editor's Choice"
                className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white outline-none"
              />
            </div>
          </div>
        )}
      </section>

      {/* 4. FEATURE TAG PILLS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Floating Feature Pills
            </h3>
          </div>
          <input
            type="checkbox"
            checked={badges.showFeaturePills}
            onChange={(e) => setBadges({ showFeaturePills: e.target.checked })}
            className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
          />
        </div>

        {badges.showFeaturePills && (
          <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 animate-in fade-in duration-150">
            <div className="space-y-1.5">
              {badges.featurePills.map((pill) => (
                <div
                  key={pill.id}
                  className="flex items-center justify-between px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs"
                >
                  <span className="text-zinc-200 font-medium truncate">
                    {pill.text}
                  </span>
                  <button
                    onClick={() => handleRemovePill(pill.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                    title="Remove Pill"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newPillText}
                onChange={(e) => setNewPillText(e.target.value)}
                placeholder="e.g. ⚡ Ultra Fast"
                className="flex-1 h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddFeaturePill();
                }}
              />
              <button
                onClick={handleAddFeaturePill}
                className="px-3 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 5. APP ICON & LOGO */}
      <section className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              App Icon & Logo
            </h3>
          </div>
          <input
            type="checkbox"
            checked={activeFrame.appIcon?.enabled === true}
            onChange={(e) =>
              useEditorStore
                .getState()
                .setAppIcon({ enabled: e.target.checked })
            }
            className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
          />
        </div>

        {activeFrame.appIcon?.enabled && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <label className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900 hover:bg-zinc-800/60 cursor-pointer">
              {activeFrame.appIcon?.url ? (
                <img
                  src={activeFrame.appIcon.url}
                  alt="App Icon"
                  className="w-10 h-10 object-cover rounded-xl border border-zinc-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles size={18} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white font-medium block truncate">
                  {activeFrame.appIcon?.url ? "Change Icon" : "Upload App Icon"}
                </span>
                <span className="text-[10px] text-zinc-500">PNG / JPG logo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      useEditorStore.getState().setAppIcon({
                        url: evt.target?.result as string,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "squircle", label: "Squircle" },
                { id: "circle", label: "Circle" },
              ].map((sh) => (
                <button
                  key={sh.id}
                  onClick={() =>
                    useEditorStore
                      .getState()
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .setAppIcon({ shape: sh.id as any })
                  }
                  className={`py-1 px-2 rounded-lg text-xs font-medium border transition-all ${
                    (activeFrame.appIcon?.shape || "squircle") === sh.id
                      ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400"
                  }`}
                >
                  {sh.label}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Icon Size</span>
                <span className="font-mono text-zinc-400">
                  {activeFrame.appIcon?.size || 84}px
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={140}
                value={activeFrame.appIcon?.size || 84}
                onChange={(e) =>
                  useEditorStore
                    .getState()
                    .setAppIcon({ size: parseInt(e.target.value) })
                }
                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Position X / Y */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Position X</span>
                  <span className="font-mono text-zinc-500">
                    {Math.round((activeFrame.appIcon?.x ?? 0.5) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.02}
                  max={0.98}
                  step={0.01}
                  value={activeFrame.appIcon?.x ?? 0.5}
                  onChange={(e) =>
                    useEditorStore
                      .getState()
                      .setAppIcon({ x: parseFloat(e.target.value) })
                  }
                  className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Position Y</span>
                  <span className="font-mono text-zinc-500">
                    {Math.round((activeFrame.appIcon?.y ?? 0.05) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.02}
                  max={0.98}
                  step={0.01}
                  value={activeFrame.appIcon?.y ?? 0.05}
                  onChange={(e) =>
                    useEditorStore
                      .getState()
                      .setAppIcon({ y: parseFloat(e.target.value) })
                  }
                  className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 block italic">
              💡 Or drag the icon directly on the canvas preview!
            </span>
          </div>
        )}
      </section>

      {/* 6. OFFICIAL STORE BADGES (Google Play & App Store) */}
      <section className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Official Store Badges
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "none", label: "None" },
            { id: "google-play", label: "Google Play" },
            { id: "app-store", label: "App Store" },
            { id: "both", label: "Dual (Both)" },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() =>
                useEditorStore
                  .getState()
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .setStoreBadge(b.id as any)
              }
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                (activeFrame.storeBadge || "none") === b.id
                  ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-sm"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <span>{b.label}</span>
              {(activeFrame.storeBadge || "none") === b.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {activeFrame.storeBadge && activeFrame.storeBadge !== "none" && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Position X</span>
                  <span className="font-mono text-zinc-500">
                    {Math.round((activeFrame.storeBadgeX ?? 0.5) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.95}
                  step={0.01}
                  value={activeFrame.storeBadgeX ?? 0.5}
                  onChange={(e) =>
                    useEditorStore
                      .getState()
                      .setStoreBadgePosition(
                        parseFloat(e.target.value),
                        activeFrame.storeBadgeY ?? 0.94
                      )
                  }
                  className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">Position Y</span>
                  <span className="font-mono text-zinc-500">
                    {Math.round((activeFrame.storeBadgeY ?? 0.94) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.98}
                  step={0.01}
                  value={activeFrame.storeBadgeY ?? 0.94}
                  onChange={(e) =>
                    useEditorStore
                      .getState()
                      .setStoreBadgePosition(
                        activeFrame.storeBadgeX ?? 0.5,
                        parseFloat(e.target.value)
                      )
                  }
                  className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 block italic">
              💡 Or drag the store badges anywhere on the canvas!
            </span>
          </div>
        )}
      </section>

      {/* 7. PROMO STICKER / FLOATING BADGE */}
      <section className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Promo Ribbon Sticker
            </h3>
          </div>
          <input
            type="checkbox"
            checked={activeFrame.promoSticker?.enabled === true}
            onChange={(e) =>
              useEditorStore
                .getState()
                .setPromoSticker({ enabled: e.target.checked })
            }
            className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
          />
        </div>

        {activeFrame.promoSticker?.enabled && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Sticker Text
              </span>
              <input
                type="text"
                value={activeFrame.promoSticker?.text || ""}
                onChange={(e) =>
                  useEditorStore
                    .getState()
                    .setPromoSticker({ text: e.target.value })
                }
                placeholder="e.g. #1 Top App, 50% OFF, Editor's Choice"
                className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Theme Color
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "gold", label: "Gold", color: "#f59e0b" },
                  { id: "indigo", label: "Indigo", color: "#6366f1" },
                  { id: "emerald", label: "Emerald", color: "#10b981" },
                  { id: "rose", label: "Rose", color: "#f43f5e" },
                  { id: "cyber", label: "Cyber", color: "#06b6d4" },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() =>
                      useEditorStore
                        .getState()
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .setPromoSticker({ theme: th.id as any })
                    }
                    className={`py-1 px-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      (activeFrame.promoSticker?.theme || "gold") === th.id
                        ? "border-white text-white shadow-sm"
                        : "border-zinc-800 text-zinc-400"
                    }`}
                    style={{ backgroundColor: `${th.color}20` }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: th.color }}
                    />
                    <span>{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Tilt & Depth Transformer */}
            <div className="space-y-2.5 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] font-bold text-amber-300 block">
                3D Tilt & Perspective Depth
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Pitch (Rotate X)</span>
                    <span className="font-mono text-zinc-500">
                      {activeFrame.promoSticker?.rotateX ?? 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={1}
                    value={activeFrame.promoSticker?.rotateX ?? 0}
                    onChange={(e) =>
                      useEditorStore.getState().setPromoSticker({
                        rotateX: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Yaw (Rotate Y)</span>
                    <span className="font-mono text-zinc-500">
                      {activeFrame.promoSticker?.rotateY ?? 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={1}
                    value={activeFrame.promoSticker?.rotateY ?? 0}
                    onChange={(e) =>
                      useEditorStore.getState().setPromoSticker({
                        rotateY: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400 font-medium">3D Depth</span>
                    <span className="font-mono text-zinc-400">
                      {activeFrame.promoSticker?.depth ?? 8}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={activeFrame.promoSticker?.depth ?? 8}
                    onChange={(e) =>
                      useEditorStore.getState().setPromoSticker({
                        depth: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Rotation</span>
                    <span className="font-mono text-zinc-500">
                      {activeFrame.promoSticker?.rotation ?? 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={activeFrame.promoSticker?.rotation ?? 0}
                    onChange={(e) =>
                      useEditorStore.getState().setPromoSticker({
                        rotation: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Position X / Y */}
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Position Adjustment
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Position X</span>
                    <span className="font-mono text-zinc-500">
                      {Math.round((activeFrame.promoSticker?.x ?? 0.5) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    value={activeFrame.promoSticker?.x ?? 0.5}
                    onChange={(e) =>
                      useEditorStore.getState().setPromoSticker({
                        x: parseFloat(e.target.value),
                        position: "custom",
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Position Y</span>
                    <span className="font-mono text-zinc-500">
                      {Math.round((activeFrame.promoSticker?.y ?? 0.42) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    value={activeFrame.promoSticker?.y ?? 0.42}
                    onChange={(e) =>
                      useEditorStore.getState().setPromoSticker({
                        y: parseFloat(e.target.value),
                        position: "custom",
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
              <span className="text-[10px] text-zinc-500 block italic pt-1">
                💡 Or drag the ribbon sticker directly on the canvas!
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 8. TESTIMONIAL REVIEW CARD */}
      <section className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-pink-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Testimonial Review Card
            </h3>
          </div>
          <input
            type="checkbox"
            checked={activeFrame.testimonial?.enabled === true}
            onChange={(e) =>
              useEditorStore
                .getState()
                .setTestimonial({ enabled: e.target.checked })
            }
            className="rounded bg-zinc-800 border-zinc-700 text-pink-500 focus:ring-0 cursor-pointer"
          />
        </div>

        {activeFrame.testimonial?.enabled && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium block">
                User Name & Role
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={activeFrame.testimonial?.name || ""}
                  onChange={(e) =>
                    useEditorStore
                      .getState()
                      .setTestimonial({ name: e.target.value })
                  }
                  placeholder="e.g. Alex Rivera"
                  className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  value={activeFrame.testimonial?.handle || ""}
                  onChange={(e) =>
                    useEditorStore
                      .getState()
                      .setTestimonial({ handle: e.target.value })
                  }
                  placeholder="e.g. Verified Buyer"
                  className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Review Quote
              </span>
              <textarea
                value={activeFrame.testimonial?.review || ""}
                onChange={(e) =>
                  useEditorStore
                    .getState()
                    .setTestimonial({ review: e.target.value })
                }
                placeholder="e.g. Absolutely gorgeous app, boosted our conversion by 200%!"
                rows={2}
                className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Star Rating
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      useEditorStore.getState().setTestimonial({ rating: star })
                    }
                    className={`p-1.5 rounded-lg text-sm transition-all ${
                      (activeFrame.testimonial?.rating || 5) >= star
                        ? "text-amber-400 bg-amber-500/10"
                        : "text-zinc-600 bg-zinc-900"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Tilt & Depth Transformer */}
            <div className="space-y-2.5 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] font-bold text-pink-300 block">
                3D Tilt & Perspective Depth
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Pitch (Rotate X)</span>
                    <span className="font-mono text-zinc-500">
                      {activeFrame.testimonial?.rotateX ?? 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={1}
                    value={activeFrame.testimonial?.rotateX ?? 0}
                    onChange={(e) =>
                      useEditorStore.getState().setTestimonial({
                        rotateX: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-pink-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Yaw (Rotate Y)</span>
                    <span className="font-mono text-zinc-500">
                      {activeFrame.testimonial?.rotateY ?? 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    step={1}
                    value={activeFrame.testimonial?.rotateY ?? 0}
                    onChange={(e) =>
                      useEditorStore.getState().setTestimonial({
                        rotateY: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400 font-medium">3D Depth</span>
                    <span className="font-mono text-zinc-400">
                      {activeFrame.testimonial?.depth ?? 10}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={activeFrame.testimonial?.depth ?? 10}
                    onChange={(e) =>
                      useEditorStore.getState().setTestimonial({
                        depth: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-pink-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Rotation</span>
                    <span className="font-mono text-zinc-500">
                      {activeFrame.testimonial?.rotation ?? 0}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={activeFrame.testimonial?.rotation ?? 0}
                    onChange={(e) =>
                      useEditorStore.getState().setTestimonial({
                        rotation: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Position X / Y */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Position Adjustment
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Position X</span>
                    <span className="font-mono text-zinc-500">
                      {Math.round((activeFrame.testimonial?.x ?? 0.5) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    value={activeFrame.testimonial?.x ?? 0.5}
                    onChange={(e) =>
                      useEditorStore.getState().setTestimonial({
                        x: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-pink-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">Position Y</span>
                    <span className="font-mono text-zinc-500">
                      {Math.round((activeFrame.testimonial?.y ?? 0.88) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.98}
                    step={0.01}
                    value={activeFrame.testimonial?.y ?? 0.88}
                    onChange={(e) =>
                      useEditorStore.getState().setTestimonial({
                        y: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>
              <span className="text-[10px] text-zinc-500 block italic pt-1">
                💡 Or drag the review card directly anywhere on the canvas!
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
