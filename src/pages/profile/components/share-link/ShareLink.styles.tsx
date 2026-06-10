import styled, { css } from 'styled-components';
import theme, { withAlpha } from '../../../../styles/theme';
import { mobile, tablet } from '../../../../util/breakpoints';

export const ShareLinkContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px;
    border-radius: 12px;
    background-color: ${theme.SURFACE_2};
    border: 1px solid ${theme.BORDER};
    max-width: 640px;

    ${tablet(css`
        max-width: 100%;
    `)}

    ${mobile(css`
        padding: 20px;
    `)}

    h3 {
        margin: 0;
        color: ${theme.PRIMARY_2};
        font-size: 20px;
        font-weight: 700;
    }

    .share-link {
        &__description {
            color: ${theme.SECONDARY_2};
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
        }

        &__url-row {
            display: flex;
            gap: 8px;
            align-items: stretch;

            .MuiTextField-root {
                flex: 1;
            }

            .MuiOutlinedInput-root {
                border-radius: 10px;
                background-color: ${theme.SURFACE_2};

                .MuiOutlinedInput-notchedOutline {
                    border-color: ${theme.BORDER_STRONG} !important;
                }

                input {
                    color: ${theme.SECONDARY_1};
                    font-family: ui-monospace, SFMono-Regular, Menlo,
                        Consolas, monospace;
                    font-size: 13px;
                }
            }

            .MuiIconButton-root {
                border-radius: 10px;
                border: 1px solid ${withAlpha(theme.PRIMARY_2, 0.4)};
                background-color: ${theme.ACCENT_SUBTLE};
                color: ${theme.PRIMARY_2};
                padding: 0 16px;

                &:hover {
                    border-color: ${theme.PRIMARY_2};
                    background-color: ${theme.ACCENT_SOFT};
                }
            }
        }

        &__qr {
            display: flex;
            justify-content: center;
            padding: 16px;
            background-color: ${theme.SECONDARY_1};
            border-radius: 12px;
            width: fit-content;
            align-self: center;
        }

        &__download {
            align-self: center;
            padding: 10px 24px;
            border-radius: 10px;
            border-color: ${withAlpha(theme.PRIMARY_2, 0.4)};
            color: ${theme.PRIMARY_2};
            background-color: ${theme.ACCENT_SUBTLE};
            text-transform: none;
            font-weight: 600;

            &:hover {
                border-color: ${theme.PRIMARY_2};
                background-color: ${theme.ACCENT_SOFT};
            }
        }
    }
`;
