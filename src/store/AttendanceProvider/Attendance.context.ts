import { createContext } from 'react';
import { CheckOutResponse, CurrentSession } from '../../types/Attendance';

export type AttendanceStatus = 'idle' | 'locating' | 'submitting';

export interface AttendanceContextValue {
  currentSession: CurrentSession | null;
  loading: boolean;
  status: AttendanceStatus;
  refresh: () => Promise<void>;
  checkIn: () => Promise<CurrentSession | null>;
  checkOut: () => Promise<CheckOutResponse | null>;
}

export default createContext<AttendanceContextValue>({
  currentSession: null,
  loading: false,
  status: 'idle',
  refresh: () => Promise.resolve(),
  checkIn: () => Promise.resolve(null),
  checkOut: () => Promise.resolve(null),
});
