import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Checkbox, FormControlLabel } from '@mui/material';
import { ChangeEvent, useId } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styled from './InternalNoteCheckbox.styles';

export type InternalNoteCheckboxProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

const InternalNoteCheckbox = ({
  checked,
  onChange,
  name = 'internalNote',
}: InternalNoteCheckboxProps) => {
  const { t } = useTranslation();
  const hintId = useId();

  return (
    <Styled.InternalNoteContainer className="internal-note">
      <FormControlLabel
        className="internal-note__control"
        control={
          <Checkbox
            name={name}
            checked={checked}
            onChange={onChange}
            inputProps={{
              'aria-describedby': checked ? hintId : undefined,
            }}
          />
        }
        label={
          <span className="internal-note__label">
            {checked && (
              <LockOutlinedIcon fontSize="small" />
            )}
            {t('internal-note')}
          </span>
        }
      />
      {checked && (
        <p id={hintId} className="internal-note__hint">
          {t('internal-note-hint')}
        </p>
      )}
    </Styled.InternalNoteContainer>
  );
};

export default InternalNoteCheckbox;
