import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffe9',
    },
    secondary: {
      main: '#ffd700',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;