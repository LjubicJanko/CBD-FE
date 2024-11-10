import { Order } from '../../../types/Order';
import ChangeHistoryComponent from '../../order-details/components/ChangeHistory.component';
import * as Styled from './StatusHistoryModal.styles';
import { useTranslation } from 'react-i18next';

export type StatusHistoryModalProps = {
  selectedOrder: Order;
  isOpen?: boolean;
  onClose: () => void;
};

const StatusHistoryModal = ({
  selectedOrder,
  isOpen = false,
  onClose,
}: StatusHistoryModalProps) => {
  const { t } = useTranslation();
  return (
    <Styled.StatusChangeModalContainer
      title={t('status-change-history')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ChangeHistoryComponent statusHistory={selectedOrder.statusHistory} />
    </Styled.StatusChangeModalContainer>
  );
};

export default StatusHistoryModal;
