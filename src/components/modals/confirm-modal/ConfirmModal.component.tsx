import { Button, TextField } from '@mui/material';
import * as Styled from './ConfirmModal.styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type ConfirmModalProps = {
  text: string;
  isOpen: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
};

const ConfirmModal = ({
  text,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  const [note, setNote] = useState('');

  return (
    <Styled.ConfirmModalContainer
      title={text}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <TextField
        className="comment-input"
        label={t('comment')}
        name="closingComment"
        type="text"
        fullWidth
        value={note}
        onChange={(val) => setNote(val.target.value)}
        multiline
        rows={4}
      />
      <div className="actions">
        <Button className="cancel" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button
          className="confirm"
          disabled={note === ''}
          onClick={() => onConfirm(note)}
        >
          {t('confirm')}
        </Button>
      </div>
    </Styled.ConfirmModalContainer>
  );
};

export default ConfirmModal;
