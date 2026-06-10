import styled, { css } from 'styled-components';
import theme, { withAlpha } from '../../styles/theme';
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
            background-color: ${theme.SURFACE_1};
            border: 1px solid ${theme.BORDER};
            cursor: pointer;
            transition: transform 0.15s ease, background-color 0.15s ease,
                border-color 0.15s ease;
            text-align: center;
            min-height: 200px;

            &:hover {
                transform: translateY(-2px);
                background-color: ${theme.SURFACE_2};
                border-color: ${withAlpha(theme.PRIMARY_2, 0.4)};
            }

            &--platform {
                background-color: ${theme.ACCENT_SUBTLE};
                border: 1px dashed ${withAlpha(theme.PRIMARY_2, 0.33)};

                &:hover {
                    background-color: ${theme.ACCENT_SOFT};
                    border-color: ${theme.PRIMARY_2};
                }
            }
        }

        &__logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
            border-radius: 10px;
            background-color: ${theme.SURFACE_1};
            padding: 8px;
        }

        &__logo-placeholder {
            width: 72px;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            background-color: ${theme.SURFACE_2};
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
