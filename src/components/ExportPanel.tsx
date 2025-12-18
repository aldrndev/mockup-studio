import { useCallback, useState } from "react";
import type Konva from "konva";
import { useEditorStore } from "../store/useEditorStore";
import { useCanvasRenderer } from "../canvas/useCanvasRenderer";
import { exportCanvas } from "../canvas/exportCanvas";
import type { ExportPresetKey } from "../types/device";

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>;
}

const presets: { key: ExportPresetKey; label: string }[] = [
  { key: "appstore", label: "App Store" },
  { key: "playstore", label: "Play Store" },
  { key: "social", label: "Social" },
];

export function ExportPanel({ stageRef }: Props) {
  const [exporting, setExporting] = useState(false);
  const { screenshot, deviceType, exportPreset, setExportPreset } =
    useEditorStore();
  const { deviceMeta } = useCanvasRenderer(deviceType, null);

  const handleExport = useCallback(async () => {
    if (!stageRef.current) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 100));
    const preset = deviceMeta.exportPresets[exportPreset];
    exportCanvas(
      stageRef.current,
      preset.width,
      preset.height,
      `mockup-${Date.now()}.png`
    );
    setTimeout(() => setExporting(false), 1000);
  }, [stageRef, deviceMeta, exportPreset]);

  const size = deviceMeta.exportPresets[exportPreset];
  const canExport = !!screenshot;

  return (
    <div>
      <div className="flex items-center justify-between !mb-1">
        <span className="section-title !mb-0 text-white">Export</span>
        <span className="export-size">
          {size.width} × {size.height}
        </span>
      </div>

      {/* Preset Pills */}
      <div className="pill-group !mb-5">
        {presets.map((p) => (
          <button
            key={p.key}
            className={`pill ${exportPreset === p.key ? "active" : ""}`}
            onClick={() => setExportPreset(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={!canExport || exporting}
        className="btn-primary"
      >
        {exporting ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PNG
          </>
        )}
      </button>

      {!canExport && (
        <p className="text-[10px] text-zinc-500 text-center mt-2">
          Upload a screenshot first
        </p>
      )}
    </div>
  );
}
