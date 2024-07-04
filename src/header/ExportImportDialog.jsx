// AI-assisted code

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography
} from '@mui/material';

function ExportImportDialog({ open, handleClose, getExportJSON, handleImport }) {
  const [mode, setMode] = useState('export');
  const [importedJson, setImportedJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [exportJSON, setExportJSON] = useState('');

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      // Clear exported JSON when switching modes
      if (newMode === 'import') {
        setExportJSON('');
      }
    }
  };

  const handleExport = () => {
    setExportJSON(getExportJSON());
  };

  const handleImportChange = (event) => {
    setImportedJson(event.target.value);
  };

  const handleImportSubmit = () => {
    handleImport(importedJson);
    handleClose();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportJSON).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Export/Import JSON</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            fullWidth
            sx={{ 
              '& .MuiToggleButton-root': {
                flex: 1,
                padding: '10px 20px',
                fontSize: '16px',
              }
            }}
          >
            <ToggleButton value="export">Export</ToggleButton>
            <ToggleButton value="import">Import</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {mode === 'import' && (
          <TextField
            label="JSON Text"
            multiline
            rows={10}
            fullWidth
            margin="dense"
            variant="outlined"
            value={importedJson}
            onChange={handleImportChange}
            sx={{ 
              '& .MuiInputBase-root': {
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
              }
            }}
          />
        )}
        {mode === 'export' && (
          <Box>
            <Button
              onClick={handleExport}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ 
                padding: '10px',
                fontSize: '16px',
              }}
            >
              Export
            </Button>
            {exportJSON && (
              <Box marginTop={2}>
                <TextField
                  label="Exported JSON"
                  multiline
                  rows={10}
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  value={exportJSON}
                  InputProps={{
                    readOnly: true,
                  }}
                  onClick={handleCopyToClipboard}
                  sx={{ 
                    cursor: 'pointer',
                    '& .MuiInputBase-root': {
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                    }
                  }}
                />
                {copied && (
                  <Typography 
                    variant="body2" 
                    color="success" 
                    align="center" 
                    marginTop={1}
                  >
                    JSON copied to clipboard!
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {mode === 'import' && (
          <Button onClick={handleImportSubmit} color="primary">
            Import
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ExportImportDialog;
