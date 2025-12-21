import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Group,
  Text,
  Image as KonvaImage,
  Circle,
  Line,
} from "react-konva";
import type Konva from "konva";
import { useEditorStore } from "../store/useEditorStore";
import { useCanvasRenderer } from "../canvas/useCanvasRenderer";
import type { Frame } from "../store/useEditorStore";
import { fitImageToMask } from "../canvas/fitImageToMask";
import type { DeviceMeta, DeviceType } from "../types/device";

interface CanvasStageProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

function DeviceBody({
  meta,
  deviceType,
  frame,
}: {
  meta: DeviceMeta;
  deviceType: DeviceType;
  frame: Frame;
}) {
  switch (deviceType) {
    case "iphone":
      return <IPhoneBody meta={meta} frame={frame} />;
    case "android":
      return <AndroidFrame meta={meta} frame={frame} />;
    case "tablet":
      return <TabletFrame meta={meta} frame={frame} />;
    case "desktop":
      return <MacBookBody meta={meta} frame={frame} />;
    default:
      return <IPhoneBody meta={meta} frame={frame} />;
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

function IPhoneBody({ meta, frame }: { meta: DeviceMeta; frame: Frame }) {
  // Titanium-like Gradient for the main chassis
  // Dark Titanium: varies from #4a4a4c to #2a2a2c
  const frameGradientStops = [
    0, "#555557",
    0.2, "#2a2a2d",
    0.5, "#1a1a1c",
    0.8, "#2a2a2d",
    1, "#444446"
  ];

  // Dynamic Thickness Calculation
  const rotateXRad = ((frame.rotateX || 0) * Math.PI) / 180;
  const rotateYRad = ((frame.rotateY || 0) * Math.PI) / 180;
  
  // Base thickness factor - how "thick" the device is
  const thickness = 10; 
  
  // Calculate offset vector based on tilt
  // RotateY tilts left/right -> X offset for depth
  // RotateX tilts forward/back -> Y offset for depth
  const thicknessX = Math.tan(rotateYRad) * thickness;
  const thicknessY = Math.tan(rotateXRad) * thickness;

  // Number of layers for smoothness (more = smoother but slower)
  const layerCount = 10;

  // Simulated Depth Layers (Thickness)
  const depthLayers = Array.from({ length: layerCount }).map((_, i) => {
    // distribute offset across layers
    const layerX = (thicknessX / layerCount) * (i + 1);
    const layerY = (thicknessY / layerCount) * (i + 1);
    
    return (
      <Rect
        key={i}
        x={layerX}
        y={layerY}
        width={meta.frameWidth}
        height={meta.frameHeight}
        cornerRadius={meta.screen.radius + 4}
        fill="#1a1a1c" 
        stroke="#111"
        strokeWidth={1}
      />
    );
  });

  return (
    <Group>
      {/* 0. Thickness / Depth Simulation */}
      {/* We offset the stack slightly so the "main" face is centered or on top */}
      <Group> 
        {depthLayers}
      </Group>
      {/* 1. Main Chassis (Outer Frame) */}
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        cornerRadius={meta.screen.radius + 4}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: meta.frameWidth, y: meta.frameHeight }}
        fillLinearGradientColorStops={frameGradientStops}
        shadowColor="black"
        shadowBlur={30}
        shadowOpacity={0.6}
        shadowOffset={{ x: 0, y: 20 }}
      />
      
      {/* 2. Antenna Bands (Subtle dividers) */}
      <Rect x={0} y={110} width={3} height={1} fill="#000" opacity={0.4} />
      <Rect x={meta.frameWidth - 3} y={110} width={3} height={1} fill="#000" opacity={0.4} />
      <Rect x={0} y={meta.frameHeight - 110} width={3} height={1} fill="#000" opacity={0.4} />
      <Rect x={meta.frameWidth - 3} y={meta.frameHeight - 110} width={3} height={1} fill="#000" opacity={0.4} />

      {/* 3. Inner Bezel (Black Border around screen) */}
      <Rect
        x={6}
        y={6}
        width={meta.frameWidth - 12}
        height={meta.frameHeight - 12}
        fill="#000000"
        cornerRadius={meta.screen.radius + 1}
        stroke="#111"
        strokeWidth={1}
      />

      {/* 4. Screen Background (Behind content) */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#000000"
        cornerRadius={meta.screen.radius}
      />

      {/* 5. Buttons (Left Side) - Volume & Action */}
      <Group>
         {/* Action Button */}
        <Rect
          x={-2}
          y={120}
          width={4}
          height={28}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 4, y: 0 }}
          fillLinearGradientColorStops={[0, "#333", 1, "#1a1a1c"]}
          cornerRadius={[4, 0, 0, 4]}
        />
        {/* Vol Up */}
        <Rect
          x={-2}
          y={165}
          width={4}
          height={55}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 4, y: 0 }}
          fillLinearGradientColorStops={[0, "#333", 1, "#1a1a1c"]}
          cornerRadius={[4, 0, 0, 4]}
        />
        {/* Vol Down */}
        <Rect
          x={-2}
          y={230}
          width={4}
          height={55}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 4, y: 0 }}
          fillLinearGradientColorStops={[0, "#333", 1, "#1a1a1c"]}
          cornerRadius={[4, 0, 0, 4]}
        />
      </Group>

      {/* 6. Power Button (Right Side) */}
      <Rect
        x={meta.frameWidth - 2}
        y={190}
        width={4}
        height={90}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 4, y: 0 }}
        fillLinearGradientColorStops={[0, "#1a1a1c", 1, "#444"]}
        cornerRadius={[0, 4, 4, 0]}
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
      {/* Dynamic Island */}
      <Rect
        x={(meta.frameWidth - dynamicIslandWidth) / 2}
        y={dynamicIslandY}
        width={dynamicIslandWidth}
        height={dynamicIslandHeight}
        fill="#000000"
        cornerRadius={18}
      />
      {/* Glossy Reflection (Glass effect) */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        cornerRadius={meta.screen.radius}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: meta.screen.width, y: meta.screen.height }}
        fillLinearGradientColorStops={[
          0, "rgba(255,255,255,0.05)",
          0.4, "transparent",
          0.6, "transparent",
          1, "rgba(255,255,255,0.02)"
        ]}
        listening={false}
      />
    </Group>
  );
}

