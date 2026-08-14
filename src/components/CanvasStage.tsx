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
  Shape,
} from "react-konva";
import type Konva from "konva";
import { useEditorStore } from "../store/useEditorStore";
import { useCanvasRenderer } from "../canvas/useCanvasRenderer";
import type { Frame } from "../store/useEditorStore";
import { fitImageToMask } from "../canvas/fitImageToMask";
import type { DeviceMeta, DeviceType, DeviceColor } from "../types/device";
import { VectorBackgroundLayer } from "./canvas/VectorBackgroundLayer";
import { PlayStoreBadgesLayer } from "./canvas/PlayStoreBadgesLayer";
import { calculateFrameLayout } from "../utils/frameLayout";
import {
  createNoiseImage,
  createDotPattern,
  createGridPattern,
} from "../utils/backgroundPatterns";

interface CanvasStageProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

// -------------------------------------------------------------
// HYPER-REALISTIC 3D DEVICE SHELLS WITH 3D BUTTONS & SPECULAR BEVELS
// -------------------------------------------------------------

function DeviceBody({
  meta,
  deviceType,
  frame,
}: {
  meta: DeviceMeta;
  deviceType: DeviceType;
  frame: Frame;
}) {
  const style = frame.deviceStyle || "realistic";

  if (style === "clay") {
    return <ClayDeviceBody meta={meta} frame={frame} />;
  }

  switch (deviceType) {
    case "android":
      return <SamsungS25UltraBody meta={meta} frame={frame} />;
    case "iphone":
      return <IPhone16ProBody meta={meta} frame={frame} />;
    case "tablet":
      return <TabletFrame meta={meta} frame={frame} />;
    case "desktop":
      return <MacBookBody meta={meta} frame={frame} />;
    default:
      return <SamsungS25UltraBody meta={meta} frame={frame} />;
  }
}

function DeviceOverlay({
  meta,
  deviceType,
  frame,
}: {
  meta: DeviceMeta;
  deviceType: DeviceType;
  frame: Frame;
}) {
  if (frame.deviceStyle === "clay") {
    return null;
  }

  switch (deviceType) {
    case "iphone":
      return <IPhoneOverlay meta={meta} />;
    case "android":
      return <AndroidOverlay meta={meta} />;
    case "desktop":
      return <MacBookOverlay meta={meta} />;
    default:
      return <AndroidOverlay meta={meta} />;
  }
}

// -------------------------------------------------------------
// HELPER: CONTINUOUS 3D CHASSIS HULL GENERATOR
// -------------------------------------------------------------

