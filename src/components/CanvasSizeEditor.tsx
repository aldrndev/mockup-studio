import { useEditorStore } from "../store/useEditorStore";

const sizePresets = [
  { label: "App Store", width: 1320, height: 2868 },
  { label: "Play Store", width: 1080, height: 1920 },
  { label: "IG Post", width: 1080, height: 1350 },
  { label: "IG Story/Reels", width: 1080, height: 1920 },
  { label: "TikTok", width: 1080, height: 1920 },
  { label: "Facebook Post", width: 1200, height: 630 },
  { label: "Twitter/X", width: 1200, height: 675 },
  { label: "IG Carousel", width: 1080, height: 1080 },
];

export function CanvasSizeEditor() {
  const { canvasWidth, canvasHeight, setCanvasSize } = useEditorStore();

  const handlePreset = (width: number, height: number) => {
    setCanvasSize(width, height);
  };

  const handleReset = () => {
    setCanvasSize(null, null);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <section>
        <div className="flex items-center gap-2 !mb-2 px-1">
          <div className="w-1 h-3 bg-white/40 rounded-full my-auto" />
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Canvas Size
          </h3>
        </div>

        {/* Size Presets */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {sizePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.width, preset.height)}
              className={`px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                canvasWidth === preset.width && canvasHeight === preset.height
                  ? "bg-indigo-600 text-white shadow-sm ring-1 ring-white/10"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={handleReset}
            className={`px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
              canvasWidth === null
                ? "bg-indigo-600 text-white shadow-sm ring-1 ring-white/10"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            Auto (Device)
          </button>
        </div>

        {/* Custom Size Input */}
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <label className="text-[10px] subpixel-antialiased font-medium text-zinc-400">Width</label>
              <span className="text-[9px] font-mono text-zinc-600">PX</span>
            </div>
            <input
              type="number"
              value={canvasWidth ?? ""}
              placeholder={canvasWidth === null ? "Auto" : ""}
              onChange={(e) =>
                setCanvasSize(
                  e.target.value ? Number(e.target.value) : null,
                  canvasHeight
                )
              }
              className="w-full h-8 px-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs text-zinc-300 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-700 font-mono"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <label className="text-[10px] subpixel-antialiased font-medium text-zinc-400">Height</label>
              <span className="text-[9px] font-mono text-zinc-600">PX</span>
            </div>
            <input
              type="number"
              value={canvasHeight ?? ""}
              placeholder={canvasHeight === null ? "Auto" : ""}
              onChange={(e) =>
                setCanvasSize(
                  canvasWidth,
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-full h-8 px-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs text-zinc-300 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-700 font-mono"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
