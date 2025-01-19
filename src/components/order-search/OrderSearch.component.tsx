import SearchIcon from '@mui/icons-material/Search';
import React, { useCallback, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useTranslation } from 'react-i18next';
import { Q_PARAM } from '../../util/constants';
import useQueryParams from '../../hooks/useQueryParams';
import * as Styled from './OrderSearch.styles';
import theme from '../../styles/theme';

const OrderSearch = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const { setQParam, removeQParam } = useQueryParams();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setQParam(Q_PARAM.SEARCH_TERM, searchTerm);
      setSearchActive(true);
    },
    [searchTerm, setQParam]
  );

  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setSearchActive(false);
    removeQParam(Q_PARAM.SEARCH_TERM);
  }, [removeQParam]);

  return (
    <form className="search" style={{ padding: 0 }} onSubmit={handleSearch}>
      <Styled.SearchBar>
        {searchActive && (
          <Styled.SearchIconButton onClick={resetSearch}>
            <CloseOutlinedIcon style={{ color: theme.PRIMARY_2 }} />
          </Styled.SearchIconButton>
        )}
        <Styled.SearchInputBase
          placeholder={t('search-orders')}
          inputProps={{ 'aria-label': 'search orders' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Styled.SearchIconButton type="submit" aria-label="search">
          <SearchIcon style={{ color: theme.PRIMARY_2 }} />
        </Styled.SearchIconButton>
      </Styled.SearchBar>
    </form>
  );
};

export default OrderSearch;
