// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cargar preferencia guardada o usar la del sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Tema claro
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#f97316',
        light: '#fb923c',
        dark: '#ea580c',
      },
      background: {
        default: '#fafaf9',
        paper: '#ffffff',
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });

  // Tema oscuro
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#f97316',
        light: '#fb923c',
        dark: '#ea580c',
      },
      background: {
        default: '#0f172a',
        paper: '#1e293b',
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Estilos globales para transiciones suaves
  const globalStyles = (
    <GlobalStyles
      styles={{
        '*, *::before, *::after': {
          transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        },
        // Evitar transición en elementos que no deben animarse
        'input, textarea, select, button': {
          transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.2s ease',
        },
      }}
    />
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};