import styled, { css } from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';
import { tablet } from '../../../util/breakpoints';

export const CombineModalContainer = styled(CbdModal)`
    background-color: ${theme.PRIMARY_1};
    width: 900px;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;

    ${tablet(css`
        width: 100%;
    `)}

    &.combine-modal {
        h2 {
            color: ${theme.SECONDARY_1};
            font-size: 20px;
            font-weight: 400;
        }
    }

    .extension-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 400px;
        overflow-y: auto;

        &__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-radius: 8px;
            background-color: ${theme.SECONDARY_2};
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
                background-color: ${theme.SECONDARY_3};
            }

            &__info {
                display: flex;
                flex-direction: column;
                gap: 4px;

                &__name {
                    color: ${theme.SECONDARY_1};
                    font-weight: 600;
                    font-size: 14px;
                }

                &__tracking {
                    color: ${theme.PRIMARY_2};
                    font-size: 12px;
                }

                &__description {
                    color: ${theme.SECONDARY_1};
                    font-size: 12px;
                    opacity: 0.7;
                }
            }
        }

        &__empty {
            color: ${theme.SECONDARY_1};
            text-align: center;
            padding: 24px;
            opacity: 0.7;
        }
    }

    .combine-view {
        display: flex;
        flex-direction: column;
        gap: 16px;

        &__columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;

            ${tablet(css`
                grid-template-columns: 1fr;
            `)}
        }

        &__order-card {
            padding: 12px;
            border-radius: 8px;
            background-color: ${theme.SECONDARY_2};

            &__header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;

                &__title {
                    color: ${theme.PRIMARY_2};
                    font-weight: 600;
                    font-size: 14px;
                }

                &__copy-all {
                    color: ${theme.PRIMARY_2};
                    font-size: 12px;
                    cursor: pointer;
                    border: none;
                    background: none;
                    text-decoration: underline;
                    width: auto !important;

                    &:hover {
                        opacity: 0.8;
                    }
                }
            }

            &__field {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);

                &:last-child {
                    border-bottom: none;
                }

                &__label {
                    color: ${theme.SECONDARY_1};
                    font-size: 12px;
                    opacity: 0.7;
                    min-width: 80px;
                }

                &__value {
                    color: ${theme.SECONDARY_1};
                    font-size: 13px;
                    text-align: right;
                    flex: 1;
                    word-break: break-word;
                }

                &__copy-btn {
                    color: ${theme.SECONDARY_1} !important;
                    padding: 2px !important;
                    width: auto !important;
                    min-width: auto !important;
                }

                &__use-btn {
                    color: ${theme.PRIMARY_2} !important;
                    padding: 2px !important;
                    width: auto !important;
                    min-width: auto !important;
                }
            }
        }

        &__result {
            padding: 16px;
            border-radius: 8px;
            border: 2px solid ${theme.PRIMARY_2};
            background-color: ${theme.SECONDARY_2};

            &__title {
                color: ${theme.PRIMARY_2};
                font-weight: 700;
                font-size: 16px;
                margin-bottom: 12px;
            }

            &__fields {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;

                ${tablet(css`
                    grid-template-columns: 1fr;
                `)}

                .full-width {
                    grid-column: 1 / -1;
                }
            }
        }

        &__actions {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-top: 8px;

            &__back {
                color: ${theme.SECONDARY_1} !important;
                width: auto !important;
            }

            &__submit {
                background-color: ${theme.PRIMARY_2} !important;
                color: ${theme.PRIMARY_1} !important;
                width: auto !important;
            }
        }
    }

    .loading-container {
        display: flex;
        justify-content: center;
        padding: 32px;
    }
`;