function draw3DChassisHull(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  w: number,
  h: number,
  r: number,
  dx: number,
  dy: number
) {
  ctx.beginPath();
  const hasX = Math.abs(dx) > 0.5;
  const hasY = Math.abs(dy) > 0.5;

  if (hasX && hasY) {
    if (dx < 0 && dy > 0) {
      // Left & Bottom visible
      ctx.moveTo(r + dx, dy);
      ctx.arcTo(dx, dy, dx, r + dy, r);
      ctx.lineTo(dx, h - r + dy);
      ctx.arcTo(dx, h + dy, r + dx, h + dy, r);
      ctx.lineTo(w - r + dx, h + dy);
      ctx.arcTo(w + dx, h + dy, w + dx, h - r + dy, r);
      ctx.lineTo(w, h - r);
      ctx.arcTo(w, h, w - r, h, r);
      ctx.lineTo(r, h);
      ctx.arcTo(0, h, 0, h - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
    } else if (dx > 0 && dy > 0) {
      // Right & Bottom visible
      ctx.moveTo(w - r + dx, dy);
      ctx.arcTo(w + dx, dy, w + dx, r + dy, r);
      ctx.lineTo(w + dx, h - r + dy);
      ctx.arcTo(w + dx, h + dy, w - r + dx, h + dy, r);
      ctx.lineTo(r + dx, h + dy);
      ctx.arcTo(dx, h + dy, dx, h - r + dy, r);
      ctx.lineTo(0, h - r);
      ctx.arcTo(0, h, r, h, r);
      ctx.lineTo(w - r, h);
      ctx.arcTo(w, h, w, h - r, r);
      ctx.lineTo(w, r);
      ctx.arcTo(w, 0, w - r, 0, r);
      ctx.closePath();
    } else if (dx < 0 && dy < 0) {
      // Left & Top visible
      ctx.moveTo(r + dx, h + dy);
      ctx.arcTo(dx, h + dy, dx, h - r + dy, r);
      ctx.lineTo(dx, r + dy);
      ctx.arcTo(dx, dy, r + dx, dy, r);
      ctx.lineTo(w - r + dx, dy);
      ctx.arcTo(w + dx, dy, w + dx, r + dy, r);
      ctx.lineTo(w, r);
      ctx.arcTo(w, 0, w - r, 0, r);
      ctx.lineTo(r, 0);
      ctx.arcTo(0, 0, 0, r, r);
      ctx.lineTo(0, h - r);
      ctx.arcTo(0, h, r, h, r);
      ctx.closePath();
    } else {
      // Right & Top visible (dx > 0 && dy < 0)
      ctx.moveTo(w - r + dx, h + dy);
      ctx.arcTo(w + dx, h + dy, w + dx, h - r + dy, r);
      ctx.lineTo(w + dx, r + dy);
      ctx.arcTo(w + dx, dy, w - r + dx, dy, r);
      ctx.lineTo(r + dx, dy);
      ctx.arcTo(dx, dy, dx, r + dy, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.lineTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w, h - r);
      ctx.arcTo(w, h, w - r, h, r);
      ctx.closePath();
    }
  } else if (hasX) {
    if (dx < 0) {
      ctx.moveTo(r + dx, 0);
      ctx.arcTo(dx, 0, dx, r, r);
      ctx.lineTo(dx, h - r);
      ctx.arcTo(dx, h, r + dx, h, r);
      ctx.lineTo(r, h);
      ctx.arcTo(0, h, 0, h - r, r);
      ctx.lineTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.closePath();
    } else {
      ctx.moveTo(w - r + dx, 0);
      ctx.arcTo(w + dx, 0, w + dx, r, r);
      ctx.lineTo(w + dx, h - r);
      ctx.arcTo(w + dx, h, w - r + dx, h, r);
      ctx.lineTo(w - r, h);
      ctx.arcTo(w, h, w, h - r, r);
      ctx.lineTo(w, r);
      ctx.arcTo(w, 0, w - r, 0, r);
      ctx.closePath();
    }
  } else if (hasY) {
    if (dy > 0) {
      ctx.moveTo(0, h - r);
      ctx.arcTo(0, h, r, h, r);
      ctx.lineTo(w - r, h);
      ctx.arcTo(w, h, w, h - r, r);
      ctx.lineTo(w, h - r + dy);
      ctx.arcTo(w, h + dy, w - r, h + dy, r);
      ctx.lineTo(r, h + dy);
      ctx.arcTo(0, h + dy, 0, h - r + dy, r);
      ctx.closePath();
    } else {
      ctx.moveTo(0, r);
      ctx.arcTo(0, 0, r, 0, r);
      ctx.lineTo(w - r, 0);
      ctx.arcTo(w, 0, w, r, r);
      ctx.lineTo(w, r + dy);
      ctx.arcTo(w, dy, w - r, dy, r);
      ctx.lineTo(r, dy);
      ctx.arcTo(0, dy, 0, r + dy, r);
      ctx.closePath();
    }
  }
}

// -------------------------------------------------------------
// 1. SAMSUNG S25 ULTRA REALISTIC 3D CHASSIS & 3D BUTTONS
// -------------------------------------------------------------

function SamsungS25UltraBody({ meta, frame }: { meta: DeviceMeta; frame: Frame }) {
  const color = frame.deviceColor || "titanium-dark";
  const outerRadius = meta.screen.radius + meta.screen.x; // Exact concentric outer radius (28px)

  const chassisPalettes: Record<DeviceColor, string[]> = {
    "titanium-dark": ["#3a3a3e", "#252528", "#121214", "#252528", "#35353a"],
    "titanium-natural": ["#76767e", "#56565e", "#38383e", "#56565e", "#6e6e76"],
    silver: ["#e4e4e7", "#b8b8c0", "#8e8e96", "#b8b8c0", "#ececf0"],
    gold: ["#d97706", "#92400e", "#451a03", "#78350f", "#f59e0b"],
    "deep-blue": ["#2563eb", "#1e3a8a", "#090d16", "#1e293b", "#3b82f6"],
    "midnight-black": ["#222225", "#131315", "#060607", "#131315", "#222225"],
  };

  const gradientStops = chassisPalettes[color] || chassisPalettes["titanium-dark"];

  // 3D Perspective Extrusion with ScaleX/ScaleY projection compensation:
  const rotateY = frame.rotateY || 0;
  const rotateX = frame.rotateX || 0;
  const chassisDepth = frame.depth || 52;

  // Compensate for Konva group's cos(rotateY) / cos(rotateX) compression:
  const radY = (rotateY * Math.PI) / 180;
  const radX = (rotateX * Math.PI) / 180;
  const cosY = Math.max(0.18, Math.abs(Math.cos(radY)));
  const cosX = Math.max(0.18, Math.abs(Math.cos(radX)));

  const dx = -Math.sign(rotateY) * (Math.abs(Math.sin(radY)) / cosY) * chassisDepth;
  const dy = Math.sign(rotateX) * (Math.abs(Math.sin(radX)) / cosX) * (chassisDepth * 0.75);
  const is3D = Math.abs(rotateY) > 0.5 || Math.abs(rotateX) > 0.5;

  return (
    <Group>
      {/* 0. MULTI-LAYER PHOTOREALISTIC SHADOWS */}
      {frame.showShadow !== false && (
        <Group>
          {/* Layer A: Broad Soft Ambient Diffusion */}
          <Rect
            x={dx * 0.6}
            y={24 + dy * 0.6}
            width={meta.frameWidth}
            height={meta.frameHeight}
            cornerRadius={outerRadius}
            fill="rgba(0, 0, 0, 0.35)"
            shadowColor="rgba(0, 0, 0, 0.85)"
            shadowBlur={48}
            shadowOpacity={0.65}
            shadowOffsetY={28}
          />
          {/* Layer B: Tight Contact Occlusion */}
          <Rect
            x={dx * 0.3}
            y={10 + dy * 0.3}
            width={meta.frameWidth}
            height={meta.frameHeight}
            cornerRadius={outerRadius}
            fill="rgba(0, 0, 0, 0.55)"
            shadowColor="rgba(0, 0, 0, 0.95)"
            shadowBlur={16}
            shadowOpacity={0.8}
            shadowOffsetY={8}
          />
        </Group>
      )}

      {/* 1. SEAMLESS 3D EXTRUDED BODY & SIDE/BOTTOM WALLS */}
      {is3D && (
        <Group>
          {/* Back Chassis Plate */}
          <Rect
            x={dx}
            y={dy}
            width={meta.frameWidth}
            height={meta.frameHeight}
            cornerRadius={outerRadius}
            fill="#101012"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={1}
          />

          {/* Continuous 3D Metallic Hull (Left, Right, Bottom, Top & Corners) */}
          <Shape
            sceneFunc={(ctx, shape) => {
              draw3DChassisHull(ctx, meta.frameWidth, meta.frameHeight, outerRadius, dx, dy);
              ctx.fillStrokeShape(shape);
            }}
            fillLinearGradientStartPoint={{
              x: dx < 0 ? dx : 0,
              y: dy < 0 ? dy : 0,
            }}
            fillLinearGradientEndPoint={{
              x: dx > 0 ? meta.frameWidth + dx : meta.frameWidth,
              y: dy > 0 ? meta.frameHeight + dy : meta.frameHeight,
            }}
            fillLinearGradientColorStops={[
              0,
              "#18181c",
              0.25,
              "#35353d",
              0.5,
              "#242429",
              0.75,
              "#18181b",
              1,
              "#121214",
            ]}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth={1}
          />

          {/* Bottom USB-C Port and Speaker Grille details when bottom is visible */}
          {dy > 2 && (
            <Group>
              <Rect
                x={meta.frameWidth / 2 + dx * 0.5 - 20}
                y={meta.frameHeight + dy * 0.45 - 2}
                width={40}
                height={Math.max(4, Math.abs(dy) * 0.22)}
                cornerRadius={3}
                fill="#09090b"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={0.5}
              />
              <Rect
                x={meta.frameWidth / 2 + dx * 0.5 - 75}
                y={meta.frameHeight + dy * 0.45 - 1.5}
                width={35}
                height={Math.max(3, Math.abs(dy) * 0.16)}
                cornerRadius={2}
                fill="#09090b"
              />
              <Rect
                x={meta.frameWidth / 2 + dx * 0.5 + 40}
                y={meta.frameHeight + dy * 0.45 - 1.5}
                width={35}
                height={Math.max(3, Math.abs(dy) * 0.16)}
                cornerRadius={2}
                fill="#09090b"
              />
            </Group>
          )}

          {/* Physical 3D Buttons on the 3D side edge */}
          {dx > 0 && (
            <Group>
              <Rect
                x={meta.frameWidth + dx * 0.7}
                y={130 + dy * 0.4}
                width={Math.max(3.5, Math.abs(dx) * 0.15)}
                height={65}
                cornerRadius={[0, 2, 2, 0]}
                fill="#52525b"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={0.5}
              />
              <Rect
                x={meta.frameWidth + dx * 0.7}
                y={220 + dy * 0.4}
                width={Math.max(3.5, Math.abs(dx) * 0.15)}
                height={40}
                cornerRadius={[0, 2, 2, 0]}
                fill="#52525b"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={0.5}
              />
            </Group>
          )}
        </Group>
      )}

      {/* 2. Main Front Titanium Chassis with Smooth Concentric Curves */}
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        cornerRadius={outerRadius}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: meta.frameWidth, y: meta.frameHeight }}
        fillLinearGradientColorStops={[
          0,
          gradientStops[0],
          0.25,
          gradientStops[1],
          0.5,
          gradientStops[2],
          0.75,
          gradientStops[3],
          1,
          gradientStops[4],
        ]}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={1}
      />

      {/* 3. Outer Chamfer Specular Edge */}
      <Rect
        x={1}
        y={1}
        width={meta.frameWidth - 2}
        height={meta.frameHeight - 2}
        cornerRadius={outerRadius - 1}
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={1}
        listening={false}
      />

      {/* 4. Antenna Isolation Joints */}
      <Line points={[0, 75, 3, 75]} stroke="#000" strokeWidth={1.5} opacity={0.6} />
      <Line
        points={[meta.frameWidth - 3, 75, meta.frameWidth, 75]}
        stroke="#000"
        strokeWidth={1.5}
        opacity={0.6}
      />
      <Line
        points={[0, meta.frameHeight - 75, 3, meta.frameHeight - 75]}
        stroke="#000"
        strokeWidth={1.5}
        opacity={0.6}
      />
      <Line
        points={[meta.frameWidth - 3, meta.frameHeight - 75, meta.frameWidth, meta.frameHeight - 75]}
        stroke="#000"
        strokeWidth={1.5}
        opacity={0.6}
      />

      {/* 5. Inner Ultra-thin Uniform Black Bezel Gasket */}
      <Rect
        x={meta.screen.x - 1}
        y={meta.screen.y - 1}
        width={meta.screen.width + 2}
        height={meta.screen.height + 2}
        fill="#040406"
        cornerRadius={meta.screen.radius + 1}
      />

      {/* 6. Screen Canvas Background */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#070709"
        cornerRadius={meta.screen.radius}
      />

      {/* 7. PHYSICAL 3D BUTTONS (Right Side - default) */}
      {!is3D && (
        <Group>
          {/* Volume Rocker */}
          <Rect
            x={meta.frameWidth - 1}
            y={130}
            width={3.5}
            height={65}
            cornerRadius={[0, 2, 2, 0]}
            fillLinearGradientStartPoint={{ x: 0, y: 130 }}
            fillLinearGradientEndPoint={{ x: 0, y: 195 }}
            fillLinearGradientColorStops={[
              0,
              "#52525b",
              0.5,
              "#27272a",
              1,
              "#3f3f46",
            ]}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />

          {/* Power Button */}
          <Rect
            x={meta.frameWidth - 1}
            y={220}
            width={3.5}
            height={40}
            cornerRadius={[0, 2, 2, 0]}
            fillLinearGradientStartPoint={{ x: 0, y: 220 }}
            fillLinearGradientEndPoint={{ x: 0, y: 260 }}
            fillLinearGradientColorStops={[
              0,
              "#52525b",
              0.5,
              "#27272a",
              1,
              "#3f3f46",
            ]}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />
        </Group>
      )}
    </Group>
  );
}

