import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Layers,
  Smartphone,
  Tablet,
  Monitor,
  Undo2,
  Redo2,
  RotateCcw,
  FolderOpen,
  Save,
  ChevronDown,
  ArrowLeftRight,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import type { CutPreset } from "../../store/useEditorStore";

interface AppHeaderProps {
  onExportClick?: () => void;
}

const CANVAS_PRESETS_QUICK: {
  label: string;
  width: number;
  height: number;
  tag: string;
  icon: React.ElementType;
  targetDeviceType?: "iphone" | "android" | "tablet" | "desktop";
}[] = [
  { label: "Google Play (9:20 Tall)", width: 1080, height: 2400, tag: "Play Store", icon: Smartphone, targetDeviceType: "android" },
  { label: "Google Play (9:16 HD)", width: 1080, height: 1920, tag: "Play Store", icon: Smartphone, targetDeviceType: "android" },
  { label: "iPhone Pro Max (9:19.5)", width: 1320, height: 2868, tag: "App Store", icon: Smartphone, targetDeviceType: "iphone" },
  { label: "Landscape Feature Graphic", width: 1024, height: 500, tag: "Banner", icon: Monitor, targetDeviceType: "android" },
  { label: "7-inch Tablet Screen", width: 1200, height: 1920, tag: "Tablet", icon: Tablet, targetDeviceType: "tablet" },
  { label: "10-inch Tablet Screen", width: 1600, height: 2560, tag: "Tablet", icon: Tablet, targetDeviceType: "tablet" },
  { label: "iPad Pro 12.9\" Display", width: 2048, height: 2732, tag: "Tablet", icon: Tablet, targetDeviceType: "tablet" },
  { label: "Desktop Web Showcase", width: 1920, height: 1080, tag: "Desktop", icon: Monitor, targetDeviceType: "desktop" },
  { label: "Square Post (1:1 Ratio)", width: 1080, height: 1080, tag: "Social", icon: Sparkles },
];

