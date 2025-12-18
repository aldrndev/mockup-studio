import { useRef } from "react";
import type Konva from "konva";
import {
  UploadZone,
  DeviceSelector,
  BackgroundPicker,
  TextEditor,
  CanvasStage,
  ExportPanel,
  CanvasSelector,
  FrameTuner,
} from "./components";

function App() {
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <div className="flex h-screen w-full bg-[#09090b] overflow-hidden">
      {/* LEFT PANEL - Controls */}
      <aside className="w-[320px] h-full shrink-0 panel border-r flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="panel-section flex items-center gap-3 sticky top-0 bg-[#0f0f12] z-10 border-b border-zinc-800/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                Mockup Studio
              </h1>
              <p className="text-[10px] text-zinc-500">
                Device Screenshot Generator
              </p>
            </div>
          </div>

          <div className="panel-section">
            <UploadZone />
          </div>

          <div className="panel-section">
            <span className="section-title">Device</span>
            <DeviceSelector />
          </div>

          <div className="panel-section">
            <FrameTuner />
          </div>

          <div className="panel-section">
            <span className="section-title">Background</span>
            <BackgroundPicker />
          </div>

          <div className="panel-section">
            <span className="section-title text-violet-400 font-bold">
              Marketing Text
            </span>
            <TextEditor />
          </div>

          <div className="panel-section mt-auto border-t border-zinc-800/80 bg-zinc-900/30">
            <ExportPanel stageRef={stageRef} />
          </div>
        </div>
      </aside>

      {/* CENTER - Canvas (Preview Only, No Scroll) */}
      <main className="flex-1 h-full relative overflow-hidden bg-black/20 canvas-container flex flex-col">
        <div className="flex-1 w-full grid place-items-center p-8 overflow-hidden">
          <CanvasStage stageRef={stageRef} />
        </div>

        {/* Canvas Sequence Selector (Floating Bottom) */}
        <div className="w-full pb-6 z-20 flex justify-center">
          <CanvasSelector />
        </div>
      </main>
    </div>
  );
}

export default App;
