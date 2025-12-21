import styled from 'styled-components';
import theme from '../../styles/theme';

export const BannerCardContainer = styled.div`
    padding: 8px;
    border-radius: 20px;
    background-color: ${theme.SECONDARY_2};
    max-width: 300px;
    cursor: pointer;
    position: relative;

    /* &:hover {
        transform: translateY(-2px);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 6px 8px;

        opacity: 0.7;
    } */

    .banner-card {
        display: flex;
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
        }
        &__actions {
            display: flex;
            align-items: flex-end;
            &__publish,
            &__unpublish {
                margin-top: 16px;
            }

            &__publish {
                background-color: ${theme.PRIMARY_2};
                color: ${theme.PRIMARY_1};
                border-color: ${theme.PRIMARY_2};
            }
            
            &__unpublish {
                color: ${theme.SECONDARY_3};
            }
        }
    }
`;