function AndroidOverlay({ meta }: { meta: DeviceMeta }) {
  const punchX = meta.frameWidth / 2;
  const punchY = 24;

  return (
    <Group listening={false}>
      {/* Screen Glass Reflection Sheen */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        cornerRadius={meta.screen.radius}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{
          x: meta.screen.width * 1.3,
          y: meta.screen.height * 1.3,
        }}
        fillLinearGradientColorStops={[
          0,
          "rgba(255,255,255,0.07)",
          0.2,
          "rgba(255,255,255,0.02)",
          0.5,
          "transparent",
          0.8,
          "rgba(255,255,255,0.01)",
          1,
          "rgba(255,255,255,0.03)",
        ]}
      />

      {/* Top Earpiece Speaker Slit */}
      <Rect
        x={meta.frameWidth / 2 - 32}
        y={5}
        width={64}
        height={2.5}
        cornerRadius={1.25}
        fill="#111113"
        stroke="#27272a"
        strokeWidth={0.5}
      />

      {/* Punch Hole Camera with Optical Lens Reflections */}
      <Circle x={punchX} y={punchY} radius={7} fill="#050507" stroke="#18181b" strokeWidth={1} />
      <Circle
        x={punchX}
        y={punchY}
        radius={4.5}
        fillLinearGradientStartPoint={{ x: punchX - 3, y: punchY - 3 }}
        fillLinearGradientEndPoint={{ x: punchX + 3, y: punchY + 3 }}
        fillLinearGradientColorStops={[0, "#1e1b4b", 0.5, "#0369a1", 1, "#050507"]}
      />
      <Circle x={punchX - 1.2} y={punchY - 1.2} radius={1.2} fill="#ffffff" opacity={0.8} />
    </Group>
  );
}

// -------------------------------------------------------------
// 2. IPHONE 16 PRO MAX REALISTIC 3D CHASSIS & 3D BUTTONS
// -------------------------------------------------------------

