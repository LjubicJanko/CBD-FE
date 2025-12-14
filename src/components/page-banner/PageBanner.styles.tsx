import styled from 'styled-components';
import theme from '../../styles/theme';

export const PageBannerContainer = styled.div`
    background-color: ${theme.PRIMARY_2};
    padding: 16px;
    text-align: center;
    position: relative;
    margin-bottom: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h2 {
        margin: 0 0 8px 0;
        font-size: 1.5em;
        font-weight: bold;
        color: ${theme.PRIMARY_1};
    }
    p {
        margin: 0;
        font-size: 1em;
    }
    button {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
    }
`;
