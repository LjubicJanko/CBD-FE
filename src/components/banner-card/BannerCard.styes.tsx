import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile } from '../../util/breakpoints';

export const BannerCardContainer = styled.div`
    padding: 12px;
    border-radius: 10px;
    background-color: ${theme.SECONDARY_2};
    max-width: 300px;
    position: relative;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 16px;

    ${mobile(css`
        max-width: 100%;
    `)}

    &.banner-card--unpublished {
        opacity: 0.7;
    }

    .banner-card {
        flex-direction: column;

        &__header {
            display: flex;
            width: 100%;
            justify-content: space-between;

            &--published {
                color: ${theme.PRIMARY_2};
            }
            &--unpublished {
                color: ${theme.SECONDARY_3};
            }

            &__actions {
                &--edit,
                &--delete {
                    min-width: unset;
                    padding: 0;
                    color: ${theme.PRIMARY_1};
                }
            }
        }

        &__content {
            color: ${theme.PRIMARY_1};
            flex: 1;
        }

        &__locations {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        &__actions {
            display: flex;
            width: 100%;
            align-items: flex-end;
            justify-content: flex-end;

            &__publish {
                background-color: ${theme.PRIMARY_2};
                color: ${theme.PRIMARY_1};
                border-color: ${theme.PRIMARY_2};
            }

            &__unpublish {
                color: ${theme.SECONDARY_1};
                border-color: ${theme.SECONDARY_1};
            }
        }
    }
`;
