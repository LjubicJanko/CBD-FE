import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { Chip } from '@mui/material';
import { mobile } from '../../util/breakpoints';

export const OrderCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  gap: 8px;
  border-radius: 8px;
  background-color: ${theme.SECONDARY_3};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  /* todo responsive */
  width: 380px;
  height: 215px;

  ${mobile(css`
    width: 100%;
  `)}

  &:hover {
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 8px;
  }

  &.order-card--paused {
    background-color: rgba(255, 223, 0, 0.1);
  }

  &.order-card--selected {
    border: 2px solid ${theme.PRIMARY_2};
    box-shadow: inset rgba(0, 0, 0, 0.1) 0px 4px 6px;
  }
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const StatusChip = styled(Chip)<{ $backgroundColor: string }>`
  && {
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    color: white;
    font-size: 0.85rem;
    font-weight: bold;
  }
`;

export const Title = styled.h2`
  font-size: 24px;
  color: ${theme.SECONDARY_1};
  margin: 0;
`;

export const Description = styled.h3`
  font-size: 16px;
  color: ${theme.SECONDARY_1};
  margin: 0;
  overflow: hidden;
  white-space: pre-line;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .order-card__footer {
    &__info {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: left;
      gap: 8px;

      &--priority-value {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
      }
    }
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${theme.SECONDARY_1};
  }
`;

export const PlannedDate = styled.p`
  font-size: 14px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;

  &.order-card__footer__info__planned-ending-date--in-past {
    background-color: #e57373;
    color: white;
  }

  &.order-card__footer__info__planned-ending-date--today {
    background-color: ${theme.PRIMARY_2};
    color: ${theme.PRIMARY_1};
  }
`;
