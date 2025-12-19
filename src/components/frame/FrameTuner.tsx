import {
  RotateCw,
  Maximize,
  Move,
  Monitor,
  Smartphone,
  LayoutTemplate,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  icon: Icon,
  unit = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  icon: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  unit?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <Icon size={14} className="text-zinc-500" />
          <span className="text-[11px] font-medium text-zinc-400">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded text-right min-w-[3.5rem] truncate">
          {Number.isInteger(value) ? value : value.toFixed(1)}
          {unit}
        </span>
      </div>
      <div className="relative h-4 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
        />
      </div>
    </div>
  );
}

export function FrameTuner() {
  const {
    frames,
    activeFrameId,
    setFrameProperties,
    editorMode,
    setEditorMode,
    toggleFrameDevice,
  } = useEditorStore();
  const activeFrame = frames.find((f) => f.id === activeFrameId);

  if (!activeFrame) return null;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* SECTION 1: CONFIGURATION */}
      <section>
        <div className="flex items-center gap-2 !mb-2 px-1">
          <div className="w-1 h-3 bg-white/40 rounded-full my-auto" />
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Configuration
          </h3>
        </div>

        <div className="!space-y-2">
          {/* Mode Toggle */}
          <div className="flex bg-zinc-950 !p-1 rounded-lg border border-zinc-800/50">
            <button
              onClick={() => setEditorMode("standard")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-medium transition-all !p-1 ${
                editorMode === "standard"
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-white/5"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <LayoutTemplate size={14} />
              Auto
            </button>
            <button
              onClick={() => setEditorMode("custom")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-medium transition-all ${
                editorMode === "custom"
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-white/5"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Smartphone size={14} />
              Custom
            </button>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between !p-2 bg-zinc-900/40 rounded-lg">
            <div className="flex items-center gap-2">
              <Monitor size={14} className="text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-400">
                Show Device
              </span>
            </div>
            <button
              onClick={() => toggleFrameDevice(activeFrame.id)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
                activeFrame.showDevice ? "bg-indigo-600" : "bg-zinc-700"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  activeFrame.showDevice ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRANSFORM */}
      {activeFrame.showDevice ? (
        <section>
          {/* Quick Layouts Presets */}
          <div className="space-y-2 !mb-4">
            <div className="flex items-center gap-2 !mb-2 px-1">
               <div className="w-1 h-3 bg-white/40 rounded-full my-auto" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Quick Layouts
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
                 <button
                  onClick={() =>
                    setFrameProperties({
                      rotation: 0,
                      rotateX: 0,
                      rotateY: 0,
                      flipX: false,
                      flipY: false,
                      offsetX: 0,
                      offsetY: 0,
                    })
                  }
                  className="px-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center gap-1 transition-colors group"
                  title="Front View"
                >
                  <div className="w-4 h-6 border-2 border-zinc-500 rounded-[2px] group-hover:border-white transition-colors" />
                  <span className="text-[9px] text-zinc-400 group-hover:text-white">Front</span>
                </button>

                <button
                  onClick={() =>
                    setFrameProperties({
                      rotation: 0,
                      rotateX: 50,
                      rotateY: 0,
                      flipX: false,
                      flipY: false,
                      offsetX: 0,
                    })
                  }
                  className="px-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center gap-1 transition-colors group"
                  title="Laying Flat"
                >
                   <div className="w-4 h-6 border-2 border-zinc-500 rounded-[2px] group-hover:border-white transition-colors transform skew-x-[30deg] scale-y-75 origin-bottom" />
                  <span className="text-[9px] text-zinc-400 group-hover:text-white">Flat</span>
                </button>

                <button
                  onClick={() =>
                    setFrameProperties({
                      rotation: 30,
                      rotateX: 10,
                      rotateY: 10,
                      flipX: false,
                      flipY: false,
                    })
                  }
                  className="px-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center gap-1 transition-colors group"
                  title="Isometric Left"
                >
                  <div className="w-4 h-6 border-2 border-zinc-500 rounded-[2px] group-hover:border-white transition-colors transform rotate-[30deg]" />
                  <span className="text-[9px] text-zinc-400 group-hover:text-white">Iso L</span>
                </button>

                <button
                  onClick={() =>
                    setFrameProperties({
                      rotation: -30,
                      rotateX: 10,
                      rotateY: -10,
                      flipX: false,
                      flipY: false,
                    })
                  }
                  className="px-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center gap-1 transition-colors group"
                  title="Isometric Right"
                >
                   <div className="w-4 h-6 border-2 border-zinc-500 rounded-[2px] group-hover:border-white transition-colors transform -rotate-[30deg]" />
                  <span className="text-[9px] text-zinc-400 group-hover:text-white">Iso R</span>
                </button>

                 <button
                  onClick={() =>
                    setFrameProperties({
                      rotation: 0,
                      rotateX: 0,
                      rotateY: 45,
                      flipX: false,
                      flipY: false,
                    })
                  }
                  className="px-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center gap-1 transition-colors group"
                  title="Side Profile"
                >
                   <div className="w-1 h-6 bg-zinc-500 rounded-[1px] group-hover:bg-white transition-colors" />
                  <span className="text-[9px] text-zinc-400 group-hover:text-white">Side</span>
                </button>

                <button
                   onClick={() =>
                    setFrameProperties({
                      rotation: 15,
                      rotateX: -10,
                      rotateY: -5,
                      offsetY: -40,
                      scale: 1.1 // Slightly closer
                    })
                  }
                  className="px-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex flex-col items-center gap-1 transition-colors group"
                  title="Floating Hover"
                >
                   <div className="w-4 h-6 border-2 border-zinc-500 rounded-[2px] group-hover:border-white transition-colors transform -translate-y-1 shadow-lg" />
                  <span className="text-[9px] text-zinc-400 group-hover:text-white">Float</span>
                </button>
            </div>
          </div>

          <div className="flex items-center gap-2 !mb-4 px-1">
            <div className="w-1 h-3 bg-white/40 rounded-full my-auto" />
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Transform
            </h3>
            <div className="flex-1" />
            <button
              onClick={() =>
                setFrameProperties({
                  scale: 1,
                  rotation: 0,
                  rotateX: 0,
                  rotateY: 0,
                  flipX: false,
                  flipY: false,
                  offsetX: 0,
                  offsetY: 0,
                })
              }
              className="text-[10px] items-center gap-1 text-zinc-500 hover:text-white transition-colors flex"
            >
              <RotateCw size={10} className="-scale-x-100" />
              Reset
            </button>
          </div>

          <div className="!space-y-4">
            <Slider
              label="Rotation"
              icon={RotateCw}
              value={activeFrame.rotation}
              min={-180}
              max={180}
              unit="°"
              onChange={(val) => setFrameProperties({ rotation: val })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Slider
                label="Rotate X"
                icon={RotateCw}
                value={activeFrame.rotateX || 0}
                min={-60}
                max={60}
                unit="°"
                onChange={(val) => setFrameProperties({ rotateX: val })}
              />
              <Slider
                label="Rotate Y"
                icon={RotateCw}
                value={activeFrame.rotateY || 0}
                min={-60}
                max={60}
                unit="°"
                onChange={(val) => setFrameProperties({ rotateY: val })}
              />
            </div>

            <Slider
              label="Scale"
              icon={Maximize}
              value={activeFrame.scale}
              min={0.1}
              max={3.0}
              step={0.05}
              unit="x"
              onChange={(val) => setFrameProperties({ scale: val })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Slider
                label="Offset X"
                icon={Move}
                value={activeFrame.offsetX}
                min={-1000}
                max={1000}
                step={10}
                onChange={(val) => setFrameProperties({ offsetX: val })}
              />
              <Slider
                label="Offset Y"
                icon={Move}
                value={activeFrame.offsetY}
                min={-1000}
                max={1000}
                step={10}
                onChange={(val) => setFrameProperties({ offsetY: val })}
              />
            </div>

            {/* Flip Controls */}
            <div className="grid grid-cols-2 gap-4 pt-2">
               <button
                onClick={() => setFrameProperties({ flipX: !activeFrame.flipX })}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                  activeFrame.flipX
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                Flip Horz
              </button>
              <button
                onClick={() => setFrameProperties({ flipY: !activeFrame.flipY })}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                  activeFrame.flipY
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                Flip Vert
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="py-8 text-center border-2 border-dashed border-zinc-800 rounded-xl my-4">
          <p className="text-zinc-600 text-xs italic">
            Device hidden.
            <br />
            Toggle visibility to edit.
          </p>
        </div>
      )}

      {/* SECTION 3: ACTIONS */}
      <section className="mt-auto pt-4 border-t border-zinc-800/50">
        <button
          className="w-full h-9 flex items-center justify-center gap-2 text-[11px] font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          onClick={() => {
            if (confirm("Are you sure you want to remove this frame?")) {
              useEditorStore.getState().removeFrame(activeFrameId);
            }
          }}
          disabled={frames.length <= 1}
        >
          <span className="group-hover:translate-x-0.5 transition-transform">
            Delete Frame
          </span>
        </button>
      </section>
    </div>
  );
}
