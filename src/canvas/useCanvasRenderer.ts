import { useState, useEffect, useCallback } from "react";
import type { DeviceMeta, DeviceType } from "../types/device";
import { loadImage } from "../utils/loadImage";

import iphoneMeta from "../devices/iphone/meta.json";
import androidMeta from "../devices/android/meta.json";
import tabletMeta from "../devices/tablet/meta.json";
import desktopMeta from "../devices/desktop/meta.json";

const deviceMetas: Record<DeviceType, DeviceMeta> = {
  iphone: iphoneMeta as DeviceMeta,
  android: androidMeta as DeviceMeta,
  tablet: tabletMeta as DeviceMeta,
  desktop: desktopMeta as DeviceMeta,
};

interface CanvasRendererState {
  deviceMeta: DeviceMeta;
  screenshotImage: HTMLImageElement | null;
  isLoading: boolean;
  error: string | null;
}

export function useCanvasRenderer(
  deviceType: DeviceType,
  screenshotSrc: string | null
) {
  const [state, setState] = useState<CanvasRendererState>({
    deviceMeta: deviceMetas[deviceType],
    screenshotImage: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      deviceMeta: deviceMetas[deviceType],
    }));
  }, [deviceType]);

  useEffect(() => {
    if (!screenshotSrc) {
      setState((prev) => ({
        ...prev,
        screenshotImage: null,
        isLoading: false,
        error: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    loadImage(screenshotSrc)
      .then((img) => {
        setState((prev) => ({
          ...prev,
          screenshotImage: img,
          isLoading: false,
        }));
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          error: err.message,
          isLoading: false,
        }));
      });
  }, [screenshotSrc]);

  const getDeviceMeta = useCallback(
    (type: DeviceType): DeviceMeta => deviceMetas[type],
    []
  );

  return {
    ...state,
    getDeviceMeta,
  };
}
