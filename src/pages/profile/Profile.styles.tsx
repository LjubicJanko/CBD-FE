import styled, { css } from 'styled-components';
import theme, { withAlpha } from '../../styles/theme';
import { tablet } from '../../util/breakpoints';

export const ProfilePageContainer = styled.div`
  display: grid;
  grid-template-areas: 'cards panel';
  grid-template-columns: 200px 1fr;
  padding: 32px;
  gap: 32px;
  width: 100%;

  ${tablet(css`
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  `)}

  .profile {
    &__cards {
      grid-area: cards;
      display: flex;
      flex-direction: column;
      gap: 16px;

      ${tablet(css`
        flex-direction: row;
        align-items: center;
        overflow-x: auto;
        gap: 8px;
      `)}

      h3 {
        font-size: 24px;
        font-weight: 700;
        color: ${theme.SECONDARY_1};
        padding-bottom: 8px;
        margin: 0;

        ${tablet(css`
          display: none;
        `)}
      }
    }

    &__group {
      display: flex;
      flex-direction: column;
      gap: 4px;

      ${tablet(css`
        flex-direction: row;
        gap: 8px;
      `)}
    }

    &__group-label {
      color: ${theme.SECONDARY_2};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 0 16px 4px;

      ${tablet(css`
        display: none;
      `)}
    }

    &__tab {
      color: ${theme.SECONDARY_2};
      text-transform: none;
      font-size: 14px;
      font-weight: 500;
      justify-content: flex-start;
      padding: 10px 16px;
      border-radius: 8px;
      white-space: nowrap;
      transition: all 0.2s ease;

      .MuiButton-startIcon {
        color: inherit;
      }

      &:hover {
        background-color: ${theme.SURFACE_2};
        color: ${theme.SECONDARY_1};
      }

      &.selected {
        background-color: ${theme.ACCENT_SOFT};
        color: ${theme.PRIMARY_2};
        font-weight: 700;
        border: none;
        border-left: 3px solid ${theme.PRIMARY_2};
        border-radius: 0 8px 8px 0;

        ${tablet(css`
          border-left: none;
          border-bottom: 2px solid ${theme.PRIMARY_2};
          border-radius: 8px 8px 0 0;
        `)}
      }
    }

    &__tab-select {
      width: 100%;

      .MuiSelect-select {
        color: ${theme.SECONDARY_1};
      }

      .MuiSelect-icon {
        color: ${theme.SECONDARY_2};
      }

      .MuiOutlinedInput-notchedOutline {
        border-color: ${theme.BORDER_STRONG};
      }

      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${withAlpha(theme.PRIMARY_2, 0.5)};
      }

      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: ${theme.PRIMARY_2};
      }
    }

    &__panel {
      grid-area: panel;
    }
  }
`;
