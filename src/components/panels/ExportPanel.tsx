import React, { useState, useCallback } from "react";
import type Konva from "konva";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Download,
  Check,
  Package,
  Layers,
  FileImage,
  FolderOpen,
  Save,
  Share2,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import { calculateFrameLayout } from "../../utils/frameLayout";

interface ExportPanelProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ stageRef }) => {
  const {
    frames,
    cutPreset,
    canvasWidth,
    canvasHeight,
    exportProjectJson,
    importProjectJson,
  } = useEditorStore();

  const [exporting, setExporting] = useState(false);
  const [exportMode, setExportMode] = useState<"batch" | "single" | "strip">("batch");
  const [exportScale, setExportScale] = useState<number>(1); // 1x, 2x, 3x
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const baseFrameWidth = canvasWidth ?? 1080;
  const stageHeight = canvasHeight ?? 2400;

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
    guidesLayer?.hide();

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
      if (exportMode === "strip" || exportMode === "single" || frames.length === 1) {
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
        });

        const res = await fetch(dataUrl);
        const blob = await res.blob();
        saveAs(blob, `screenshot_mockup_${timestamp}.png`);
      } else {
        // Multi-frame ZIP export
        const zip = new JSZip();

        for (let i = 0; i < layout.frames.length; i++) {
          const frame = layout.frames[i];
          const dataUrl = stage.toDataURL({
            x: frame.x,
            y: 0,
            width: frame.width,
            height: stageHeight,
            pixelRatio: exportScale,
            mimeType: "image/png",
          });

          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          const filename = `screenshot_${i + 1}_${timestamp}.png`;
          zip.file(filename, base64Data, { base64: true });
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `screenshots_mockup_${timestamp}.zip`);
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      stage.scale({ x: oldScaleX, y: oldScaleY });
      guidesLayer?.show();
      selectionBorders.forEach((node) => node.show());
      stage.draw();
      setExporting(false);
    }
  }, [stageRef, frames, cutPreset, baseFrameWidth, stageHeight, exportMode, exportScale]);

  const handleCopyClipboard = useCallback(async () => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const oldScaleX = stage.scaleX();
    const oldScaleY = stage.scaleY();
    stage.scale({ x: 1, y: 1 });

    const layout = calculateFrameLayout(
      frames,
      cutPreset,
      baseFrameWidth,
      stageHeight
    );

    try {
      const activeF = layout.frames[0];
      const dataUrl = stage.toDataURL({
        x: activeF.x,
        y: 0,
        width: activeF.width,
        height: stageHeight,
        pixelRatio: 1,
        mimeType: "image/png",
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    } finally {
      stage.scale({ x: oldScaleX, y: oldScaleY });
      stage.draw();
    }
  }, [stageRef, frames, cutPreset, baseFrameWidth, stageHeight]);

  const handleSaveProject = () => {
    const jsonStr = exportProjectJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mockup-project-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        importProjectJson(content);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 space-y-6 select-none">
      {/* 1. EXPORT MODE SELECTOR */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Export Package Options
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
          <button
            onClick={() => setExportMode("batch")}
            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
              exportMode === "batch"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Package size={14} />
            <span className="text-[10px]">All Frames (ZIP)</span>
          </button>

          <button
            onClick={() => setExportMode("single")}
            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
              exportMode === "single"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FileImage size={14} />
            <span className="text-[10px]">Single PNG</span>
          </button>

          <button
            onClick={() => setExportMode("strip")}
            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
              exportMode === "strip"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Layers size={14} />
            <span className="text-[10px]">Panorama Strip</span>
          </button>
        </div>
      </section>

      {/* 2. RESOLUTION SCALING MULTIPLIER */}
      <section className="space-y-2.5 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-300">
            Export Resolution Multiplier
          </span>
          <span className="text-[10px] font-mono text-indigo-400">
            {exportScale === 1
              ? `${baseFrameWidth} × ${stageHeight} px`
              : `${baseFrameWidth * exportScale} × ${stageHeight * exportScale} px (Ultra HD)`}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { scale: 1, label: "1x Standard", tag: "Fast" },
            { scale: 2, label: "2x Retina", tag: "2K/4K" },
            { scale: 3, label: "3x Ultra HD", tag: "Crisp Print" },
          ].map((item) => (
            <button
              key={item.scale}
              onClick={() => setExportScale(item.scale)}
              className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                exportScale === item.scale
                  ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/30"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[9px] text-zinc-500">{item.tag}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRIMARY DOWNLOAD & COPY TO CLIPBOARD ACTIONS */}
      <section className="space-y-2.5 pt-2 border-t border-zinc-800/80">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Download size={15} />
          <span>
            {exporting
              ? "Generating High-Res Export..."
              : exportMode === "batch"
              ? `Download All ${frames.length} Screenshots (.ZIP)`
              : exportMode === "strip"
              ? "Download Panorama Strip (.PNG)"
              : "Download Active Frame (.PNG)"}
          </span>
        </button>

        <button
          onClick={handleCopyClipboard}
          className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {copiedSuccess ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied to Clipboard! (Ready to Paste)</span>
            </>
          ) : (
            <>
              <Share2 size={14} className="text-zinc-400" />
              <span>Copy Image to Clipboard (Paste in Figma / Canva / Chat)</span>
            </>
          )}
        </button>
      </section>

      {/* 4. PROJECT BACKUP (.JSON) */}
      <section className="space-y-3 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Project Backup (.json)
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSaveProject}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Save size={13} className="text-indigo-400" />
            <span>Save Project</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all">
            <FolderOpen size={13} className="text-purple-400" />
            <span>Load Project</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleOpenProject}
              className="hidden"
            />
          </label>
        </div>
      </section>
    </div>
  );
};
