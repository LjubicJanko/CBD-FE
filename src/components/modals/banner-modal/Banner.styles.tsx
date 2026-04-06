import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const BannerContainer = styled(CbdModal)`
    min-width: 250px;

    &.banner-modal {
        h2 {
            font-weight: 700;
            font-size: 20px;
            color: ${theme.PRIMARY_2};
        }
    }

    .banner-modal {
        &__form {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            &__fields {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 16px;

                &__title,
                &__text {
                    width: 100%;
                }

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
                }

                .MuiInputLabel-root {
                    color: ${theme.SECONDARY_2} !important;

                    &.Mui-focused {
                        color: ${theme.PRIMARY_2} !important;
                    }
                }

                &__chips {
                    display: flex;
                    gap: 8px;

                    &__chip {
                        white-space: nowrap;
                        width: fit-content;
                        color: ${theme.SECONDARY_1};
                        border-color: ${theme.SECONDARY_2};

                        &--selected {
                            color: ${theme.PRIMARY_1};
                            background-color: ${theme.PRIMARY_2} !important;
                            border-color: ${theme.PRIMARY_2};
                        }
                    }
                }
            }

            &__actions {
                display: flex;
                width: 100%;
                justify-content: space-between;
                margin-top: 32px;

                &__cancel {
                    color: ${theme.SECONDARY_2};
                    border-color: ${theme.SECONDARY_2};
                }

                &__confirm {
                    background-color: ${theme.PRIMARY_2};
                    color: ${theme.PRIMARY_1};
                    font-weight: 700;

                    &:hover {
                        background-color: ${theme.PRIMARY_2}D9;
                    }
                }
            }
        }
    }
`;
