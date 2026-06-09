import styled from 'styled-components';
import theme from '../../styles/theme';

export const FeatureToggles = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 480px;

    .feature-toggles__item {
        align-items: flex-start;
        margin: 0;
        gap: 12px;

        .MuiFormControlLabel-label {
            /* lets the label/description column take the remaining width */
            width: 100%;
        }

        .MuiSwitch-root {
            margin-top: 2px;
        }

        .MuiSwitch-switchBase.Mui-checked {
            color: ${theme.PRIMARY_2};

            & + .MuiSwitch-track {
                background-color: ${theme.PRIMARY_2} !important;
                opacity: 0.5;
            }
        }
    }

    .feature-toggles__label {
        display: flex;
        flex-direction: column;
        gap: 2px;

        strong {
            color: ${theme.SECONDARY_1};
            font-size: 14px;
            font-weight: 600;
        }
    }

    .feature-toggles__desc {
        color: ${theme.SECONDARY_2};
        font-size: 12px;
        line-height: 1.4;
    }

    .feature-toggles__requires {
        margin-top: 2px;
        color: ${theme.PRIMARY_2};
        font-size: 11px;
        font-style: italic;
    }
`;
