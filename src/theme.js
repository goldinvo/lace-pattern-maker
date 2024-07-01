import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#426A5A',
      contrastText: '#000',
    },
    secondary: {
      main: '#ffd700',
    },
  },
});

export default theme;