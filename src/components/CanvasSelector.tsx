import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layout,
  Grid,
  Layers,
  Monitor,
  Slash,
} from "lucide-react";
import { useEditorStore } from "../store/useEditorStore";
import type { CutPreset } from "../store/useEditorStore";

const cutPresets: { key: CutPreset; label: string; icon: React.ElementType }[] =
  [
    { key: "even", label: "Example: App Store Grid", icon: Grid },
    { key: "overlap", label: "Example: Connected Carousel", icon: Layers },
    { key: "hero", label: "Example: Hero Focus", icon: Monitor },
    { key: "diagonal", label: "Diagonal (Coming Soon)", icon: Slash },
  ];

export function CanvasSelector() {
  const {
    frames,
    activeFrameId,
    addFrame,
    removeFrame,
    setActiveFrame,
    reorderFrame,
    cutPreset,
    setCutPreset,
  } = useEditorStore();

  const handleReorder = (fromIndex: number, direction: "left" | "right") => {
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex >= 0 && toIndex < frames.length) {
      reorderFrame(fromIndex, toIndex);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50 !p-2 !mb-2 rounded-lg mx-auto shadow-xl shadow-black/20 overflow-visible z-50">
      {/* Label: Frames */}
      <div className="flex items-center gap-2 pl-2 pr-2 border-r border-white/5 shrink-0">
        <Layout size={14} className="text-zinc-500" />
        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:block">
          Frames
        </span>
      </div>

      {/* Frame List */}
      <div className="flex items-center gap-1.5">
        {frames.map((frame, index) => {
          const isActive = frame.id === activeFrameId;

          return (
            <div
              key={frame.id}
              onClick={() => setActiveFrame(frame.id)}
              className={`group relative flex items-center justify-center w-9 h-9 shrink-0 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "bg-zinc-800 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              <span className="text-xs font-bold font-mono">{index + 1}</span>

              {/* Hover Actions (Only on Active) */}
              {isActive && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900 border border-zinc-700 p-1.5 rounded-lg shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                  {/* Move Left */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(index, "left");
                    }}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-zinc-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-zinc-400 transition-colors"
                    title="Move Left"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Remove this frame?")) removeFrame(frame.id);
                    }}
                    disabled={frames.length <= 1}
                    className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-zinc-400 transition-colors border-l border-r border-zinc-800 mx-1"
                    title="Remove Frame"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* Move Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(index, "right");
                    }}
                    disabled={index === frames.length - 1}
                    className="p-1.5 hover:bg-zinc-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent text-zinc-400 transition-colors"
                    title="Move Right"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <button
        onClick={addFrame}
        disabled={frames.length >= 4}
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        title="Add Frame (Max 4)"
      >
        <Plus size={14} />
      </button>

      {/* Divider */}
      <div className="w-px h-7 bg-zinc-700/50 mx-3" />

      {/* Cut Style Selector */}
      <div className="flex items-center gap-2">
        {cutPresets.map((preset) => (
          <button
            key={preset.key}
            onClick={() =>
              preset.key !== "diagonal" && setCutPreset(preset.key)
            }
            className={`p-2 transition-all ${
              cutPreset === preset.key
                ? "bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/50"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
            } ${
              preset.key === "diagonal" ? "opacity-30 cursor-not-allowed" : ""
            }`}
            title={preset.label}
          >
            <preset.icon size={16} />
          </button>
        ))}
      </div>

      <span className="text-[10px] text-zinc-600 font-mono ml-3">
        {frames.length}/4
      </span>
    </div>
  );
}
