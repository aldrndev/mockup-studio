import React from "react";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useEditorStore } from "../store/useEditorStore";

export const CanvasSelector: React.FC = () => {
  const {
    frames,
    activeFrameId,
    addFrame,
    removeFrame,
    setActiveFrame,
    reorderFrame,
  } = useEditorStore();

  const handleReorder = (fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex >= 0 && toIndex < frames.length) {
      reorderFrame(fromIndex, toIndex);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-[#0f0f13]/90 backdrop-blur-xl border border-zinc-800/80 px-3 py-2 rounded-2xl shadow-2xl shadow-black/60 select-none z-30">
      {/* Label: Play Store Slides */}
      <div className="flex items-center gap-2 pr-3 border-r border-zinc-800/80 shrink-0">
        <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400">
          <Layers size={13} />
        </div>
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:block">
          Screenshots
        </span>
      </div>

      {/* Frame List Thumbnails */}
      <div className="flex items-center gap-1.5">
        {frames.map((frame, index) => {
          const isActive = frame.id === activeFrameId;

          return (
            <div
              key={frame.id}
              onClick={() => setActiveFrame(frame.id)}
              className={`group relative flex items-center justify-center w-8 h-8 shrink-0 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white font-bold border-indigo-400 shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/30 scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span className="text-xs font-mono">{index + 1}</span>

              {/* Tooltip & Reorder/Delete Toolbar on Hover */}
              {isActive && (
                <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#18181d] border border-zinc-700/80 px-1.5 py-1 rounded-lg shadow-2xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-auto z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(index, "left");
                    }}
                    disabled={index === 0}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white disabled:opacity-25 transition-colors"
                    title="Move Left"
                  >
                    <ChevronLeft size={13} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this screenshot slide?")) {
                        removeFrame(frame.id);
                      }
                    }}
                    disabled={frames.length <= 1}
                    className="p-1 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded disabled:opacity-25 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 size={13} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(index, "right");
                    }}
                    disabled={index === frames.length - 1}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white disabled:opacity-25 transition-colors"
                    title="Move Right"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Frame Button */}
      <button
        onClick={() => addFrame()}
        disabled={frames.length >= 8}
        className="h-8 px-2.5 rounded-lg border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all flex items-center gap-1 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
        title="Add Screenshot Frame (Max 8 for Play Store)"
      >
        <Plus size={13} />
        <span className="hidden sm:inline">Add Slide</span>
      </button>

      <span className="text-[10px] text-zinc-500 font-mono pl-1">
        {frames.length}/8
      </span>
    </div>
  );
};