function IPhone16ProBody({ meta, frame }: { meta: DeviceMeta; frame: Frame }) {
  const color = frame.deviceColor || "titanium-dark";
  const outerRadius = meta.screen.radius + meta.screen.x; // Exact concentric outer radius (67px)

  const chassisPalettes: Record<DeviceColor, string[]> = {
    "titanium-dark": ["#38383c", "#232326", "#141416", "#232326", "#323236"],
    "titanium-natural": ["#787880", "#585860", "#3a3a40", "#585860", "#707078"],
    silver: ["#e4e4e7", "#b8b8c0", "#8e8e96", "#b8b8c0", "#ececf0"],
    gold: ["#d4a574", "#9b6e3f", "#6b4720", "#9b6e3f", "#dfb88e"],
    "deep-blue": ["#2563eb", "#1e3a8a", "#090d16", "#1e293b", "#3b82f6"],
    "midnight-black": ["#232326", "#141416", "#070708", "#141416", "#232326"],
  };

  const gradientStops = chassisPalettes[color] || chassisPalettes["titanium-dark"];

  // 3D Perspective Extrusion with ScaleX/ScaleY projection compensation:
  const rotateY = frame.rotateY || 0;
  const rotateX = frame.rotateX || 0;
  const chassisDepth = frame.depth || 52;

  // Compensate for Konva group's cos(rotateY) / cos(rotateX) compression:
  const radY = (rotateY * Math.PI) / 180;
  const radX = (rotateX * Math.PI) / 180;
  const cosY = Math.max(0.18, Math.abs(Math.cos(radY)));
  const cosX = Math.max(0.18, Math.abs(Math.cos(radX)));

  const dx = -Math.sign(rotateY) * (Math.abs(Math.sin(radY)) / cosY) * chassisDepth;
  const dy = Math.sign(rotateX) * (Math.abs(Math.sin(radX)) / cosX) * (chassisDepth * 0.75);
  const is3D = Math.abs(rotateY) > 0.5 || Math.abs(rotateX) > 0.5;

  return (
    <Group>
      {/* 0. MULTI-LAYER PHOTOREALISTIC SHADOWS */}
      {frame.showShadow !== false && (
        <Group>
          {/* Layer A: Broad Soft Ambient Diffusion */}
          <Rect
            x={dx * 0.6}
            y={24 + dy * 0.6}
            width={meta.frameWidth}
            height={meta.frameHeight}
            cornerRadius={outerRadius}
            fill="rgba(0, 0, 0, 0.35)"
            shadowColor="rgba(0, 0, 0, 0.85)"
            shadowBlur={48}
            shadowOpacity={0.65}
            shadowOffsetY={28}
          />
          {/* Layer B: Tight Contact Occlusion */}
          <Rect
            x={dx * 0.3}
            y={10 + dy * 0.3}
            width={meta.frameWidth}
            height={meta.frameHeight}
            cornerRadius={outerRadius}
            fill="rgba(0, 0, 0, 0.55)"
            shadowColor="rgba(0, 0, 0, 0.95)"
            shadowBlur={16}
            shadowOpacity={0.8}
            shadowOffsetY={8}
          />
        </Group>
      )}

      {/* 1. SEAMLESS 3D EXTRUDED BODY & SIDE WALL */}
      {is3D && (
        <Group>
          {/* Back Chassis Plate */}
          <Rect
            x={dx}
            y={dy}
            width={meta.frameWidth}
            height={meta.frameHeight}
            cornerRadius={outerRadius}
            fill="#101012"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={1}
          />

          {/* Continuous 3D Metallic Hull (Left, Right, Bottom, Top & Corners) */}
          <Shape
            sceneFunc={(ctx, shape) => {
              draw3DChassisHull(ctx, meta.frameWidth, meta.frameHeight, outerRadius, dx, dy);
              ctx.fillStrokeShape(shape);
            }}
            fillLinearGradientStartPoint={{
              x: dx < 0 ? dx : 0,
              y: dy < 0 ? dy : 0,
            }}
            fillLinearGradientEndPoint={{
              x: dx > 0 ? meta.frameWidth + dx : meta.frameWidth,
              y: dy > 0 ? meta.frameHeight + dy : meta.frameHeight,
            }}
            fillLinearGradientColorStops={[
              0,
              "#18181c",
              0.25,
              "#35353d",
              0.5,
              "#242429",
              0.75,
              "#18181b",
              1,
              "#121214",
            ]}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth={1}
          />

          {/* Bottom USB-C Port and Speaker Grille details when bottom is visible */}
          {dy > 2 && (
            <Group>
              <Rect
                x={meta.frameWidth / 2 + dx * 0.5 - 20}
                y={meta.frameHeight + dy * 0.45 - 2}
                width={40}
                height={Math.max(4, Math.abs(dy) * 0.22)}
                cornerRadius={3}
                fill="#09090b"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={0.5}
              />
              <Rect
                x={meta.frameWidth / 2 + dx * 0.5 - 75}
                y={meta.frameHeight + dy * 0.45 - 1.5}
                width={35}
                height={Math.max(3, Math.abs(dy) * 0.16)}
                cornerRadius={2}
                fill="#09090b"
              />
              <Rect
                x={meta.frameWidth / 2 + dx * 0.5 + 40}
                y={meta.frameHeight + dy * 0.45 - 1.5}
                width={35}
                height={Math.max(3, Math.abs(dy) * 0.16)}
                cornerRadius={2}
                fill="#09090b"
              />
            </Group>
          )}

          {/* Physical 3D Buttons mounted on the 3D side edge */}
          {dx < 0 && (
            <Group>
              <Rect
                x={dx + 2}
                y={115 + dy * 0.4}
                width={Math.max(3.5, Math.abs(dx) * 0.15)}
                height={28}
                cornerRadius={[2, 0, 0, 2]}
                fill="#52525b"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={0.5}
              />
              <Rect
                x={dx + 2}
                y={155 + dy * 0.4}
                width={Math.max(3.5, Math.abs(dx) * 0.15)}
                height={50}
                cornerRadius={[2, 0, 0, 2]}
                fill="#52525b"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={0.5}
              />
              <Rect
                x={dx + 2}
                y={215 + dy * 0.4}
                width={Math.max(3.5, Math.abs(dx) * 0.15)}
                height={50}
                cornerRadius={[2, 0, 0, 2]}
                fill="#52525b"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={0.5}
              />
            </Group>
          )}

          {dx > 0 && (
            <Group>
              {/* Power / Siri Button */}
              <Rect
                x={meta.frameWidth + dx * 0.7}
                y={170 + dy * 0.4}
                width={Math.max(3.5, Math.abs(dx) * 0.15)}
                height={75}
                cornerRadius={[0, 2, 2, 0]}
                fill="#52525b"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={0.5}
              />
              {/* Camera Control button */}
              <Rect
                x={meta.frameWidth + dx * 0.7}
                y={275 + dy * 0.4}
                width={Math.max(3.5, Math.abs(dx) * 0.15)}
                height={55}
                cornerRadius={[0, 2, 2, 0]}
                fill="#3f3f46"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={0.5}
              />
            </Group>
          )}
        </Group>
      )}

      {/* 2. Main Front Titanium Chassis with Smooth Concentric Curves */}
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        cornerRadius={outerRadius}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: meta.frameWidth, y: meta.frameHeight }}
        fillLinearGradientColorStops={[
          0,
          gradientStops[0],
          0.25,
          gradientStops[1],
          0.5,
          gradientStops[2],
          0.75,
          gradientStops[3],
          1,
          gradientStops[4],
        ]}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth={1}
      />

      {/* 3. Outer Chamfer Specular Edge */}
      <Rect
        x={1}
        y={1}
        width={meta.frameWidth - 2}
        height={meta.frameHeight - 2}
        cornerRadius={outerRadius - 1}
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={1}
        listening={false}
      />

      {/* 4. Inner Ultra-thin Uniform Black Bezel Gasket */}
      <Rect
        x={meta.screen.x - 1}
        y={meta.screen.y - 1}
        width={meta.screen.width + 2}
        height={meta.screen.height + 2}
        fill="#040406"
        cornerRadius={meta.screen.radius + 1}
      />

      {/* 5. Screen Canvas */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#070709"
        cornerRadius={meta.screen.radius}
      />

      {/* 6. PHYSICAL 3D BUTTONS (Left & Right - default flat view) */}
      {!is3D && (
        <Group>
          {/* LEFT: Action Button */}
          <Rect
            x={-3.5}
            y={115}
            width={4}
            height={28}
            cornerRadius={[2, 0, 0, 2]}
            fill="#3f3f46"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />
          {/* LEFT: Volume Up */}
          <Rect
            x={-3.5}
            y={155}
            width={4}
            height={50}
            cornerRadius={[2, 0, 0, 2]}
            fill="#3f3f46"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />
          {/* LEFT: Volume Down */}
          <Rect
            x={-3.5}
            y={215}
            width={4}
            height={50}
            cornerRadius={[2, 0, 0, 2]}
            fill="#3f3f46"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />

          {/* RIGHT: Power Button */}
          <Rect
            x={meta.frameWidth - 1}
            y={165}
            width={3.5}
            height={75}
            cornerRadius={[0, 2, 2, 0]}
            fill="#3f3f46"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
          />

          {/* RIGHT: Camera Control Button */}
          <Rect
            x={meta.frameWidth - 1}
            y={300}
            width={3}
            height={46}
            cornerRadius={[0, 2, 2, 0]}
            fill="#27272a"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={0.5}
          />
        </Group>
      )}
    </Group>
  );
}

