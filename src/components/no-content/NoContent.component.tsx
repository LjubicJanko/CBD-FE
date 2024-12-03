import * as Styled from './NoContent.styles';

interface NoContentProps {
  message?: string;
}

const NoContent = ({ message }: NoContentProps) => {
  return (
    <Styled.NoContentContainer>
      <img className="no-content-img" src="/no_content.png" alt="no-content" />
      {message && <Styled.ErrorMessage>{message}</Styled.ErrorMessage>}
    </Styled.NoContentContainer>
  );
};

export default NoContent;
