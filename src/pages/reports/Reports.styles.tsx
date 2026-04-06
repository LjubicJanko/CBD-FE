import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
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
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 10px;

            .MuiOutlinedInput-notchedOutline {
                border-color: rgba(255, 255, 255, 0.12) !important;
            }

            &:hover .MuiOutlinedInput-notchedOutline {
                border-color: ${theme.PRIMARY_2}80 !important;
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
    align-items: baseline;
    gap: 12px;

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
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.2s, background-color 0.2s;

    &:hover {
        border-color: ${theme.PRIMARY_2}40;
        background-color: rgba(255, 255, 255, 0.07);
    }

    ${({ $accent }) =>
        $accent &&
        css`
            border-color: ${theme.PRIMARY_2}60;
            background-color: rgba(212, 255, 0, 0.04);
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
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

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
