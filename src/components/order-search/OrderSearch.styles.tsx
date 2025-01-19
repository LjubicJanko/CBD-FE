import { IconButton, InputBase, Paper } from '@mui/material';
import styled from 'styled-components';
import theme from '../../styles/theme';

export const SearchBar = styled(Paper)`
  display: flex;
  align-items: center;
  border-radius: 50px;
  padding: 0 8px;
  border: 2px solid ${theme.PRIMARY_2};
  background-color: ${theme.PRIMARY_1} !important;
  color: ${theme.PRIMARY_2};
  box-shadow: none;
  border-radius: 20px !important;
  width: 100%;

  &:hover {
    box-shadow: 0px 0px 10px #d0ff00;
  }
`;

export const SearchInputBase = styled(InputBase)`
  margin-left: 8px;
  flex: 1;
  background-color: ${theme.PRIMARY_1};
  color: ${theme.PRIMARY_2} !important;
  font-size: 1rem;

  &::placeholder {
    color: ${theme.PRIMARY_2};
    opacity: 1;
  }
`;

export const SearchIconButton = styled(IconButton)`
  color: ${theme.PRIMARY_2};
`;
