import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffd700',
    },
    secondary: {
      main: '#646E68',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;