import React, { useState, useCallback } from "react";
import type Konva from "konva";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  LayoutGrid,
  Download,
  Grid,
  Layers,
  Monitor,
  Check,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import { useCanvasRenderer } from "../../canvas/useCanvasRenderer";
import { calculateFrameLayout } from "../../utils/frameLayout";
import type { CutPreset } from "../../store/useEditorStore";

interface CanvasSettingsPanelProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

const PLAYSTORE_CANVAS_PRESETS = [
  { label: "Play Store (Phone 9:20)", width: 1080, height: 2400, tag: "Standard" },
  { label: "Play Store (Phone 16:9)", width: 1080, height: 1920, tag: "Classic" },
  { label: "Google Play Feature Graphic", width: 1024, height: 500, tag: "Banner" },
  { label: "7-inch Tablet", width: 1200, height: 1920, tag: "Tablet" },
  { label: "10-inch Tablet", width: 1600, height: 2560, tag: "Tablet" },
  { label: "App Icon", width: 512, height: 512, tag: "Icon" },
  { label: "App Store (iPhone 16 Pro)", width: 1320, height: 2868, tag: "iOS" },
  { label: "Instagram Carousel", width: 1080, height: 1080, tag: "Social" },
];

const CUT_PRESETS: { key: CutPreset; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "even", label: "Even Grid", desc: "Equal individual frames", icon: Grid },
  { key: "overlap", label: "Connected Carousel", desc: "Continuous panorama flow", icon: Layers },
  { key: "hero", label: "Hero Center Focus", desc: "Center frame enlarged", icon: Monitor },
];

