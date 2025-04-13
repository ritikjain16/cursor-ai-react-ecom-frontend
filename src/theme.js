import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2874f0',
      light: '#4a8eff',
      dark: '#1e5bb0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9f00',
      light: '#ffb333',
      dark: '#cc7f00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f1f3f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 2,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.08)',
        },
      },
    },
  },
});

export default theme; 