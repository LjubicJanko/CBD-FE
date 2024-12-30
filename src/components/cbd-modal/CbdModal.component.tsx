import React from 'react';
import ReactDOM from 'react-dom';
import * as Styled from './CbdModal.styles';

interface CbdModalProps {
  isOpen: boolean;
  onClose: () => void;
  showClose?: boolean;
  children: React.ReactNode;
  title?: React.ReactNode | string;
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
        {title && (
          <Styled.ModalTitle className="modal-title">{title}</Styled.ModalTitle>
        )}{' '}
        {showClose && (
          <Styled.CloseButton className="modal-close-button" onClick={onClose}>
            &times;
          </Styled.CloseButton>
        )}
        {children}
      </Styled.ModalContent>
    </Styled.ModalOverlay>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default CbdModal;
