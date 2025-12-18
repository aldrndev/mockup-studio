import { useCallback, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fileToDataUrl } from "../utils/loadImage";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const { frames, activeFrameId, setScreenshot } = useEditorStore();
  const activeFrame = frames.find((c) => c.id === activeFrameId) || frames[0];
  const screenshot = activeFrame.screenshot;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
        const dataUrl = await fileToDataUrl(file);
        setScreenshot(dataUrl);
      }
    },
    [setScreenshot]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const dataUrl = await fileToDataUrl(file);
        setScreenshot(dataUrl);
      }
    },
    [setScreenshot]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="section-title !mb-2">Screenshot</span>
        {screenshot && (
          <button onClick={() => setScreenshot(null)} className="text-link">
            Clear
          </button>
        )}
      </div>

      {screenshot ? (
        <div className="upload-preview">
          <img src={screenshot} alt="Screenshot" />
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`upload-zone ${isDragging ? "active" : ""}`}
        >
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />
          <svg
            className="w-6 h-6 mb-2 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <span className="text-xs text-zinc-500">
            Drop image or click to upload
          </span>
        </label>
      )}
    </div>
  );
}
