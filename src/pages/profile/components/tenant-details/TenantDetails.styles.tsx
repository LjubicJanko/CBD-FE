import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const TenantDetailsTab = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    h3 {
        margin: 0;
        color: ${theme.SECONDARY_1};
        font-size: 20px;
        font-weight: 700;
    }

    &__empty,
    .tenant-details-tab__empty {
        color: ${theme.SECONDARY_2};
        font-size: 14px;
    }
`;
