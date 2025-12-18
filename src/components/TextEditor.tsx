import { useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import type { TextPreset } from "../types/device";

const styles: { key: TextPreset; label: string }[] = [
  { key: "appstore", label: "Clean" },
  { key: "startup", label: "Modern" },
  { key: "bold", label: "Bold" },
];

export function TextEditor() {
  const {
    frames,
    activeFrameId,
    textPreset,
    setHeadline,
    setSubtitle,
    setTextPreset,
  } = useEditorStore();

  const activeFrame = frames.find((c) => c.id === activeFrameId) || frames[0];
  const { headline, subtitle } = activeFrame;
  const [showColors, setShowColors] = useState(false);

  return (
    <div>
      {/* Headline */}
      <div className="form-group mb-4">
        <div className="form-label">
          <span className="text-[13px] font-semibold text-zinc-300">
            Headline
          </span>
          <span
            className={`form-counter ${
              headline.text.length >= 35 ? "warn" : ""
            }`}
          >
            {headline.text.length}/40
          </span>
        </div>
        <input
          type="text"
          value={headline.text}
          onChange={(e) => setHeadline({ text: e.target.value.slice(0, 40) })}
          placeholder="Your amazing headline"
          className="form-input !h-11 !text-[14px] font-medium"
        />
      </div>

      {/* Subtitle */}
      <div className="form-group mb-4">
        <div className="form-label">
          <span className="text-[13px] font-semibold text-zinc-300">
            Subtitle
          </span>
          <span
            className={`form-counter ${
              subtitle.text.length >= 70 ? "warn" : ""
            }`}
          >
            {subtitle.text.length}/80
          </span>
        </div>
        <textarea
          value={subtitle.text}
          onChange={(e) => setSubtitle({ text: e.target.value.slice(0, 80) })}
          placeholder="Describe your app features..."
          className="form-input !h-32 py-3 leading-relaxed resize-none !text-[13px]"
        />
      </div>

      {/* Style Pills */}
      <div className="form-group">
        <div className="pill-group">
          {styles.map((s) => (
            <button
              key={s.key}
              className={`pill ${textPreset === s.key ? "active" : ""}`}
              onClick={() => setTextPreset(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowColors(!showColors)}
        className="text-xs text-zinc-500 hover:text-zinc-400 mb-3 flex items-center gap-1 transition-colors"
      >
        <span className="!mb-2">{showColors ? "-" : "+"}</span>
        <span className="!mb-2">Text Settings</span>
      </button>

      {showColors && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
          <div className="!p-2">
            <span className="text-[11px] font-semibold text-zinc-400 !mb-2 block uppercase tracking-wide">
              Headline
            </span>
            <div className="flex flex-col gap-2">
              <div className="color-picker-row">
                <label className="relative cursor-pointer">
                  <input
                    type="color"
                    value={headline.fill}
                    onChange={(e) => setHeadline({ fill: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div
                    className="color-picker-swatch"
                    style={{ background: headline.fill }}
                  />
                </label>
                <input
                  type="text"
                  value={headline.fill}
                  onChange={(e) => setHeadline({ fill: e.target.value })}
                  className="color-picker-input !w-full"
                />
              </div>
              <div className="!p-2 flex items-center gap-2 bg-zinc-800/50 rounded px-2 h-7 border border-zinc-800">
                <span className="text-[10px] text-zinc-500">Size</span>
                <input
                  type="number"
                  value={headline.fontSize}
                  onChange={(e) =>
                    setHeadline({ fontSize: Number(e.target.value) })
                  }
                  className="bg-transparent text-xs text-zinc-300 w-full text-right outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="!p-2">
            <span className="text-[11px] font-semibold text-zinc-400 !mb-2 block uppercase tracking-wide">
              Subtitle
            </span>
            <div className="flex flex-col gap-2">
              <div className="color-picker-row">
                <label className="relative cursor-pointer">
                  <input
                    type="color"
                    value={subtitle.fill}
                    onChange={(e) => setSubtitle({ fill: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div
                    className="color-picker-swatch"
                    style={{ background: subtitle.fill }}
                  />
                </label>
                <input
                  type="text"
                  value={subtitle.fill}
                  onChange={(e) => setSubtitle({ fill: e.target.value })}
                  className="color-picker-input !w-full"
                />
              </div>
              <div className="!p-2 flex items-center gap-2 bg-zinc-800/50 rounded px-2 h-7 border border-zinc-800">
                <span className="text-[10px] text-zinc-500">Size</span>
                <input
                  type="number"
                  value={subtitle.fontSize}
                  onChange={(e) =>
                    setSubtitle({ fontSize: Number(e.target.value) })
                  }
                  className="bg-transparent text-xs text-zinc-300 w-full text-right outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
