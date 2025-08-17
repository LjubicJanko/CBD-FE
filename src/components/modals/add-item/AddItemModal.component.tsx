import { useState } from 'react';
import * as Styled from './AddItemModal.styles';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type AddItemModalProps = {
  text: string;
  isOpen: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
};

const AddItemModal = ({
  text,
  isOpen,
  onCancel,
  onConfirm,
}: AddItemModalProps) => {
  const { t } = useTranslation();
  const [item, setItem] = useState('');

  return (
    <Styled.AddItemModalContainer
      className="confirm-modal"
      title={text}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <TextField
        className="comment-input"
        label={t('Name')}
        type="text"
        fullWidth
        value={item}
        onChange={(val) => setItem(val.target.value)}
        multiline
        rows={4}
      />
      <div className="actions">
        <Button className="actions__cancel" onClick={onCancel}>
          {t('back')}
        </Button>
        <Button
          className="actions__confirm"
          disabled={item === ''}
          onClick={() => onConfirm(item)}
          variant="contained"
        >
          {t('confirm')}
        </Button>
      </div>
    </Styled.AddItemModalContainer>
  );
};

export default AddItemModal;
