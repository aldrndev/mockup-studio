import type { ScreenArea } from "../types/device";

interface FitResult {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export function fitImageToMask(
  imgWidth: number,
  imgHeight: number,
  screen: ScreenArea
): FitResult {
  const screenRatio = screen.width / screen.height;
  const imgRatio = imgWidth / imgHeight;

  let width: number;
  let height: number;
  let x: number;
  let y: number;

  if (imgRatio > screenRatio) {
    height = screen.height;
    width = imgWidth * (height / imgHeight);
    x = screen.x - (width - screen.width) / 2;
    y = screen.y;
  } else {
    width = screen.width;
    height = imgHeight * (width / imgWidth);
    x = screen.x;
    y = screen.y - (height - screen.height) / 2;
  }

  const scale = width / imgWidth;

  return { x, y, width, height, scale };
}