function IPhoneOverlay({ meta }: { meta: DeviceMeta }) {
  const dynamicIslandWidth = 116;
  const dynamicIslandHeight = 32;
  const dynamicIslandY = 16;
  const islandX = (meta.frameWidth - dynamicIslandWidth) / 2;

  return (
    <Group listening={false}>
      {/* Dynamic Island Pill */}
      <Rect
        x={islandX}
        y={dynamicIslandY}
        width={dynamicIslandWidth}
        height={dynamicIslandHeight}
        fill="#000000"
        cornerRadius={16}
        stroke="#111113"
        strokeWidth={0.5}
      />

      {/* Optical Camera Lens inside Dynamic Island */}
      <Circle
        x={islandX + 24}
        y={dynamicIslandY + 16}
        radius={4.5}
        fillLinearGradientStartPoint={{ x: -2, y: -2 }}
        fillLinearGradientEndPoint={{ x: 2, y: 2 }}
        fillLinearGradientColorStops={[0, "#1e1b4b", 0.5, "#0284c7", 1, "#000"]}
      />
      <Circle
        x={islandX + 22.8}
        y={dynamicIslandY + 14.8}
        radius={1.2}
        fill="#ffffff"
        opacity={0.85}
      />

      {/* Sensor Dot */}
      <Circle x={islandX + 70} y={dynamicIslandY + 16} radius={3} fill="#0a0a0d" />

      {/* Glossy Screen Glare */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        cornerRadius={meta.screen.radius}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{
          x: meta.screen.width * 1.3,
          y: meta.screen.height * 1.3,
        }}
        fillLinearGradientColorStops={[
          0,
          "rgba(255,255,255,0.07)",
          0.2,
          "rgba(255,255,255,0.02)",
          0.5,
          "transparent",
          0.8,
          "rgba(255,255,255,0.01)",
          1,
          "rgba(255,255,255,0.03)",
        ]}
      />
    </Group>
  );
}

// -------------------------------------------------------------
// 3. MINIMAL CLAY MOCKUP BODY
// -------------------------------------------------------------

function ClayDeviceBody({ meta, frame }: { meta: DeviceMeta; frame: Frame }) {
  return (
    <Group>
      {/* 1. Clay Drop Shadow */}
      {frame.showShadow !== false && (
        <Rect
          x={0}
          y={12}
          width={meta.frameWidth}
          height={meta.frameHeight}
          cornerRadius={meta.screen.radius + 6}
          fill="rgba(0, 0, 0, 0.4)"
          shadowColor="rgba(0, 0, 0, 0.85)"
          shadowBlur={32}
          shadowOpacity={0.5}
          shadowOffsetY={18}
        />
      )}

      {/* 2. Clay Main Body */}
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        cornerRadius={meta.screen.radius + 6}
        fill="#334155"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1}
      />

      {/* 3. Screen Canvas */}
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#0f172a"
        cornerRadius={meta.screen.radius}
      />
    </Group>
  );
}

// -------------------------------------------------------------
// 4. TABLET & DESKTOP FRAMES
// -------------------------------------------------------------

function TabletFrame({ meta }: { meta: DeviceMeta; frame: Frame }) {
  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight}
        fill="#1c1c1e"
        cornerRadius={meta.screen.radius + 8}
        stroke="#3a3a3c"
        strokeWidth={1.5}
        shadowColor="black"
        shadowBlur={35}
        shadowOpacity={0.5}
        shadowOffsetY={20}
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

function MacBookBody({ meta }: { meta: DeviceMeta; frame: Frame }) {
  const lidColor = "#27272a";
  const borderColor = "#3f3f46";
  const baseHeight = 16;
  const hingeHeight = 8;

  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={meta.frameWidth}
        height={meta.frameHeight - baseHeight - hingeHeight}
        fill={lidColor}
        cornerRadius={[16, 16, 0, 0]}
        stroke={borderColor}
        strokeWidth={1}
        shadowColor="black"
        shadowBlur={40}
        shadowOpacity={0.6}
        shadowOffsetY={20}
      />
      <Circle x={meta.frameWidth / 2} y={12} radius={2.5} fill="#1a1a1a" />
      <Rect
        x={meta.screen.x}
        y={meta.screen.y}
        width={meta.screen.width}
        height={meta.screen.height}
        fill="#000000"
        cornerRadius={[8, 8, 0, 0]}
      />
      <Rect
        x={0}
        y={meta.frameHeight - baseHeight - hingeHeight}
        width={meta.frameWidth}
        height={hingeHeight}
        fill="#18181b"
      />
      <Rect
        x={-20}
        y={meta.frameHeight - baseHeight}
        width={meta.frameWidth + 40}
        height={baseHeight}
        fill="#52525b"
        cornerRadius={[0, 0, 8, 8]}
        stroke={borderColor}
        strokeWidth={1}
      />
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
    <Group listening={false}>
      <Rect
        x={(meta.frameWidth - notchWidth) / 2}
        y={0}
        width={notchWidth}
        height={notchHeight}
        fill="#000000"
        cornerRadius={[0, 0, 10, 10]}
      />
      <Circle x={meta.frameWidth / 2} y={14} radius={3} fill="#1a1a1a" />
    </Group>
  );
}

