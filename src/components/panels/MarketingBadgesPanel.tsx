import React, { useState } from "react";
import {
  Type,
  Star,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Shield,
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
  { key: "playstore-hero", label: "Play Store Hero" },
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
            type="text"
            value={headline.text}
            onChange={(e) => setHeadline({ text: e.target.value.slice(0, 90) })}
            placeholder="e.g. ATURAN POLA & SARAN AI"
            className="w-full h-10 px-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 font-semibold"
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
            value={subtitle.text}
            onChange={(e) =>
              setSubtitle({ text: e.target.value.slice(0, 180) })
            }
            placeholder="Describe your killer features clearly..."
            rows={2}
            className="w-full p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 leading-relaxed resize-none"
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
      <section className="space-y-3">
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

      {/* 5. 3D HOLOGRAPHIC SHIELD BADGE (Cyber Anti-Spam Style) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              3D Holographic Shield
            </h3>
          </div>
          <input
            type="checkbox"
            checked={badges.showFloatingShield || false}
            onChange={(e) => setBadges({ showFloatingShield: e.target.checked })}
            className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0 cursor-pointer"
          />
        </div>

        {badges.showFloatingShield && (
          <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 animate-in fade-in duration-150">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Shield Glow Color
            </span>
            <div className="flex gap-2">
              {[
                { color: "#06b6d4", label: "Cyan" },
                { color: "#d946ef", label: "Magenta" },
                { color: "#8b5cf6", label: "Purple" },
                { color: "#10b981", label: "Emerald" },
              ].map((sw) => (
                <button
                  key={sw.color}
                  onClick={() => setBadges({ shieldColor: sw.color })}
                  className={`flex-1 h-7 rounded-lg border text-[10px] font-bold transition-all ${
                    badges.shieldColor === sw.color
                      ? "border-white text-white shadow-md ring-1 ring-white/20"
                      : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${sw.color}33, ${sw.color}66)`,
                    boxShadow: badges.shieldColor === sw.color ? `0 0 12px ${sw.color}66` : undefined,
                  }}
                >
                  {sw.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
