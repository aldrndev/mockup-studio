import { useCallback, useState } from "react";
import type Konva from "konva";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useEditorStore } from "../store/useEditorStore";
import { useCanvasRenderer } from "../canvas/useCanvasRenderer";
import type { ExportPresetKey } from "../types/device";

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>;
}

const presets: { key: ExportPresetKey; label: string }[] = [
  { key: "appstore", label: "App Store" },
  { key: "playstore", label: "Play Store" },
  { key: "social", label: "Social" },
];

import { calculateFrameLayout } from "../utils/frameLayout";

export function ExportPanel({ stageRef }: Props) {
  const [exporting, setExporting] = useState(false);
  const { frames, deviceType, exportPreset, setExportPreset, cutPreset } =
    useEditorStore();
  const { deviceMeta } = useCanvasRenderer(deviceType, null);

  // Recalculate dimensions to match CanvasStage logic
  // Padding calculated to match App Store export ratio (1320 × 2868)
  const isDesktop = deviceType === "desktop";
  const paddingX = 92; // Must match CanvasStage
  const paddingTop = 320;
  const paddingBottom = 80;
  const baseFrameWidth =
    deviceMeta.frameWidth + paddingX * 2 + (isDesktop ? 80 : 0);
  const stageHeight = deviceMeta.frameHeight + paddingTop + paddingBottom;

  const handleExport = useCallback(async () => {
    if (!stageRef.current) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 100)); // UI Render delay

    const stage = stageRef.current;

    // 1. Save current state (scale)
    const oldScaleX = stage.scaleX();
    const oldScaleY = stage.scaleY();

    // 2. Reset scale to 1 for 1:1 logical export
    stage.scale({ x: 1, y: 1 });

    // 3. Hide Guides Layer (Last Layer)
    // The structure in CanvasStage is: Layer(Bg) -> Layer(Frames) -> Layer(Guides)
    const layers = stage.getLayers();
    const guidesLayer = layers[layers.length - 1];
    guidesLayer.hide();

    // Calculate exact layout to match CanvasStage
    const layout = calculateFrameLayout(
      frames,
      cutPreset,
      baseFrameWidth,
      stageHeight
    );

    const preset = deviceMeta.exportPresets[exportPreset];
    // Use height as the anchor for consistency across variable-width cuts
    const scale = preset.height / stageHeight;

    // Generate timestamp filename (ddmmyyhhmm)
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${dd}${mm}${yy}${hh}${min}`;

    try {
      // Single export logic
      if (frames.length === 1) {
        const frameData = layout.frames[0];
        const dataUrl = stage.toDataURL({
          x: frameData.x,
          y: 0,
          width: frameData.width,
          height: stageHeight,
          pixelRatio: scale,
          mimeType: "image/png",
          quality: 1,
        });

        const blob = await (await fetch(dataUrl)).blob();
        saveAs(blob, `${timestamp}-${exportPreset}.png`);
      } else {
        // ZIP export for multiple frames
        const zip = new JSZip();

        for (let i = 0; i < layout.frames.length; i++) {
          const frameData = layout.frames[i];

          const dataUrl = stage.toDataURL({
            x: frameData.x,
            y: 0,
            width: frameData.width,
            height: stageHeight,
            pixelRatio: scale,
            mimeType: "image/png",
            quality: 1,
          });

          // Strip base64 prefix
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          zip.file(`${i + 1}.png`, base64Data, {
            base64: true,
          });

          // Small yield
          await new Promise((r) => setTimeout(r, 50));
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${timestamp}-${exportPreset}.zip`);
      }
    } finally {
      // 4. Restore original state
      guidesLayer.show();
      stage.scale({ x: oldScaleX, y: oldScaleY });
      setExporting(false);
    }
  }, [
    stageRef,
    deviceMeta,
    exportPreset,
    frames,
    cutPreset,
    baseFrameWidth,
    stageHeight,
  ]);

  const size = deviceMeta.exportPresets[exportPreset];
  // Enable export if ANY frame has a screenshot? Or just generally enable it.
  // Actually, we should allow exporting empty frames too if desired (with text).
  // But let's check if at least one screenshot exists to be safe?
  // For now, simplify: "canExport" if there is at least one frame.
  const canExport = frames.length > 0;

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
            Download {frames.length > 1 ? "All PNGs" : "PNG"}
          </>
        )}
      </button>

      {!canExport && (
        <p className="text-[10px] text-zinc-500 text-center mt-2">
          Add a frame to start
        </p>
      )}
    </div>
  );
}
