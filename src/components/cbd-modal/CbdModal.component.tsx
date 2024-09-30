import React from 'react';
import ReactDOM from 'react-dom';
import * as Styled from './CbdModal.styles';

interface CbdModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const CbdModal: React.FC<CbdModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Styled.ModalOverlay>
      <Styled.ModalContent className={className}>
        {' '}
        {/* Apply className here */}
        <Styled.CloseButton onClick={onClose}>&times;</Styled.CloseButton>
        {title && <Styled.ModalTitle>{title}</Styled.ModalTitle>}{' '}
        {/* Render title if provided */}
        {children}
      </Styled.ModalContent>
    </Styled.ModalOverlay>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default CbdModal;
