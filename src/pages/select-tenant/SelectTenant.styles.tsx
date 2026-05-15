import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile, tablet } from '../../util/breakpoints';

export const SelectTenantContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 32px;

    ${tablet(css`
        padding: 24px 16px;
    `)}

    .select-tenant {
        &__heading {
            text-align: center;
            margin-bottom: 8px;

            h1 {
                margin: 0;
                color: ${theme.SECONDARY_1};
                font-size: 28px;
                font-weight: 700;
            }
        }

        &__subtitle {
            text-align: center;
            color: ${theme.SECONDARY_2};
            font-size: 14px;
            margin-bottom: 40px;
        }

        &__grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;

            ${mobile(css`
                grid-template-columns: 1fr;
            `)}
        }

        &__card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 32px 16px;
            border-radius: 14px;
            background-color: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            cursor: pointer;
            transition: transform 0.15s ease, background-color 0.15s ease,
                border-color 0.15s ease;
            text-align: center;
            min-height: 200px;

            &:hover {
                transform: translateY(-2px);
                background-color: rgba(255, 255, 255, 0.06);
                border-color: ${theme.PRIMARY_2}66;
            }

            &--platform {
                background-color: rgba(212, 255, 0, 0.05);
                border: 1px dashed ${theme.PRIMARY_2}55;

                &:hover {
                    background-color: rgba(212, 255, 0, 0.1);
                    border-color: ${theme.PRIMARY_2};
                }
            }
        }

        &__logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.04);
            padding: 8px;
        }

        &__logo-placeholder {
            width: 72px;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.05);
            color: ${theme.SECONDARY_2};
            font-size: 28px;
            font-weight: 700;
            text-transform: uppercase;
        }

        &__name {
            color: ${theme.SECONDARY_1};
            font-size: 18px;
            font-weight: 700;
            margin: 0;
        }

        &__slug {
            color: ${theme.SECONDARY_2};
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        &__platform-icon {
            color: ${theme.PRIMARY_2};
            font-size: 56px !important;
        }

        &__platform-label {
            color: ${theme.PRIMARY_2};
            font-weight: 700;
            font-size: 16px;
        }
    }
`;
