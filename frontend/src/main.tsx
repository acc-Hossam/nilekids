import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

console.log("main.tsx: script start");

// RTL Support for Arabic
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

console.log("main.tsx: creating cacheRtl");

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

console.log("main.tsx: creating queryClient");

// MUI Theme (Pastel Colors للحضانة)
const theme = createTheme({
  direction: 'rtl', // للعربي
  palette: {
    primary: {
      main: '#6C9BCF', // أزرق هادئ
    },
    secondary: {
      main: '#FFD93D', // أصفر دافئ
    },
    success: {
      main: '#95D9C3', // mint green
    },
    background: {
      default: '#F9F9F9',
    },
  },
  typography: {
    fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

console.log("main.tsx: creating theme");

console.log("main.tsx: calling ReactDOM.createRoot");
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);