function AndroidFrame({ meta, frame }: { meta: DeviceMeta; frame: Frame }) {
  // Sharp, Boxy Design (S25 Ultra style)
  const frameGradientStops = [
    0, "#2d2d2d",
    0.3, "#1a1a1a",
    0.7, "#1a1a1a",
    1, "#2d2d2d"
  ];

  // Dynamic Thickness Calculation
  const rotateXRad = ((frame.rotateX || 0) * Math.PI) / 180;
  const rotateYRad = ((frame.rotateY || 0) * Math.PI) / 180;

  const thickness = 12; // Slightly thicker for Ultra
  
  // RotateY tilts left/right -> X offset for depth
  // RotateX tilts forward/back -> Y offset for depth
  const thicknessX = Math.tan(rotateYRad) * thickness;
  const thicknessY = Math.tan(rotateXRad) * thickness;

  const layerCount = 12;

  // Simulated Depth Layers (Thickness)
  const depthLayers = Array.from({ length: layerCount }).map((_, i) => {
    const layerX = (thicknessX / layerCount) * (i + 1);
    const layerY = (thicknessY / layerCount) * (i + 1);

    return (
      <Rect
        key={i}
        x={layerX}
        y={layerY}
        width={meta.frameWidth}
        height={meta.frameHeight}
        cornerRadius={24}
        fill="#1a1a1a" // Darker internal chassis
        stroke="#000"
        strokeWidth={0.5}
      />
    );
  });

  return (
    <Group>
      {/* 0. Thickness / Depth Simulation */}
      <Group>
        {depthLayers}
      </Group>
      {/* 1. Main Chroma Chassis */}
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        cornerRadius={24} // More rounded based on S25 Ultra reference image
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: meta.frameWidth, y: 0 }}
        fillLinearGradientColorStops={frameGradientStops}
        shadowColor="black"
        shadowBlur={25}
        shadowOpacity={0.5}
        shadowOffset={{ x: 0, y: 15 }}
      />



      {/* 2. Inner Black Bezel */}
      <Rect
        x={4}
        y={4}
        width={meta.frameWidth - 8}
        height={meta.frameHeight - 8}
        fill="#000000"
        cornerRadius={20}
      />

      {/* 3. Screen Background */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#000000"
        cornerRadius={meta.screen.radius}
      />

      {/* 4. Camera Hole Punch */}
      <Circle
        x={meta.frameWidth / 2}
        y={28}
        radius={6}
        fill="#000"
        stroke="#111"
        strokeWidth={1}
      />
       {/* Camera Reflection */}
      <Circle x={meta.frameWidth / 2 - 2} y={26} radius={2} fill="rgba(255,255,255,0.2)" />


      {/* 5. Buttons (Right Side) */}
      <Group>
        {/* Power */}
        <Rect
          x={meta.frameWidth - 2}
          y={180}
          width={3}
          height={50}
          fill="#333"
          cornerRadius={[0, 2, 2, 0]}
        />
         {/* Volume Rocker */}
         <Rect
          x={meta.frameWidth - 2}
          y={100}
          width={3}
          height={70}
          fill="#333"
          cornerRadius={[0, 2, 2, 0]}
        />
      </Group>

      {/* 6. Subtle Screen Glare */}
       <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        cornerRadius={meta.screen.radius}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: meta.screen.width, y: meta.screen.height }}
        fillLinearGradientColorStops={[
          0, "rgba(255,255,255,0.03)",
          0.5, "transparent",
          1, "rgba(255,255,255,0.01)"
        ]}
        listening={false}
      />
    </Group>
  );
}

