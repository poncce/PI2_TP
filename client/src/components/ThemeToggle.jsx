// src/components/ThemeToggle.jsx
import { IconButton, Tooltip } from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}>
      <IconButton 
        onClick={toggleTheme}
        sx={{ 
          color: 'inherit',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'rotate(20deg)'
          }
        }}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </IconButton>
    </Tooltip>
  );
}