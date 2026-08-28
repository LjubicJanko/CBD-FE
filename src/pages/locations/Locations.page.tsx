import {
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { QRCodeCanvas } from 'qrcode.react';
import dayjs from 'dayjs';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { locationService } from '../../api';
import {
  CheckInMethod,
  WorkLocation,
  WorkLocationPatchRequest,
  WorkLocationRequest,
} from '../../types/WorkLocation';
import SnackbarContext from '../../store/SnackbarProvider/Snackbar.context';
import AuthContext from '../../store/AuthProvider/Auth.context';
import localStorageService from '../../services/localStorage.service';
import MapPicker from '../../components/map-picker/MapPicker.component';
import ConfirmModal from '../../components/modals/confirm-modal/ConfirmModal.component';
import theme, { DEFAULT_COLORS } from '../../styles/theme';
import { Feature } from '../../util/features';
import { useHasFeature } from '../../hooks/useFeatures';
import * as Styled from './Locations.styles';

// A phone scanning the printed QR can't resolve `localhost`, it needs the
// dev machine's LAN address. window.location.origin only gives that if the
// admin happens to be browsing via the LAN URL themselves; this lets local
// dev pin it explicitly regardless. import.meta.env.DEV keeps it out of
// production builds even if the var is left set in a shared .env.
const getScanOrigin = (): string => {
  if (import.meta.env.DEV) {
    const override = import.meta.env.VITE_LOCAL_SCAN_ORIGIN as
      | string
      | undefined;
    if (override) return override;
  }
  return window.location.origin;
};

const DEFAULT_RADIUS = 100;
// Belgrade, neutral starting point for new entries. The admin pans/zooms
// from here. Avoids triggering a geolocation permission prompt on the admin
// device just to seed the map.
const DEFAULT_LAT = 44.787197;
const DEFAULT_LNG = 20.457273;

type FormState = {
  name: string;
  checkInMethod: CheckInMethod;
  lat: number;
  lng: number;
  radiusM: number;
  active: boolean;
};

const emptyForm: FormState = {
  name: '',
  // New locations default to QR, geofence is the legacy opt-in now.
  checkInMethod: 'QR',
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
  radiusM: DEFAULT_RADIUS,
  active: true,
};

const formFromLocation = (loc: WorkLocation): FormState => ({
  name: loc.name,
  checkInMethod: loc.checkInMethod,
  lat: loc.lat ?? DEFAULT_LAT,
  lng: loc.lng ?? DEFAULT_LNG,
  radiusM: loc.radiusM ?? DEFAULT_RADIUS,
  active: loc.active,
});

const LocationsPage = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useContext(SnackbarContext);
  const { authData } = useContext(AuthContext);
  const hasGeofenceFeature = useHasFeature(Feature.ATTENDANCE_GEOFENCE);

  // A superadmin has no tenant of their own, resolve the currently
  // impersonated tenant's slug so the scan URL is buildable for them too.
  const tenantSlug = authData?.superadmin
    ? localStorageService.selectedTenantSlug
    : authData?.tenantSlug ?? null;

  const [locations, setLocations] = useState<WorkLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<WorkLocation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<{ name?: string; radius?: string }>({});

  // Set only when saving a method change on a location with open sessions —
  // gates the save behind an extra confirmation instead of firing right away.
  const [pendingMethodSwitch, setPendingMethodSwitch] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WorkLocation | null>(null);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await locationService.list();
      setLocations(data);
    } catch (error) {
      console.error(error);
      showSnackbar(t('locations.load-error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, t]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const openCreate = useCallback(() => {
    // QR is always available under the base attendance feature, so it's
    // always a safe default here regardless of the geofence beta flag.
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((loc: WorkLocation) => {
    setEditing(loc);
    setForm(formFromLocation(loc));
    setErrors({});
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (saving) return;
    setDialogOpen(false);
  }, [saving]);

  const validate = useCallback((state: FormState) => {
    const next: { name?: string; radius?: string } = {};
    if (!state.name.trim()) next.name = 'locations.name-required';
    if (
      state.checkInMethod === 'GEOFENCE' &&
      (state.radiusM < 10 || state.radiusM > 5000)
    ) {
      next.radius = 'locations.radius-range';
    }
    return next;
  }, []);

  const buildPayload = useCallback(
    (state: FormState): WorkLocationRequest => ({
      name: state.name.trim(),
      checkInMethod: state.checkInMethod,
      active: state.active,
      ...(state.checkInMethod === 'GEOFENCE'
        ? { lat: state.lat, lng: state.lng, radiusM: state.radiusM }
        : {}),
    }),
    []
  );

  const performSave = useCallback(async () => {
    setSaving(true);
    try {
      if (editing) {
        const patch: WorkLocationPatchRequest = buildPayload(form);
        const updated = await locationService.patch(editing.id, patch);
        setLocations((old) =>
          old.map((l) => (l.id === updated.id ? updated : l))
        );
        showSnackbar(t('locations.updated'), 'success');
        setDialogOpen(false);
      } else {
        const created = await locationService.create(buildPayload(form));
        setLocations((old) => [...old, created]);
        showSnackbar(t('locations.created'), 'success');
        if (created.checkInMethod === 'QR') {
          // Switch into edit mode instead of closing, so the freshly-minted
          // QR code's download/print controls are immediately reachable
          // rather than making the admin reopen the dialog to find them.
          setEditing(created);
          setForm(formFromLocation(created));
        } else {
          setDialogOpen(false);
        }
      }
    } catch (error) {
      console.error(error);
      showSnackbar(
        t(editing ? 'locations.save-error' : 'locations.create-error'),
        'error'
      );
    } finally {
      setSaving(false);
    }
  }, [buildPayload, editing, form, showSnackbar, t]);

  const handleSave = useCallback(() => {
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    // Switching a location's check-in method while people are mid-session
    // there is confusing (they may need the new method to check out), warn
    // rather than silently switching.
    if (
      editing &&
      form.checkInMethod !== editing.checkInMethod &&
      (editing.openSessionCount ?? 0) > 0
    ) {
      setPendingMethodSwitch(true);
      return;
    }

    performSave();
  }, [editing, form, performSave, validate]);

  const confirmMethodSwitch = useCallback(() => {
    setPendingMethodSwitch(false);
    performSave();
  }, [performSave]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(null);
    setDeletingId(id);
    try {
      await locationService.remove(id);
      // Refetch rather than splice: the BE may have soft-deleted (set
      // active=false) instead of hard-deleting if attendance rows reference
      // this location, and we want the row to reflect that.
      await fetchLocations();
      showSnackbar(t('locations.deleted'), 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(t('locations.delete-error'), 'error');
    } finally {
      setDeletingId(null);
    }
  }, [pendingDelete, fetchLocations, showSnackbar, t]);

  const handleCoordChange = useCallback((lat: number, lng: number) => {
    setForm((old) => ({ ...old, lat, lng }));
  }, []);

  const scanUrl = useMemo(() => {
    if (!tenantSlug || !editing?.qrToken) return '';
    return `${getScanOrigin()}/attendance/scan/${tenantSlug}/${editing.qrToken}`;
  }, [tenantSlug, editing?.qrToken]);

  const getQrDataUrl = useCallback((): string | null => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  }, []);

  const handleDownloadQr = useCallback(() => {
    const dataUrl = getQrDataUrl();
    if (!dataUrl || !editing) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${editing.name.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [editing, getQrDataUrl]);

  const handlePrintQr = useCallback(() => {
    const dataUrl = getQrDataUrl();
    if (!dataUrl || !editing) return;
    const printWindow = window.open('', '_blank', 'width=480,height=640');
    if (!printWindow) return;
    const printDoc = printWindow.document;

    // Built via DOM APIs + textContent rather than document.write() with an
    // interpolated string: editing.name is free-text an admin can set, and
    // write()-ing it into HTML would let a crafted location name execute
    // script in this same-origin window. textContent escapes it instead.
    printDoc.title = editing.name;

    const style = printDoc.createElement('style');
    style.textContent = `
      body { font-family: sans-serif; text-align: center; padding: 32px; }
      h1 { font-size: 20px; margin-bottom: 24px; }
      img { width: 280px; height: 280px; }
      p { margin-top: 16px; word-break: break-all; font-size: 12px; color: #555; }
    `;
    printDoc.head.appendChild(style);

    const heading = printDoc.createElement('h1');
    heading.textContent = editing.name;

    const img = printDoc.createElement('img');
    img.alt = t('locations.method-qr');
    // The window's own load event already fired by the time we get here
    // (window.open('', ...) hands back an already-loaded blank document), so
    // wait on the image itself rather than printWindow.onload.
    img.onload = () => printWindow.print();
    img.src = dataUrl;

    const urlText = printDoc.createElement('p');
    urlText.textContent = scanUrl;

    printDoc.body.append(heading, img, urlText);
  }, [editing, getQrDataUrl, scanUrl, t]);

  const dialogTitleKey = editing ? 'locations.edit' : 'locations.add';

  const tableRows = useMemo(
    () =>
      locations.map((loc) => (
        <tr key={loc.id}>
          <td data-label={t('locations.name')}>{loc.name}</td>
          <td data-label={t('locations.method')}>
            {t(
              loc.checkInMethod === 'GEOFENCE'
                ? 'locations.method-geofence'
                : 'locations.method-qr'
            )}
            {loc.checkInMethod === 'QR' &&
              Boolean(loc.openSessionCount) && (
                <Chip
                  className="locations-page__session-chip"
                  size="small"
                  label={t('locations.qr-open-sessions', {
                    COUNT: loc.openSessionCount,
                  })}
                />
              )}
          </td>
          <td data-label={`${t('locations.lat')}/${t('locations.lng')}`}>
            {loc.checkInMethod === 'GEOFENCE' && loc.lat !== null && loc.lng !== null
              ? `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`
              : '—'}
          </td>
          <td data-label={t('locations.radius')}>
            {loc.checkInMethod === 'GEOFENCE' && loc.radiusM !== null
              ? `${loc.radiusM} m`
              : '—'}
          </td>
          <td data-label={t('status')}>
            <span
              className={classNames('locations-page__status-chip', {
                'locations-page__status-chip--active': loc.active,
                'locations-page__status-chip--inactive': !loc.active,
              })}
            >
              {t(loc.active ? 'locations.active' : 'locations.inactive')}
            </span>
          </td>
          <td>
            <div className="locations-page__row-actions">
              <IconButton
                size="small"
                onClick={() => openEdit(loc)}
                aria-label={t('locations.edit')}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                className="locations-page__delete"
                size="small"
                onClick={() => setPendingDelete(loc)}
                disabled={deletingId === loc.id}
                aria-label={t('delete')}
              >
                {deletingId === loc.id ? (
                  <CircularProgress size={16} />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            </div>
          </td>
        </tr>
      )),
    [deletingId, locations, openEdit, t]
  );

  // The real token only exists after the location has been saved with
  // checkInMethod QR, toggling the form to QR before saving (whether
  // creating, or switching an existing GEOFENCE location) has nothing to
  // render yet.
  const hasSavedQrToken =
    editing?.checkInMethod === 'QR' && Boolean(editing.qrToken);

  // The backend only rejects a request that SWITCHES a location to GEOFENCE:
  // an already-GEOFENCE location stays fully editable without the feature.
  // Mirror that client-side against the location's SAVED method
  // (editing?.checkInMethod), not the live form value — comparing against
  // the live value would let an admin toggle QR -> GEOFENCE -> QR within one
  // dialog session and get permanently locked out of GEOFENCE for the rest
  // of that session (the QR selection would itself re-trigger the lock).
  // Anchoring on the saved value means an already-GEOFENCE location's toggle
  // stays freely selectable for the whole session regardless of how the
  // admin fiddles with it, while a location that WASN'T already GEOFENCE (or
  // a brand-new one) stays locked out throughout. QR needs no such gate,
  // it's always available.
  const geofenceOptionLocked =
    !hasGeofenceFeature && editing?.checkInMethod !== 'GEOFENCE';

  return (
    <Styled.Container className="locations-page">
      <div className="locations-page__header">
        <h1 className="locations-page__title">{t('locations.title')}</h1>
        <Button
          className="locations-page__add"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          {t('locations.add')}
        </Button>
      </div>

      {loading ? (
        <div className="locations-page__loader">
          <CircularProgress />
        </div>
      ) : locations.length === 0 ? (
        <div className="locations-page__empty">{t('locations.no-locations')}</div>
      ) : (
        <div className="locations-page__table-wrap">
          <table className="locations-page__table">
            <thead>
              <tr>
                <th>{t('locations.name')}</th>
                <th>{t('locations.method')}</th>
                <th>
                  {t('locations.lat')}/{t('locations.lng')}
                </th>
                <th>{t('locations.radius')}</th>
                <th>{t('status')}</th>
                <th />
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      )}

      <Styled.LocationsModal
        isOpen={dialogOpen}
        onClose={closeDialog}
        title={t(dialogTitleKey)}
      >
        <div className="locations-dialog__form">
          <TextField
            fullWidth
            label={t('locations.name')}
            value={form.name}
            onChange={(e) =>
              setForm((old) => ({ ...old, name: e.target.value }))
            }
            error={!!errors.name}
            helperText={errors.name ? t(errors.name) : ''}
          />

          <ToggleButtonGroup
            className="locations-dialog__method"
            exclusive
            fullWidth
            value={form.checkInMethod}
            onChange={(_, value: string | null) => {
              if (value === 'GEOFENCE' || value === 'QR') {
                setForm((old) => ({ ...old, checkInMethod: value }));
              }
            }}
          >
            <ToggleButton value="QR">{t('locations.method-qr')}</ToggleButton>
            <ToggleButton value="GEOFENCE" disabled={geofenceOptionLocked}>
              {t('locations.method-geofence')}
            </ToggleButton>
          </ToggleButtonGroup>
          {geofenceOptionLocked && (
            <p className="locations-dialog__hint">
              {t('locations.geofence-feature-disabled-hint')}
            </p>
          )}

          {form.checkInMethod === 'GEOFENCE' ? (
            <>
              <div>
                <MapPicker
                  lat={form.lat}
                  lng={form.lng}
                  radiusM={form.radiusM}
                  onChange={handleCoordChange}
                />
                <p className="locations-dialog__hint">{t('locations.click-map')}</p>
              </div>

              <div className="locations-dialog__coords">
                <TextField
                  label={t('locations.lat')}
                  type="number"
                  value={form.lat}
                  onChange={(e) =>
                    setForm((old) => ({ ...old, lat: Number(e.target.value) }))
                  }
                  inputProps={{ step: 0.000001, min: -90, max: 90 }}
                />
                <TextField
                  label={t('locations.lng')}
                  type="number"
                  value={form.lng}
                  onChange={(e) =>
                    setForm((old) => ({ ...old, lng: Number(e.target.value) }))
                  }
                  inputProps={{ step: 0.000001, min: -180, max: 180 }}
                />
                <TextField
                  label={t('locations.radius')}
                  type="number"
                  value={form.radiusM}
                  onChange={(e) =>
                    setForm((old) => ({
                      ...old,
                      radiusM: Number(e.target.value),
                    }))
                  }
                  inputProps={{ step: 10, min: 10, max: 5000 }}
                  error={!!errors.radius}
                  helperText={
                    errors.radius ? t(errors.radius) : t('locations.radius-hint')
                  }
                />
              </div>
            </>
          ) : (
            <div className="locations-dialog__qr">
              <p className="locations-dialog__hint">{t('locations.qr-hint')}</p>
              {hasSavedQrToken ? (
                <>
                  <QRCodeCanvas
                    ref={qrCanvasRef}
                    value={scanUrl}
                    size={200}
                    bgColor={theme.SECONDARY_1}
                    fgColor={DEFAULT_COLORS.background}
                    level="M"
                    marginSize={2}
                  />
                  {scanUrl && (
                    <p className="locations-dialog__qr-url">
                      {t('locations.qr-scan-url')}: {scanUrl}
                    </p>
                  )}
                  {Boolean(editing?.openSessionCount) && (
                    <Chip
                      size="small"
                      label={t('locations.qr-open-sessions', {
                        COUNT: editing?.openSessionCount,
                      })}
                    />
                  )}
                  <div className="locations-dialog__qr-actions">
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadQr}
                    >
                      {t('locations.qr-download')}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={handlePrintQr}
                    >
                      {t('locations.qr-print')}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="locations-dialog__hint">
                  {t('locations.qr-pending')}
                </p>
              )}
            </div>
          )}

          {editing && (
            <FormControlLabel
              className="locations-dialog__active"
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) =>
                    setForm((old) => ({ ...old, active: e.target.checked }))
                  }
                />
              }
              label={t('locations.active')}
            />
          )}

          {editing && (
            <p className="locations-dialog__hint">
              {t('locations.created-at')}:{' '}
              {dayjs(editing.createdAt).format('YYYY-MM-DD HH:mm')}
            </p>
          )}

          <div className="locations-dialog__actions">
            <Button variant="outlined" onClick={closeDialog} disabled={saving}>
              {t('cancel')}
            </Button>
            <Button
              className="locations-dialog__save"
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : t('save-changes')}
            </Button>
          </div>
        </div>
      </Styled.LocationsModal>

      <ConfirmModal
        hideNote
        isOpen={pendingDelete !== null}
        text={t('locations.delete-confirm')}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmModal
        hideNote
        isOpen={pendingMethodSwitch}
        text={t('locations.switch-warning', {
          COUNT: editing?.openSessionCount ?? 0,
        })}
        onConfirm={confirmMethodSwitch}
        onCancel={() => setPendingMethodSwitch(false)}
      />
    </Styled.Container>
  );
};

export default LocationsPage;
