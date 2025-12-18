import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Group,
  Text,
  Image as KonvaImage,
  Circle,
} from "react-konva";
import type Konva from "konva";
import { useEditorStore } from "../store/useEditorStore";
import { useCanvasRenderer } from "../canvas/useCanvasRenderer";
import { fitImageToMask } from "../canvas/fitImageToMask";
import type { DeviceMeta, DeviceType } from "../types/device";

interface CanvasStageProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

function DeviceBody({
  meta,
  deviceType,
}: {
  meta: DeviceMeta;
  deviceType: DeviceType;
}) {
  switch (deviceType) {
    case "iphone":
      return <IPhoneBody meta={meta} />;
    case "android":
      return <AndroidFrame meta={meta} />;
    case "tablet":
      return <TabletFrame meta={meta} />;
    case "desktop":
      return <MacBookBody meta={meta} />;
    default:
      return <IPhoneBody meta={meta} />;
  }
}

function DeviceOverlay({
  meta,
  deviceType,
}: {
  meta: DeviceMeta;
  deviceType: DeviceType;
}) {
  switch (deviceType) {
    case "iphone":
      return <IPhoneOverlay meta={meta} />;
    case "desktop":
      return <MacBookOverlay meta={meta} />;
    default:
      return null;
  }
}

// --- Split Components per Device ---

function IPhoneBody({ meta }: { meta: DeviceMeta }) {
  const frameColor = "#1a1a1c";
  const borderColor = "#2a2a2c";

  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        fill={frameColor}
        cornerRadius={meta.screen.radius + 2}
        stroke={borderColor}
        strokeWidth={1.5}
      />
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#000000"
        cornerRadius={meta.screen.radius}
      />
      {/* Side Buttons */}
      <Rect
        x={meta.frameWidth - 3}
        y={140}
        width={3}
        height={80}
        fill={borderColor}
        cornerRadius={[0, 2, 2, 0]}
      />
      <Rect
        x={0}
        y={120}
        width={3}
        height={28}
        fill={borderColor}
        cornerRadius={[2, 0, 0, 2]}
      />
      <Rect
        x={0}
        y={165}
        width={3}
        height={55}
        fill={borderColor}
        cornerRadius={[2, 0, 0, 2]}
      />
      <Rect
        x={0}
        y={230}
        width={3}
        height={55}
        fill={borderColor}
        cornerRadius={[2, 0, 0, 2]}
      />
    </Group>
  );
}

function IPhoneOverlay({ meta }: { meta: DeviceMeta }) {
  const dynamicIslandWidth = 120;
  const dynamicIslandHeight = 36;
  const dynamicIslandY = 20;

  return (
    <Group>
      <Rect
        x={(meta.frameWidth - dynamicIslandWidth) / 2}
        y={dynamicIslandY}
        width={dynamicIslandWidth}
        height={dynamicIslandHeight}
        fill="#000000"
        cornerRadius={18}
      />
    </Group>
  );
}

function AndroidFrame({ meta }: { meta: DeviceMeta }) {
  const frameColor = "#121212";
  const borderColor = "#2a2a2a";

  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        fill={frameColor}
        cornerRadius={meta.screen.radius + 4}
        stroke={borderColor}
        strokeWidth={1.5}
      />
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#000000"
        cornerRadius={meta.screen.radius}
      />
      <Circle x={meta.frameWidth / 2} y={24} radius={8} fill="#000000" />
      <Rect
        x={meta.frameWidth - 3}
        y={100}
        width={3}
        height={60}
        fill={borderColor}
        cornerRadius={[0, 2, 2, 0]}
      />
      <Rect
        x={meta.frameWidth - 3}
        y={180}
        width={3}
        height={80}
        fill={borderColor}
        cornerRadius={[0, 2, 2, 0]}
      />
    </Group>
  );
}

