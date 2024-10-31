import * as Styled from './NoContent.styles';

const NoContent = () => {
  return (
    <Styled.NoContentContainer>
      <img className="no-content-img" src="/no_content.png" alt="no-content" />
    </Styled.NoContentContainer>
  );
};

export default NoContent;
