import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';

export const StatusChangeModalContainer = styled(CbdModal)`
  /* min-width: 500px; */
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
