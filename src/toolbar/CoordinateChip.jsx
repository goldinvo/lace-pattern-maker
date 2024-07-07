import React from 'react';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Typography } from '@mui/material';

function CoordinateChip({ point, onDelete, color }) {
  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" component="span">
            x: {point.x.toFixed(1)}
          </Typography>
          <Box sx={{ width: '16px' }} />
          <Typography variant="body2" component="span">
            y: {point.y.toFixed(1)}
          </Typography>
        </Box>
      }
      onDelete={onDelete}
      deleteIcon={<CancelIcon />}
      sx={{ mr: 1, border: `2px solid ${color}`}}
    />
  );
}

export default CoordinateChip;
