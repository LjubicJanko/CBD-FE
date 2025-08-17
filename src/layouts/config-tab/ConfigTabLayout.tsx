import { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import * as Styled from './ConfigTabLayout.styles';
import { Button, IconButton } from '@mui/material';

interface ConfigTabLayoutProps {
  title: string;
  children: ReactNode;
  hideFooter?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  className?: string;
}

const ConfigTabLayout = ({
  title,
  children,
  hideFooter = false,
  onClose,
  onCancel,
  onSubmit,
  className,
}: ConfigTabLayoutProps) => {
  return (
    <Styled.Container className={className}>
      {/* Header */}
      <Styled.Header>
        <h2>{title}</h2>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Styled.Header>

      {/* Body */}
      <Styled.Content>{children}</Styled.Content>

      {/* Footer */}
      {!hideFooter && (
        <Styled.Footer>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        </Styled.Footer>
      )}
    </Styled.Container>
  );
};

export default ConfigTabLayout;
