import { useState } from "react";
import { useEditorStore } from "../store/useEditorStore";

const gradients = [
  { c1: "#0f0c29", c2: "#302b63" },
  { c1: "#1a1a2e", c2: "#16213e" },
  { c1: "#000428", c2: "#004e92" },
  { c1: "#200122", c2: "#6f0000" },
  { c1: "#0f2027", c2: "#2c5364" },
  { c1: "#141e30", c2: "#243b55" },
];

const solids = [
  "#09090b",
  "#18181b",
  "#0f172a",
  "#1e1b4b",
  "#0c0a09",
  "#1c1917",
];

export function BackgroundPicker() {
  const { background, setBackground } = useEditorStore();
  const [tab, setTab] = useState<"gradient" | "solid">(background.type);

  const switchTab = (t: "gradient" | "solid") => {
    setTab(t);
    setBackground({ type: t });
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${tab === "gradient" ? "active" : ""}`}
          onClick={() => switchTab("gradient")}
        >
          Gradient
        </button>
        <button
          className={`tab ${tab === "solid" ? "active" : ""}`}
          onClick={() => switchTab("solid")}
        >
          Solid
        </button>
      </div>

      <div className="swatch-grid mb-6">
        {(tab === "gradient"
          ? gradients
          : solids.map((c) => ({ c1: c, c2: c }))
        ).map((g, i) => (
          <button
            key={i}
            className={`swatch ${background.color1 === g.c1 ? "active" : ""}`}
            style={{
              background:
                tab === "gradient"
                  ? `linear-gradient(135deg, ${g.c1}, ${g.c2})`
                  : g.c1,
            }}
            onClick={() => setBackground({ color1: g.c1, color2: g.c2 })}
          />
        ))}
      </div>

      {tab === "gradient" && (
        <div className="color-picker-row !mt-3">
          <label className="relative cursor-pointer">
            <input
              type="color"
              value={background.color1}
              onChange={(e) => setBackground({ color1: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div
              className="color-picker-swatch"
              style={{ background: background.color1 }}
            />
          </label>
          <span className="text-zinc-600 text-xs">→</span>
          <label className="relative cursor-pointer">
            <input
              type="color"
              value={background.color2}
              onChange={(e) => setBackground({ color2: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div
              className="color-picker-swatch"
              style={{ background: background.color2 }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
