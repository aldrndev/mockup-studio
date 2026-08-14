import { useRef } from "react";
import type Konva from "konva";
import {
  AppHeader,
  SidebarTabs,
  CanvasPanel,
  TemplatesPanel,
  DevicesPanel,
  VectorBackgroundPanel,
  MarketingBadgesPanel,
  FloatingElementsPanel,
  ExportPanel,
  CanvasStage,
  CanvasSelector,
} from "./components";
import { useEditorStore } from "./store/useEditorStore";

function App() {
  const stageRef = useRef<Konva.Stage>(null);
  const { activeTab, setActiveTab } = useEditorStore();

  const handleExportClick = () => {
    setActiveTab("export");
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070709] text-zinc-100 overflow-hidden select-none font-sans">
      {/* 1. TOP APP HEADER */}
      <AppHeader onExportClick={handleExportClick} />

      {/* 2. MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* A. SIDEBAR TAB ICON NAVIGATION */}
        <SidebarTabs />

        {/* B. ACTIVE CONTROL PANEL */}
        <aside className="w-85 shrink-0 bg-[#0f0f13] border-r border-zinc-800/80 flex flex-col overflow-hidden z-10 shadow-2xl shadow-black/40">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === "canvas" && <CanvasPanel />}
            {activeTab === "templates" && <TemplatesPanel />}
            {activeTab === "devices" && <DevicesPanel />}
            {activeTab === "backgrounds" && <VectorBackgroundPanel />}
            {activeTab === "marketing" && <MarketingBadgesPanel />}
            {activeTab === "decorations" && <FloatingElementsPanel />}
            {activeTab === "export" && <ExportPanel stageRef={stageRef} />}
          </div>
        </aside>

        {/* C. CANVAS STAGE VIEWPORT */}
        <div className="flex-1 relative h-full bg-[#050508] canvas-container flex flex-col overflow-hidden">
          {/* Scrollable / Scalable Canvas Area (Centered without header clipping or sidebar cut-off) */}
          <main className="flex-1 w-full relative overflow-x-auto overflow-y-auto custom-scrollbar-solid min-h-0 flex flex-col p-6 sm:p-8">
            <div className="m-auto min-w-max flex items-center justify-center transition-transform duration-150 py-2">
              <CanvasStage stageRef={stageRef} />
            </div>
          </main>

          {/* Floating Bottom Toolbar (Carousel Frame Switcher) */}
          <div className="w-full pb-3 pt-1 z-20 flex justify-center shrink-0 pointer-events-none">
            <div className="pointer-events-auto">
              <CanvasSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
