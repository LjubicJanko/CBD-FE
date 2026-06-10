import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.SECONDARY_2};
  border: 2px solid ${(props) => props.theme.PRIMARY_2};
  color: ${(props) => props.theme.PRIMARY_1};
  box-shadow: 0 2px 8px ${(props) => props.theme.SHADOW};

  ${mobile(css`
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  `)}

  .attendance-card__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .attendance-card__title {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 11px;
    opacity: 0.7;
  }

  .attendance-card__primary {
    font-size: 16px;
    font-weight: 600;
  }

  .attendance-card__secondary {
    font-size: 13px;
    opacity: 0.85;
  }

  .attendance-card__action {
    min-width: 140px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;

    &.attendance-card__action--in {
      background-color: ${(props) => props.theme.PRIMARY_1} !important;
      color: ${(props) => props.theme.PRIMARY_2} !important;
    }

    &.attendance-card__action--out {
      background-color: ${(props) => props.theme.PRIMARY_1} !important;
      color: ${(props) => props.theme.PRIMARY_2} !important;
      border: 2px solid ${(props) => props.theme.PRIMARY_2} !important;
    }
  }
`;
