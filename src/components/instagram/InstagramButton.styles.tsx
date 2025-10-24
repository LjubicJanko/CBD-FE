import { IconButton, styled } from '@mui/material';
import theme from '../../styles/theme';
import { tablet, mobile } from '../../util/breakpoints';
import { css } from 'styled-components';

export const InstagramButtonContainer = styled(IconButton)`
  width: fit-content;

  font-weight: 400;
  font-size: 24px;
  letter-spacing: 0%;
  text-align: center;
  color: ${theme.PRIMARY_2};

  ${tablet(css`
    font-size: 18px;
  `)}

  ${mobile(css`
    font-size: 12px;
  `)}
`;