export const AppHeader: React.FC<AppHeaderProps> = ({ onExportClick }) => {
  const {
    canvasZoom,
    setCanvasZoom,
    setActiveTab,
    frames,
    canvasWidth,
    canvasHeight,
    setCanvasSize,
    cutPreset,
    setCutPreset,
    past,
    future,
    undo,
    redo,
    resetAll,
    exportProjectJson,
    importProjectJson,
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCanvasMenuOpen, setIsCanvasMenuOpen] = useState(false);
  const canvasMenuRef = useRef<HTMLDivElement>(null);

  const currentW = canvasWidth ?? 1080;
  const currentH = canvasHeight ?? 2400;

  const currentPreset = CANVAS_PRESETS_QUICK.find(
    (p) => p.width === currentW && p.height === currentH
  );

  const handleZoomIn = () => setCanvasZoom((z) => Math.min(2.0, z + 0.1));
  const handleZoomOut = () => setCanvasZoom((z) => Math.max(0.4, z - 0.1));
  const handleZoomReset = () => setCanvasZoom(1);

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

  const handleOpenProjectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        const success = importProjectJson(content);
        if (!success) {
          alert("Failed to load project file. Please ensure it is a valid Mockup Studio JSON file.");
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Close canvas menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        canvasMenuRef.current &&
        !canvasMenuRef.current.contains(e.target as Node)
      ) {
        setIsCanvasMenuOpen(false);
      }
    };
    if (isCanvasMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCanvasMenuOpen]);

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
    <header className="h-14 shrink-0 bg-[#0f0f13] border-b border-zinc-800/80 px-4 flex items-center justify-between z-30 select-none relative">
      {/* 1. BRAND & STUDIO TITLE */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-[#0f0f13] rounded-[10px] flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-tight">
              Mockup Studio
            </h1>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PRO
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">
            3D Device Mockup & Screenshot Generator
          </p>
        </div>
      </div>

      {/* 2. CENTER CONTROLS: UNDO/REDO + SAVE/LOAD + DEDICATED CANVAS MENU + ZOOM */}
      <div className="flex items-center gap-2.5">
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

        {/* Project File Save & Open */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 shadow-inner gap-0.5">
          <button
            onClick={handleSaveProject}
            className="flex items-center gap-1 px-2 py-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors text-[11px] font-medium"
            title="Save Project File (.json)"
          >
            <Save size={12} className="text-indigo-400" />
            <span>Save .json</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors text-[11px] font-medium"
            title="Open Existing Project File (.json)"
          >
            <FolderOpen size={12} className="text-purple-400" />
            <span>Open .json</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleOpenProjectFile}
            className="hidden"
          />
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED CANVAS MENU BUTTON & DROPDOWN POPOVER */}
        {/* ========================================================================= */}
        <div className="relative" ref={canvasMenuRef}>
          <button
            onClick={() => setIsCanvasMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold shadow-sm ${
              isCanvasMenuOpen
                ? "bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20"
                : "bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-200 hover:border-zinc-700"
            }`}
          >
            <Layers size={13} className="text-indigo-400" />
            <span className="font-mono text-[11px]">
              {currentW} × {currentH}
            </span>
            <span className="text-[10px] text-zinc-400 hidden md:inline">
              ({currentPreset ? currentPreset.tag : "Custom"})
            </span>
            <ChevronDown
              size={12}
              className={`transition-transform text-zinc-400 ${
                isCanvasMenuOpen ? "rotate-180 text-white" : ""
              }`}
            />
          </button>

          {/* Popover Dropdown Menu */}
          {isCanvasMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-80 bg-[#121217] border border-zinc-800 rounded-2xl shadow-2xl shadow-black/80 p-3 z-50 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers size={14} className="text-indigo-400" /> Canvas Settings
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {currentW} × {currentH} px
                </span>
              </div>

              {/* Custom Width / Height */}
              <div className="space-y-2 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-medium block">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      min={300}
                      max={4000}
                      step={10}
                      value={currentW}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1080;
                        setCanvasSize(val, currentH);
                      }}
                      className="w-full h-7 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-medium block">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min={300}
                      max={4000}
                      step={10}
                      value={currentH}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 2400;
                        setCanvasSize(currentW, val);
                      }}
                      className="w-full h-7 px-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setCanvasSize(currentH, currentW)}
                  className="w-full py-1 px-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] font-medium text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeftRight size={11} className="text-zinc-400" />
                  <span>Flip Orientation ({currentW > currentH ? "Landscape" : "Portrait"})</span>
                </button>
              </div>

              {/* Quick Standard Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Store Presets
                </span>
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-0.5">
                  {CANVAS_PRESETS_QUICK.map((preset) => {
                    const isSelected =
                      preset.width === currentW && preset.height === currentH;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setCanvasSize(preset.width, preset.height, {
                            deviceType: preset.targetDeviceType,
                          });
                          setIsCanvasMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/40 text-white font-semibold"
                            : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-800/80 text-zinc-300"
                        }`}
                      >
                        <span className="text-[11px] block">{preset.label}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {preset.width} × {preset.height}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Carousel Flow Preset Selector */}
              <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 font-bold uppercase">Carousel Flow</span>
                  <span className="text-indigo-400 font-mono">{frames.length} frames</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: "even", label: "Even" },
                    { key: "overlap", label: "Panorama" },
                    { key: "hero", label: "Hero" },
                  ].map((cp) => (
                    <button
                      key={cp.key}
                      onClick={() => setCutPreset(cp.key as CutPreset)}
                      className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                        cutPreset === cp.key
                          ? "bg-indigo-600 text-white border-indigo-500"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

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

      {/* 3. RIGHT CONTROLS: QUICK EXPORT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (onExportClick) {
              onExportClick();
            } else {
              setActiveTab("export");
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
