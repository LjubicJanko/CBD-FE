import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const ContactInfoFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .contact-info-form {
    &__actions {
      display: flex;
      justify-content: space-between;

      &__cancel {
      }

      &__save {
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 4px;

        &--disabled {
          background-color: ${theme.SECONDARY_3};
          opacity: 0.7;
        }

        .MuiSvgIcon-root {
          color: ${theme.PRIMARY_1};
        }
      }
    }
  }
`;
