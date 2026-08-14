import React from "react";
import { Group, Rect, Circle, Path, Line, Arc } from "react-konva";
import type { VectorOverlayConfig } from "../../types/device";
import {
  DEFAULT_AURORA_ORBS,
  generateWavePaths,
  generateFloatingCards,
  generateCyberCircuit,
} from "../../utils/vectorBackgrounds";

interface VectorBackgroundLayerProps {
  config: VectorOverlayConfig;
  stageWidth: number;
  stageHeight: number;
}

export const VectorBackgroundLayer: React.FC<VectorBackgroundLayerProps> = ({
  config,
  stageWidth,
  stageHeight,
}) => {
  if (config.type === "none" || config.opacity <= 0) return null;

  const { type, color, secondaryColor = "#06b6d4", opacity, scale, positionY } = config;

  switch (type) {
    case "studio-floor": {
      // 3D Studio Horizon Beam & Reflective Floor (Exact match to Image 1)
      const horizonY = stageHeight * (positionY || 0.72);

      return (
        <Group opacity={opacity} listening={false}>
          {/* Top Ambient Glow above horizon */}
          <Circle
            x={stageWidth * 0.15}
            y={horizonY - 100}
            radius={stageWidth * 0.45 * scale}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndRadius={stageWidth * 0.45 * scale}
            fillRadialGradientColorStops={[
              0,
              color || "#d946ef",
              0.5,
              "rgba(217, 70, 239, 0.15)",
              1,
              "transparent",
            ]}
            opacity={0.6}
          />
          <Circle
            x={stageWidth * 0.85}
            y={horizonY - 100}
            radius={stageWidth * 0.45 * scale}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndRadius={stageWidth * 0.45 * scale}
            fillRadialGradientColorStops={[
              0,
              secondaryColor || "#06b6d4",
              0.5,
              "rgba(6, 182, 212, 0.15)",
              1,
              "transparent",
            ]}
            opacity={0.6}
          />

          {/* Dark Glossy Floor Plane */}
          <Rect
            x={0}
            y={horizonY}
            width={stageWidth}
            height={stageHeight - horizonY}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: stageHeight - horizonY }}
            fillLinearGradientColorStops={[
              0,
              "rgba(10, 10, 15, 0.7)",
              0.5,
              "#07070a",
              1,
              "#040406",
            ]}
          />

          {/* Horizon Neon Light Bar (Soft Bloom Layer) */}
          <Line
            points={[0, horizonY, stageWidth, horizonY]}
            strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
            strokeLinearGradientEndPoint={{ x: stageWidth, y: 0 }}
            strokeLinearGradientColorStops={[
              0,
              color || "#d946ef",
              0.5,
              "#a855f7",
              1,
              secondaryColor || "#06b6d4",
            ]}
            strokeWidth={14 * scale}
            shadowColor={color || "#d946ef"}
            shadowBlur={35}
            shadowOpacity={0.9}
            opacity={0.75}
          />

          {/* Horizon Neon Light Bar (Sharp Core Line) */}
          <Line
            points={[0, horizonY, stageWidth, horizonY]}
            strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
            strokeLinearGradientEndPoint={{ x: stageWidth, y: 0 }}
            strokeLinearGradientColorStops={[
              0,
              "#ffffff",
              0.2,
              color || "#d946ef",
              0.8,
              secondaryColor || "#06b6d4",
              1,
              "#ffffff",
            ]}
            strokeWidth={2.5 * scale}
            opacity={0.95}
          />
        </Group>
      );
    }

    case "cyber-circuit": {
      // High-Tech PCB Circuit Tracks & Glowing Nodes (Exact match to Image 2)
      const circuit = generateCyberCircuit(stageWidth, stageHeight);
      const horizonY = stageHeight * 0.75;

      return (
        <Group opacity={opacity} listening={false}>
          {/* Top Ambient Glow */}
          <Circle
            x={stageWidth * 0.5}
            y={stageHeight * 0.25}
            radius={stageWidth * 0.5 * scale}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndRadius={stageWidth * 0.5 * scale}
            fillRadialGradientColorStops={[
              0,
              secondaryColor,
              0.4,
              "rgba(6, 182, 212, 0.15)",
              1,
              "transparent",
            ]}
            opacity={0.5}
          />

          {/* Circuit Polyline Tracks */}
          {circuit.tracks.map((track, i) => (
            <Line
              key={`track-${i}`}
              points={track.points}
              stroke={i % 3 === 0 ? color : secondaryColor}
              strokeWidth={2}
              opacity={0.45}
              lineCap="round"
              lineJoin="round"
              shadowColor={secondaryColor}
              shadowBlur={10}
              shadowOpacity={0.4}
            />
          ))}

          {/* Circuit Solder Nodes */}
          {circuit.nodes.map((node, i) => (
            <Group key={`node-${i}`}>
              <Circle
                x={node.x}
                y={node.y}
                radius={node.radius * scale}
                fill={secondaryColor}
                shadowColor={secondaryColor}
                shadowBlur={12}
                shadowOpacity={0.8}
              />
              <Circle
                x={node.x}
                y={node.y}
                radius={node.radius * 0.5 * scale}
                fill="#ffffff"
              />
            </Group>
          ))}

          {/* Neon Laser Streak Crossing Left-to-Right */}
          <Line
            points={[
              0,
              stageHeight * 0.85,
              stageWidth * 0.35,
              stageHeight * 0.72,
            ]}
            stroke={color || "#ec4899"}
            strokeWidth={3}
            shadowColor={color || "#ec4899"}
            shadowBlur={20}
            shadowOpacity={0.9}
            lineCap="round"
          />
          <Line
            points={[
              stageWidth * 0.7,
              stageHeight * 0.45,
              stageWidth,
              stageHeight * 0.38,
            ]}
            stroke={secondaryColor || "#06b6d4"}
            strokeWidth={3}
            shadowColor={secondaryColor || "#06b6d4"}
            shadowBlur={20}
            shadowOpacity={0.9}
            lineCap="round"
          />

          {/* Floor Horizon Glow */}
          <Line
            points={[0, horizonY, stageWidth, horizonY]}
            strokeLinearGradientStartPoint={{ x: 0, y: 0 }}
            strokeLinearGradientEndPoint={{ x: stageWidth, y: 0 }}
            strokeLinearGradientColorStops={[
              0,
              color || "#d946ef",
              0.5,
              secondaryColor || "#06b6d4",
              1,
              color || "#d946ef",
            ]}
            strokeWidth={3}
            shadowColor={secondaryColor}
            shadowBlur={25}
            shadowOpacity={0.8}
          />
        </Group>
      );
    }

    case "neon-beams": {
      // Angled Laser Beams & Dual Horizon Lines
      return (
        <Group opacity={opacity} listening={false}>
          {/* Laser Beam 1 (Magenta) */}
          <Line
            points={[0, stageHeight * 0.6, stageWidth * 0.45, stageHeight * 0.72]}
            stroke={color || "#d946ef"}
            strokeWidth={4 * scale}
            shadowColor={color || "#d946ef"}
            shadowBlur={25}
            shadowOpacity={0.9}
            lineCap="round"
          />
          <Line
            points={[0, stageHeight * 0.6, stageWidth * 0.45, stageHeight * 0.72]}
            stroke="#ffffff"
            strokeWidth={1.5 * scale}
            lineCap="round"
          />

          {/* Laser Beam 2 (Cyan) */}
          <Line
            points={[stageWidth * 0.55, stageHeight * 0.72, stageWidth, stageHeight * 0.6]}
            stroke={secondaryColor || "#06b6d4"}
            strokeWidth={4 * scale}
            shadowColor={secondaryColor || "#06b6d4"}
            shadowBlur={25}
            shadowOpacity={0.9}
            lineCap="round"
          />
          <Line
            points={[stageWidth * 0.55, stageHeight * 0.72, stageWidth, stageHeight * 0.6]}
            stroke="#ffffff"
            strokeWidth={1.5 * scale}
            lineCap="round"
          />

          {/* Ambient Glow Center */}
          <Circle
            x={stageWidth / 2}
            y={stageHeight * 0.72}
            radius={stageWidth * 0.4 * scale}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndRadius={stageWidth * 0.4 * scale}
            fillRadialGradientColorStops={[
              0,
              secondaryColor,
              0.4,
              color,
              1,
              "transparent",
            ]}
            opacity={0.3}
          />
        </Group>
      );
    }

    case "aurora": {
      // Dynamic Aurora Mesh Glow Blobs
      return (
        <Group opacity={opacity} listening={false}>
          {DEFAULT_AURORA_ORBS.map((orb, i) => {
            const cx = stageWidth * orb.xRatio;
            const cy = stageHeight * (orb.yRatio * positionY * 1.5);
            const radius = Math.min(stageWidth, stageHeight) * orb.radiusRatio * scale;
            const blobColor = i % 2 === 0 ? color : secondaryColor;

            return (
              <Circle
                key={`aurora-${i}`}
                x={cx}
                y={cy}
                radius={radius}
                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndRadius={radius}
                fillRadialGradientColorStops={[
                  0,
                  blobColor,
                  0.4,
                  blobColor,
                  1,
                  "transparent",
                ]}
                opacity={orb.opacity * 1.8}
              />
            );
          })}
        </Group>
      );
    }

    case "waves": {
      // Fluid Wave Ribbons
      const wavePaths = generateWavePaths(stageWidth, stageHeight, scale, positionY);
      return (
        <Group opacity={opacity} listening={false}>
          {wavePaths.map((w, idx) => {
            const waveColor = idx === 0 ? color : idx === 1 ? secondaryColor : color;
            return (
              <Path
                key={`wave-${idx}`}
                data={w.d}
                fill={waveColor}
                opacity={w.opacity * 2}
                stroke={secondaryColor}
                strokeWidth={idx === 2 ? 3 : 0}
              />
            );
          })}
        </Group>
      );
    }

    case "stage-podium": {
      // Futuristic glowing podium arc dome centered below device
      const centerX = stageWidth / 2;
      const centerY = stageHeight * positionY;
      const arcWidth = stageWidth * 0.9 * scale;

      return (
        <Group opacity={opacity} listening={false}>
          <Circle
            x={centerX}
            y={centerY}
            radius={arcWidth * 0.6}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndRadius={arcWidth * 0.6}
            fillRadialGradientColorStops={[
              0,
              secondaryColor,
              0.5,
              color,
              1,
              "transparent",
            ]}
            opacity={0.35}
          />
          <Arc
            x={centerX}
            y={centerY + 50}
            innerRadius={arcWidth * 0.45}
            outerRadius={arcWidth * 0.48}
            angle={180}
            rotation={180}
            fillLinearGradientStartPoint={{ x: -arcWidth / 2, y: 0 }}
            fillLinearGradientEndPoint={{ x: arcWidth / 2, y: 0 }}
            fillLinearGradientColorStops={[0, color, 0.5, secondaryColor, 1, color]}
            shadowColor={secondaryColor}
            shadowBlur={35}
            shadowOpacity={0.8}
          />
        </Group>
      );
    }

    case "modern-grid": {
      const gridSpacing = Math.round(50 * scale);
      const lines: React.ReactNode[] = [];

      for (let x = 0; x <= stageWidth; x += gridSpacing) {
        lines.push(
          <Line
            key={`vx-${x}`}
            points={[x, 0, x, stageHeight]}
            stroke={color}
            strokeWidth={1}
            opacity={0.35}
          />
        );
      }

      for (let y = 0; y <= stageHeight; y += gridSpacing) {
        lines.push(
          <Line
            key={`hz-${y}`}
            points={[0, y, stageWidth, y]}
            stroke={secondaryColor}
            strokeWidth={1}
            opacity={0.25}
          />
        );
      }

      return (
        <Group opacity={opacity} listening={false}>
          {lines}
        </Group>
      );
    }

    case "dot-matrix": {
      const dotSpacing = Math.round(36 * scale);
      const cols = Math.ceil(stageWidth / dotSpacing);
      const rows = Math.ceil(stageHeight / dotSpacing);
      const dots: React.ReactNode[] = [];

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * dotSpacing;
          const y = r * dotSpacing;
          const dist = Math.hypot(x - stageWidth / 2, y - stageHeight * positionY);
          const maxDist = stageWidth * 0.7;
          const dotOpacity = Math.max(0, 1 - dist / maxDist) * 0.65;

          if (dotOpacity > 0.05) {
            dots.push(
              <Circle
                key={`dot-${r}-${c}`}
                x={x}
                y={y}
                radius={2.5 * scale}
                fill={c % 3 === 0 ? secondaryColor : color}
                opacity={dotOpacity}
              />
            );
          }
        }
      }

      return (
        <Group opacity={opacity} listening={false}>
          {dots}
        </Group>
      );
    }

    case "isometric-cards": {
      const cards = generateFloatingCards(stageWidth, stageHeight, scale);
      return (
        <Group opacity={opacity} listening={false}>
          {cards.map((c, idx) => (
            <Group key={`card-${idx}`} x={c.x} y={c.y} rotation={c.rotation}>
              <Rect
                width={c.width}
                height={c.height}
                cornerRadius={c.radius}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: c.width, y: c.height }}
                fillLinearGradientColorStops={[
                  0,
                  "rgba(255, 255, 255, 0.18)",
                  0.5,
                  idx % 2 === 0 ? color : secondaryColor,
                  1,
                  "rgba(255, 255, 255, 0.03)",
                ]}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={1.5}
                shadowColor={color}
                shadowBlur={30}
                shadowOpacity={0.4}
                shadowOffsetY={10}
              />
            </Group>
          ))}
        </Group>
      );
    }

    default:
      return null;
  }
};
