import React, { useEffect } from "react";
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Layers,
  Smartphone,
  Undo2,
  Redo2,
  RotateCcw,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";

interface AppHeaderProps {
  onExportClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onExportClick }) => {
  const {
    canvasZoom,
    setCanvasZoom,
    setActiveTab,
    frames,
    canvasWidth,
    canvasHeight,
    past,
    future,
    undo,
    redo,
    resetAll,
  } = useEditorStore();

  const handleZoomIn = () => setCanvasZoom((z) => Math.min(2.0, z + 0.1));
  const handleZoomOut = () => setCanvasZoom((z) => Math.max(0.4, z - 0.1));
  const handleZoomReset = () => setCanvasZoom(1);

  // Global Keyboard Shortcuts (Cmd+Z / Ctrl+Z, Cmd+Shift+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <header className="h-14 shrink-0 bg-[#0f0f13] border-b border-zinc-800/80 px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-[#0f0f13] rounded-[10px] flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-tight">
              PlayStore Mockup Studio
            </h1>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PRO
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium">
            3D Device Screenshots & Feature Graphic Generator
          </p>
        </div>
      </div>

      {/* Center Controls: Undo/Redo/Reset + Templates + Zoom */}
      <div className="flex items-center gap-3">
        {/* History: Undo / Redo / Reset All */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 shadow-inner gap-0.5">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none rounded-md transition-colors"
            title="Undo (Ctrl+Z / ⌘Z)"
          >
            <Undo2 size={13} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none rounded-md transition-colors"
            title="Redo (Ctrl+Shift+Z / ⌘⇧Z)"
          >
            <Redo2 size={13} />
          </button>
          <div className="h-3.5 w-px bg-zinc-800 mx-0.5" />
          <button
            onClick={resetAll}
            className="flex items-center gap-1 px-2 py-1 text-zinc-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-md transition-colors text-[11px] font-medium"
            title="Reset All to Blank Canvas"
          >
            <RotateCcw size={11} className="text-zinc-500" />
            <span>Reset All</span>
          </button>
        </div>

        {/* Template Quick Launcher */}
        <button
          onClick={() => setActiveTab("templates")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-500/60 hover:from-indigo-600/30 transition-all text-xs font-semibold shadow-sm group"
        >
          <Sparkles size={13} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span>Templates</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 shadow-inner">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={handleZoomReset}
            className="px-2 py-1 text-[11px] font-mono font-medium text-zinc-300 hover:text-white transition-colors"
            title="Reset Zoom (100%)"
          >
            {Math.round(canvasZoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors border-l border-zinc-800"
            title="Fit to Screen"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* Right Controls: Canvas Dimension Badge & Quick Export */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
          <Layers size={12} className="text-zinc-500" />
          <span>
            {canvasWidth || 1080} × {canvasHeight || 2400} px
          </span>
          <span className="text-zinc-600">({frames.length} frames)</span>
        </div>

        <button
          onClick={() => {
            if (onExportClick) {
              onExportClick();
            } else {
              setActiveTab("canvas");
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={13} />
          <span>Export {frames.length > 1 ? "ZIP" : "PNG"}</span>
        </button>
      </div>
    </header>
  );
};
