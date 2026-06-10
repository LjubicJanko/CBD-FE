import styled from 'styled-components';
import theme, { accentAlpha } from '../../styles/theme';

export const TenantDetailsForm = styled.div`
    width: 100%;

    .tenant-form {
        &__fields {
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-width: 480px;

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

                &.Mui-disabled {
                    background-color: ${theme.SURFACE_1};

                    input {
                        -webkit-text-fill-color: ${theme.SECONDARY_2};
                    }

                    .MuiOutlinedInput-notchedOutline {
                        border-color: ${theme.BORDER} !important;
                    }
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

            .MuiSelect-select {
                color: ${theme.SECONDARY_1};
            }

            .MuiSelect-icon {
                color: ${theme.SECONDARY_2};
            }
        }

        &__social {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-width: 480px;
        }

        &__section-label {
            color: ${theme.SECONDARY_2};
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        &__features {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 480px;
        }

        &__logo {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        &__logo-label {
            color: ${theme.SECONDARY_2};
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        &__logo-row {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;

            .MuiButtonBase-root {
                min-width: auto;
                padding: 6px 14px;
                font-size: 12px;
                font-weight: 600;
                border-radius: 6px;
                text-transform: none;
                letter-spacing: 0.2px;
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
        }

        &__logo-thumb {
            width: 48px;
            height: 48px;
            object-fit: contain;
            border-radius: 6px;
            background-color: ${theme.SURFACE_3};
            padding: 4px;
            display: block;
        }

        &__logo-missing {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            color: ${theme.SECONDARY_2};
            background-color: ${theme.SURFACE_1};
            border-radius: 6px;
            font-size: 16px;
        }

        &__logo-hint {
            color: ${theme.SECONDARY_2};
            font-size: 12px;
        }

        &__submit {
            align-self: flex-start;
            padding: 12px 32px;
            border-radius: 10px;
            background-color: ${theme.PRIMARY_2};
            color: ${theme.PRIMARY_1};
            font-weight: 700;
            font-size: 14px;
            text-transform: none;

            &:hover {
                background-color: ${accentAlpha(0.85)};
            }

            &:disabled {
                background-color: ${theme.SECONDARY_3} !important;
                color: ${theme.PRIMARY_1};
                opacity: 0.5;
            }
        }

        &__colors {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-width: 480px;
        }

        &__color {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        &__color-label {
            color: ${theme.SECONDARY_1};
            font-size: 14px;
        }

        &__color-row {
            display: flex;
            align-items: center;
            gap: 12px;

            .MuiButton-outlined {
                min-width: auto;
                padding: 6px 14px;
                font-size: 12px;
                font-weight: 600;
                border-radius: 6px;
                text-transform: none;
                border-color: ${accentAlpha(0.4)};
                color: ${theme.PRIMARY_2};
                background-color: ${theme.ACCENT_SUBTLE};

                &:hover {
                    border-color: ${theme.PRIMARY_2};
                    background-color: ${theme.ACCENT_SOFT};
                }
            }
        }

        &__color-swatch {
            appearance: none;
            -webkit-appearance: none;
            width: 44px;
            height: 36px;
            padding: 0;
            border: 1px solid ${theme.BORDER_STRONG};
            border-radius: 8px;
            background: none;
            cursor: pointer;
            flex-shrink: 0;

            &::-webkit-color-swatch-wrapper {
                padding: 4px;
            }
            &::-webkit-color-swatch {
                border: none;
                border-radius: 5px;
            }
            &::-moz-color-swatch {
                border: none;
                border-radius: 5px;
            }
        }

        &__colors-hint {
            color: ${theme.SECONDARY_2};
            font-size: 12px;
        }

        &__colors-warning {
            color: ${theme.WARNING};
            background-color: ${theme.WARNING_SOFT};
            border: 1px solid ${theme.WARNING};
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 12px;
        }
    }
`;
