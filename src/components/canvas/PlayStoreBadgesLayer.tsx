import React from "react";
import { Group, Rect, Text, Path } from "react-konva";
import type { PlayStoreBadgesConfig } from "../../types/device";
import { useEditorStore } from "../../store/useEditorStore";

interface PlayStoreBadgesLayerProps {
  badges: PlayStoreBadgesConfig;
  stageWidth: number;
  stageHeight: number;
  activeFrameX: number;
  activeFrameWidth: number;
}

// SVG Path Icons
const STAR_ICON = "M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.399 8.163L12 18.896l-7.333 3.867 1.399-8.163L.132 9.21l8.2-1.192z";
const TROPHY_ICON = "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z";
const SHIELD_ICON = "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z";
const ZAP_ICON = "M7 2v11h3v9l7-12h-4l4-8z";
const SPARKLE_ICON = "M12 0l2.5 7.5L22 10l-7.5 2.5L12 20l-2.5-7.5L2 10l7.5-2.5z";
const CHECK_ICON = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

export const PlayStoreBadgesLayer: React.FC<PlayStoreBadgesLayerProps> = ({
  badges,
  stageHeight,
  activeFrameX,
  activeFrameWidth,
}) => {
  const {
    showRating,
    ratingScore,
    ratingCount,
    ratingStyle,
    ratingPosition,
    ratingX,
    ratingY,
    showDownloads,
    downloadCount,
    downloadIcon,
    downloadsX,
    downloadsY,
    showFeaturePills,
    featurePills,
    pillsX,
    pillsY,
    showFloatingShield,
    shieldColor = "#06b6d4",
    shieldX,
    shieldY,
  } = badges;

  const defaultCenterX = activeFrameX + activeFrameWidth / 2;
  const isLandscape = activeFrameWidth > stageHeight;

  // Scale factor proportional to 1080 standard width
  const s = Math.max(0.6, Math.min(1.4, activeFrameWidth / 1080));

  // Default Y positions
  const topY = isLandscape ? 30 : Math.max(50, stageHeight * 0.05);
  const bottomY = stageHeight - (isLandscape ? 60 : 130);
  const defaultRatingY = ratingPosition === "bottom" ? bottomY : topY;

  const curRatingX = ratingX !== undefined ? activeFrameX + ratingX * activeFrameWidth : defaultCenterX;
  const curRatingY = ratingY !== undefined ? ratingY * stageHeight : defaultRatingY;

  const curDownloadsX = downloadsX !== undefined ? activeFrameX + downloadsX * activeFrameWidth : defaultCenterX;
  const curDownloadsY = downloadsY !== undefined ? downloadsY * stageHeight : curRatingY + (showRating ? 76 * s : 0);

  const curPillsX = pillsX !== undefined ? activeFrameX + pillsX * activeFrameWidth : defaultCenterX;
  const curPillsY = pillsY !== undefined ? pillsY * stageHeight : stageHeight - (isLandscape ? 80 : 150);

  const curShieldX = shieldX !== undefined ? activeFrameX + shieldX * activeFrameWidth : defaultCenterX + 155 * s;
  const curShieldY = shieldY !== undefined ? shieldY * stageHeight : stageHeight * 0.62;

  return (
    <Group>
      {/* 1. PLAY STORE RATING BADGE */}
      {showRating && (
        <Group
          x={curRatingX}
          y={curRatingY}
          draggable={true}
          onDragEnd={(e) => {
            const newRelX = (e.target.x() - activeFrameX) / activeFrameWidth;
            const newRelY = e.target.y() / stageHeight;
            useEditorStore.getState().setBadges({
              ratingX: Math.max(0.02, Math.min(0.98, newRelX)),
              ratingY: Math.max(0.02, Math.min(0.98, newRelY)),
            });
          }}
        >
          {ratingStyle === "google-play" && (
            <Group offsetX={(480 * s) / 2} y={0}>
              <Rect
                width={480 * s}
                height={62 * s}
                cornerRadius={31 * s}
                fill="rgba(15, 23, 42, 0.85)"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={1.5}
                shadowColor="black"
                shadowBlur={20}
                shadowOpacity={0.5}
                shadowOffsetY={5}
              />
              <Path
                x={22 * s}
                y={17 * s}
                data={STAR_ICON}
                fill="#fbbf24"
                scaleX={1.1 * s}
                scaleY={1.1 * s}
              />
              <Text
                x={54 * s}
                y={18 * s}
                text={`${ratingScore.toFixed(1)}`}
                fontSize={22 * s}
                fontFamily="Poppins"
                fontStyle="bold"
                fill="#ffffff"
              />
              <Text
                x={100 * s}
                y={18 * s}
                text="•"
                fontSize={22 * s}
                fontFamily="Inter"
                fill="#64748b"
              />
              <Text
                x={120 * s}
                y={19 * s}
                text="★★★★★"
                fontSize={18 * s}
                fontFamily="Inter"
                fill="#fbbf24"
              />
              <Text
                x={230 * s}
                y={21 * s}
                text={`(${ratingCount})`}
                fontSize={17 * s}
                fontFamily="Inter"
                fill="#94a3b8"
              />
            </Group>
          )}

          {ratingStyle === "gold-star" && (
            <Group offsetX={(460 * s) / 2} y={0}>
              <Rect
                width={460 * s}
                height={60 * s}
                cornerRadius={30 * s}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 460 * s, y: 60 * s }}
                fillLinearGradientColorStops={[
                  0,
                  "rgba(245, 158, 11, 0.35)",
                  1,
                  "rgba(217, 119, 6, 0.15)",
                ]}
                stroke="rgba(245, 158, 11, 0.6)"
                strokeWidth={2}
                shadowColor="#f59e0b"
                shadowBlur={25}
                shadowOpacity={0.4}
              />
              <Path
                x={24 * s}
                y={16 * s}
                data={STAR_ICON}
                fill="#f59e0b"
                scaleX={1.15 * s}
                scaleY={1.15 * s}
              />
              <Text
                x={58 * s}
                y={18 * s}
                text={`${ratingScore.toFixed(1)} ★ Top Rated App`}
                fontSize={20 * s}
                fontFamily="Poppins"
                fontStyle="bold"
                fill="#fef08a"
              />
              <Text
                x={295 * s}
                y={20 * s}
                text={`• ${ratingCount}`}
                fontSize={16 * s}
                fontFamily="Inter"
                fill="#fde68a"
              />
            </Group>
          )}

          {ratingStyle === "compact-pill" && (
            <Group offsetX={(280 * s) / 2} y={0}>
              <Rect
                width={280 * s}
                height={50 * s}
                cornerRadius={25 * s}
                fill="rgba(255, 255, 255, 0.1)"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1.5}
              />
              <Path
                x={22 * s}
                y={14 * s}
                data={STAR_ICON}
                fill="#fbbf24"
                scaleX={0.9 * s}
                scaleY={0.9 * s}
              />
              <Text
                x={50 * s}
                y={15 * s}
                text={`${ratingScore.toFixed(1)} (${ratingCount})`}
                fontSize={17 * s}
                fontFamily="Inter"
                fontStyle="bold"
                fill="#ffffff"
              />
            </Group>
          )}
        </Group>
      )}

      {/* 2. DOWNLOAD & SOCIAL PROOF BADGE */}
      {showDownloads && (
        <Group
          x={curDownloadsX}
          y={curDownloadsY}
          draggable={true}
          onDragEnd={(e) => {
            const newRelX = (e.target.x() - activeFrameX) / activeFrameWidth;
            const newRelY = e.target.y() / stageHeight;
            useEditorStore.getState().setBadges({
              downloadsX: Math.max(0.02, Math.min(0.98, newRelX)),
              downloadsY: Math.max(0.02, Math.min(0.98, newRelY)),
            });
          }}
        >
          <Group offsetX={(380 * s) / 2} y={0}>
            <Rect
              width={380 * s}
              height={52 * s}
              cornerRadius={26 * s}
              fill="rgba(30, 41, 59, 0.8)"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth={1.5}
              shadowColor="#3b82f6"
              shadowBlur={16}
              shadowOpacity={0.3}
            />
            <Path
              x={22 * s}
              y={14 * s}
              data={
                downloadIcon === "trophy"
                  ? TROPHY_ICON
                  : downloadIcon === "shield"
                  ? SHIELD_ICON
                  : downloadIcon === "flame"
                  ? ZAP_ICON
                  : TROPHY_ICON
              }
              fill="#60a5fa"
              scaleX={1 * s}
              scaleY={1 * s}
            />
            <Text
              x={54 * s}
              y={15 * s}
              text={downloadCount}
              fontSize={18 * s}
              fontFamily="Poppins"
              fontStyle="bold"
              fill="#93c5fd"
            />
          </Group>
        </Group>
      )}

      {/* 3. FLOATING FEATURE PILLS */}
      {showFeaturePills && featurePills.length > 0 && (
        <Group
          x={curPillsX}
          y={curPillsY}
          draggable={true}
          onDragEnd={(e) => {
            const newRelX = (e.target.x() - activeFrameX) / activeFrameWidth;
            const newRelY = e.target.y() / stageHeight;
            useEditorStore.getState().setBadges({
              pillsX: Math.max(0.02, Math.min(0.98, newRelX)),
              pillsY: Math.max(0.02, Math.min(0.98, newRelY)),
            });
          }}
        >
          {(() => {
            const pillWidth = 270 * s;
            const gap = 16 * s;
            const totalWidth =
              featurePills.length * pillWidth + (featurePills.length - 1) * gap;
            const startX = -totalWidth / 2;

            return featurePills.map((pill, idx) => {
              const pillX = startX + idx * (pillWidth + gap);
              const iconData =
                pill.icon === "lock"
                  ? SHIELD_ICON
                  : pill.icon === "sparkles"
                  ? SPARKLE_ICON
                  : pill.icon === "zap"
                  ? ZAP_ICON
                  : CHECK_ICON;

              return (
                <Group key={pill.id || `pill-${idx}`} x={pillX} y={0}>
                  <Rect
                    width={pillWidth}
                    height={52 * s}
                    cornerRadius={26 * s}
                    fill={pill.bg || "rgba(255, 255, 255, 0.12)"}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth={1.5}
                    shadowColor="black"
                    shadowBlur={15}
                    shadowOpacity={0.4}
                    shadowOffsetY={4}
                  />
                  <Path
                    x={20 * s}
                    y={14 * s}
                    data={iconData}
                    fill={pill.textFill || "#ffffff"}
                    scaleX={1 * s}
                    scaleY={1 * s}
                  />
                  <Text
                    x={48 * s}
                    y={16 * s}
                    text={pill.text}
                    fontSize={16 * s}
                    fontFamily="Inter"
                    fontStyle="bold"
                    fill={pill.textFill || "#ffffff"}
                    width={pillWidth - 60 * s}
                    ellipsis={true}
                  />
                </Group>
              );
            });
          })()}
        </Group>
      )}

      {/* 4. HOLOGRAPHIC 3D FLOATING NEON SHIELD BADGE */}
      {showFloatingShield && (
        <Group
          x={curShieldX}
          y={curShieldY}
          rotation={-6}
          draggable={true}
          onDragEnd={(e) => {
            const newRelX = (e.target.x() - activeFrameX) / activeFrameWidth;
            const newRelY = e.target.y() / stageHeight;
            useEditorStore.getState().setBadges({
              shieldX: Math.max(0.02, Math.min(0.98, newRelX)),
              shieldY: Math.max(0.02, Math.min(0.98, newRelY)),
            });
          }}
        >
          {/* Outer Neon Glow Halo */}
          <Path
            data="M30 0 L58 14 L58 52 C58 80 30 98 30 98 C30 98 2 80 2 52 L2 14 Z"
            fill="rgba(6, 182, 212, 0.2)"
            stroke={shieldColor || "#06b6d4"}
            strokeWidth={5}
            shadowColor={shieldColor || "#06b6d4"}
            shadowBlur={32}
            shadowOpacity={0.95}
            scaleX={1.7 * s}
            scaleY={1.7 * s}
          />
          {/* Inner Glass Body with Pink Accent Rim */}
          <Path
            x={6 * s}
            y={6 * s}
            data="M30 0 L58 14 L58 52 C58 80 30 98 30 98 C30 98 2 80 2 52 L2 14 Z"
            fill="rgba(10, 15, 30, 0.88)"
            stroke="#f43f5e"
            strokeWidth={2}
            shadowColor="#f43f5e"
            shadowBlur={15}
            shadowOpacity={0.8}
            scaleX={1.5 * s}
            scaleY={1.5 * s}
          />
          {/* Glowing Shield Icon & Phone Slash */}
          <Path
            x={32 * s}
            y={34 * s}
            data={SHIELD_ICON}
            fill="#ffffff"
            scaleX={1.6 * s}
            scaleY={1.6 * s}
            shadowColor="#ffffff"
            shadowBlur={12}
            shadowOpacity={0.9}
          />
        </Group>
      )}
    </Group>
  );
};
