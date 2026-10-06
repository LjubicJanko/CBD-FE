import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCanEditPrintFiles } from '../../../../hooks/useCanEditPrintFiles';
import { Order } from '../../../../types/Order';
import EditPrintFilesModal from '../../../modals/edit-print-files/EditPrintFilesModal.component';
import * as Styled from './PrintFilesEdit.styles';

export type PrintFilesEditProps = {
  order: Pick<Order, 'id' | 'status' | 'executionStatus' | 'printFilesUrl'>;
};

const PrintFilesEdit = ({ order }: PrintFilesEditProps) => {
  const { t } = useTranslation();
  const canEdit = useCanEditPrintFiles(order);
  const [isOpen, setIsOpen] = useState(false);

  if (!canEdit) return null;

  const label = t(
    order.printFilesUrl ? 'edit-print-files-link' : 'add-print-files-link'
  );

  return (
    <Styled.PrintFilesEditContainer>
      <Button
        type="button"
        size="small"
        className="print-files-edit__button"
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>
      {isOpen && (
        <EditPrintFilesModal
          orderId={order.id}
          currentUrl={order.printFilesUrl}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </Styled.PrintFilesEditContainer>
  );
};

export default PrintFilesEdit;
