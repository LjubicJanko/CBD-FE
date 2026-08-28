import styled, { css } from 'styled-components';
import { mobile } from '../../util/breakpoints';

export const AttendanceBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 14px;
    height: 34px;
    border-radius: 20px;
    cursor: pointer;
    font-family: 'Afacad', serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    transition: opacity 0.15s ease;
    outline: none;
    border: 2px solid transparent;

    &:hover:not(:disabled) {
        opacity: 0.78;
    }

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    &:disabled {
        cursor: default;
        opacity: 0.55;
    }

    .attendance-btn__icon {
        font-size: 18px !important;
        flex-shrink: 0;
    }

    /* Checked in, outline, lime text */
    &.attendance-btn--out {
        background-color: transparent;
        color: ${(p) => p.theme.PRIMARY_2};
        border-color: ${(p) => p.theme.PRIMARY_2};
    }

    ${mobile(css`
        padding: 0;
        width: 34px;
        height: 34px;
        border-radius: 50%;

        .attendance-btn__text {
            display: none;
        }
    `)}
`;