function TabletFrame({ meta }: { meta: DeviceMeta }) {
  const frameColor = "#1c1c1e";
  const borderColor = "#3a3a3c";

  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        fill={frameColor}
        cornerRadius={meta.screen.radius + 8}
        stroke={borderColor}
        strokeWidth={1.5}
      />
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#000000"
        cornerRadius={meta.screen.radius}
      />
      <Circle x={meta.frameWidth / 2} y={12} radius={4} fill="#2a2a2a" />
    </Group>
  );
}

function MacBookBody({ meta }: { meta: DeviceMeta }) {
  const lidColor = "#27272a"; // Zinc-800
  const borderColor = "#3f3f46"; // Zinc-700
  const baseHeight = 16;
  const hingeHeight = 8;

  return (
    <Group>
      {/* Lid Chassis */}
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight - baseHeight - hingeHeight}
        fill={lidColor}
        cornerRadius={[16, 16, 0, 0]}
        stroke={borderColor}
        strokeWidth={1}
      />
      {/* Webcam Dot (Behind overlay, technically invisible, but kept for fallback) */}
      <Circle x={meta.frameWidth / 2} y={12} radius={2} fill="#1a1a1a" />
      {/* Screen Backing */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#000000"
        cornerRadius={[8, 8, 0, 0]}
      />
      {/* Hinge Area */}
      <Rect
        x={0}
        y={meta.frameHeight - baseHeight - hingeHeight}
        width={meta.frameWidth}
        height={hingeHeight}
        fill="#18181b"
      />
      {/* Base / Keyboard Deck */}
      <Rect
        x={-20} // Wider base
        y={meta.frameHeight - baseHeight}
        width={meta.frameWidth + 40}
        height={baseHeight}
        fill="#52525b" // Lighter zinc for contrast
        cornerRadius={[0, 0, 8, 8]}
        stroke={borderColor}
        strokeWidth={1}
      />
      {/* Thumb Indent */}
      <Rect
        x={meta.frameWidth / 2 - 50}
        y={meta.frameHeight - baseHeight}
        width={100}
        height={4}
        fill="#3f3f46"
        cornerRadius={[0, 0, 4, 4]}
      />
    </Group>
  );
}

function MacBookOverlay({ meta }: { meta: DeviceMeta }) {
  const notchWidth = 160;
  const notchHeight = 32;

  return (
    <Group>
      {/* Notch */}
      <Rect
        x={(meta.frameWidth - notchWidth) / 2}
        y={0} // Starts from top edge
        width={notchWidth}
        height={notchHeight}
        fill="#000000" // Pure black matching bezel
        cornerRadius={[0, 0, 10, 10]}
      />
      {/* Camera Lens */}
      <Circle
        x={meta.frameWidth / 2}
        y={14}
        radius={3}
        fill="#1a1a1a" // Slightly lighter lens
      />
      {/* Subtle Screen Glare/Reflection */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{
          x: meta.screen.width,
          y: meta.screen.height,
        }}
        fillLinearGradientColorStops={[
          0,
          "rgba(255,255,255,0.03)",
          0.5,
          "transparent",
          1,
          "rgba(255,255,255,0.01)",
        ]}
        listening={false} // Click-through
      />
    </Group>
  );
}

