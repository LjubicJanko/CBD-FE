import styled, { css } from 'styled-components';
import { laptop, mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const HomeContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 72px;
    padding: 40px;

    &.home--loading {
        align-items: center;
        justify-content: center;
        min-height: 50vh;
    }

    .home {
        &__landing {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
            padding: 40px 24px;

            &__logo {
                width: 120px;
                height: 120px;
                object-fit: contain;
            }

            &__name {
                margin: 0;
                color: ${theme.SECONDARY_1};
                font-size: 28px;
                font-weight: 700;
            }

            &__subtitle {
                margin: 0;
                color: ${theme.SECONDARY_2};
                font-size: 15px;
            }

            &__login {
                margin-top: 8px;
                padding: 12px 40px;
                border-radius: 10px;
                background-color: ${theme.PRIMARY_2};
                color: ${theme.PRIMARY_1};
                font-weight: 700;
                font-size: 14px;
                text-transform: none;

                &:hover {
                    background-color: ${theme.PRIMARY_2}D9;
                }
            }
        }

        &__sections {
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 72px;
            padding: 40px;

            ${laptop(css`
                gap: 48px;
                padding: 32px;
            `)}

            ${tablet(css`
                flex-direction: row;
                gap: 8px;
                height: 80vh;
                padding: 0;
            `)}

            ${mobile(css`
                flex-direction: column;
                max-height: 80vh;
                padding-top: 16px;
            `)}

            &__tracking-panel {
                background-image: url('/id_tracking.jpg');
            }

            &__order-panel {
                background-image: url('/order_shirt.jpg');
            }

            &__title {
                font-family: 'Afacad', serif;
                font-size: 14px;
                font-weight: 300;
                text-align: left;
                text-decoration-skip-ink: none;
                color: ${theme.SECONDARY_1};
                margin-top: 30px;
                margin-bottom: 60px;

                ${mobile(css`
                    margin-top: 18px;
                    margin-bottom: 27px;
                    font-weight: 200;
                `)}
            }
        }
    }
`;
