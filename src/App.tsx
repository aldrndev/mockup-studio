import { useRef } from "react";
import type Konva from "konva";
import {
  AppHeader,
  SidebarTabs,
  TemplatesPanel,
  DevicesPanel,
  VectorBackgroundPanel,
  MarketingBadgesPanel,
  CanvasSettingsPanel,
  CanvasStage,
  CanvasSelector,
} from "./components";
import { useEditorStore } from "./store/useEditorStore";

function App() {
  const stageRef = useRef<Konva.Stage>(null);
  const { activeTab, setActiveTab } = useEditorStore();

  const handleExportClick = () => {
    setActiveTab("canvas");
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
            {activeTab === "templates" && <TemplatesPanel />}
            {activeTab === "devices" && <DevicesPanel />}
            {activeTab === "backgrounds" && <VectorBackgroundPanel />}
            {activeTab === "marketing" && <MarketingBadgesPanel />}
            {activeTab === "canvas" && (
              <CanvasSettingsPanel stageRef={stageRef} />
            )}
          </div>
        </aside>

        {/* C. CANVAS STAGE VIEWPORT */}
        <div className="flex-1 relative h-full bg-[#050508] canvas-container flex flex-col overflow-hidden">
          {/* Scrollable / Scalable Canvas Area */}
          <main className="flex-1 w-full relative overflow-auto custom-scrollbar-solid min-h-0 flex items-center justify-center p-8">
            <div className="min-w-max min-h-full flex items-center justify-center transition-transform duration-150">
              <CanvasStage stageRef={stageRef} />
            </div>
          </main>

          {/* Floating Bottom Toolbar (Carousel Frame Switcher) */}
          <div className="w-full pb-4 z-20 flex justify-center shrink-0 pointer-events-none">
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
