import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile } from '../../util/breakpoints';

export const BannerPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 32px;

    .banners-page {
        &__heading {
            display: flex;

            &__add-button {
                color: ${theme.PRIMARY_1};
                background-color: ${theme.PRIMARY_2};
                border-radius: 20px;
                width: fit-content;
                ${mobile(css`
                    width: 100%;
                `)}
            }
        }

        &__content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: 100%;
            grid-column-gap: 16px;
            row-gap: 16px;

            ${mobile(css`
                display: flex;
                flex-direction: column;
            `)}
        }
    }
`;
