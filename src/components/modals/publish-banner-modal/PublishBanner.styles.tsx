import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const PublishBannerContainer = styled(CbdModal)`
    min-width: 250px;

    &.publish-banner-modal {
        h2 {
            font-weight: 700;
            font-size: 20px;
            color: ${theme.PRIMARY_2};
        }
    }

    .publish-banner-modal {
        &__chips {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }

        &__actions {
            display: flex;
            width: 100%;
            justify-content: flex-end;

            &__publish-button {
                background-color: ${theme.PRIMARY_2};
                color: ${theme.PRIMARY_1};
                font-weight: 700;
                border-radius: 10px;

                &:hover {
                    background-color: ${theme.PRIMARY_2}D9;
                }

                &:disabled {
                    background-color: ${theme.SECONDARY_3};
                    color: ${theme.PRIMARY_1};
                    opacity: 0.5;
                }
            }
        }
    }
`;
