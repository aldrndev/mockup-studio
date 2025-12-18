export function createNoiseImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    if (ctx) {
      const idata = ctx.createImageData(size, size);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) {
          // White noise (visible on dark bg)
          buffer32[i] = 0xffffffff;
        } else {
          // Transparent
          buffer32[i] = 0x00000000;
        }
      }

      ctx.putImageData(idata, 0, 0);
    }

    // Create image from canvas
    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => resolve(img);
  });
}

export const createDotPattern = (
  opacity: number = 0.3
): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 20;
    canvas.width = size;
    canvas.height = size;

    if (ctx) {
      const color = `rgba(255,255,255,${opacity})`;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(2, 2, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => resolve(img);
  });
};

export function createGridPattern(
  color = "rgba(255,255,255,0.05)"
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 40;
    canvas.width = size;
    canvas.height = size;

    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, size);
      ctx.stroke();
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => resolve(img);
  });
}
