import { IconButton, styled } from '@mui/material';
import theme from '../../styles/theme';
import { tablet, mobile } from '../../util/breakpoints';
import { css } from 'styled-components';

export const InstagramButtonContainer = styled(IconButton)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 32px;
  width: fit-content;

  font-weight: 400;
  font-size: 24px;
  letter-spacing: 0%;
  text-align: center;
  color: ${theme.PRIMARY_2};

  ${tablet(css`
    bottom: 8px;
    font-size: 18px;
  `)}

  ${mobile(css`
    bottom: 2px;
    font-size: 12px;
  `)}
`;
