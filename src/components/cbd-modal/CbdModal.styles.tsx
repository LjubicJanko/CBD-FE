import styled from 'styled-components';
import theme from '../../styles/theme';

// Styled component for modal overlay
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Styled component for modal content
export const ModalContent = styled.div`
  background-color: ${theme.PRIMARY_1};
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
`;

// Styled component for close button
export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  color: ${theme.SECONDARY_1};
`;

// Styled component for modal title
export const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: ${theme.SECONDARY_1};
`;
