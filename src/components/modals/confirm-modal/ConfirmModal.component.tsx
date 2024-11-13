import { Button, TextField } from '@mui/material';
import * as Styled from './ConfirmModal.styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export type ConfirmModalProps = {
  text: string;
  isOpen: boolean;
  hideNote?: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
};

const ConfirmModal = ({
  text,
  isOpen,
  hideNote = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
  const [note, setNote] = useState('');

  return (
    <Styled.ConfirmModalContainer
      className="confirm-modal"
      title={text}
      isOpen={isOpen}
      showClose={!hideNote}
      onClose={onCancel}
    >
      {!hideNote && (
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
      )}
      <div className="actions">
        <Button className="cancel" onClick={onCancel}>
          {t('back')}
        </Button>
        <Button
          className="confirm"
          disabled={note === '' && !hideNote}
          onClick={() => onConfirm(note)}
        >
          {t('confirm')}
        </Button>
      </div>
    </Styled.ConfirmModalContainer>
  );
};

export default ConfirmModal;
