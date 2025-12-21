import { useCallback, useState } from "react";
import type Konva from "konva";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useEditorStore } from "../store/useEditorStore";
import { useCanvasRenderer } from "../canvas/useCanvasRenderer";



interface Props {
  stageRef: React.RefObject<Konva.Stage | null>;
}

import { calculateFrameLayout } from "../utils/frameLayout";

export function ExportPanel({ stageRef }: Props) {
  const [exporting, setExporting] = useState(false);
  const [exportMode, setExportMode] = useState<"single" | "batch">("batch");
  const { frames, deviceType, cutPreset, canvasWidth, canvasHeight } =
    useEditorStore();
  const { deviceMeta } = useCanvasRenderer(deviceType, null);

  // Recalculate dimensions to match CanvasStage logic
  // Padding calculated to match App Store export ratio (1320 × 2868)
  const isDesktop = deviceType === "desktop";
  const paddingX = 92; // Must match CanvasStage
  const paddingTop = 320;
  const paddingBottom = 80;
  const autoWidth = deviceMeta.frameWidth + paddingX * 2 + (isDesktop ? 80 : 0);
  const autoHeight = deviceMeta.frameHeight + paddingTop + paddingBottom;
  
  // Use custom canvas size if set, otherwise auto
  const baseFrameWidth = canvasWidth ?? autoWidth;
  const stageHeight = canvasHeight ?? autoHeight;

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

    // 4. Hide Selection Borders
    const selectionBorders = stage.find(".active-frame-border");
    selectionBorders.forEach((node) => node.hide());

    // Calculate exact layout to match CanvasStage
    const layout = calculateFrameLayout(
      frames,
      cutPreset,
      baseFrameWidth,
      stageHeight
    );

    // Export at 1:1 scale (canvas dimensions = export dimensions)
    const scale = 1;

    // DEBUG: Log dimensions to verify alignment
    console.log("=== EXPORT DEBUG ===");
    console.log("baseFrameWidth:", baseFrameWidth, "stageHeight:", stageHeight);
    console.log("layout.totalWidth:", layout.totalWidth);
    console.log("layout.frames:", layout.frames.map(f => ({ x: f.x, width: f.width })));
    console.log("stage actual width:", stage.width(), "height:", stage.height());

    // Generate timestamp filename (ddmmyyhhmm)
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${dd}${mm}${yy}${hh}${min}`;

    try {
      if (exportMode === "single") {
        // EXPORT AS SINGLE IMAGE (Composition)
        // 1. Calculate bounding box of all frames
        let minX = Infinity;
        let maxX = -Infinity;
        
        layout.frames.forEach(f => {
            if (f.x < minX) minX = f.x;
            if (f.x + f.width > maxX) maxX = f.x + f.width;
        });

        // Add padding around the whole group
        const totalWidth = maxX - minX;
        
        // Render the full stage area containing all frames
        // We assume frames are starting at x=0 in layout?
        // calculateFrameLayout returns x positions.
        // We capture from 0 to last frame end? 
        // Actually layout.frames[i].x might be large if user moved them.
        
        // Simple approach: Capture from 0 to max width.
        // Or if we want exact crop: x: minX, width: totalWidth.
        
        // Since we want the background etc, usually we capture the whole stage area defined by content.
        // But stage size is dynamic.
        // Let's use the bounds of the frames.
        
        const dataUrl = stage.toDataURL({
          x: minX,
          y: 0,
          width: totalWidth,
          height: stageHeight,
          pixelRatio: scale, // Maintain quality
          mimeType: "image/png",
          quality: 1,
        });

        const blob = await (await fetch(dataUrl)).blob();
        saveAs(blob, `${timestamp}-canvas.png`);

      } else {
        // BATCH EXPORT (Default)
        // Single export logic
        if (frames.length === 1) {
          // ... existing single frame logic ...
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
          saveAs(blob, `${timestamp}-mockup.png`);
        } else {
          // ZIP export for multiple frames - CANVAS SPLIT APPROACH
          // 1. Export entire stage as one image first
          const fullDataUrl = stage.toDataURL({
            x: 0,
            y: 0,
            width: layout.totalWidth,
            height: stageHeight,
            pixelRatio: scale,
            mimeType: "image/png",
            quality: 1,
          });

          // 2. Load into HTML Image
          const fullImage = new Image();
          fullImage.src = fullDataUrl;
          await new Promise<void>((resolve) => {
            fullImage.onload = () => resolve();
          });

          console.log("Full image loaded:", fullImage.width, "x", fullImage.height);

          // 3. Create zip and split using HTML Canvas
          const zip = new JSZip();

          // DEBUG: Also save the full stitched image
          const fullBase64 = fullDataUrl.replace(/^data:image\/png;base64,/, "");
          zip.file("_FULL_DEBUG.png", fullBase64, { base64: true });
          
          for (let i = 0; i < layout.frames.length; i++) {
            const frameData = layout.frames[i];
            const frameWidth = Math.round(frameData.width);
            const frameHeight = Math.round(stageHeight);
            const frameX = Math.round(frameData.x);

            console.log(`Slice ${i}: x=${frameX}, w=${frameWidth}, h=${frameHeight}`);

            // Create a canvas for this frame slice
            const canvas = document.createElement("canvas");
            canvas.width = frameWidth;
            canvas.height = frameHeight;
            const ctx = canvas.getContext("2d")!;

            // Draw the slice from the full image - pixel perfect
            ctx.drawImage(
              fullImage,
              frameX, 0, frameWidth, frameHeight,  // Source rect
              0, 0, frameWidth, frameHeight         // Dest rect
            );

            // Convert to base64
            const sliceDataUrl = canvas.toDataURL("image/png", 1);
            const base64Data = sliceDataUrl.replace(/^data:image\/png;base64,/, "");
            zip.file(`${i + 1}.png`, base64Data, { base64: true });

            await new Promise((r) => setTimeout(r, 20));
          }

          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, `${timestamp}-mockups.zip`);
        }
      }
    } finally {
      // 5. Restore original state
      guidesLayer.show();
      stage.find(".active-frame-border").forEach((node) => node.show());
      stage.scale({ x: oldScaleX, y: oldScaleY });
      setExporting(false);
    }
  }, [
    stageRef,
    deviceMeta,
    frames,
    cutPreset,
    baseFrameWidth,
    stageHeight,
    exportMode,
  ]);

  const canExport = frames.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between !mb-3">
        <span className="section-title !mb-0 text-white">Export</span>
        <span className="export-size">
          {baseFrameWidth} × {stageHeight}
        </span>
      </div>

      {/* Export Mode Toggle */}
      {frames.length > 1 && (
        <div className="flex bg-zinc-900 rounded-lg p-1 mb-4 border border-zinc-800">
             <button
            onClick={() => setExportMode("batch")}
            className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all ${
              exportMode === "batch"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            Batch (ZIP)
          </button>
          <button
            onClick={() => setExportMode("single")}
            className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all ${
              exportMode === "single"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            Canvas (PNG)
          </button>
        </div>
      )}

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
            Download {
                frames.length > 1 
                    ? (exportMode === "single" ? "Canvas PNG" : "All (ZIP)") 
                    : "PNG"
            }
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
