import styled, { css } from 'styled-components';
import theme, { accentAlpha } from '../../styles/theme';
import CbdModal from '../../components/cbd-modal/CbdModal.component';
import { mobile, tablet } from '../../util/breakpoints';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 24px 32px 48px;
    color: ${theme.SECONDARY_1};

    ${mobile(css`
        padding: 16px 12px 32px;
    `)}

    .locations-page {
        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            gap: 16px;

            ${mobile(css`
                flex-direction: column;
                align-items: stretch;
            `)}
        }

        &__title {
            margin: 0;
            color: ${theme.SECONDARY_1};
            font-size: 24px;
            font-weight: 600;
        }

        &__add {
            border-radius: 8px;
            text-transform: none;
            font-weight: 600;
            box-shadow: none;
            background-color: ${theme.PRIMARY_2};
            color: ${theme.PRIMARY_1};

            &:hover {
                background-color: ${theme.PRIMARY_2};
                opacity: 0.9;
                box-shadow: none;
            }
        }

        &__loader,
        &__empty {
            display: flex;
            justify-content: center;
            padding: 48px 0;
            color: ${theme.SECONDARY_2};
        }

        &__table-wrap {
            overflow-x: auto;
        }

        &__table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;

            th,
            td {
                padding: 12px 16px;
                text-align: left;
                border-bottom: 1px solid ${theme.BORDER};
                vertical-align: middle;
            }

            th:last-child,
            td:last-child {
                width: 1%;
                text-align: right;
                white-space: nowrap;
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
                background-color: ${theme.SURFACE_1};
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
                    background-color: ${theme.SURFACE_1};
                    border: 1px solid ${theme.BORDER};
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
                    border-bottom: 1px solid ${theme.SURFACE_2};

                    &:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                        text-align: left;
                        width: 100%;
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

        &__status-chip {
            display: inline-block;
            padding: 2px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;

            &--active {
                background-color: ${theme.ACCENT_SOFT};
                color: ${theme.PRIMARY_2};
                border: 1px solid ${accentAlpha(0.4)};
            }

            &--inactive {
                background-color: ${theme.SURFACE_3};
                color: ${theme.SECONDARY_2};
                border: 1px solid ${theme.SECONDARY_3};
            }
        }

        &__session-chip {
            margin-left: 8px;
            height: 20px;
            font-size: 11px;
            background-color: ${theme.ACCENT_SOFT};
            color: ${theme.PRIMARY_2};
        }

        &__row-actions {
            display: flex;
            gap: 4px;
            justify-content: flex-end;

            .MuiIconButton-root {
                color: ${theme.SECONDARY_2};

                &:hover {
                    color: ${theme.PRIMARY_2};
                    background-color: ${theme.ACCENT_SOFT};
                }
            }

            .locations-page__delete:hover {
                color: ${theme.ERROR_TEXT};
                background-color: ${theme.ERROR_SOFT};
            }
        }
    }
`;

export const LocationsModal = styled(CbdModal)`
    min-width: 640px;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 48px);
    overflow: auto;

    ${tablet(css`
        min-width: unset;
        width: 100%;
    `)}

    .locations-dialog {
        &__form {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .MuiOutlinedInput-root {
                border-radius: 10px;
                background-color: ${theme.SURFACE_2};

                .MuiOutlinedInput-notchedOutline {
                    border-color: ${theme.BORDER_STRONG} !important;
                }

                &:hover .MuiOutlinedInput-notchedOutline {
                    border-color: ${accentAlpha(0.5)} !important;
                }

                &.Mui-focused .MuiOutlinedInput-notchedOutline {
                    border-color: ${theme.PRIMARY_2} !important;
                    border-width: 1px !important;
                }

                input {
                    color: ${theme.SECONDARY_1};
                }
            }

            .MuiInputLabel-root {
                color: ${theme.SECONDARY_2} !important;

                &.Mui-focused {
                    color: ${theme.PRIMARY_2} !important;
                }
            }

            .MuiFormHelperText-root {
                color: ${theme.SECONDARY_2};
            }
        }

        &__method {
            .MuiToggleButton-root {
                text-transform: none;
                font-weight: 600;
                color: ${theme.SECONDARY_2};
                border-color: ${theme.BORDER_STRONG};

                &.Mui-selected {
                    color: ${theme.PRIMARY_1};
                    background-color: ${theme.PRIMARY_2};

                    &:hover {
                        background-color: ${theme.PRIMARY_2};
                        opacity: 0.9;
                    }
                }
            }
        }

        &__qr {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background-color: ${theme.SURFACE_2};
            border-radius: 12px;

            canvas {
                border-radius: 8px;
            }
        }

        &__qr-url {
            font-size: 12px;
            color: ${theme.SECONDARY_2};
            word-break: break-all;
            text-align: center;
            margin: 0;
        }

        &__qr-actions {
            display: flex;
            gap: 12px;

            .MuiButton-root {
                text-transform: none;
                border-radius: 8px;
                font-weight: 600;
                border-color: ${accentAlpha(0.4)};
                color: ${theme.PRIMARY_2};
            }
        }

        &__coords {
            display: flex;
            gap: 12px;

            ${mobile(css`
                flex-direction: column;
            `)}

            > * {
                flex: 1;
            }
        }

        &__active {
            .MuiFormControlLabel-label {
                color: ${theme.SECONDARY_1};
                font-size: 14px;
            }

            .MuiSwitch-switchBase.Mui-checked {
                color: ${theme.PRIMARY_2};
            }

            .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
                background-color: ${theme.PRIMARY_2};
            }
        }

        &__hint {
            font-size: 12px;
            color: ${theme.SECONDARY_2};
            margin: 0;
        }

        &__actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 4px;

            .MuiButton-root {
                text-transform: none;
                border-radius: 8px;
                font-weight: 600;
                padding: 8px 20px;
            }

            .MuiButton-outlined {
                border-color: ${accentAlpha(0.4)};
                color: ${theme.PRIMARY_2};
                background-color: ${theme.ACCENT_SUBTLE};

                &:hover {
                    border-color: ${theme.PRIMARY_2};
                    background-color: ${theme.ACCENT_SOFT};
                }
            }

            .locations-dialog__save {
                background-color: ${theme.PRIMARY_2};
                color: ${theme.PRIMARY_1};

                &:hover {
                    background-color: ${accentAlpha(0.85)};
                }

                &:disabled {
                    background-color: ${theme.SECONDARY_3} !important;
                    color: ${theme.PRIMARY_1};
                    opacity: 0.5;
                }
            }
        }
    }
`;