function MockupScreenPlaceholder({ meta }: { meta: DeviceMeta }) {
  const sx = meta.screen.x;
  const sy = meta.screen.y;
  const sw = meta.screen.width;
  const sh = meta.screen.height;

  return (
    <Group x={sx} y={sy} width={sw} height={sh} listening={false}>
      {/* 1. Neutral Dark Studio Glass Background */}
      <Rect
        width={sw}
        height={sh}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: sh }}
        fillLinearGradientColorStops={[0, "#111420", 0.5, "#0a0d16", 1, "#05070c"]}
      />

      {/* 2. Ambient Soft Glow in Center */}
      <Circle
        x={sw / 2}
        y={sh / 2}
        radius={sw * 0.65}
        fillRadialGradientStartPoint={{ x: sw / 2, y: sh / 2 }}
        fillRadialGradientEndPoint={{ x: sw / 2, y: sh / 2 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndRadius={sw * 0.65}
        fillRadialGradientColorStops={[0, "rgba(99, 102, 241, 0.12)", 1, "transparent"]}
      />

      {/* 3. Status Bar */}
      <Text
        x={24}
        y={14}
        text="9:41"
        fontSize={12}
        fontFamily="Inter"
        fontStyle="bold"
        fill="#94a3b8"
      />
      <Group x={sw - 60} y={15}>
        <Line points={[0, 8, 0, 10]} stroke="#94a3b8" strokeWidth={1.5} />
        <Line points={[4, 5, 4, 10]} stroke="#94a3b8" strokeWidth={1.5} />
        <Line points={[8, 2, 8, 10]} stroke="#94a3b8" strokeWidth={1.5} />
        <Line points={[12, 0, 12, 10]} stroke="#94a3b8" strokeWidth={1.5} />
        <Rect x={18} y={1} width={18} height={9} cornerRadius={2} stroke="#94a3b8" strokeWidth={1} />
        <Rect x={20} y={3} width={11} height={5} cornerRadius={1} fill="#94a3b8" />
      </Group>

      {/* 4. Elegant Minimalist App Skeleton Cards */}
      <Group x={20} y={65}>
        {/* Top Header Skeleton */}
        <Rect width={120} height={14} cornerRadius={7} fill="rgba(255, 255, 255, 0.08)" />
        <Rect x={sw - 72} width={32} height={32} cornerRadius={16} fill="rgba(255, 255, 255, 0.06)" />

        {/* Hero Card Skeleton */}
        <Rect
          y={48}
          width={sw - 40}
          height={140}
          cornerRadius={18}
          fill="rgba(255, 255, 255, 0.04)"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={1}
        />
        <Rect x={20} y={72} width={140} height={16} cornerRadius={8} fill="rgba(255, 255, 255, 0.12)" />
        <Rect x={20} y={100} width={200} height={10} cornerRadius={5} fill="rgba(255, 255, 255, 0.06)" />
        <Rect x={20} y={120} width={100} height={30} cornerRadius={15} fill="rgba(99, 102, 241, 0.3)" />

        {/* Upload Instruction Box */}
        <Group y={210}>
          <Rect
            width={sw - 40}
            height={160}
            cornerRadius={18}
            fill="rgba(99, 102, 241, 0.05)"
            stroke="rgba(99, 102, 241, 0.25)"
            strokeWidth={1.5}
            dash={[6, 6]}
          />
          {/* Center Upload Icon */}
          <Circle x={(sw - 40) / 2} y={55} radius={22} fill="rgba(99, 102, 241, 0.15)" />
          <Text
            x={(sw - 40) / 2 - 8}
            y={42}
            text="↑"
            fontSize={20}
            fontFamily="Inter"
            fontStyle="bold"
            fill="#818cf8"
          />
          <Text
            y={90}
            width={sw - 40}
            text="Upload Your App Screenshot"
            fontSize={13}
            fontFamily="Inter"
            fontStyle="bold"
            fill="#e2e8f0"
            align="center"
          />
          <Text
            y={114}
            width={sw - 40}
            text="Drag & drop or browse in Upload tab"
            fontSize={10}
            fontFamily="Inter"
            fill="#64748b"
            align="center"
          />
        </Group>

        {/* List Skeleton Items */}
        <Group y={395}>
          <Rect
            width={sw - 40}
            height={60}
            cornerRadius={14}
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={1}
          />
          <Circle x={30} y={30} radius={14} fill="rgba(255, 255, 255, 0.06)" />
          <Rect x={56} y={20} width={120} height={10} cornerRadius={5} fill="rgba(255, 255, 255, 0.08)" />
          <Rect x={56} y={34} width={80} height={8} cornerRadius={4} fill="rgba(255, 255, 255, 0.04)" />
        </Group>

        <Group y={470}>
          <Rect
            width={sw - 40}
            height={60}
            cornerRadius={14}
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={1}
          />
          <Circle x={30} y={30} radius={14} fill="rgba(255, 255, 255, 0.06)" />
          <Rect x={56} y={20} width={100} height={10} cornerRadius={5} fill="rgba(255, 255, 255, 0.08)" />
          <Rect x={56} y={34} width={60} height={8} cornerRadius={4} fill="rgba(255, 255, 255, 0.04)" />
        </Group>
      </Group>
    </Group>
  );
}

// -------------------------------------------------------------
// MAIN CANVAS STAGE COMPONENT
// -------------------------------------------------------------

