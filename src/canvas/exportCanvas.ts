import type Konva from "konva";

export function exportCanvas(
  stage: Konva.Stage,
  width: number,
  filename?: string
): void {
  const originalWidth = stage.width();
  const scale = width / originalWidth;

  const dataUrl = stage.toDataURL({
    pixelRatio: scale,
    mimeType: "image/png",
    quality: 1,
  });

  const link = document.createElement("a");
  link.download = filename || `mockup-${Date.now()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportCanvasAsBlob(
  stage: Konva.Stage,
  width: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const originalWidth = stage.width();
    const scale = width / originalWidth;

    stage.toBlob({
      pixelRatio: scale,
      mimeType: "image/png",
      quality: 1,
      callback: (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
    });
  });
}
