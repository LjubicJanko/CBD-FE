import styled from 'styled-components';

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
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

// Styled component for close button
export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

// Styled component for modal title
export const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
`;
