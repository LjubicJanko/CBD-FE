import styled, { css } from 'styled-components';
import theme, { accentAlpha } from '../../styles/theme';
import { mobile, belowTablet, tablet } from '../../util/breakpoints';

export const ReportsContainer = styled.div`
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 40px;

    ${mobile(css`
        padding: 16px;
        gap: 24px;
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
    gap: 20px;
`;

export const SectionHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    .section__title {
        margin: 0;
        font-size: 20px;
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
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    ${tablet(css`
        grid-template-columns: repeat(2, 1fr);
    `)}

    ${mobile(css`
        grid-template-columns: 1fr;
    `)}
`;

export const StatCard = styled.div<{ $accent?: boolean }>`
    background-color: ${theme.SURFACE_2};
    border-radius: 12px;
    border: 1px solid ${theme.BORDER};
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.2s, background-color 0.2s;

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
        font-size: 24px;
        font-weight: 700;
        color: ${theme.SECONDARY_1};

        ${belowTablet(css`
            font-size: 20px;
        `)}
    }

    .stat-card__breakdown {
        font-size: 13px;
        color: ${theme.SECONDARY_2};
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
