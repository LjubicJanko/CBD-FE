import styled from 'styled-components';

export const TooltipContent = styled.div`
  background-color: #f9f9f9;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
  min-width: 200px;
`;

export const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  border-bottom: 1px solid #ddd;

  &:last-of-type {
    border-bottom: none;
  }
`;

export default { TooltipContent, TooltipRow };
