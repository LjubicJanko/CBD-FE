import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const AttendanceContainer = styled.div`
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

  .attendance-page__title {
    font-size: 28px;
    margin: 0;
    color: ${(props) => props.theme.SECONDARY_1};
    text-align: center;
  }

  .attendance-page__card {
    width: 100%;
    max-width: 480px;
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

  .attendance-page__status-label {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 12px;
    color: ${(props) => props.theme.PRIMARY_1};
    opacity: 0.7;
  }

  .attendance-page__primary-line {
    font-size: 22px;
    font-weight: 600;
    color: ${(props) => props.theme.PRIMARY_1};
    text-align: center;
  }

  .attendance-page__secondary-line {
    font-size: 16px;
    color: ${(props) => props.theme.PRIMARY_1};
    opacity: 0.85;
    text-align: center;
  }

  .attendance-page__duration {
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.theme.PRIMARY_1};
  }

  .attendance-page__action {
    width: 100%;
    height: 64px;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .attendance-page__action--in {
    background-color: ${(props) => props.theme.PRIMARY_2} !important;
    color: ${(props) => props.theme.PRIMARY_1} !important;

    &:disabled {
      opacity: 0.6;
    }
  }

  .attendance-page__action--out {
    background-color: ${(props) => props.theme.PRIMARY_1} !important;
    color: ${(props) => props.theme.PRIMARY_2} !important;
    border: 2px solid ${(props) => props.theme.PRIMARY_2} !important;

    &:disabled {
      opacity: 0.6;
    }
  }

  .attendance-page__hint {
    font-size: 13px;
    color: ${(props) => props.theme.SECONDARY_3};
    text-align: center;
    max-width: 480px;
  }
`;
