import InstagramIcon from '@mui/icons-material/Instagram';
import * as Styled from './InstagramButton.styles';

export type InstagramButtonProps = {
  className?: string;
};

const InstagramButton = ({ className }: InstagramButtonProps) => {
  return (
    <Styled.InstagramButtonContainer
      className={className}
      onClick={() =>
        window.open('https://www.instagram.com/cbd_sportswear', '_blank')
      }
    >
      <InstagramIcon />
      <p>cbd_sportswear</p>
    </Styled.InstagramButtonContainer>
  );
};

export default InstagramButton;
