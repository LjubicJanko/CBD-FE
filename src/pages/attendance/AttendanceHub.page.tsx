import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tab,
    Tabs,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useSearchParams } from 'react-router-dom';
import * as Styled from './AttendanceHub.styles';
import AttendancePage from './Attendance.page';
import AttendanceAdminPage from '../attendance-admin/AttendanceAdmin.page';
import LocationsPage from '../locations/Locations.page';
import { usePrivileges } from '../../hooks/usePrivileges';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import { xxsMax } from '../../util/breakpoints';

/**
 * Single attendance route hosting the previously-separate pages as tabs:
 *  - "My attendance" (check in/out) — for anyone who can check in.
 *  - "Attendance overview" (all sessions) — for ATTENDANCE_VIEW_ALL.
 *  - "Locations" — for LOCATION_MANAGE.
 *
 * Each tab is gated by its privilege, so a regular user sees only their own
 * attendance tab (and the tab bar is hidden entirely in that case). Reuses the
 * existing header menu labels as tab labels, so no new translations are needed.
 */
const AttendanceHub = () => {
    const { t } = useTranslation();
    const { canCheckIn, canViewAttendance, canManageLocations } =
        usePrivileges();
    const width = useResponsiveWidth();
    const isMobile = width < xxsMax;

    const tabs = useMemo<{ id: string; label: string; panel: ReactNode }[]>(
        () => [
            ...(canCheckIn
                ? [
                      {
                          id: 'me',
                          label: t('attendance.menu'),
                          panel: <AttendancePage />,
                      },
                  ]
                : []),
            ...(canViewAttendance
                ? [
                      {
                          id: 'overview',
                          label: t('attendance.admin.menu'),
                          panel: <AttendanceAdminPage />,
                      },
                  ]
                : []),
            ...(canManageLocations
                ? [
                      {
                          id: 'locations',
                          label: t('locations.menu'),
                          panel: <LocationsPage />,
                      },
                  ]
                : []),
        ],
        [canCheckIn, canViewAttendance, canManageLocations, t]
    );

    const [searchParams, setSearchParams] = useSearchParams();

    // No relevant privilege at all — nothing to show here.
    if (tabs.length === 0) return <Navigate to="/dashboard" replace />;

    // The active tab is driven by the `tab` query param (its stable id) so a
    // refresh or shared link lands on the same tab. Falls back to the first
    // tab when the param is missing or names a tab this user can't access.
    const paramIndex = tabs.findIndex((tab) => tab.id === searchParams.get('tab'));
    const activeIndex = paramIndex === -1 ? 0 : paramIndex;
    const activePanel = tabs[activeIndex].panel;

    const selectTab = (index: number) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set('tab', tabs[index].id);
                return next;
            },
            { replace: true }
        );
    };

    // Single accessible tab (regular user) — render the page as-is, no tab bar.
    if (tabs.length === 1) return <>{activePanel}</>;

    return (
        <Styled.AttendanceHubContainer className="attendance-hub">
            <div className="attendance-hub__tabs">
                {isMobile ? (
                    <Select
                        className="attendance-hub__tab-select"
                        value={activeIndex}
                        onChange={(e: SelectChangeEvent<number>) =>
                            selectTab(Number(e.target.value))
                        }
                        size="small"
                        fullWidth
                    >
                        {tabs.map((tab, index) => (
                            <MenuItem key={tab.id} value={index}>
                                {tab.label}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <Box className="attendance-hub__tabs-box">
                        <Tabs
                            className="attendance-hub__tabs-box__tabs"
                            value={activeIndex}
                            onChange={(_, value) => selectTab(value)}
                        >
                            {tabs.map((tab) => (
                                <Tab key={tab.id} label={tab.label} />
                            ))}
                        </Tabs>
                    </Box>
                )}
            </div>
            <div className="attendance-hub__panel">{activePanel}</div>
        </Styled.AttendanceHubContainer>
    );
};

export default AttendanceHub;
