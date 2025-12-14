import styled from 'styled-components';
import CbdModal from '../../cbd-modal/CbdModal.component';
import theme from '../../../styles/theme';

export const PublishBannerContainer = styled(CbdModal)`
    min-width: 250px;
    background-color: ${theme.SECONDARY_2};

    &.publish-banner-modal {
        h2 {
            font-weight: 400;
            font-size: 20px;
            color: ${theme.SECONDARY_1};
        }
    }

    .publish-banner-modal {
        &__chips {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }

        &__actions {
            display: flex;
            width: 100%;
            justify-content: flex-end;
            &__publish-button {
                &:disabled {
                    background-color: ${theme.SECONDARY_3};
                    color: ${theme.PRIMARY_1};
                }
                background-color: ${theme.PRIMARY_2};
                color: ${theme.PRIMARY_1};
            }
        }
    }
`;
