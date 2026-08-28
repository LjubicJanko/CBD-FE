export type AttendanceReason =
  | 'out_of_geofence'
  | 'already_checked_in'
  | 'not_checked_in'
  | 'no_active_locations';

export type AttendanceCheckRequest = {
  lat: number;
  lng: number;
  accuracy: number;
};

export type CurrentSession = {
  id: number;
  locationId: number;
  locationName: string;
  checkInAt: string;
};

export type CheckOutResponse = CurrentSession & {
  checkOutAt: string;
  durationSeconds: number;
};

export type AttendanceSession = {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  locationId: number;
  locationName: string;
  checkInAt: string;
  checkInLat: number;
  checkInLng: number;
  checkInAccuracyM: number;
  checkInIp: string | null;
  checkInUserAgent: string | null;
  checkOutAt: string | null;
  checkOutLat: number | null;
  checkOutLng: number | null;
  checkOutAccuracyM: number | null;
  checkOutIp: string | null;
  checkOutUserAgent: string | null;
  autoClosed: boolean;
  notes: string | null;
  durationSeconds: number | null;
};

export type AttendanceFilters = {
  date?: string;
  from?: string;
  to?: string;
  userId?: number;
  locationId?: number;
  openOnly?: boolean;
  page?: number;
  size?: number;
  sort?: string;
};

export type AttendanceAdminCreate = {
  userId: number;
  locationId: number;
  checkInAt: string;
  checkOutAt?: string;
  notes?: string;
};

export type AttendanceAdminPatch = {
  checkInAt?: string;
  checkOutAt?: string;
  notes?: string;
};

// Public, unauthenticated, just enough to render the confirm-screen chrome
// before the caller has necessarily logged in.
export type ScanLocationInfo = {
  locationName: string;
};

export type ScanRequest = {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
};

export type ScanAction = 'CHECK_IN' | 'CHECK_OUT';

export type ScanResult = {
  action: ScanAction;
  sessionId: number;
  locationId: number;
  locationName: string;
  checkInAt: string;
  checkOutAt: string | null;
  durationSeconds: number | null;
};
