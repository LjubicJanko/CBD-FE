export type CheckInMethod = 'GEOFENCE' | 'QR';

export type WorkLocation = {
  id: number;
  name: string;
  checkInMethod: CheckInMethod;
  lat: number | null;
  lng: number | null;
  radiusM: number | null;
  // Present only for callers with location-manage; null otherwise (and always
  // null for GEOFENCE locations).
  qrToken: string | null;
  // Present only for callers with location-manage.
  openSessionCount: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkLocationRequest = {
  name: string;
  checkInMethod: CheckInMethod;
  // Required when checkInMethod is GEOFENCE, omitted/null for QR, the server
  // generates the QR token itself.
  lat?: number;
  lng?: number;
  radiusM?: number;
  active?: boolean;
};

export type WorkLocationPatchRequest = Partial<WorkLocationRequest>;
