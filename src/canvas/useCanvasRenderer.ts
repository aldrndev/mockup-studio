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
  screenshotImage: HTMLImageElement | null;
  isLoading: boolean;
  error: string | null;
}

export function useCanvasRenderer(
  deviceType: DeviceType,
  screenshotSrc: string | null
) {
  // Derive deviceMeta directly from prop, no need for state
  const deviceMeta = deviceMetas[deviceType];

  const [state, setState] = useState<CanvasRendererState>({
    screenshotImage: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!screenshotSrc) {
      // Only reset if we have an image currently
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((prev) => {
        if (!prev.screenshotImage && !prev.isLoading && !prev.error)
          return prev;
        return {
          screenshotImage: null,
          isLoading: false,
          error: null,
        };
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    let isMounted = true;

    loadImage(screenshotSrc)
      .then((img) => {
        if (isMounted) {
          setState({
            screenshotImage: img,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setState({
            screenshotImage: null,
            isLoading: false,
            error: err.message,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [screenshotSrc]);

  const getDeviceMeta = useCallback(
    (type: DeviceType): DeviceMeta => deviceMetas[type],
    []
  );

  return {
    deviceMeta,
    ...state,
    getDeviceMeta,
  };
}
