import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PrintDialog from './PrintDialog';
import ExportImportDialog from './ExportImportDialog';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Tooltip from '@mui/material/Tooltip'


function Header(props) {
  const [printOpen, setPrintOpen] = useState(false);
  const [exportImportOpen, setExportImportOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  function handleSave() {
    localStorage.setItem("canvas", props.getExportJSON());
    console.log(props.getExportJSON())
  }

  function handleLoad() {
    let json = localStorage.getItem("canvas");
    console.log(json);
    if (!json) alert('No data found in local storage');
    props.handleImport(json);
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'secondary.main', boxShadow: 1, px: { xs: 2, sm: 3 } }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography
            variant="h6"
            component="a"
            href="https://goldinvo.com"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            goldinvo.com/
          </Typography>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '1.25rem',
              whiteSpace: 'nowrap',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'default',
              userSelect: 'none', // Disable text selection
              '&:hover': {
                cursor: 'default',
              },
            }}
          >
            lace-pattern-tool
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Tooltip title="Save current canvas to local storage. Overwrites previous saves.">
            <Button color="inherit" onClick={() => handleSave()}>
              Save
            </Button>
          </Tooltip>
          <Tooltip title="Load last save from local storage">
            <Button color="inherit" onClick={() => handleLoad()}>
              Load
            </Button>
          </Tooltip>
          <Tooltip title="Get canvas in text (JSON) format">
            <Button color="inherit" onClick={() => setExportImportOpen(true)}>
              Export/Import
            </Button>
          </Tooltip>
          <Button color="inherit" onClick={() => setPrintOpen(true)}>
            Print
          </Button>
          <Button color="inherit" onClick={() => setAboutOpen(true)}>
            About
          </Button>
        </Box>
        <ExportImportDialog
          open={exportImportOpen}
          handleClose={() => { setExportImportOpen(false) }}
          handleImport={props.handleImport}
          getExportJSON={props.getExportJSON}
        />
        <PrintDialog
          open={printOpen}
          handleClose={() => setPrintOpen(false)}
          handlePrint={props.handlePrint}
        />
        <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            About
            <IconButton
              aria-label="close"
              onClick={() => setAboutOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box>
              <Typography variant="h4" gutterBottom>
                Lace Pattern Tool
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Lace Pattern Tool</strong> is an interactive canvas designed for making bobbin lace patterns. It is easy-to-learn and free-to-use!
              </Typography>
              <Typography variant="body1" paragraph>
                Read below to get the basics, or visit my{' '}
                <Link href="https://goldinvo.com/blog/2024/06/29/lace-pattern-tool" target="_blank" rel="noopener">
                  blog post
                </Link>{' '}
                to learn more about this tool. If you enjoyed using this tool or have any feedback, bug reports, or feature requests, please email me at{' '}
                <Link href="mailto:goldin@goldinvo.com">goldin@goldinvo.com</Link>.
              </Typography>
              <Typography variant="h5" gutterBottom>
                Usage
              </Typography>
              <Typography variant="h6" gutterBottom>
                Navigation
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Scroll to zoom in and out" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Hold Alt or use Pan mode to move the canvas" />
                </ListItem>
              </List>
              <Typography variant="h6" gutterBottom>
                Working with Objects
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="In Draw mode, you can plot points, curves, or freehand draw. Holding shift allows you to draw lines in freehand draw mode." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Use Erase mode to delete objects, or delete a selection in Select mode." />
                </ListItem>
              </List>
              <Typography variant="h6" gutterBottom>
                Using Select Mode
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Click or click-and-drag to make a selection. Shift-click to modify the selection." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary='To copy and paste, you need to have a blue "control point" plotted. Objects are copy/pasted relative to the control point. Double click to plot a control point.' />
                </ListItem>
              </List>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAboutOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

/*
# Lace Pattern Tool
**Lace Pattern Tool** is an interactive canvas designed for making bobbin lace 
patterns. It is easy-to-learn and free-to-use!

Read below to get the basics, or visit my [blog post](https://goldinvo.com/blog/2024/06/29/lace-pattern-tool)
to learn more about this tool. If you enjoyed using this tool or have any feedback, bug reports, or feature requests, please 
email me at goldin@goldinvo.com. 

## Usage
1. Navigation
  - Scroll to zoom in and out
  - Hold Alt or use Pan mode to move the canvas
2. Working with Objects
  - In Draw mode, you can plot points, curves, or freehand draw. Holding shift allows you to draw lines in freehand draw mode.
  - Use Erase mode to delete objects, or delete a selection in Select mode.
3. Using Select Mode
  - Click or click-and-drag to make a selection. Shift-click to modify the selection.
  - To copy and paste, you need to have a blue "control point" plotted. Objects are copy/pasted relative to the control point. Double click to plot a control point.

*/