export function CanvasStage({ stageRef }: CanvasStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    frames,
    activeFrameId,
    deviceType,
    background,
    vectorOverlay,
    badges,
    cutPreset,
    setActiveFrame,
    canvasWidth,
    canvasHeight,
    canvasZoom,
  } = useEditorStore();

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (background.type === "image" && background.imageUrl) {
      const img = new Image();
      img.src = background.imageUrl;
      img.onload = () => {
        if (isMounted) setBgImage(img);
      };
    } else {
      queueMicrotask(() => {
        if (isMounted) setBgImage(null);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [background.type, background.imageUrl]);

  const { deviceMeta } = useCanvasRenderer(deviceType, null);
  const isDesktop = deviceType === "desktop";

  const paddingX = 92;
  const paddingTop = 320;
  const paddingBottom = 80;

  const autoWidth = deviceMeta.frameWidth + paddingX * 2 + (isDesktop ? 80 : 0);
  const autoHeight = deviceMeta.frameHeight + paddingTop + paddingBottom;

  const baseFrameWidth = canvasWidth ?? autoWidth;
  const stageHeight = canvasHeight ?? autoHeight;

  const layout = useMemo(
    () => calculateFrameLayout(frames, cutPreset, baseFrameWidth, stageHeight),
    [frames, cutPreset, baseFrameWidth, stageHeight]
  );

  const totalStageWidth = layout.totalWidth;

  const maxDisplayHeight = 650;
  const baseScale = Math.min(maxDisplayHeight / stageHeight, 1);
  const finalScale = baseScale * canvasZoom;

  const displayWidth = totalStageWidth * finalScale;
  const displayHeight = stageHeight * finalScale;

  const activeFrameLayout = layout.frames.find((f) => f.id === activeFrameId) || layout.frames[0];

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
    <div ref={containerRef} className="canvas-frame p-2 overflow-hidden flex items-center justify-center">
      <Stage
        ref={stageRef}
        width={totalStageWidth}
        height={stageHeight}
        scaleX={finalScale}
        scaleY={finalScale}
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

          const x = (ptr.x - stage.x()) / stage.scaleX();
          const clickedFrame = layout.frames.find(
            (f) => x >= f.x && x < f.x + f.width
          );

          if (clickedFrame && clickedFrame.id !== activeFrameId) {
            setActiveFrame(clickedFrame.id);
          }
        }}
      >
        {/* 1. MASTER BACKGROUND & VECTOR OVERLAY LAYER */}
        <Layer>
          {/* Base Solid */}
          {background.type === "solid" && (
            <Rect
              width={totalStageWidth}
              height={stageHeight}
              fill={background.color1}
            />
          )}

          {/* Base Image */}
          {background.type === "image" && bgImage && (
            (() => {
              const imgRatio = bgImage.width / bgImage.height;
              const canvasRatio = totalStageWidth / stageHeight;
              let renderW, renderH, renderX, renderY;

              if (imgRatio > canvasRatio) {
                renderH = stageHeight;
                renderW = renderH * imgRatio;
                renderY = 0;
                renderX = (totalStageWidth - renderW) / 2;
              } else {
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

          {/* Base Linear Gradient */}
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

          {/* Vector Overlays (Waves, Aurora, Tech Grid, Stage Podium, Dots, Cards) */}
          <VectorBackgroundLayer
            config={vectorOverlay}
            stageWidth={totalStageWidth}
            stageHeight={stageHeight}
          />

          {/* Lighting Style FX */}
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
                "rgba(255,255,255,0.14)",
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
                "rgba(255,255,255,0.18)",
                1,
                "transparent",
              ]}
              listening={false}
            />
          )}

          {background.style === "beam" && (
            <Rect
              x={totalStageWidth / 2 - totalStageWidth * 0.18}
              y={0}
              width={totalStageWidth * 0.36}
              height={stageHeight}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: totalStageWidth * 0.36, y: 0 }}
              fillLinearGradientColorStops={[
                0,
                "transparent",
                0.5,
                "rgba(255,255,255,0.12)",
                1,
                "transparent",
              ]}
              listening={false}
            />
          )}

          {/* Vignette */}
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
                Math.min(totalStageWidth, stageHeight) * 0.35
              }
              fillRadialGradientEndRadius={
                Math.max(totalStageWidth, stageHeight) * 0.95
              }
              fillRadialGradientColorStops={[
                0,
                "transparent",
                1,
                "rgba(0,0,0,0.35)",
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

        {/* 2. PLAY STORE MARKETING BADGES LAYER */}
        <Layer>
          {activeFrameLayout && (
            <PlayStoreBadgesLayer
              badges={badges}
              stageWidth={totalStageWidth}
              stageHeight={stageHeight}
              activeFrameX={activeFrameLayout.x}
              activeFrameWidth={activeFrameLayout.width}
            />
          )}
        </Layer>

        {/* 3. FRAMES & 3D DEVICES LAYER */}
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
                backdropColor={background.color1}
                onTextDragEnd={handleTextDragEnd}
                frameIndex={index}
                totalFrames={layout.frames.length}
              />
            );
          })}
        </Layer>

        {/* 4. GUIDES OVERLAY (Cut Lines) */}
        <Layer listening={false}>
          {layout.frames.map((frameLayout, i) => {
            if (i === layout.frames.length - 1) return null;
            const lineX = frameLayout.x + frameLayout.width;

            return (
              <Group key={`guide-${i}`}>
                <Line
                  points={[lineX, 0, lineX, stageHeight]}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth={1.5}
                  dash={[6, 6]}
                />
                <Circle
                  x={lineX}
                  y={40}
                  radius={12}
                  fill="rgba(0,0,0,0.6)"
                  stroke="white"
                  strokeWidth={1.5}
                />
                <Text
                  x={lineX - 20}
                  y={34}
                  text="CUT"
                  fontSize={9}
                  fontFamily="Inter"
                  fontStyle="bold"
                  fill="white"
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

function FrameContent({
  frame,
  isActive,
  deviceType,
  x,
  width,
  stageHeight,
  backdrop,
  backdropColor,
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
  backdropColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTextDragEnd: (id: string, type: "headline" | "subtitle", e: any) => void;
  frameIndex: number;
  totalFrames: number;
}) {
  const { screenshotImage, deviceMeta } = useCanvasRenderer(
    deviceType,
    frame.screenshot
  );

  const baseCenterX = Math.round((width - deviceMeta.frameWidth) / 2);

  let carouselOffset = 0;
  if (totalFrames > 1) {
    const overlapAmount = width * 0.12;
    if (frameIndex === 0) {
      carouselOffset = overlapAmount;
    } else if (frameIndex === totalFrames - 1) {
      carouselOffset = -overlapAmount;
    }
  }

  const deviceX = baseCenterX + carouselOffset;
  const isLandscape = width > stageHeight;

  const textPaddingTop = isLandscape
    ? Math.min(60, stageHeight * 0.1)
    : Math.min(130, stageHeight * 0.12);
  const availableHeight = stageHeight - textPaddingTop;

  const deviceY = Math.round(
    textPaddingTop + (availableHeight - deviceMeta.frameHeight) / 2
  );

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

  const handleDeviceDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    const baseCX = deviceX + deviceMeta.frameWidth / 2;
    const baseCY = deviceY + deviceMeta.frameHeight / 2;

    useEditorStore.getState().setFrameProperties({
      offsetX: newX - baseCX,
      offsetY: newY - baseCY,
    });
  };

  return (
    <Group x={x} y={0}>
      {/* Active Frame Selection Border */}
      {isActive && (
        <Rect
          width={width}
          height={stageHeight}
          name="active-frame-border"
          stroke="#8b5cf6"
          strokeWidth={4}
          opacity={0.35}
          listening={false}
        />
      )}

      {/* 3D Backdrop Glow Panel (Behind Device) */}
      {frame.showDevice !== false && backdrop && (
        <Group
          x={centerX}
          y={centerY}
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
          listening={false}
        >
          {/* Ambient Glow Bloom */}
          <Rect
            x={-35}
            y={-35}
            width={deviceMeta.frameWidth + 70}
            height={deviceMeta.frameHeight + 70}
            cornerRadius={deviceMeta.screen.radius + 28}
            fill="rgba(99, 102, 241, 0.12)"
            shadowColor={backdropColor || "#6366f1"}
            shadowBlur={65}
            shadowOpacity={0.8}
          />
          {/* Glassmorphic Rounded Backdrop Panel */}
          <Rect
            x={-24}
            y={-24}
            width={deviceMeta.frameWidth + 48}
            height={deviceMeta.frameHeight + 48}
            cornerRadius={deviceMeta.screen.radius + 20}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{
              x: deviceMeta.frameWidth + 48,
              y: deviceMeta.frameHeight + 48,
            }}
            fillLinearGradientColorStops={[
              0,
              "rgba(255, 255, 255, 0.14)",
              0.4,
              "rgba(255, 255, 255, 0.04)",
              1,
              "rgba(255, 255, 255, 0.08)",
            ]}
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth={1.5}
            shadowColor="black"
            shadowBlur={35}
            shadowOpacity={0.4}
            shadowOffsetY={12}
          />
        </Group>
      )}

      {/* 3D Glossy Floor Mirror Reflection (Flipped downwards) */}
      {frame.showDevice !== false && frame.showReflection === true && (
        <Group
          x={centerX}
          y={centerY + deviceMeta.frameHeight * frame.scale * 0.78}
          scaleX={
            frame.scale *
            (frame.flipX ? -1 : 1) *
            Math.cos(((frame.rotateY || 0) * Math.PI) / 180)
          }
          scaleY={
            -frame.scale *
            0.55 *
            (frame.flipY ? -1 : 1) *
            Math.cos(((frame.rotateX || 0) * Math.PI) / 180)
          }
          rotation={-frame.rotation}
          skewX={Math.tan(((frame.skewX || 0) * Math.PI) / 180)}
          skewY={-Math.tan(((frame.skewY || 0) * Math.PI) / 180)}
          offset={{
            x: deviceMeta.frameWidth / 2,
            y: deviceMeta.frameHeight / 2,
          }}
          opacity={0.28}
          listening={false}
        >
          <DeviceBody meta={deviceMeta} deviceType={deviceType} frame={frame} />
          {/* Fade out mask over reflection */}
          <Rect
            x={-50}
            y={-50}
            width={deviceMeta.frameWidth + 100}
            height={deviceMeta.frameHeight + 100}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: deviceMeta.frameHeight }}
            fillLinearGradientColorStops={[
              0,
              "transparent",
              0.35,
              "rgba(5, 5, 8, 0.55)",
              0.85,
              "rgba(5, 5, 8, 0.95)",
            ]}
          />
        </Group>
      )}

      {/* 3D Device Body (Transformed with 3D Side Rail Thickness) */}
      {frame.showDevice !== false && (
        <Group
          x={centerX}
          y={centerY}
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
        >
          <DeviceBody meta={deviceMeta} deviceType={deviceType} frame={frame} />
          <Group
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clipFunc={(ctx: any) => {
              const r = deviceMeta.screen.radius;
              const sx = deviceMeta.screen.x;
              const sy = deviceMeta.screen.y;
              const sw = deviceMeta.screen.width;
              const sh = deviceMeta.screen.height;
              ctx.beginPath();
              ctx.moveTo(sx + r, sy);
              ctx.arcTo(sx + sw, sy, sx + sw, sy + sh, r);
              ctx.arcTo(sx + sw, sy + sh, sx, sy + sh, r);
              ctx.arcTo(sx, sy + sh, sx, sy, r);
              ctx.arcTo(sx, sy, sx + sw, sy, r);
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
              <MockupScreenPlaceholder meta={deviceMeta} />
            )}
          </Group>
          <DeviceOverlay meta={deviceMeta} deviceType={deviceType} frame={frame} />
        </Group>
      )}

      {/* MARKETING TEXT LAYER */}
      <Group>
        {frame.headline.text && (
          <Group>
            {/* Neon Glow Bloom Layer */}
            {frame.headline.glow !== false && (
              <Text
                x={0}
                y={frame.headline.y * stageHeight}
                text={frame.headline.text}
                fontSize={frame.headline.fontSize}
                fontFamily={frame.headline.fontFamily || "Poppins"}
                fontStyle={frame.headline.fontWeight >= 700 ? "bold" : "normal"}
                fill={frame.headline.glowColor || "#06b6d4"}
                align="center"
                width={width}
                padding={36}
                lineHeight={1.15}
                shadowColor={frame.headline.glowColor || "#06b6d4"}
                shadowBlur={32}
                shadowOpacity={0.9}
                opacity={0.8}
                listening={false}
              />
            )}
            {/* Main Sharp Foreground Text */}
            <Text
              x={0}
              y={frame.headline.y * stageHeight}
              text={frame.headline.text}
              fontSize={frame.headline.fontSize}
              fontFamily={frame.headline.fontFamily || "Poppins"}
              fontStyle={frame.headline.fontWeight >= 700 ? "bold" : "normal"}
              fill={frame.headline.fill || "#ffffff"}
              align="center"
              width={width}
              padding={36}
              lineHeight={1.15}
              shadowColor="black"
              shadowBlur={16}
              shadowOpacity={0.6}
              shadowOffsetY={4}
              draggable={isActive}
              onDragEnd={(e) => onTextDragEnd(frame.id, "headline", e)}
            />
          </Group>
        )}
        {frame.subtitle.text && (
          <Text
            x={0}
            y={frame.subtitle.y * stageHeight}
            text={frame.subtitle.text}
            fontSize={frame.subtitle.fontSize}
            fontFamily={frame.subtitle.fontFamily}
            fill={frame.subtitle.fill}
            align="center"
            width={width}
            padding={48}
            lineHeight={1.3}
            shadowColor="black"
            shadowBlur={12}
            shadowOpacity={0.5}
            shadowOffsetY={2}
            draggable={isActive}
            onDragEnd={(e) => onTextDragEnd(frame.id, "subtitle", e)}
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
    let isMounted = true;
    if (pattern === "dots") {
      createDotPattern().then((img) => {
        if (isMounted) setPatternImg(img);
      });
    } else if (pattern === "grid") {
      createGridPattern().then((img) => {
        if (isMounted) setPatternImg(img);
      });
    } else {
      queueMicrotask(() => {
        if (isMounted) setPatternImg(null);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [pattern]);

  return (
    <>
      {pattern !== "none" && patternImg && (
        <Rect
          width={stageWidth}
          height={stageHeight}
          fillPatternImage={patternImg}
          fillPatternRepeat="repeat"
          opacity={0.35}
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
