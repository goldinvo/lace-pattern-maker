
import { useEffect, useState } from 'react'
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import SelectPanel from "./SelectPanel.jsx"



export default function Toolbar(props) {
  const [previousMode, setPreviousMode] = useState(null);
  
  function handleKeyDown(e) {
    if (e.key === "Alt") {
      setPreviousMode(mode);
      handleMode(e,"pan");
    }
  }
  function handleKeyUp(e) {
    if (e.key === "Alt") {
      handleMode(e, previousMode);
      setPreviousMode(null);
    }
  }

  useEffect(() => {   

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

  }, [props.mode, previousMode]);
  return (
  <Stack 
    spacing={1}
    sx={{position: 'fixed', top: 60, right: 30}}
  >
    <ToggleButtonGroup
      value={props.mode}
      exclusive
      onChange={props.handleMode}
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

    { (props.mode === "select") && <SelectPanel clipboard={props.clipboard} handleCopy={props.handleCopy} handlePaste={props.handlePaste}/>}

    <FormControlLabel 
      disabled={props.mode === "pan"}
      control={<Switch checked={props.snap} onChange={props.handleSnap} />}
      label="Snap to Grid"
    />

    <Chip label={"x:" + Math.round(props.curPos.x) + " y:" + Math.round(props.curPos.y)}/>
  </Stack>
  )
}