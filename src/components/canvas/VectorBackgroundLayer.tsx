import React from "react";
import { Group, Rect, Circle, Path, Line, Arc, Shape } from "react-konva";
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

  const { type, color, secondaryColor = "#06b6d4", opacity, scale = 1, positionY = 0.5 } = config;

  switch (type) {
    case "studio-floor": {
      // 3D Studio Horizon Beam & Reflective Floor
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
      // High-Tech PCB Circuit Tracks & Glowing Nodes
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
            points={[0, stageHeight * 0.85, stageWidth * 0.35, stageHeight * 0.72]}
            stroke={color || "#ec4899"}
            strokeWidth={3}
            shadowColor={color || "#ec4899"}
            shadowBlur={20}
            shadowOpacity={0.9}
            lineCap="round"
          />
          <Line
            points={[stageWidth * 0.7, stageHeight * 0.45, stageWidth, stageHeight * 0.38]}
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

    case "synthwave-grid": {
      // 3D Synthwave Perspective Sun & Floor Grid
      const horizonY = stageHeight * (positionY || 0.68);
      const sunRadius = stageWidth * 0.3 * scale;
      const vanishingX = stageWidth / 2;

      // Perspective grid floor lines
      const floorLines: React.ReactNode[] = [];
      const numPerspectiveRays = 14;
      for (let i = 0; i <= numPerspectiveRays; i++) {
        const bottomX = (stageWidth / numPerspectiveRays) * i;
        floorLines.push(
          <Line
            key={`ray-${i}`}
            points={[vanishingX, horizonY, bottomX, stageHeight]}
            stroke={secondaryColor}
            strokeWidth={1.5}
            opacity={0.6}
          />
        );
      }

      // Horizontal depth grid lines with exponential spacing
      const numHorizontals = 10;
      for (let j = 1; j <= numHorizontals; j++) {
        const progress = Math.pow(j / numHorizontals, 1.8);
        const y = horizonY + (stageHeight - horizonY) * progress;
        floorLines.push(
          <Line
            key={`h-grid-${j}`}
            points={[0, y, stageWidth, y]}
            stroke={secondaryColor}
            strokeWidth={1.5}
            opacity={0.3 + progress * 0.5}
          />
        );
      }

      return (
        <Group opacity={opacity} listening={false}>
          {/* Synthwave Neon Sun with Horizontal Slices */}
          <Circle
            x={vanishingX}
            y={horizonY}
            radius={sunRadius}
            fillLinearGradientStartPoint={{ x: 0, y: -sunRadius }}
            fillLinearGradientEndPoint={{ x: 0, y: sunRadius }}
            fillLinearGradientColorStops={[
              0, "#fde047",
              0.4, color || "#f43f5e",
              1, "#7c3aed"
            ]}
            shadowColor={color || "#f43f5e"}
            shadowBlur={50}
            shadowOpacity={0.9}
          />

          {/* Slices across sun */}
          {[0.1, 0.25, 0.42, 0.6, 0.78].map((sRatio, sIdx) => {
            const slatY = horizonY - sunRadius * (1 - sRatio * 1.5);
            if (slatY < horizonY && slatY > horizonY - sunRadius) {
              return (
                <Line
                  key={`slat-${sIdx}`}
                  points={[vanishingX - sunRadius, slatY, vanishingX + sunRadius, slatY]}
                  stroke="#080b14"
                  strokeWidth={4 + sIdx * 2}
                />
              );
            }
            return null;
          })}

          {/* Dark Floor Mask */}
          <Rect
            x={0}
            y={horizonY}
            width={stageWidth}
            height={stageHeight - horizonY}
            fill="#080b14"
            opacity={0.88}
          />

          {/* Grid Floor */}
          {floorLines}

          {/* Horizon Line Glow */}
          <Line
            points={[0, horizonY, stageWidth, horizonY]}
            stroke={color}
            strokeWidth={4}
            shadowColor={color}
            shadowBlur={30}
            shadowOpacity={0.95}
          />
        </Group>
      );
    }

    case "neon-beams": {
      // Angled Laser Beams
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

    case "honeycomb-hex": {
      // Cyber Honeycomb Hexagonal Matrix
      const hexRadius = 45 * scale;
      const hexWidth = Math.sqrt(3) * hexRadius;
      const hexHeight = 2 * hexRadius;
      const cols = Math.ceil(stageWidth / hexWidth) + 1;
      const rows = Math.ceil(stageHeight / (hexHeight * 0.75)) + 1;

      return (
        <Group opacity={opacity} listening={false}>
          <Shape
            sceneFunc={(ctx, shape) => {
              for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                  const x = c * hexWidth + (r % 2 === 1 ? hexWidth / 2 : 0);
                  const y = r * (hexHeight * 0.75);

                  ctx.beginPath();
                  for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 6;
                    const hx = x + hexRadius * 0.88 * Math.cos(angle);
                    const hy = y + hexRadius * 0.88 * Math.sin(angle);
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                  }
                  ctx.closePath();

                  // Highlight random-like periodic cells
                  if ((r * 3 + c * 5) % 11 === 0) {
                    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
                    ctx.fill();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                  } else {
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
                    ctx.lineWidth = 1;
                  }
                  ctx.stroke();
                }
              }
              ctx.fillStrokeShape(shape);
            }}
          />
        </Group>
      );
    }

    case "speed-vortex": {
      // Radial Warp Speed Laser Tunnel
      const centerX = stageWidth / 2;
      const centerY = stageHeight * positionY;
      const numLines = 36;
      const maxRadius = Math.max(stageWidth, stageHeight) * 0.9 * scale;

      const lines: React.ReactNode[] = [];
      for (let i = 0; i < numLines; i++) {
        const angle = ((Math.PI * 2) / numLines) * i;
        const innerDist = 120 * scale + (i % 3) * 40;
        const outerDist = maxRadius;

        const x1 = centerX + Math.cos(angle) * innerDist;
        const y1 = centerY + Math.sin(angle) * innerDist;
        const x2 = centerX + Math.cos(angle) * outerDist;
        const y2 = centerY + Math.sin(angle) * outerDist;

        lines.push(
          <Line
            key={`vortex-${i}`}
            points={[x1, y1, x2, y2]}
            stroke={i % 2 === 0 ? color : secondaryColor}
            strokeWidth={(i % 4 === 0 ? 3.5 : 1.5) * scale}
            opacity={0.4 + (i % 3) * 0.2}
            shadowColor={color}
            shadowBlur={i % 4 === 0 ? 12 : 0}
          />
        );
      }

      return (
        <Group opacity={opacity} listening={false}>
          {lines}
          <Circle
            x={centerX}
            y={centerY}
            radius={140 * scale}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndRadius={140 * scale}
            fillRadialGradientColorStops={[0, color, 0.6, secondaryColor, 1, "transparent"]}
            opacity={0.5}
          />
        </Group>
      );
    }

    case "audio-equalizer": {
      // Digital Audio Waves & Frequency Bars
      const barCount = 32;
      const barWidth = (stageWidth / barCount) * 0.65;
      const gap = (stageWidth / barCount) * 0.35;
      const baseY = stageHeight * (positionY || 0.85);

      const bars: React.ReactNode[] = [];
      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap) + gap / 2;
        // Generate dynamic sinusoidal bell height
        const normalized = Math.sin((i / barCount) * Math.PI);
        const noise = Math.sin(i * 1.7) * 0.3 + 0.7;
        const barHeight = Math.max(12, 180 * normalized * noise * scale);

        bars.push(
          <Rect
            key={`eq-${i}`}
            x={x}
            y={baseY - barHeight}
            width={barWidth}
            height={barHeight}
            cornerRadius={barWidth / 2}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: barHeight }}
            fillLinearGradientColorStops={[
              0, color,
              0.5, secondaryColor,
              1, "rgba(255,255,255,0.05)"
            ]}
            shadowColor={color}
            shadowBlur={10}
            shadowOpacity={0.5}
          />
        );
      }

      return (
        <Group opacity={opacity} listening={false}>
          {bars}
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

    case "organic-blobs": {
      // Liquid Organic Morph Blobs
      const centerY = stageHeight * positionY;
      const b1 = `
        M ${stageWidth * 0.15},${centerY - 180 * scale}
        C ${stageWidth * 0.4},${centerY - 240 * scale} ${stageWidth * 0.6},${centerY - 100 * scale} ${stageWidth * 0.85},${centerY - 160 * scale}
        C ${stageWidth * 0.95},${centerY + 60 * scale} ${stageWidth * 0.75},${centerY + 200 * scale} ${stageWidth * 0.5},${centerY + 220 * scale}
        C ${stageWidth * 0.25},${centerY + 240 * scale} ${stageWidth * 0.05},${centerY + 100 * scale} ${stageWidth * 0.15},${centerY - 180 * scale}
        Z
      `;

      return (
        <Group opacity={opacity} listening={false}>
          <Path
            data={b1.trim()}
            fillLinearGradientStartPoint={{ x: stageWidth * 0.2, y: centerY - 200 }}
            fillLinearGradientEndPoint={{ x: stageWidth * 0.8, y: centerY + 200 }}
            fillLinearGradientColorStops={[
              0, color || "#ec4899",
              0.5, secondaryColor || "#8b5cf6",
              1, "rgba(236, 72, 153, 0.2)"
            ]}
            shadowColor={color}
            shadowBlur={40}
            shadowOpacity={0.6}
            opacity={0.45}
          />
        </Group>
      );
    }

    case "circle-ripples": {
      // Sonar Radar & Ripple Waves
      const centerX = stageWidth / 2;
      const centerY = stageHeight * positionY;
      const rings: React.ReactNode[] = [];
      const numRings = 7;

      for (let i = 1; i <= numRings; i++) {
        const r = (i * 70 * scale);
        rings.push(
          <Circle
            key={`ripple-${i}`}
            x={centerX}
            y={centerY}
            radius={r}
            stroke={i % 2 === 0 ? color : secondaryColor}
            strokeWidth={1.5}
            dash={i % 3 === 0 ? [8, 8] : undefined}
            opacity={Math.max(0.15, 1 - (i / numRings) * 0.8)}
          />
        );
      }

      return (
        <Group opacity={opacity} listening={false}>
          {rings}
          {/* Crosshair target lines */}
          <Line
            points={[centerX - 240 * scale, centerY, centerX + 240 * scale, centerY]}
            stroke={secondaryColor}
            strokeWidth={1}
            opacity={0.3}
          />
          <Line
            points={[centerX, centerY - 240 * scale, centerX, centerY + 240 * scale]}
            stroke={secondaryColor}
            strokeWidth={1}
            opacity={0.3}
          />
        </Group>
      );
    }

    case "stardust-particles": {
      // Floating Galaxy Stardust & Sparkles
      return (
        <Group opacity={opacity} listening={false}>
          <Shape
            sceneFunc={(ctx, shape) => {
              // 40 deterministic stardust sparkles
              for (let i = 0; i < 40; i++) {
                const px = ((i * 137.5) % stageWidth);
                const py = ((i * 269.3) % stageHeight);
                const pSize = 1.5 + (i % 4) * 1.5;

                ctx.fillStyle = i % 2 === 0 ? color : secondaryColor;
                ctx.beginPath();
                ctx.arc(px, py, pSize * scale, 0, Math.PI * 2);
                ctx.fill();

                // Twinkle cross on larger stars
                if (i % 5 === 0) {
                  ctx.strokeStyle = "#ffffff";
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(px - pSize * 2.5, py);
                  ctx.lineTo(px + pSize * 2.5, py);
                  ctx.moveTo(px, py - pSize * 2.5);
                  ctx.lineTo(px, py + pSize * 2.5);
                  ctx.stroke();
                }
              }
              ctx.fillStrokeShape(shape);
            }}
          />
        </Group>
      );
    }

    case "stage-podium": {
      // Futuristic glowing podium arc dome
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

    case "geometric-shards": {
      // 3D Crystal Shards and Polygonal Prisms
      const shards = [
        { points: [stageWidth * 0.1, stageHeight * 0.15, stageWidth * 0.25, stageHeight * 0.12, stageWidth * 0.18, stageHeight * 0.28], fill: color },
        { points: [stageWidth * 0.85, stageHeight * 0.18, stageWidth * 0.95, stageHeight * 0.32, stageWidth * 0.78, stageHeight * 0.28], fill: secondaryColor },
        { points: [stageWidth * 0.05, stageHeight * 0.75, stageWidth * 0.22, stageHeight * 0.7, stageWidth * 0.12, stageHeight * 0.88], fill: secondaryColor },
        { points: [stageWidth * 0.75, stageHeight * 0.72, stageWidth * 0.92, stageHeight * 0.65, stageWidth * 0.88, stageHeight * 0.85], fill: color },
      ];

      return (
        <Group opacity={opacity} listening={false}>
          {shards.map((s, i) => (
            <Line
              key={`shard-${i}`}
              points={s.points}
              closed={true}
              fill={s.fill}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth={1.5}
              shadowColor={s.fill}
              shadowBlur={20}
              shadowOpacity={0.6}
              opacity={0.45}
            />
          ))}
        </Group>
      );
    }

    case "sunburst-rays": {
      // Radial Promotional Sunburst Flare
      const centerX = stageWidth / 2;
      const centerY = stageHeight * positionY;
      const numRays = 18;
      const maxLen = Math.max(stageWidth, stageHeight) * 1.2 * scale;

      return (
        <Group opacity={opacity} listening={false}>
          <Shape
            sceneFunc={(ctx, shape) => {
              for (let i = 0; i < numRays; i++) {
                const a1 = ((Math.PI * 2) / numRays) * i;
                const a2 = a1 + (Math.PI / numRays);

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + Math.cos(a1) * maxLen, centerY + Math.sin(a1) * maxLen);
                ctx.lineTo(centerX + Math.cos(a2) * maxLen, centerY + Math.sin(a2) * maxLen);
                ctx.closePath();

                ctx.fillStyle = i % 2 === 0 ? color : "transparent";
                ctx.fill();
              }
              ctx.fillStrokeShape(shape);
            }}
          />
        </Group>
      );
    }

    case "diagonal-stripes": {
      // Velocity Slash Stripes
      const stripeWidth = 60 * scale;
      const gap = 90 * scale;
      const count = Math.ceil((stageWidth + stageHeight) / (stripeWidth + gap)) + 2;

      const stripes: React.ReactNode[] = [];
      for (let i = 0; i < count; i++) {
        const offset = i * (stripeWidth + gap) - stageHeight * 0.5;
        stripes.push(
          <Line
            key={`stripe-${i}`}
            points={[offset, 0, offset + stageHeight * 0.8, stageHeight]}
            stroke={i % 2 === 0 ? color : secondaryColor}
            strokeWidth={stripeWidth}
            opacity={0.15 + (i % 3) * 0.1}
          />
        );
      }

      return (
        <Group opacity={opacity} listening={false}>
          {stripes}
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

    default:
      return null;
  }
};
