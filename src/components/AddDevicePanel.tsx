import { Plus } from "lucide-react";
import { useEditorStore } from "../store/useEditorStore";
import type { DeviceType } from "../types/device";

const devices: { type: DeviceType; label: string; sublabel: string }[] = [
  { type: "iphone", label: "iPhone", sublabel: "16 Pro Max" },
  { type: "android", label: "Android", sublabel: "S25 Ultra" },
  { type: "tablet", label: "Tablet", sublabel: "iPad Pro" },
  { type: "desktop", label: "Desktop", sublabel: "MacBook" },
];

export function AddDevicePanel() {
  const { addFrame } = useEditorStore();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {devices.map((d) => (
          <button
            key={d.type}
            onClick={() => addFrame(d.type)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
          >
            <span className="text-xs font-medium text-zinc-400 group-hover:text-white mb-0.5">
              {d.label}
            </span>
            <span className="text-[9px] text-zinc-600 group-hover:text-zinc-500">
              {d.sublabel}
            </span>
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => addFrame()}
        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-xs"
      >
        <Plus size={12} />
        Add Empty Frame
      </button>
    </div>
  );
}
