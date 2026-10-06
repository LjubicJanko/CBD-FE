import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile, tablet } from '../../util/breakpoints';
import { ReportsContainer } from '../reports/Reports.styles';

// Compact variant of the Reports page shell: title and date range share a row
// so the table starts as high on the screen as possible.
export const PaymentsReportContainer = styled(ReportsContainer)`
    gap: 14px;
    padding-top: 16px;
    padding-bottom: 16px;

    .reports-page__header {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px 24px;

        ${tablet(css`
            flex-direction: column;
            align-items: stretch;
        `)}
    }

    .reports-page__heading {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .reports-page__back {
        font-size: 14px;
        color: ${theme.PRIMARY_2};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }

        &:focus-visible {
            outline: 2px solid ${theme.PRIMARY_2};
            outline-offset: 2px;
        }
    }

    .reports-page__title {
        font-size: 26px;
    }

    .reports-page__error {
        width: 100%;
        margin: 0;
        font-size: 13px;
        color: ${theme.ERROR_TEXT};
    }

    .reports-page__tabs {
        border-bottom: 1px solid ${theme.BORDER};
    }

    ${mobile(css`
        padding: 12px 16px;
        gap: 12px;

        .reports-page__title {
            font-size: 22px;
        }

        .reports-page__date-range {
            align-items: stretch;

            .MuiFormControl-root {
                width: 100%;
            }
        }
    `)}
`;
