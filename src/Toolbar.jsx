
import * as React from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
export default function Toolbar({curPos}) {
  const [alignment, setAlignment] = React.useState('left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
  <>
    <div>
        x: {Math.round(curPos.x)}, y: {Math.round(curPos.y)}
    </div>
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <AdjustOutlinedIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <PanToolOutlinedIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <ModeOutlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  </>
  )
}