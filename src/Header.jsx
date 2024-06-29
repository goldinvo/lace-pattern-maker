import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  return (
    <AppBar>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="https://goldinvo.com"
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: 'monospace',
            fontWeight: 600,
            color: 'black',
            textDecoration: 'none',
          }}
        >
          goldinvo.com
        </Typography>


        <Button
          sx={{ my: 2, color: 'black', display: 'block' }}
          href="http://goldinvo.com/blog/2024/06/29/lace-pattern-tool.html"  
        > 
          About
        </Button>
        (App is work in progress)
      </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;