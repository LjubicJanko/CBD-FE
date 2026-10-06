import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import theme, { accentAlpha } from '../../styles/theme';
import { mobile, belowTablet } from '../../util/breakpoints';

export const ReportsContainer = styled.div`
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 28px;

    ${mobile(css`
        padding: 16px;
        gap: 20px;
    `)}

    .reports-page__header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .reports-page__title {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        color: ${theme.SECONDARY_1};
        letter-spacing: -0.5px;
    }

    .reports-page__description {
        margin: 0;
        font-size: 14px;
        color: ${theme.SECONDARY_2};
        line-height: 1.5;
    }

    .reports-page__date-range {
        display: flex;
        align-items: center;
        gap: 12px;

        .MuiOutlinedInput-root {
            font-size: 14px;
            background-color: ${theme.SURFACE_2};
            border-radius: 10px;

            .MuiOutlinedInput-notchedOutline {
                border-color: ${theme.BORDER} !important;
            }

            &:hover .MuiOutlinedInput-notchedOutline {
                border-color: ${accentAlpha(0.5)} !important;
            }

            &.Mui-focused .MuiOutlinedInput-notchedOutline {
                border-color: ${theme.PRIMARY_2} !important;
                border-width: 1px !important;
            }
        }

        .MuiInputLabel-root {
            color: ${theme.SECONDARY_2} !important;
            font-size: 14px;

            &.Mui-focused {
                color: ${theme.PRIMARY_2} !important;
            }
        }

        .MuiSvgIcon-root {
            color: ${theme.SECONDARY_2};
        }

        ${mobile(css`
            flex-direction: column;
            width: 100%;
        `)}
    }
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const SectionHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;

    .section__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: ${theme.SECONDARY_1};
    }

    .section__subtitle {
        margin: 0;
        font-size: 13px;
        color: ${theme.SECONDARY_2};
    }
`;

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
    gap: 12px;

    ${mobile(css`
        grid-template-columns: 1fr;
    `)}
`;

const statCardStyles = css<{ $accent?: boolean }>`
    background-color: ${theme.SURFACE_2};
    border-radius: 12px;
    border: 1px solid ${theme.BORDER};
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition:
        border-color 0.2s,
        background-color 0.2s;

    &:hover {
        border-color: ${accentAlpha(0.25)};
        background-color: ${theme.SURFACE_2};
    }

    ${({ $accent }) =>
        $accent &&
        css`
            border-color: ${accentAlpha(0.38)};
            background-color: ${theme.ACCENT_SUBTLE};
        `}

    .stat-card__label {
        font-size: 12px;
        font-weight: 500;
        color: ${theme.SECONDARY_2};
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .stat-card__value {
        font-size: 20px;
        font-weight: 700;
        color: ${theme.SECONDARY_1};
        font-variant-numeric: tabular-nums;

        ${belowTablet(css`
            font-size: 18px;
        `)}
    }

    .stat-card__breakdown {
        font-size: 12px;
        line-height: 1.3;
        color: ${theme.SECONDARY_2};
    }
`;

export const StatCard = styled.div<{ $accent?: boolean }>`
    ${statCardStyles}
`;

// Real link (focusable, keyboard-activatable) for the admin-only drill-downs.
export const StatCardLink = styled(Link)<{ $accent?: boolean }>`
    ${statCardStyles}
    text-decoration: none;
    cursor: pointer;

    &:hover {
        border-color: ${accentAlpha(0.6)};
    }

    &:focus-visible {
        outline: 2px solid ${theme.PRIMARY_2};
        outline-offset: 2px;
    }
`;

export const PaymentsEntry = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
`;

export const ViewAllLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 20px;
    background-color: ${theme.PRIMARY_2};
    color: ${theme.PRIMARY_1};
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;

    &:hover {
        background-color: ${accentAlpha(0.85)};
    }

    &:focus-visible {
        outline: 2px solid ${theme.SECONDARY_1};
        outline-offset: 2px;
    }
`;

export const ChartCard = styled.div`
    background-color: ${theme.SURFACE_2};
    border-radius: 12px;
    border: 1px solid ${theme.BORDER};
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    * {
        outline: none !important;
    }

    ${mobile(css`
        padding: 16px;
    `)}
`;

export const NoData = styled.p`
    text-align: center;
    color: ${theme.SECONDARY_2};
    font-size: 15px;
    padding: 48px 0;
    margin: 0;
`;
