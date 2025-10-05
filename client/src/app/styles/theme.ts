// theme.ts
'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f97316', // orange-500 (bg-orange-500)
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1E40AF', // blue-800 (bg-blue-800)
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // biar text tidak uppercase
          borderRadius: '4px', // <== atur rounded di sini
          fontWeight: 500,
        },
      },
    },
  },
});
