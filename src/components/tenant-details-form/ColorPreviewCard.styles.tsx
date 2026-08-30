import styled from 'styled-components';
import theme from '../../styles/theme';

export const ColorPreviewCard = styled.div`
    .color-preview {
        &__card {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 16px;
            border-radius: 10px;
            border: 1px solid ${theme.BORDER};
            background-color: ${theme.PRIMARY_1};
        }

        &__heading {
            color: ${theme.SECONDARY_1};
            font-size: 16px;
            font-weight: 700;
        }

        &__muted {
            color: ${theme.SECONDARY_2};
            font-size: 13px;
        }

        &__subtle {
            color: ${theme.SECONDARY_3};
            font-size: 12px;
        }

        &__button {
            align-self: flex-start;
            margin-top: 6px;
            padding: 6px 16px;
            border: none;
            border-radius: 8px;
            background-color: ${theme.PRIMARY_2};
            color: ${theme.PRIMARY_1};
            font-weight: 700;
            font-size: 13px;
        }
    }
`;
