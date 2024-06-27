
import * as React from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
export default function Toolbar({curPos, mode, handleMode}) {
  return (
  <>
    <div>
        x: {Math.round(curPos.x)}, y: {Math.round(curPos.y)}
    </div>
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleMode}
      size="small"
      aria-label="mode"
    >
      <ToggleButton value="select" aria-label="select">
        <AdjustOutlinedIcon />
      </ToggleButton>
      <ToggleButton value="pan" aria-label="pan">
        <PanToolOutlinedIcon />
      </ToggleButton>
      <ToggleButton value="draw" aria-label="draw">
        <ModeOutlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  </>
  )
}