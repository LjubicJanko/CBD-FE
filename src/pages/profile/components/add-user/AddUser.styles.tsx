import styled, { css } from 'styled-components';
import theme from '../../../../styles/theme';
import { tablet } from '../../../../util/breakpoints';

export const AddUserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;

  gap: 16px;
  padding: 32px;
  background-color: ${theme.SECONDARY_1};

  ${tablet(css`
    padding: 16px;
    width: 100%;
  `)};

  form {
    max-width: 50%;
    width: 100%;

    display: flex;
    flex-direction: column;

    ${tablet(css`
      max-width: unset;
    `)}

    gap: 16px;
    .add-user {
      margin-top: 16px;
      width: fit-content;
      padding: 16px 32px;
    }
  }
  &.signup-container {
    .role-item {
      color: white;
    }
  }
`;

export const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  border-radius: 8px;
  width: 100%;

  gap: 16px;
  margin-top: 32px;
`;
