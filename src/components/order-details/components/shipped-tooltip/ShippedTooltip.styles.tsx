import styled from 'styled-components';
import theme from '../../../../styles/theme';

export const TooltipContent = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.PRIMARY_2};
  padding: 8px 16px;
  border-radius: 8px;
  color: ${theme.PRIMARY_1};
`;

export default { TooltipContent };
