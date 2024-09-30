import SearchIcon from '@mui/icons-material/Search';
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import React, { useCallback, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

type OrderSearchProps = {
  onSearch: (query: string) => void; // Callback to trigger the search
};

const OrderSearch: React.FC<OrderSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault(); // Prevent form submission from reloading the page
      onSearch(searchTerm); // Pass the search term to the parent component for searching
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
        placeholder="Search orders"
        inputProps={{ 'aria-label': 'search orders' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default OrderSearch;