export function CanvasStage({ stageRef }: CanvasStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { screenshot, deviceType, background, headline, subtitle } =
    useEditorStore();
  const { deviceMeta, screenshotImage } = useCanvasRenderer(
    deviceType,
    screenshot
  );

  const isDesktop = deviceType === "desktop";

  // Canvas dimensions - device + padding for text space
  const paddingX = 80;
  const paddingTop = 320; // Dedicated marketing text zone
  const paddingBottom = 80;

  const stageWidth =
    deviceMeta.frameWidth + paddingX * 2 + (isDesktop ? 80 : 0);
  const stageHeight = deviceMeta.frameHeight + paddingTop + paddingBottom;

  // Scale to fit max 420px width (except desktop)
  const maxDisplayWidth = isDesktop ? 600 : 420;
  const maxDisplayHeight = 650; // Increased to accommodate taller aspect ratio
  const scale = Math.min(
    maxDisplayWidth / stageWidth,
    maxDisplayHeight / stageHeight,
    1
  );
  const displayWidth = stageWidth * scale;
  const displayHeight = stageHeight * scale;

  const screenshotFit = useMemo(() => {
    if (!screenshotImage) return null;
    return fitImageToMask(
      screenshotImage.width,
      screenshotImage.height,
      deviceMeta.screen
    );
  }, [screenshotImage, deviceMeta.screen]);

  const handleTextDragEnd = useCallback(
    (type: "headline" | "subtitle", e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const x = node.x() / stageWidth;
      const y = node.y() / stageHeight;
      if (type === "headline") {
        useEditorStore.getState().setHeadline({ x, y });
      } else {
        useEditorStore.getState().setSubtitle({ x, y });
      }
    },
    [stageWidth, stageHeight]
  );

  // Center device horizontally, position with space for text above
  const deviceX = (stageWidth - deviceMeta.frameWidth) / 2;
  const deviceY = paddingTop;

  return (
    <div ref={containerRef} className="canvas-frame p-2">
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        style={{
          width: displayWidth,
          height: displayHeight,
          borderRadius: "8px",
        }}
      >
        <Layer>
          {/* BACKGROUND RENDERER */}
          {background.type === "solid" && (
            <Rect
              width={stageWidth}
              height={stageHeight}
              fill={background.color1}
            />
          )}

          {background.type === "gradient" && (
            <Rect
              width={stageWidth}
              height={stageHeight}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{
                x: stageWidth * Math.cos((background.angle * Math.PI) / 180),
                y: stageHeight * Math.sin((background.angle * Math.PI) / 180),
              }}
              fillLinearGradientColorStops={[
                0,
                background.color1,
                1,
                background.color2,
              ]}
            />
          )}

          {/* STYLE LAYER - Additive Lighting Effects */}
          {background.style === "radial" && (
            <Rect
              width={stageWidth}
              height={stageHeight}
              fillRadialGradientStartPoint={{
                x: stageWidth / 2,
                y: stageHeight / 2,
              }}
              fillRadialGradientEndPoint={{
                x: stageWidth / 2,
                y: stageHeight / 2,
              }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={
                Math.max(stageWidth, stageHeight) * 0.8
              }
              fillRadialGradientColorStops={[
                0,
                "rgba(255,255,255,0.1)", // Center lighting (subtle)
                1,
                "rgba(0,0,0,0.3)", // Edge darkening (vignette)
              ]}
            />
          )}

          {background.style === "spotlight" && (
            <Rect
              width={stageWidth}
              height={stageHeight}
              fillRadialGradientStartPoint={{ x: stageWidth / 2, y: 0 }}
              fillRadialGradientEndPoint={{ x: stageWidth / 2, y: 0 }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={stageHeight * 1.2}
              fillRadialGradientColorStops={[
                0,
                "rgba(255,255,255,0.15)", // Top lighting
                1,
                "transparent",
              ]}
            />
          )}

          {/* OVERLAYS */}
          {/* We need to use images for noise/pattern. 
              Since we provided the util but can't easily use async in render loop here without state,
              we'll assume for this iteration we might need a quick useEffect wrapper or just use CSS for preview
              BUT requirement says "Export EXACTLY as previewed". So it MUST be on canvas. 
              
              I will add a simple useEffect to load these patterns into state in the component.
          */}
          <BackgroundOverlays
            stageWidth={stageWidth}
            stageHeight={stageHeight}
            opacity={background.noise}
            pattern={background.pattern}
          />
        </Layer>

        <Layer x={deviceX} y={deviceY}>
          <DeviceBody meta={deviceMeta} deviceType={deviceType} />
          <Group
            clipFunc={(ctx) => {
              const r = deviceMeta.screen.radius;
              const x = deviceMeta.screen.x;
              const y = deviceMeta.screen.y;
              const w = deviceMeta.screen.width;
              const h = deviceMeta.screen.height;
              // Simple rounded rect for screen content
              // Using helper or raw context
              // Note: clipFunc context is raw 2D context
              ctx.beginPath();

              // Helper: rounded rect
              ctx.moveTo(x + r, y);
              ctx.lineTo(x + w - r, y);
              ctx.quadraticCurveTo(x + w, y, x + w, y + r);
              ctx.lineTo(x + w, y + h - r);
              ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
              ctx.lineTo(x + r, y + h);
              ctx.quadraticCurveTo(x, y + h, x, y + h - r);
              ctx.lineTo(x, y + r);
              ctx.quadraticCurveTo(x, y, x + r, y);

              ctx.closePath();
            }}
          >
            {screenshotImage && screenshotFit ? (
              <KonvaImage
                image={screenshotImage}
                x={screenshotFit.x}
                y={screenshotFit.y}
                width={screenshotFit.width}
                height={screenshotFit.height}
              />
            ) : (
              <Rect
                x={deviceMeta.screen.x}
                y={deviceMeta.screen.y}
                width={deviceMeta.screen.width}
                height={deviceMeta.screen.height}
                fill="#0a0a0a"
              />
            )}
          </Group>
          {/* Overlay renders ON TOP of screenshot */}
          <DeviceOverlay meta={deviceMeta} deviceType={deviceType} />
        </Layer>

        {/* Text Layer - on top of everything */}
        <Layer>
          {headline.text && (
            <Text
              x={headline.x * stageWidth}
              y={headline.y * stageHeight}
              text={headline.text}
              fontSize={headline.fontSize}
              fontFamily={headline.fontFamily}
              fontStyle={headline.fontWeight >= 700 ? "bold" : "normal"}
              fill={headline.fill}
              align="center"
              draggable
              onDragEnd={(e) => handleTextDragEnd("headline", e)}
              onDragMove={(e) => {
                e.target.offsetX(e.target.width() / 2);
              }}
            />
          )}
          {subtitle.text && (
            <Text
              x={subtitle.x * stageWidth}
              y={subtitle.y * stageHeight}
              text={subtitle.text}
              fontSize={subtitle.fontSize}
              fontFamily={subtitle.fontFamily}
              fill={subtitle.fill}
              align="center"
              draggable
              onDragEnd={(e) => handleTextDragEnd("subtitle", e)}
              onDragMove={(e) => {
                e.target.offsetX(e.target.width() / 2);
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

import {
  createNoiseImage,
  createDotPattern,
  createGridPattern,
} from "../utils/backgroundPatterns";

// Subcomponent for handling async pattern loading
function BackgroundOverlays({
  stageWidth,
  stageHeight,
  opacity,
  pattern,
}: {
  stageWidth: number;
  stageHeight: number;
  opacity: number;
  pattern: string;
}) {
  const [noiseImg, setNoiseImg] = useState<HTMLImageElement | null>(null);
  const [patternImg, setPatternImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    createNoiseImage().then(setNoiseImg);
  }, []);

  useEffect(() => {
    if (pattern === "dots") {
      createDotPattern().then(setPatternImg);
    } else if (pattern === "grid") {
      createGridPattern().then(setPatternImg);
    } else {
      setPatternImg(null);
    }
  }, [pattern]);

  return (
    <>
      {/* Pattern Layer */}
      {pattern !== "none" && patternImg && (
        <Rect
          width={stageWidth}
          height={stageHeight}
          fillPatternImage={patternImg}
          fillPatternRepeat="repeat"
          opacity={0.3} // Increased from 0.05 to 0.3 for visibility (30%)
        />
      )}
      {/* Noise Layer */}
      {opacity > 0 && noiseImg && (
        <Rect
          width={stageWidth}
          height={stageHeight}
          fillPatternImage={noiseImg}
          fillPatternRepeat="repeat"
          opacity={opacity}
        />
      )}
    </>
  );
}
