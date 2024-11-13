import React from 'react';
import ReactDOM from 'react-dom';
import * as Styled from './CbdModal.styles';

interface CbdModalProps {
  isOpen: boolean;
  onClose: () => void;
  showClose?: boolean;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const CbdModal: React.FC<CbdModalProps> = ({
  isOpen,
  onClose,
  showClose = true,
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
        {showClose && (
          <Styled.CloseButton onClick={onClose}>&times;</Styled.CloseButton>
        )}
        {title && <Styled.ModalTitle>{title}</Styled.ModalTitle>}{' '}
        {/* Render title if provided */}
        {children}
      </Styled.ModalContent>
    </Styled.ModalOverlay>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default CbdModal;
