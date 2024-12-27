import SearchIcon from '@mui/icons-material/Search';
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import React, { useCallback, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useTranslation } from 'react-i18next';

type OrderSearchProps = {
  onSearch: (query: string) => void;
};

const OrderSearch: React.FC<OrderSearchProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchTerm);
      setSearchActive(true);
    },
    [searchTerm, onSearch]
  );

  const resetSearch = useCallback(() => {
    setSearchTerm('');
    setSearchActive(false);
    onSearch('');
  }, [onSearch]);

  return (
    <Paper component="form" className="search" onSubmit={handleSearch}>
      {searchActive && (
        <IconButton onClick={resetSearch}>
          <CloseOutlinedIcon />
        </IconButton>
      )}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t('search-orders')}
        inputProps={{ 'aria-label': 'search orders' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default OrderSearch;
