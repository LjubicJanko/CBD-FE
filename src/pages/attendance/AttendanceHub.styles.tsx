import styled, { css } from 'styled-components';
import theme from '../../styles/theme';
import { tablet } from '../../util/breakpoints';

export const AttendanceHubContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    .attendance-hub {
        &__tabs {
            padding: 24px 32px 0;

            ${tablet(css`
                padding: 16px 16px 0;
            `)}
        }

        &__tabs-box {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);

            .MuiTabs-indicator {
                background-color: ${theme.PRIMARY_2};
            }

            .MuiTab-root {
                color: ${theme.SECONDARY_2};
                text-transform: none;
                font-size: 15px;
                font-weight: 600;

                &.Mui-selected {
                    color: ${theme.PRIMARY_2};
                }
            }
        }

        &__tab-select {
            width: 100%;

            .MuiSelect-select {
                color: ${theme.SECONDARY_1};
            }

            .MuiSelect-icon {
                color: ${theme.SECONDARY_2};
            }

            .MuiOutlinedInput-notchedOutline {
                border-color: rgba(255, 255, 255, 0.2);
            }

            &:hover .MuiOutlinedInput-notchedOutline {
                border-color: ${theme.PRIMARY_2}80;
            }

            &.Mui-focused .MuiOutlinedInput-notchedOutline {
                border-color: ${theme.PRIMARY_2};
            }
        }
    }
`;
