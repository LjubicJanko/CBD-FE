import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const AttendanceScanContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px 64px;
  gap: 24px;
  color: ${(props) => props.theme.SECONDARY_1};

  ${mobile(css`
    padding: 16px 12px 48px;
  `)}

  .attendance-scan__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .attendance-scan__logo {
    max-width: 140px;
    max-height: 72px;
    object-fit: contain;
  }

  .attendance-scan__title {
    font-size: 24px;
    margin: 0;
    text-align: center;
    color: ${(props) => props.theme.SECONDARY_1};
  }

  .attendance-scan__card {
    width: 100%;
    max-width: 420px;
    background-color: ${(props) => props.theme.SECONDARY_2};
    border: 2px solid ${(props) => props.theme.PRIMARY_2};
    border-radius: 20px;
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 12px ${(props) => props.theme.SHADOW};
  }

  .attendance-scan__location {
    font-size: 22px;
    font-weight: 600;
    color: ${(props) => props.theme.PRIMARY_1};
    text-align: center;
  }

  .attendance-scan__question {
    font-size: 16px;
    color: ${(props) => props.theme.PRIMARY_1};
    opacity: 0.85;
    text-align: center;
  }

  .attendance-scan__action {
    width: 100%;
    height: 56px;
    font-size: 17px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: ${(props) => props.theme.PRIMARY_2} !important;
    color: ${(props) => props.theme.PRIMARY_1} !important;

    &:disabled {
      opacity: 0.6;
    }
  }

  .attendance-scan__not-now {
    color: ${(props) => props.theme.PRIMARY_1} !important;
    opacity: 0.6;
    text-transform: none;
  }

  .attendance-scan__error {
    font-size: 14px;
    color: ${(props) => props.theme.ERROR_TEXT};
    text-align: center;
  }

  .attendance-scan__result-icon {
    font-size: 48px;
    color: ${(props) => props.theme.PRIMARY_1};
  }

  .attendance-scan__result-text {
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.theme.PRIMARY_1};
    text-align: center;
  }

  .attendance-scan__login-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;

    label {
      color: ${(props) => props.theme.PRIMARY_1};
      font-size: 14px;
      margin-bottom: 4px;
      display: block;
    }
  }

  .attendance-scan__login-btn {
    background-color: ${(props) => props.theme.PRIMARY_2} !important;
    color: ${(props) => props.theme.PRIMARY_1} !important;
    height: 48px;
  }
`;