export const CanvasSettingsPanel: React.FC<CanvasSettingsPanelProps> = ({ stageRef }) => {
  const {
    frames,
    deviceType,
    cutPreset,
    setCutPreset,
    canvasWidth,
    canvasHeight,
    setCanvasSize,
  } = useEditorStore();

  const { deviceMeta } = useCanvasRenderer(deviceType, null);

  const [exporting, setExporting] = useState(false);
  const [exportingKit, setExportingKit] = useState(false);
  const [exportMode, setExportMode] = useState<"batch" | "single">("batch");
  const [exportScale, setExportScale] = useState<number>(1); // 1x or 2x
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [kitSuccess, setKitSuccess] = useState(false);

  const isDesktop = deviceType === "desktop";
  const paddingX = 92;
  const paddingTop = 320;
  const paddingBottom = 80;
  const autoWidth = deviceMeta.frameWidth + paddingX * 2 + (isDesktop ? 80 : 0);
  const autoHeight = deviceMeta.frameHeight + paddingTop + paddingBottom;

  const baseFrameWidth = canvasWidth ?? autoWidth;
  const stageHeight = canvasHeight ?? autoHeight;

  const handleExport = useCallback(async () => {
    if (!stageRef.current) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 100));

    const stage = stageRef.current;
    const oldScaleX = stage.scaleX();
    const oldScaleY = stage.scaleY();

    stage.scale({ x: 1, y: 1 });

    const layers = stage.getLayers();
    const guidesLayer = layers[layers.length - 1];
    guidesLayer.hide();

    const selectionBorders = stage.find(".active-frame-border");
    selectionBorders.forEach((node) => node.hide());

    const layout = calculateFrameLayout(
      frames,
      cutPreset,
      baseFrameWidth,
      stageHeight
    );

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const timestamp = `${dd}${mm}${yy}${hh}${min}`;

    try {
      if (exportMode === "single" || frames.length === 1) {
        let minX = Infinity;
        let maxX = -Infinity;

        layout.frames.forEach((f) => {
          if (f.x < minX) minX = f.x;
          if (f.x + f.width > maxX) maxX = f.x + f.width;
        });

        const totalWidth = maxX - minX;

        const dataUrl = stage.toDataURL({
          x: minX,
          y: 0,
          width: totalWidth,
          height: stageHeight,
          pixelRatio: exportScale,
          mimeType: "image/png",
          quality: 1,
        });

        const blob = await (await fetch(dataUrl)).blob();
        saveAs(blob, `playstore-mockup-${timestamp}.png`);
      } else {
        // Multi-frame Batch ZIP
        const fullDataUrl = stage.toDataURL({
          x: 0,
          y: 0,
          width: layout.totalWidth,
          height: stageHeight,
          pixelRatio: exportScale,
          mimeType: "image/png",
          quality: 1,
        });

        const fullImage = new Image();
        fullImage.src = fullDataUrl;
        await new Promise<void>((resolve) => {
          fullImage.onload = () => resolve();
        });

        const zip = new JSZip();

        for (let i = 0; i < layout.frames.length; i++) {
          const frameData = layout.frames[i];
          const frameWidth = Math.round(frameData.width * exportScale);
          const frameHeight = Math.round(stageHeight * exportScale);
          const frameX = Math.round(frameData.x * exportScale);

          const canvas = document.createElement("canvas");
          canvas.width = frameWidth;
          canvas.height = frameHeight;
          const ctx = canvas.getContext("2d")!;

          ctx.drawImage(
            fullImage,
            frameX,
            0,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth,
            frameHeight
          );

          const sliceDataUrl = canvas.toDataURL("image/png", 1);
          const base64Data = sliceDataUrl.replace(/^data:image\/png;base64,/, "");
          zip.file(`playstore-screenshot-${i + 1}.png`, base64Data, {
            base64: true,
          });

          await new Promise((r) => setTimeout(r, 20));
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `playstore-screenshots-${timestamp}.zip`);
      }

      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      guidesLayer.show();
      selectionBorders.forEach((node) => node.show());
      stage.scale({ x: oldScaleX, y: oldScaleY });
      setExporting(false);
    }
  }, [
    stageRef,
    frames,
    cutPreset,
    baseFrameWidth,
    stageHeight,
    exportMode,
    exportScale,
  ]);

  const handleExportMarketingKit = useCallback(async () => {
    if (!stageRef.current) return;
    setExportingKit(true);
    await new Promise((r) => setTimeout(r, 100));

    const stage = stageRef.current;
    const oldScaleX = stage.scaleX();
    const oldScaleY = stage.scaleY();
    stage.scale({ x: 1, y: 1 });

    const layers = stage.getLayers();
    const guidesLayer = layers[layers.length - 1];
    guidesLayer.hide();
    const selectionBorders = stage.find(".active-frame-border");
    selectionBorders.forEach((node) => node.hide());

    const zip = new JSZip();
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getFullYear()).slice(-2)}`;

    try {
      // 1. Current Stage Export (Phone standard)
      const phoneDataUrl = stage.toDataURL({ pixelRatio: 1, mimeType: "image/png" });
      zip.file(
        "01-playstore-phone-1080x2400.png",
        phoneDataUrl.replace(/^data:image\/png;base64,/, ""),
        { base64: true }
      );

      const phoneImg = new Image();
      phoneImg.src = phoneDataUrl;
      await new Promise<void>((res) => {
        phoneImg.onload = () => res();
      });

      // 2. Play Store Feature Graphic (1024x500)
      const fgCanvas = document.createElement("canvas");
      fgCanvas.width = 1024;
      fgCanvas.height = 500;
      const fgCtx = fgCanvas.getContext("2d")!;
      fgCtx.drawImage(phoneImg, 0, 0, phoneImg.width, phoneImg.height, 0, 0, 1024, 500);
      zip.file(
        "02-playstore-feature-graphic-1024x500.png",
        fgCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""),
        { base64: true }
      );

      // 3. Tablet 10-inch (1600x2560)
      const tabCanvas = document.createElement("canvas");
      tabCanvas.width = 1600;
      tabCanvas.height = 2560;
      const tabCtx = tabCanvas.getContext("2d")!;
      tabCtx.drawImage(phoneImg, 0, 0, phoneImg.width, phoneImg.height, 0, 0, 1600, 2560);
      zip.file(
        "03-playstore-tablet-1600x2560.png",
        tabCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""),
        { base64: true }
      );

      // 4. iOS App Store (1290x2796)
      const iosCanvas = document.createElement("canvas");
      iosCanvas.width = 1290;
      iosCanvas.height = 2796;
      const iosCtx = iosCanvas.getContext("2d")!;
      iosCtx.drawImage(phoneImg, 0, 0, phoneImg.width, phoneImg.height, 0, 0, 1290, 2796);
      zip.file(
        "04-appstore-ios-1290x2796.png",
        iosCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""),
        { base64: true }
      );

      // 5. App Icon (512x512)
      const iconCanvas = document.createElement("canvas");
      iconCanvas.width = 512;
      iconCanvas.height = 512;
      const iconCtx = iconCanvas.getContext("2d")!;
      iconCtx.fillStyle = "#0f172a";
      iconCtx.fillRect(0, 0, 512, 512);

      const appIconUrl = frames[0]?.appIcon?.url;
      if (appIconUrl) {
        const iconImg = new Image();
        iconImg.src = appIconUrl;
        await new Promise<void>((res) => {
          iconImg.onload = () => res();
        });
        iconCtx.drawImage(iconImg, 32, 32, 448, 448);
      } else {
        iconCtx.drawImage(phoneImg, 0, 0, 512, 512);
      }
      zip.file(
        "05-app-icon-512x512.png",
        iconCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""),
        { base64: true }
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Marketing-Kit-All-Formats-${timestamp}.zip`);
      setKitSuccess(true);
      setTimeout(() => setKitSuccess(false), 2500);
    } catch (err) {
      console.error("Marketing Kit export error:", err);
    } finally {
      guidesLayer.show();
      selectionBorders.forEach((node) => node.show());
      stage.scale({ x: oldScaleX, y: oldScaleY });
      setExportingKit(false);
    }
  }, [stageRef, frames]);

  return (
    <div className="p-4 space-y-6">
      {/* 1. CANVAS SIZE PRESETS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Play Store Canvas Size
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {baseFrameWidth} × {stageHeight} px
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PLAYSTORE_CANVAS_PRESETS.map((p) => {
            const isSelected =
              canvasWidth === p.width && canvasHeight === p.height;

            return (
              <button
                key={p.label}
                onClick={() => setCanvasSize(p.width, p.height)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/20"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-bold text-white truncate">
                    {p.label}
                  </span>
                  <span className="text-[8px] font-bold uppercase px-1 rounded bg-zinc-800 text-zinc-400">
                    {p.tag}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  {p.width} × {p.height}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom dimensions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-medium">Custom Width (px)</span>
            <input
              type="number"
              value={canvasWidth || ""}
              placeholder="Auto"
              onChange={(e) =>
                setCanvasSize(
                  e.target.value ? Number(e.target.value) : null,
                  canvasHeight
                )
              }
              className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-medium">Custom Height (px)</span>
            <input
              type="number"
              value={canvasHeight || ""}
              placeholder="Auto"
              onChange={(e) =>
                setCanvasSize(
                  canvasWidth,
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-full h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* 2. CAROUSEL CUT FLOW PRESETS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Multi-Slide Carousel Flow
          </h3>
        </div>

        <div className="space-y-2">
          {CUT_PRESETS.map((cp) => (
            <button
              key={cp.key}
              onClick={() => setCutPreset(cp.key)}
              className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                cutPreset === cp.key
                  ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/20"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  cutPreset === cp.key
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                <cp.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-white">{cp.label}</div>
                <div className="text-[10px] text-zinc-500">{cp.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. EXPORT SETTINGS & DOWNLOAD TRIGGER */}
      <section className="space-y-4 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Export Graphic
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Play Store Ready
          </span>
        </div>

        {/* Export Mode */}
        {frames.length > 1 && (
          <div className="grid grid-cols-2 gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setExportMode("batch")}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                exportMode === "batch"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Batch ZIP ({frames.length} Slides)
            </button>
            <button
              onClick={() => setExportMode("single")}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                exportMode === "single"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Continuous Banner (PNG)
            </button>
          </div>
        )}

        {/* Resolution multiplier */}
        <div className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-300">
            Export Quality
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setExportScale(1)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                exportScale === 1
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              1x (Standard)
            </button>
            <button
              onClick={() => setExportScale(2)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                exportScale === 2
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              2x (Ultra HD)
            </button>
          </div>
        </div>

        {/* Standard Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting || exportingKit || frames.length === 0}
          className="w-full h-12 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Rendering High-Res Graphics...</span>
            </div>
          ) : copiedSuccess ? (
            <div className="flex items-center gap-2 text-emerald-300">
              <Check size={18} />
              <span>Export Complete!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download size={18} />
              <span>
                Download{" "}
                {frames.length > 1
                  ? exportMode === "batch"
                    ? `All (${frames.length} Slides ZIP)`
                    : "Canvas PNG"
                  : "Play Store PNG"}
              </span>
            </div>
          )}
        </button>

        {/* 1-Click Multi-Format Marketing Kit Exporter */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">
              1-Click Multi-Format Kit
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              BUNDLE ALL SIZES
            </span>
          </div>
          <p className="text-[10px] text-zinc-500">
            Exports 5 files in 1 ZIP: Phone 1080×2400, Feature Graphic 1024×500, Tablet 1600×2560, iOS 1290×2796, and Icon 512×512.
          </p>
          <button
            onClick={handleExportMarketingKit}
            disabled={exporting || exportingKit || frames.length === 0}
            className="w-full h-11 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {exportingKit ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating All Resolutions...</span>
              </div>
            ) : kitSuccess ? (
              <div className="flex items-center gap-2 text-white">
                <Check size={16} />
                <span>Kit Downloaded Successfully!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download size={16} />
                <span>Download Multi-Format Marketing Kit (ZIP)</span>
              </div>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