function TabletFrame({ meta, frame: _frame }: { meta: DeviceMeta; frame: Frame }) {
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

function MacBookBody({ meta, frame: _frame }: { meta: DeviceMeta; frame: Frame }) {
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

import { calculateFrameLayout } from "../utils/frameLayout";

export function CanvasStage({ stageRef }: CanvasStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    frames,
    activeFrameId,
    deviceType,
    background,
    cutPreset,
    setActiveFrame,
    canvasWidth,
    canvasHeight,
  } = useEditorStore();

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (background.type === "image" && background.imageUrl) {
      const img = new Image();
      img.src = background.imageUrl;
      // img.crossOrigin = "Anonymous"; // If needed
      img.onload = () => setBgImage(img);
    } else {
      setBgImage(null);
    }
  }, [background.type, background.imageUrl]);


  const { deviceMeta } = useCanvasRenderer(deviceType, null);
  const isDesktop = deviceType === "desktop";

  // Canvas dimensions - device + padding for text space
  // Use custom size if set, otherwise auto from device
  const paddingX = 92;
  const paddingTop = 320;
  const paddingBottom = 80;
  
  // Base dimensions from device
  const autoWidth = deviceMeta.frameWidth + paddingX * 2 + (isDesktop ? 80 : 0);
  const autoHeight = deviceMeta.frameHeight + paddingTop + paddingBottom;
  
  // Apply custom canvas size if set
  const baseFrameWidth = canvasWidth ?? autoWidth;
  const stageHeight = canvasHeight ?? autoHeight;

  // Calculate Layout
  const layout = useMemo(
    () => calculateFrameLayout(frames, cutPreset, baseFrameWidth, stageHeight),
    [frames, cutPreset, baseFrameWidth, stageHeight]
  );

  const totalStageWidth = layout.totalWidth;

  const maxDisplayHeight = 650;
  const scale = Math.min(maxDisplayHeight / stageHeight, 1);

  const displayWidth = totalStageWidth * scale; // Full strip width
  const displayHeight = stageHeight * scale;

  const handleTextDragEnd = useCallback(
    (
      canvasId: string,
      type: "headline" | "subtitle",
      e: Konva.KonvaEventObject<DragEvent>
    ) => {
      const node = e.target;
      const frameLayout = layout.frames.find((f) => f.id === canvasId);
      if (!frameLayout) return;

      const relativeX = node.x() / frameLayout.width;
      const relativeY = node.y() / stageHeight;

      if (type === "headline") {
        useEditorStore.getState().setHeadline({ x: relativeX, y: relativeY });
      } else {
        useEditorStore.getState().setSubtitle({ x: relativeX, y: relativeY });
      }
    },
    [layout, stageHeight]
  );

  return (
    <div ref={containerRef} className="canvas-frame p-2 overflow-hidden">
      <Stage
        ref={stageRef}
        width={totalStageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        style={{
          width: displayWidth,
          height: displayHeight,
          borderRadius: "8px",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        onMouseDown={(e) => {
          const stage = e.target.getStage();
          if (!stage) return;
          const ptr = stage.getPointerPosition();
          if (!ptr) return;

          // Improved Hit Testing for Variable Widths
          const x = (ptr.x - stage.x()) / stage.scaleX();
          const clickedFrame = layout.frames.find(
            (f) => x >= f.x && x < f.x + f.width
          );

          if (clickedFrame && clickedFrame.id !== activeFrameId) {
            setActiveFrame(clickedFrame.id);
          }
        }}
      >
        <Layer>
          {/* 1. MASTER BACKGROUND (Spans layout) */}
          {background.type === "solid" && (
            <Rect
              width={totalStageWidth}
              height={stageHeight}
              fill={background.color1}
            />
          )}

          {background.type === "image" && bgImage && (
            (() => {
               // Calculate "Cover" fit
               const imgRatio = bgImage.width / bgImage.height;
               const canvasRatio = totalStageWidth / stageHeight;
               
               let renderW, renderH, renderX, renderY;
               
               if (imgRatio > canvasRatio) {
                 // Image is wider -> Match Display Height
                 renderH = stageHeight;
                 renderW = renderH * imgRatio;
                 renderY = 0;
                 renderX = (totalStageWidth - renderW) / 2;
               } else {
                 // Image is taller -> Match Display Width
                 renderW = totalStageWidth;
                 renderH = renderW / imgRatio;
                 renderX = 0;
                 renderY = (stageHeight - renderH) / 2;
               }

               return (
                 <KonvaImage
                   image={bgImage}
                   width={renderW}
                   height={renderH}
                   x={renderX}
                   y={renderY}
                 />
               );
            })()
          )}

          {background.type === "gradient" && (
            <Rect
              width={totalStageWidth}
              height={stageHeight}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{
                x:
                  totalStageWidth *
                  Math.cos((background.angle * Math.PI) / 180),
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

          {background.vignette && (
            <Rect
              width={totalStageWidth}
              height={stageHeight}
              fillRadialGradientStartPoint={{
                x: totalStageWidth / 2,
                y: stageHeight / 2,
              }}
              fillRadialGradientEndPoint={{
                x: totalStageWidth / 2,
                y: stageHeight / 2,
              }}
              fillRadialGradientStartRadius={
                Math.min(totalStageWidth, stageHeight) * 0.4
              }
              fillRadialGradientEndRadius={
                Math.max(totalStageWidth, stageHeight) * 0.9
              }
              fillRadialGradientColorStops={[
                0,
                "transparent",
                1,
                "rgba(0,0,0,0.2)",
              ]}
              listening={false}
            />
          )}

          {background.style === "radial" && (
            <Rect
              width={totalStageWidth}
              height={stageHeight}
              fillRadialGradientStartPoint={{
                x: totalStageWidth / 2,
                y: stageHeight / 2,
              }}
              fillRadialGradientEndPoint={{
                x: totalStageWidth / 2,
                y: stageHeight / 2,
              }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={
                Math.max(totalStageWidth, stageHeight) * 0.8
              }
              fillRadialGradientColorStops={[
                0,
                "rgba(255,255,255,0.12)",
                1,
                "transparent",
              ]}
              listening={false}
            />
          )}

          {background.style === "spotlight" && (
            <Rect
              width={totalStageWidth}
              height={stageHeight}
              fillRadialGradientStartPoint={{ x: totalStageWidth / 2, y: 0 }}
              fillRadialGradientEndPoint={{ x: totalStageWidth / 2, y: 0 }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndRadius={stageHeight * 1.2}
              fillRadialGradientColorStops={[
                0,
                "rgba(255,255,255,0.15)",
                1,
                "transparent",
              ]}
              listening={false}
            />
          )}

          {background.style === "beam" && (
            <Rect
              x={totalStageWidth / 2 - totalStageWidth * 0.15}
              y={0}
              width={totalStageWidth * 0.3}
              height={stageHeight}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: totalStageWidth * 0.3, y: 0 }}
              fillLinearGradientColorStops={[
                0,
                "transparent",
                0.5,
                "rgba(255,255,255,0.08)",
                1,
                "transparent",
              ]}
              listening={false}
            />
          )}

          <BackgroundOverlays
            stageWidth={totalStageWidth}
            stageHeight={stageHeight}
            opacity={background.noise}
            pattern={background.pattern}
          />
        </Layer>

        {/* FRAMES */}
        <Layer>
          {layout.frames.map((frameLayout, index) => {
            const frame = frames.find((f) => f.id === frameLayout.id);
            if (!frame) return null;

            return (
              <FrameContent
                key={frame.id}
                frame={frame}
                isActive={frame.id === activeFrameId}
                deviceType={frame.deviceType}
                x={frameLayout.x}
                width={frameLayout.width}
                height={frameLayout.height}
                stageHeight={stageHeight}
                backdrop={background.backdrop}
                onTextDragEnd={handleTextDragEnd}
                frameIndex={index}
                totalFrames={layout.frames.length}
              />
            );
          })}
        </Layer>

        {/* GUIDES OVERLAY (Cut Lines) */}
        <Layer listening={false}>
          {layout.frames.map((frameLayout, i) => {
            // Don't draw line after the last frame
            if (i === layout.frames.length - 1) return null;
            // Draw line at the END of this frame (x + width)
            const lineX = frameLayout.x + frameLayout.width;

            return (
              <Group key={`guide-${i}`}>
                {/* Dashed Cut Line */}
                <Line
                  points={[lineX, 0, lineX, stageHeight]}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={2}
                  dash={[8, 8]}
                />
                {/* Scissor Icon (Visual indicator) */}
                <Circle
                  x={lineX}
                  y={40}
                  radius={12}
                  fill="rgba(0,0,0,0.5)"
                  stroke="white"
                  strokeWidth={1.5}
                />
                {/* Text Label */}
                <Text
                  x={lineX - 20}
                  y={15}
                  text="CUT"
                  fontSize={10}
                  fill="rgba(255,255,255,0.8)"
                  fontFamily="Inter"
                  width={40}
                  align="center"
                />
              </Group>
            );
          })}
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

function FrameContent({
  frame,
  isActive,
  deviceType,
  x,
  width,
  stageHeight,
  backdrop,
  onTextDragEnd,
  frameIndex,
  totalFrames,
}: {
  frame: Frame;
  width: number;
  height: number;
  x: number;
  deviceType: DeviceType;
  isActive: boolean;
  stageHeight: number;
  backdrop?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTextDragEnd: (id: string, type: "headline" | "subtitle", e: any) => void;
  frameIndex: number;
  totalFrames: number;
}) {
  const { screenshotImage, deviceMeta } = useCanvasRenderer(
    deviceType,
    frame.screenshot
  );

  // Calculate base centering within the frame
  const baseCenterX = Math.round((width - deviceMeta.frameWidth) / 2);
  
  // CAROUSEL POSITIONING: Shift devices to create visual flow across frames
  // For seamless carousel, devices should appear to flow/connect
  let carouselOffset = 0;
  if (totalFrames > 1) {
    const overlapAmount = width * 0.15; // 15% overlap towards adjacent frame
    if (frameIndex === 0) {
      // First frame: shift device slightly right (towards next frame)
      carouselOffset = overlapAmount;
    } else if (frameIndex === totalFrames - 1) {
      // Last frame: shift device slightly left (towards previous frame)
      carouselOffset = -overlapAmount;
    }
    // Middle frames stay centered (carouselOffset = 0)
  }
  
  const deviceX = baseCenterX + carouselOffset;
  
  // Calculate deviceY to center device vertically, with some top padding for text
  const textPaddingTop = Math.min(120, stageHeight * 0.1);
  const availableHeight = stageHeight - textPaddingTop;
  
  // Center device in available space
  const deviceY = Math.round(textPaddingTop + (availableHeight - deviceMeta.frameHeight) / 2);

  // Calculate pivot point for rotation/scaling (Center of device)
  const centerX = deviceX + deviceMeta.frameWidth / 2 + (frame.offsetX || 0);
  const centerY = deviceY + deviceMeta.frameHeight / 2 + (frame.offsetY || 0);

  const screenshotFit = useMemo(() => {
    if (!screenshotImage) return null;
    return fitImageToMask(
      screenshotImage.width,
      screenshotImage.height,
      deviceMeta.screen
    );
  }, [screenshotImage, deviceMeta.screen]);

  // Handle Device Drag
  const handleDeviceDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    // Current position relative to the FrameContent group
    const newX = node.x();
    const newY = node.y();

    // Calculate what the offset SHOULD be to achieve this X/Y
    // centerX = baseCenterX + offsetX  =>  offsetX = centerX - baseCenterX
    const baseCenterX = deviceX + deviceMeta.frameWidth / 2;
    const baseCenterY = deviceY + deviceMeta.frameHeight / 2;

    const newOffsetX = newX - baseCenterX;
    const newOffsetY = newY - baseCenterY;

    // Update store
    useEditorStore.getState().setFrameProperties({
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    });
  };

  return (
    <Group x={x} y={0}>
      {/* Frame Border (Visualize selection) */}
      {isActive && (
        <Rect
          width={width}
          height={stageHeight}
          name="active-frame-border"
          stroke="#8b5cf6"
          strokeWidth={4}
          opacity={0.3}
          listening={false}
        />
      )}

      {/* Backdrop Panel */}
      {backdrop && (
        <Rect
          x={deviceX - 20 + (frame.offsetX || 0)}
          y={deviceY - 20 + (frame.offsetY || 0)}
          width={deviceMeta.frameWidth + 40}
          height={deviceMeta.frameHeight + 40}
          fill="rgba(255,255,255,0.08)"
          cornerRadius={deviceMeta.screen.radius + 32}
          shadowColor="black"
          shadowBlur={30}
          shadowOpacity={0.2}
          shadowOffsetY={10}
        />
      )}

      {/* Device Body (Transformed) */}
      {frame.showDevice !== false && (
        <Group
          x={centerX}
          y={centerY}
          // Scale-based 3D perspective (no skew distortion)
          // RotateX (forward/back tilt) → shrink height
          // RotateY (left/right tilt) → shrink width  
          scaleX={
            frame.scale *
            (frame.flipX ? -1 : 1) *
            Math.cos(((frame.rotateY || 0) * Math.PI) / 180)
          }
          scaleY={
            frame.scale *
            (frame.flipY ? -1 : 1) *
            Math.cos(((frame.rotateX || 0) * Math.PI) / 180)
          }
          rotation={frame.rotation}
          skewX={Math.tan(((frame.skewX || 0) * Math.PI) / 180)}
          skewY={Math.tan(((frame.skewY || 0) * Math.PI) / 180)}
          offset={{
            x: deviceMeta.frameWidth / 2,
            y: deviceMeta.frameHeight / 2,
          }}
          draggable={isActive}
          onDragEnd={handleDeviceDragEnd}
          onDragStart={() => {
            // Optional: Snap visual feedback or cursor change
          }}
        >
          <DeviceBody meta={deviceMeta} deviceType={deviceType} frame={frame} />
          <Group
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clipFunc={(ctx: any) => {
              const r = deviceMeta.screen.radius;
              const x = deviceMeta.screen.x;
              const y = deviceMeta.screen.y;
              const w = deviceMeta.screen.width;
              const h = deviceMeta.screen.height;
              ctx.beginPath();
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
          <DeviceOverlay meta={deviceMeta} deviceType={deviceType} />
        </Group>
      )}

      {/* Text Layer */}
      <Group>
        {frame.headline.text && (
          <Text
            x={frame.headline.x * width}
            y={frame.headline.y * stageHeight}
            text={frame.headline.text}
            fontSize={frame.headline.fontSize}
            fontFamily={frame.headline.fontFamily}
            fontStyle={frame.headline.fontWeight >= 700 ? "bold" : "normal"}
            fill={frame.headline.fill}
            align="center"
            width={width}
            draggable={isActive}
            onDragEnd={(e) => onTextDragEnd(frame.id, "headline", e)}
            onDragMove={(e) => {
              e.target.offsetX(e.target.width() / 2);
            }}
          />
        )}
        {frame.subtitle.text && (
          <Text
            x={frame.subtitle.x * width}
            y={frame.subtitle.y * stageHeight}
            text={frame.subtitle.text}
            fontSize={frame.subtitle.fontSize}
            fontFamily={frame.subtitle.fontFamily}
            fill={frame.subtitle.fill}
            align="center"
            width={width}
            draggable={isActive}
            onDragEnd={(e) => onTextDragEnd(frame.id, "subtitle", e)}
            onDragMove={(e) => {
              e.target.offsetX(e.target.width() / 2);
            }}
          />
        )}
      </Group>
    </Group>
  );
}

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPatternImg(null);
    }
  }, [pattern]);

  return (
    <>
      {pattern !== "none" && patternImg && (
        <Rect
          width={stageWidth}
          height={stageHeight}
          fillPatternImage={patternImg}
          fillPatternRepeat="repeat"
          opacity={0.3}
        />
      )}
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
