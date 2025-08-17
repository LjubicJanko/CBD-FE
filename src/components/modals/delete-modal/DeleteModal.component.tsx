import { Button } from '@mui/material';
import * as Styled from './DeleteModal.styles';
import { useTranslation } from 'react-i18next';

export type DeleteModalProps = {
  title: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteModal = ({
  title,
  isOpen,
  onCancel,
  onConfirm,
}: DeleteModalProps) => {
  const { t } = useTranslation();

  return (
    <Styled.DeleteModalContainer
      className="delete-modal"
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <div className="actions">
        <Button className="actions__cancel" onClick={onCancel}>
          {t('back')}
        </Button>
        <Button
          className="actions__confirm"
          onClick={() => onConfirm()}
          variant="contained"
        >
          {t('confirm')}
        </Button>
      </div>
    </Styled.DeleteModalContainer>
  );
};
