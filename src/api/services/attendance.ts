import {
  AttendanceAdminCreate,
  AttendanceAdminPatch,
  AttendanceCheckRequest,
  AttendanceFilters,
  AttendanceSession,
  CheckOutResponse,
  CurrentSession,
  ScanLocationInfo,
  ScanRequest,
  ScanResult,
} from '../../types/Attendance';
import { PaginatedResponse } from '../../types/Response';
import client from '../client';
import privateClient from '../privateClient';

const checkIn = async (
  data: AttendanceCheckRequest
): Promise<CurrentSession> =>
  privateClient.post('/attendance/check-in', data).then((res) => res.data);

const checkOut = async (
  data: AttendanceCheckRequest
): Promise<CheckOutResponse> =>
  privateClient.post('/attendance/check-out', data).then((res) => res.data);

const getCurrentSession = async (): Promise<CurrentSession | null> =>
  privateClient.get('/attendance/me/current').then((res) => {
    // 204 No Content means there is no open session for the current user.
    if (res.status === 204) return null;
    return res.data;
  });

const list = async (
  filters: AttendanceFilters
): Promise<PaginatedResponse<AttendanceSession[]>> =>
  privateClient
    .get('/attendance', {
      params: {
        date: filters.date,
        from: filters.from,
        to: filters.to,
        userId: filters.userId,
        locationId: filters.locationId,
        openOnly: filters.openOnly,
        page: filters.page ?? 0,
        size: filters.size ?? 20,
        sort: filters.sort ?? 'checkInAt,desc',
      },
    })
    .then((res) => res.data);

const createManual = async (
  data: AttendanceAdminCreate
): Promise<AttendanceSession> =>
  privateClient.post('/attendance', data).then((res) => res.data);

const patchSession = async (
  id: number,
  data: AttendanceAdminPatch
): Promise<AttendanceSession> =>
  privateClient.patch(`/attendance/${id}`, data).then((res) => res.data);

// Public, no auth header, so the scan landing page can render the location
// name before the caller has necessarily logged in.
const getScanLocation = async (
  tenantSlug: string,
  token: string
): Promise<ScanLocationInfo> =>
  client
    .get(`/attendance/scan/${tenantSlug}/${token}`)
    .then((res) => res.data);

// Authenticated. Toggles automatically server-side: checks in if the caller
// has no open session, checks out if they do.
const scan = async (token: string, data: ScanRequest): Promise<ScanResult> =>
  privateClient.post(`/attendance/scan/${token}`, data).then((res) => res.data);

export default {
  checkIn,
  checkOut,
  getCurrentSession,
  list,
  createManual,
  patchSession,
  getScanLocation,
  scan,
};
