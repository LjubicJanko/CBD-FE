import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const StatusChangeModalContainer = styled(CbdModal)`
  background-color: ${theme.SECONDARY_2};

  &.status-change-modal {
    h2 {
      font-weight: 400;
      font-size: 20px;
      color: ${theme.SECONDARY_1};
    }
  }

  form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .comment-input {
    }
    .comment-input,
    .postal-service-input,
    .postal-code-input {
      width: 100%;
    }

    .fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }

    .submit-button {
      background-color: ${theme.PRIMARY_2};
      color: ${theme.PRIMARY_1};
    }

    p {
      color: red;
      padding-left: 16px;
      font-size: 14px;
      margin: 0;
      /* font-family: unset; */
      margin-top: 4px;
    }
  }
`;
