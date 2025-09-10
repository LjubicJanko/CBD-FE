import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
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
import configService from '../../../api/services/config';
import { GearReqDto, GearResDto } from '../../../types/Gear';
import { GenericConfig } from '../../../types/GenericConfig';
import * as Styled from './GearModal.styles';

export type GearModalProps = {
  gear?: GearResDto;
  title: string;
  isOpen: boolean;
  onConfirm: (gear: GearReqDto | GearResDto) => void;
  onCancel: () => void;
};

export const GearModal = ({
  gear,
  title,
  isOpen,
  onCancel,
  onConfirm,
}: GearModalProps) => {
  const { t } = useTranslation();

  const [name, setName] = useState(gear?.name ?? '');
  const [categoryId, setCategoryId] = useState<number | ''>(
    gear?.categoryId ?? ''
  );
  const [typeId, setTypeId] = useState<number | ''>(gear?.typeId ?? '');

  const [categories, setCategories] = useState<GenericConfig[]>([]);
  const [types, setTypes] = useState<GenericConfig[]>([]);

  useEffect(() => {
    if (gear) {
      setName(gear.name);
      setCategoryId(gear.categoryId ?? '');
      setTypeId(gear.typeId ?? '');
    } else {
      setName('');
      setCategoryId('');
      setTypeId('');
    }
  }, [gear, isOpen]);

  useEffect(() => {
    configService.getConfigsByType('GEAR_CATEGORY').then(setCategories);
    configService.getConfigsByType('GEAR_TYPE').then(setTypes);
  }, []);

  const isSubmitDisabled = useMemo(
    () => !(name && categoryId),
    [categoryId, name]
  );

  const handleSubmit = () => {
    if (!name || !categoryId) return;
    const categoryName = categories.find((x) => x.id === categoryId)?.value;
    const typeName = types.find((x) => x.id === typeId)?.value;
    console.log(typeName);

    onConfirm({
      name,
      categoryId: Number(categoryId),
      categoryName: categoryName,
      typeId: Number(typeId),
      typeName: typeName,
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
              {categories.map((cat) => (
                <MenuItem key={`gear-category-${cat.id}`} value={cat.id}>
                  {cat.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="gear-modal__fields__types">
          <InputLabel>{t('Tip')}</InputLabel>
          <FormControl fullWidth margin="normal">
            <Select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value as number)}
              label={t('gearType')}
            >
              {types.map((gearType) => (
                <MenuItem key={`gear-type-${gearType.id}`} value={gearType.id}>
                  {gearType.value}
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
