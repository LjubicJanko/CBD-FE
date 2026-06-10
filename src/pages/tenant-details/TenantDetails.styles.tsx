import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { tablet } from '../../util/breakpoints';

export const TenantDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 24px;
    width: 100%;

    ${tablet(css`
        padding: 16px;
        gap: 16px;
    `)}

    .tenant-details {
        &__header {
            display: flex;
            flex-direction: column;
            gap: 8px;

            h2 {
                margin: 0;
                color: ${theme.SECONDARY_1};
                font-size: 24px;
                font-weight: 700;
            }
        }

        &__back {
            align-self: flex-start;
            color: ${theme.SECONDARY_2};
            text-transform: none;
            font-size: 13px;
            font-weight: 600;
            padding: 4px 8px;

            &:hover {
                color: ${theme.SECONDARY_1};
                background-color: ${theme.SURFACE_1};
            }
        }

        &__section {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 24px;
            background-color: ${theme.SURFACE_2};
            border: 1px solid ${theme.BORDER};
            border-radius: 12px;
            max-width: 560px;
        }

        &__not-found {
            color: ${theme.SECONDARY_2};
            font-size: 14px;
        }
    }
`;
