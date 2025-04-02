import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const AddPaymentModalContainer = styled(CbdModal)`
  background-color: ${theme.PRIMARY_1};

  &.add-payment {
    h2 {
      color: ${theme.SECONDARY_1};
    }
  }
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 8px;

    &__submit {
      margin-top: 12px;
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};

      &--disabled {
        background-color: ${theme.SECONDARY_2};
        opacity: 0.7;
      }
    }
  }
`;
