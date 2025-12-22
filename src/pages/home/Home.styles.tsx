import styled, { css } from 'styled-components';
import { laptop, mobile, tablet } from '../../util/breakpoints';
import theme from '../../styles/theme';

export const HomeContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 72px;
    padding: 40px;

    .home {
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
                background-image: url('id_tracking.jpg');
            }

            &__order-panel {
                background-image: url('order_shirt.jpg');
            }

            &__title {
                font-family: Inter;
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
