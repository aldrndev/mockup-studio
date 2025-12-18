import { useEditorStore } from "../store/useEditorStore";
import type { DeviceType } from "../types/device";

const devices: { type: DeviceType; label: string; sublabel: string }[] = [
  { type: "iphone", label: "iPhone", sublabel: "16 Pro Max" },
  { type: "android", label: "Android", sublabel: "S25 Ultra" },
  { type: "tablet", label: "Tablet", sublabel: "iPad Pro" },
  { type: "desktop", label: "Desktop", sublabel: "MacBook" },
];

export function DeviceSelector() {
  const { deviceType, setDeviceType } = useEditorStore();

  return (
    <div className="segmented-control !mt-1">
      {devices.map((d) => (
        <button
          key={d.type}
          onClick={() => setDeviceType(d.type)}
          className={`segment ${deviceType === d.type ? "active" : ""}`}
        >
          <span className="segment-label">{d.label}</span>
          <span className="segment-sublabel">{d.sublabel}</span>
        </button>
      ))}
    </div>
  );
}
