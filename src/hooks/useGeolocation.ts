import { useCallback, useEffect, useRef } from 'react';

export type GeolocationReason =
  | 'geolocation_denied'
  | 'geolocation_unavailable'
  | 'geolocation_timeout';

export class GeolocationError extends Error {
  reason: GeolocationReason;
  constructor(reason: GeolocationReason) {
    super(reason);
    this.reason = reason;
    this.name = 'GeolocationError';
  }
}

export type Coords = {
  lat: number;
  lng: number;
  accuracy: number;
};

const mapPositionError = (
  err: GeolocationPositionError
): GeolocationReason => {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'geolocation_denied';
    case err.TIMEOUT:
      return 'geolocation_timeout';
    case err.POSITION_UNAVAILABLE:
    default:
      return 'geolocation_unavailable';
  }
};

// Report the device's real GPS accuracy. The server no longer uses this to
// gate check-ins (the geofence tolerance lives in WorkLocation.radiusM); we
// keep sending it purely so it's recorded on the session for audit.
const toCoords = (pos: GeolocationPosition): Coords => ({
  lat: pos.coords.latitude,
  lng: pos.coords.longitude,
  accuracy: Math.round(pos.coords.accuracy),
});

const WATCH_TIMEOUT_MS = 30_000;

// Starts watching position immediately so a fix is ready by the time the user
// taps Check In / Check Out, avoiding a cold-start timeout on mobile.
export const useGeolocation = () => {
  const latestRef = useRef<Coords | null>(null);
  const watchErrorRef = useRef<GeolocationReason | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        latestRef.current = toCoords(pos);
        watchErrorRef.current = null;
      },
      (err) => {
        watchErrorRef.current = mapPositionError(err);
      },
      { enableHighAccuracy: true, maximumAge: 10_000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const getCurrentPosition = useCallback((): Promise<Coords> => {
    if (!('geolocation' in navigator)) {
      return Promise.reject(new GeolocationError('geolocation_unavailable'));
    }

    // If watchPosition already has a fix, return it immediately.
    if (latestRef.current) {
      return Promise.resolve(latestRef.current);
    }

    // No cached fix yet — fall back to a one-shot request.
    return new Promise<Coords>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new GeolocationError(watchErrorRef.current ?? 'geolocation_timeout'));
      }, WATCH_TIMEOUT_MS);

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          clearTimeout(timer);
          navigator.geolocation.clearWatch(watchId);
          resolve(toCoords(pos));
        },
        (err) => {
          clearTimeout(timer);
          navigator.geolocation.clearWatch(watchId);
          reject(new GeolocationError(mapPositionError(err)));
        },
        { enableHighAccuracy: true, maximumAge: 10_000 }
      );
    });
  }, []);

  return { getCurrentPosition };
};
