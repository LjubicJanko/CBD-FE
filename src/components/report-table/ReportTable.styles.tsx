import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import reportChipStyles from './reportChip.styles';
import { mobile, tablet } from '../../util/breakpoints';

// Shared by the payments and unpaid-orders report tabs. Filter chips, sort
// select and pagination deliberately mirror the orders page (FiltersModal /
// DashboardHeader): outlined chips, lime selected state, lime page buttons.
export const ReportTableContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: ${theme.SECONDARY_1};

    .report-table__toolbar {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px 24px;

        ${tablet(css`
            flex-direction: column;
            align-items: stretch;
        `)}
    }

    .report-table__field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
    }

    .report-table__label {
        font-size: 12px;
        font-weight: 500;
        color: ${theme.SECONDARY_2};
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .report-table__chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    ${reportChipStyles}

    .report-table__select {
        min-width: 220px;
        font-size: 14px;

        .MuiSelect-icon {
            color: ${theme.SECONDARY_1};
        }

        ${tablet(css`
            width: 100%;
        `)}
    }

    .report-table__note {
        margin: 0;
        font-size: 12px;
        color: ${theme.SECONDARY_2};
    }

    .report-table__state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        min-height: 160px;
        padding: 24px 16px;
        border: 1px dashed ${theme.BORDER_STRONG};
        border-radius: 12px;
        color: ${theme.SECONDARY_2};
        text-align: center;
    }

    .report-table__state--error {
        color: ${theme.ERROR_TEXT};
        border-color: ${theme.ERROR};
    }

    .report-table__retry.MuiButton-root {
        color: ${theme.PRIMARY_2};
        border-color: ${theme.PRIMARY_2};
        text-transform: none;
    }

    /* The table body scrolls inside the viewport while the header stays put. */
    .report-table__scroll {
        overflow: auto;
        max-height: max(320px, calc(100vh - 520px));
        border: 1px solid ${theme.BORDER};
        border-radius: 12px;
        transition: opacity 0.2s;

        &[aria-busy='true'] {
            opacity: 0.55;
        }
    }

    .report-table__table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }

    .report-table__header-cell {
        position: sticky;
        top: 0;
        z-index: 1;
        padding: 10px 16px;
        background-color: ${theme.SURFACE_SOLID};
        border-bottom: 1px solid ${theme.BORDER_STRONG};
        color: ${theme.SECONDARY_1};
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        white-space: nowrap;
    }

    .report-table__row {
        &:nth-of-type(even) {
            background-color: ${theme.SURFACE_1};
        }

        &:hover {
            background-color: ${theme.SURFACE_3};
        }

        &:last-child .report-table__cell {
            border-bottom: none;
        }
    }

    .report-table__cell {
        padding: 12px 16px;
        border-bottom: 1px solid ${theme.BORDER};
        color: ${theme.SECONDARY_1};
        font-size: 14px;
        line-height: 1.35;
        vertical-align: middle;
    }

    .report-table__cell--order {
        min-width: 200px;
    }

    .report-table__cell--date {
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
    }

    .report-table__header-cell--amount,
    .report-table__cell--amount {
        text-align: right;
    }

    .report-table__cell--amount {
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
        font-weight: 600;
    }

    .report-table__cell--note {
        max-width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${theme.SECONDARY_2};
    }

    .report-table__order-link {
        color: ${theme.PRIMARY_2};
        font-weight: 600;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }

        &:focus-visible {
            outline: 2px solid ${theme.PRIMARY_2};
            outline-offset: 2px;
        }
    }

    .report-table__order-tracking {
        display: block;
        font-size: 12px;
        color: ${theme.SECONDARY_2};
    }

    .report-table__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px 16px;

        ${mobile(css`
            flex-direction: column;
        `)}
    }

    .report-table__total {
        margin: 0;
        font-size: 16px;
        text-transform: uppercase;
        color: ${theme.PRIMARY_2};
    }

    .report-table__pagination {
        button {
            color: ${theme.PRIMARY_2};

            &.Mui-selected {
                background-color: ${theme.PRIMARY_2};
                color: ${theme.PRIMARY_1};
            }
        }
    }

    /* Compact summary strip: narrower tracks so the cards fit in one row. */
    .report-table__summary {
        grid-template-columns: repeat(auto-fill, minmax(172px, 1fr));

        .stat-card__value {
            font-size: 18px;
            white-space: nowrap;
        }
    }

    .report-table__summary .stat-card__info {
        margin-left: 2px;
        padding: 0;
        font-size: 14px;
        color: ${theme.SECONDARY_2};
        vertical-align: middle;

        &:hover,
        &:focus-visible {
            color: ${theme.PRIMARY_2};
        }
    }

    /* Below the tablet breakpoint every row becomes a labelled card. */
    ${tablet(css`
        .report-table__scroll {
            overflow: visible;
            max-height: none;
            border: none;
            border-radius: 0;
        }

        .report-table__table,
        .report-table__table tbody {
            display: block;
        }

        .report-table__table thead {
            display: none;
        }

        .report-table__row {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            padding: 8px 0;
            border: 1px solid ${theme.BORDER};
            border-radius: 12px;
            background-color: ${theme.SURFACE_2};

            &:nth-of-type(even) {
                background-color: ${theme.SURFACE_2};
            }
        }

        .report-table__cell {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 12px;
            padding: 4px 14px;
            border: none;
            text-align: right;

            &::before {
                content: attr(data-label);
                flex-shrink: 0;
                font-size: 12px;
                font-weight: 500;
                color: ${theme.SECONDARY_2};
                text-transform: uppercase;
                letter-spacing: 0.5px;
                text-align: left;
            }
        }

        .report-table__cell--order {
            min-width: 0;
        }

        .report-table__cell--note {
            max-width: none;
            white-space: normal;
        }
    `)}

    ${mobile(css`
        .report-table__summary {
            grid-template-columns: repeat(2, 1fr);

            .stat-card__value {
                font-size: 16px;
            }
        }
    `)}
`;
