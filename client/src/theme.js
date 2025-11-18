import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    body: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'gray.50',
      },
    },
  },
  colors: {
    brand: {
      50: '#e5f2ff',
      100: '#b8d9ff',
      200: '#8bc0ff',
      300: '#5ea7ff',
      400: '#318eff',
      500: '#1675e6',
      600: '#0f5bb4',
      700: '#084282',
      800: '#022851',
      900: '#000f23',
    },
  },
});

export default theme;

