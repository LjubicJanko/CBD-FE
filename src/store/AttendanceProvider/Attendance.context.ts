import { createContext } from 'react';
import { CheckOutResponse, CurrentSession } from '../../types/Attendance';
import { CheckInMethod } from '../../types/WorkLocation';

export type AttendanceStatus = 'idle' | 'locating' | 'submitting';

export interface AttendanceContextValue {
  currentSession: CurrentSession | null;
  loading: boolean;
  status: AttendanceStatus;
  // Whether the tenant has at least one active GEOFENCE location anywhere —
  // used only for the no-session (check-in) case, where the GPS flow matches
  // against any nearby geofence location, not a specific one yet.
  hasGeofenceLocations: boolean;
  // The checkInMethod of currentSession's OWN location (null if unknown or no
  // session). Distinct from hasGeofenceLocations: a tenant can have both QR
  // and GEOFENCE locations, and the GPS check-OUT flow only works when the
  // open session's specific location is GEOFENCE — checking hasGeofenceLocations
  // there would offer a GPS checkout button that 422s for a QR-opened session
  // just because some other location in the tenant happens to be GEOFENCE.
  currentSessionCheckInMethod: CheckInMethod | null;
  refresh: () => Promise<void>;
  checkIn: () => Promise<CurrentSession | null>;
  checkOut: () => Promise<CheckOutResponse | null>;
}

export default createContext<AttendanceContextValue>({
  currentSession: null,
  loading: false,
  status: 'idle',
  hasGeofenceLocations: true,
  currentSessionCheckInMethod: null,
  refresh: () => Promise.resolve(),
  checkIn: () => Promise.resolve(null),
  checkOut: () => Promise.resolve(null),
});
