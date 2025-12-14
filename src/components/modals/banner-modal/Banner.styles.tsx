import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const BannerContainer = styled(CbdModal)`
    min-width: 250px;
    background-color: ${theme.SECONDARY_2};

    &.banner-modal {
        h2 {
            font-weight: 400;
            font-size: 20px;
            color: ${theme.SECONDARY_1};
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

                &__chips {
                    display: flex;
                    gap: 8px;

                    &__chip {
                        white-space: nowrap;
                        width: fit-content;
                        color: ${theme.SECONDARY_1};
                        border-color: ${theme.SECONDARY_1};

                        &--selected {
                            color: ${theme.PRIMARY_1};
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
                    color: ${theme.SECONDARY_1};
                }

                &__confirm {
                    background-color: ${theme.PRIMARY_2};
                    color: ${theme.PRIMARY_1};
                }
            }
        }
    }
`;
