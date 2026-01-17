import styled, { css } from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';
import { tablet } from '../../../util/breakpoints';

export const PostServiceModalContainer = styled(CbdModal)`
  min-width: 250px;
  background-color: ${theme.PRIMARY_1};
  width: 770px;
  padding: 48px 80px 32px 80px;
  justify-content: space-between;

  ${tablet(css`
    padding: 24px 40px 16px 40px;
  `)}

  &.postService-modal {
    h2 {
      font-weight: 400;
      color: ${theme.SECONDARY_1};
      font-size: 32px;
      line-height: 25px;
      text-align: center;
      vertical-align: middle;
      margin-top: 48px;
      margin-bottom: 48px;
    }
  }

  .postService-modal {
    &__fields {
      display: flex;
      flex-direction: column;
      gap: 32px;

      &__categories {
        max-width: 50%;
        ${tablet(css`
          max-width: unset;
        `)}
      }
      &__confirm {
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        margin-top: 32px;
        margin-right: -50px;
        align-self: flex-end;
        border-radius: 25px;
        font-family: Afacad;
        font-weight: 400;
        font-size: 24px;
        line-height: 25px;
        letter-spacing: 0%;

        ${tablet(css`
          margin-right: unset;
        `)}
      }
    }
  }
`;
