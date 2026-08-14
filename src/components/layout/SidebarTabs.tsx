import React from "react";
import {
  Sparkles,
  Smartphone,
  Image as ImageIcon,
  Type,
  LayoutGrid,
  Shapes,
  Download,
} from "lucide-react";
import { useEditorStore } from "../../store/useEditorStore";
import type { EditorTab } from "../../store/useEditorStore";

interface TabItem {
  id: EditorTab;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: "canvas", label: "Canvas", sublabel: "Size & Ratio", icon: LayoutGrid },
  { id: "templates", label: "Templates", sublabel: "1-Click Styles", icon: Sparkles },
  { id: "devices", label: "Device", sublabel: "3D Mockups", icon: Smartphone },
  { id: "backgrounds", label: "Vectors", sublabel: "Waves & Mesh", icon: ImageIcon },
  { id: "marketing", label: "Badges", sublabel: "Rating & Text", icon: Type },
  { id: "decorations", label: "3D Icons", sublabel: "Floating Assets", icon: Shapes },
  { id: "export", label: "Export", sublabel: "Sizes & ZIP", icon: Download },
];

export const SidebarTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useEditorStore();

  return (
    <div className="w-16.5 shrink-0 bg-[#0b0b0e] border-r border-zinc-800/80 flex flex-col items-center py-3 gap-2 select-none z-20">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-13 h-13 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group cursor-pointer ${
              isActive
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/80 border border-transparent"
            }`}
            title={`${tab.label} (${tab.sublabel})`}
          >
            {/* Active Left Indicator Pill */}
            {isActive && (
              <div className="absolute -left-2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-md shadow-indigo-500" />
            )}

            <Icon
              size={18}
              className={`transition-transform duration-200 shrink-0 ${
                isActive
                  ? "scale-110 text-indigo-400"
                  : "group-hover:scale-110 group-hover:text-zinc-300"
              }`}
            />
            <span
              className={`text-[9.5px] font-semibold tracking-tight leading-none ${
                isActive ? "text-indigo-300" : "text-zinc-500 group-hover:text-zinc-400"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
