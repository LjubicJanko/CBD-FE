import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { locationService } from '../../api';
import {
  WorkLocation,
  WorkLocationPatchRequest,
  WorkLocationRequest,
} from '../../types/WorkLocation';
import SnackbarContext from '../../store/SnackbarProvider/Snackbar.context';
import MapPicker from '../../components/map-picker/MapPicker.component';
import ConfirmModal from '../../components/modals/confirm-modal/ConfirmModal.component';
import * as Styled from './Locations.styles';

const DEFAULT_RADIUS = 100;
// Belgrade — neutral starting point for new entries. The admin pans/zooms
// from here. Avoids triggering a geolocation permission prompt on the admin
// device just to seed the map.
const DEFAULT_LAT = 44.787197;
const DEFAULT_LNG = 20.457273;

type FormState = {
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  active: boolean;
};

const emptyForm: FormState = {
  name: '',
  lat: DEFAULT_LAT,
  lng: DEFAULT_LNG,
  radiusM: DEFAULT_RADIUS,
  active: true,
};

const LocationsPage = () => {
  const { t } = useTranslation();
  const { showSnackbar } = useContext(SnackbarContext);

  const [locations, setLocations] = useState<WorkLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<WorkLocation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<{ name?: string; radius?: string }>({});

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<WorkLocation | null>(null);

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
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((loc: WorkLocation) => {
    setEditing(loc);
    setForm({
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      radiusM: loc.radiusM,
      active: loc.active,
    });
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
    if (state.radiusM < 10 || state.radiusM > 5000) {
      next.radius = 'locations.radius-range';
    }
    return next;
  }, []);

  const handleSave = useCallback(async () => {
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSaving(true);
    try {
      if (editing) {
        const patch: WorkLocationPatchRequest = {
          name: form.name.trim(),
          lat: form.lat,
          lng: form.lng,
          radiusM: form.radiusM,
          active: form.active,
        };
        const updated = await locationService.patch(editing.id, patch);
        setLocations((old) =>
          old.map((l) => (l.id === updated.id ? updated : l))
        );
        showSnackbar(t('locations.updated'), 'success');
      } else {
        const payload: WorkLocationRequest = {
          name: form.name.trim(),
          lat: form.lat,
          lng: form.lng,
          radiusM: form.radiusM,
        };
        const created = await locationService.create(payload);
        setLocations((old) => [...old, created]);
        showSnackbar(t('locations.created'), 'success');
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      showSnackbar(
        t(editing ? 'locations.save-error' : 'locations.create-error'),
        'error'
      );
    } finally {
      setSaving(false);
    }
  }, [editing, form, showSnackbar, t, validate]);

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

  const dialogTitleKey = editing ? 'locations.edit' : 'locations.add';

  const tableRows = useMemo(
    () =>
      locations.map((loc) => (
        <tr key={loc.id}>
          <td data-label={t('locations.name')}>{loc.name}</td>
          <td data-label={`${t('locations.lat')}/${t('locations.lng')}`}>
            {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
          </td>
          <td data-label={t('locations.radius')}>{loc.radiusM} m</td>
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
                setForm((old) => ({ ...old, radiusM: Number(e.target.value) }))
              }
              inputProps={{ step: 10, min: 10, max: 5000 }}
              error={!!errors.radius}
              helperText={
                errors.radius ? t(errors.radius) : t('locations.radius-hint')
              }
            />
          </div>

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
    </Styled.Container>
  );
};

export default LocationsPage;
