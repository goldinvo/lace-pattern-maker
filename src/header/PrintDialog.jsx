// AI-assisted code.

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box
} from '@mui/material';
import { userToAbsolute } from '../utils';
import { CELL_SIZE } from '../constants.js'

function PrintDialog({ open, handleClose, handlePrint }) {
  const [formValues, setFormValues] = React.useState({
    tlX: '',
    tlY: '',
    brX: '',
    brY: '',
    squares: '8',  // Default value for squares
    inches: '1',   // Default value for inches
  });

  const [errors, setErrors] = React.useState({
    tlX: false,
    tlY: false,
    brX: false,
    brY: false,
    squares: false,
    inches: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {
      tlX: isNaN(formValues.tlX),
      tlY: isNaN(formValues.tlY),
      brX: isNaN(formValues.brX),
      brY: isNaN(formValues.brY),
      squares: isNaN(formValues.squares),
      inches: isNaN(formValues.inches),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      let aTlX = userToAbsolute(formValues.tlX);
      let aTlY = userToAbsolute(formValues.tlY);
      let aBrX = userToAbsolute(formValues.brX);
      let aBrY = userToAbsolute(formValues.brY);

      // 96 pixels = 1 inch
      let scale = 96 / (formValues.squares * CELL_SIZE / formValues.inches)

        console.log(scale);
      handlePrint(aTlX, aTlY, aBrX - aTlX, aBrY - aTlY, scale);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>Print Parameters</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the top-left and bottom-right coordinates of the bounding box for your print selection.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="tlX"
              name="tlX"
              label="X (Top-Left)"
              type="text"
              value={formValues.tlX}
              onChange={handleInputChange}
              error={errors.tlX}
              helperText={errors.tlX ? 'Please enter a valid number' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="tlY"
              name="tlY"
              label="Y (Top-Left)"
              type="text"
              value={formValues.tlY}
              onChange={handleInputChange}
              error={errors.tlY}
              helperText={errors.tlY ? 'Please enter a valid number' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="brX"
              name="brX"
              label="X (Bottom-Right)"
              type="text"
              value={formValues.brX}
              onChange={handleInputChange}
              error={errors.brX}
              helperText={errors.brX ? 'Please enter a valid number' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="brY"
              name="brY"
              label="Y (Bottom-Right)"
              type="text"
              value={formValues.brY}
              onChange={handleInputChange}
              error={errors.brY}
              helperText={errors.brY ? 'Please enter a valid number' : ''}
            />
          </Grid>
        </Grid>
        <Box marginY={2}>
          <Divider />
        </Box>
        <DialogContentText>
          Specify the ratio of grid squares to inches to determine the scaling for 
          the final image. Make sure to print at 100% scaling!
        </DialogContentText>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={5}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="squares"
              name="squares"
              label="Squares"
              type="text"
              value={formValues.squares}
              onChange={handleInputChange}
              error={errors.squares}
              helperText={errors.squares ? 'Please enter a valid number' : ''}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" align="center" marginX={2}>:</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="inches"
              name="inches"
              label="Inches"
              type="text"
              value={formValues.inches}
              onChange={handleInputChange}
              error={errors.inches}
              helperText={errors.inches ? 'Please enter a valid number' : ''}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Print</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PrintDialog;