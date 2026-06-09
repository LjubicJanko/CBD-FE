import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const PremiumFeaturesTab = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    h3 {
        margin: 0;
        color: ${theme.SECONDARY_1};
        font-size: 20px;
        font-weight: 700;
    }

    &__hint,
    .premium-features-tab__hint {
        margin: 0;
        color: ${theme.SECONDARY_2};
        font-size: 13px;
        line-height: 1.5;
        max-width: 480px;
    }

    &__empty,
    .premium-features-tab__empty {
        color: ${theme.SECONDARY_2};
        font-size: 14px;
    }

    &__save,
    .premium-features-tab__save {
        align-self: flex-start;
        padding: 12px 32px;
        border-radius: 10px;
        background-color: ${theme.PRIMARY_2};
        color: ${theme.PRIMARY_1};
        font-weight: 700;
        font-size: 14px;
        text-transform: none;

        &:hover {
            background-color: ${theme.PRIMARY_2}D9;
        }

        &:disabled {
            background-color: ${theme.SECONDARY_3} !important;
            color: ${theme.PRIMARY_1};
            opacity: 0.5;
        }
    }
`;
