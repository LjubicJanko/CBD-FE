import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { mobile, tablet } from '../../util/breakpoints';

export const PlatformContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 32px;
    gap: 32px;
    width: 100%;

    ${tablet(css`
        padding: 16px;
        gap: 16px;
    `)}

    .platform {
        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            h2 {
                margin: 0;
                color: ${theme.SECONDARY_1};
                font-size: 24px;
                font-weight: 700;
            }
        }

        &__layout {
            display: grid;
            grid-template-columns: minmax(320px, 400px) 1fr;
            gap: 24px;
            align-items: start;

            ${tablet(css`
                grid-template-columns: 1fr;
            `)}
        }

        &__section {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 24px;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            min-width: 0;

            ${mobile(css`
                padding: 16px;
            `)}

            h3 {
                margin: 0;
                color: ${theme.PRIMARY_2};
                font-size: 20px;
                font-weight: 700;
            }
        }

        &__table-wrap {
            overflow-x: auto;
        }

        &__form {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .MuiOutlinedInput-root {
                border-radius: 10px;
                background-color: rgba(255, 255, 255, 0.05);

                .MuiOutlinedInput-notchedOutline {
                    border-color: rgba(255, 255, 255, 0.2) !important;
                }

                &:hover .MuiOutlinedInput-notchedOutline {
                    border-color: ${theme.PRIMARY_2}80 !important;
                }

                &.Mui-focused .MuiOutlinedInput-notchedOutline {
                    border-color: ${theme.PRIMARY_2} !important;
                    border-width: 1px !important;
                }

                input {
                    color: ${theme.SECONDARY_1};
                }

                .MuiIconButton-root {
                    color: ${theme.SECONDARY_2};
                }
            }

            .MuiInputLabel-root {
                color: ${theme.SECONDARY_2} !important;

                &.Mui-focused {
                    color: ${theme.PRIMARY_2} !important;
                }
            }

            .MuiSelect-select {
                color: ${theme.SECONDARY_1};
            }

            .MuiSelect-icon {
                color: ${theme.SECONDARY_2};
            }
        }

        &__submit {
            padding: 12px 32px;
            border-radius: 10px;
            background-color: ${theme.PRIMARY_2};
            color: ${theme.PRIMARY_1};
            font-weight: 700;
            font-size: 14px;

            &:hover {
                background-color: ${theme.PRIMARY_2}D9;
            }

            &:disabled {
                background-color: ${theme.SECONDARY_3} !important;
                color: ${theme.PRIMARY_1};
                opacity: 0.5;
            }
        }

        &__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            table-layout: auto;

            th,
            td {
                padding: 12px 16px;
                text-align: left;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                vertical-align: middle;
            }

            th:last-child,
            td:last-child {
                width: 100%;
            }

            th {
                color: ${theme.SECONDARY_2};
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            td {
                color: ${theme.SECONDARY_1};
                font-size: 14px;
            }

            tr:hover td {
                background-color: rgba(255, 255, 255, 0.03);
            }

            ${mobile(css`
                display: block;

                thead {
                    display: none;
                }

                tbody,
                tr,
                td {
                    display: block;
                    width: 100%;
                }

                tr {
                    background-color: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                }

                tr:hover td {
                    background-color: transparent;
                }

                td {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

                    &:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }

                    &::before {
                        content: attr(data-label);
                        color: ${theme.SECONDARY_2};
                        font-size: 11px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        flex-shrink: 0;
                    }
                }
            `)}
        }

        &__actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;

            ${mobile(css`
                justify-content: flex-end;
                flex: 1;
            `)}

            .MuiButtonBase-root {
                min-width: auto;
                padding: 6px 14px;
                font-size: 12px;
                font-weight: 600;
                line-height: 1.4;
                border-radius: 6px;
                text-transform: none;
                letter-spacing: 0.2px;
                white-space: nowrap;
            }

            .MuiButton-outlined {
                border-color: ${theme.PRIMARY_2}66;
                color: ${theme.PRIMARY_2};
                background-color: rgba(212, 255, 0, 0.04);

                &:hover {
                    border-color: ${theme.PRIMARY_2};
                    background-color: rgba(212, 255, 0, 0.12);
                }
            }

            .MuiButton-outlinedError {
                border-color: #ff6b6b66;
                color: #ff8a8a;
                background-color: rgba(255, 107, 107, 0.04);

                &:hover {
                    border-color: #ff6b6b;
                    background-color: rgba(255, 107, 107, 0.12);
                }
            }
        }

        &__logo-picker {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;

            .MuiButtonBase-root {
                min-width: auto;
                padding: 6px 14px;
                font-size: 12px;
                font-weight: 600;
                line-height: 1.4;
                border-radius: 6px;
                text-transform: none;
                letter-spacing: 0.2px;
            }

            .MuiButton-outlined {
                border-color: ${theme.PRIMARY_2}66;
                color: ${theme.PRIMARY_2};
                background-color: rgba(212, 255, 0, 0.04);

                &:hover {
                    border-color: ${theme.PRIMARY_2};
                    background-color: rgba(212, 255, 0, 0.12);
                }
            }

            .MuiButton-text {
                color: ${theme.SECONDARY_2};

                &:hover {
                    color: ${theme.SECONDARY_1};
                    background-color: rgba(255, 255, 255, 0.04);
                }
            }
        }

        &__logo-hint {
            color: ${theme.SECONDARY_2};
            font-size: 12px;
        }

        &__logo-thumb {
            width: 40px;
            height: 40px;
            object-fit: contain;
            border-radius: 6px;
            background-color: rgba(255, 255, 255, 0.08);
            padding: 4px;
            display: block;
        }

        &__logo-missing {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            color: ${theme.SECONDARY_2};
            background-color: rgba(255, 255, 255, 0.04);
            border-radius: 6px;
            font-size: 16px;
        }

        &__deactivate-dialog {
            display: flex;
            flex-direction: column;
            gap: 20px;
            color: ${theme.SECONDARY_1};
            min-width: 320px;

            p {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
            }

            &__actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;

                .MuiButton-root {
                    text-transform: none;
                    border-radius: 8px;
                }
            }
        }

        &__inactive-pill {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 8px;
            border-radius: 999px;
            background-color: rgba(255, 107, 107, 0.15);
            color: #ff8a8a;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }

    .platform__table tr.inactive td {
        opacity: 0.55;
    }
`;
