import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PrintDialog from './PrintDialog';
import ExportImportDialog from './ExportImportDialog';
import AboutDialog from './AboutDialog';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Header(props) {
  const [printOpen, setPrintOpen] = useState(false);
  const [exportImportOpen, setExportImportOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  function handleSave() {
    localStorage.setItem('canvas', props.getExportJSON());
    setSnackbarMessage('Canvas Saved');
    setSnackbarOpen(true);
  }

  function handleLoad() {
    let json = localStorage.getItem('canvas');
    if (!json) alert('No data found in local storage');
    props.handleImport(json);
    setSnackbarMessage('Last Save Loaded');
    setSnackbarOpen(true);
  }

  function handleSnackbarClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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
            lace-pattern-maker
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
          handleClose={() => { setExportImportOpen(false); }}
          handleImport={props.handleImport}
          getExportJSON={props.getExportJSON}
        />
        <PrintDialog
          open={printOpen}
          handleClose={() => setPrintOpen(false)}
          handlePrint={props.handlePrint}
        />
        <AboutDialog 
          open={aboutOpen}
          handleClose={() => {setAboutOpen(false)}}
        />
      </Toolbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin= {{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default Header;

