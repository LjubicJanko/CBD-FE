import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GearReqDto, GearResDto } from '../../../types/Gear';
import { GenericConfig } from '../../../types/GenericConfig';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import * as Styled from './GearModal.styles';

export type GearModalProps = {
  gear?: GearResDto;
  title: string;
  isOpen: boolean;
  gearCategories: GenericConfig[];
  onConfirm: (gear: GearReqDto | GearResDto) => void;
  onCancel: () => void;
};

export const GearModal = ({
  gear,
  title,
  isOpen,
  gearCategories,
  onCancel,
  onConfirm,
}: GearModalProps) => {
  const { t } = useTranslation();

  const [name, setName] = useState(gear?.name ?? '');
  const [categoryId, setCategoryId] = useState<number | ''>(
    gear?.categoryId ?? ''
  );

  useEffect(() => {
    if (gear) {
      setName(gear.name);
      setCategoryId(gear.categoryId ?? '');
    } else {
      setName('');
      setCategoryId('');
    }
  }, [gear, isOpen]);

  const isSubmitDisabled = useMemo(
    () => !(name && categoryId),
    [categoryId, name]
  );

  const handleSubmit = () => {
    if (!name || !categoryId) return;
    const categoryName = gearCategories.find((x) => x.id === categoryId)?.value;

    onConfirm({
      name,
      categoryId: Number(categoryId),
      categoryName: categoryName,
      id: gear?.id,
    });
  };

  return (
    <Styled.GearModalContainer
      className="gear-modal"
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <div className="gear-modal__fields">
        <div className="gear-modal__fields__name">
          <InputLabel>{t('Naziv')}</InputLabel>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>

        <div className="gear-modal__fields__categories">
          <InputLabel>{t('Kategorija')}</InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as number)}
              label={t('gearCategory')}
            >
              {gearCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button
          variant="contained"
          onClick={handleSubmit}
          className="gear-modal__fields__confirm"
          disabled={isSubmitDisabled}
          endIcon={<SaveOutlinedIcon />}
        >
          {t('confirm')}
        </Button>
      </div>
    </Styled.GearModalContainer>
  );
};
