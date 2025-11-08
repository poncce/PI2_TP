// src/components/SimpleRecipeSearch.jsx
import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Search, X } from 'lucide-react';

export default function SimpleRecipeSearch({ onSearch, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: searchTerm });
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch({ search: '' });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="Buscar recetas por título o contenido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-5 h-5" style={{ color: '#64748b' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ color: '#64748b' }}
                >
                  <X className="w-4 h-4" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              bgcolor: '#fff',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#f97316'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f97316'
                }
              }
            }
          }}
          disabled={loading}
        />
      </form>
    </Box>
  );
}