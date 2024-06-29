import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// TODO: replace with better google icons
import CircleIcon from '@mui/icons-material/Circle';
import CommitIcon from '@mui/icons-material/Commit';
import GestureIcon from '@mui/icons-material/Gesture';

export default function DrawPanel(props) {    
  return (
    <ToggleButtonGroup
      value={props.drawMode}
      exclusive
      onChange={props.handleDrawMode}
      size="small"
    >
    <ToggleButton value="point">
      <CircleIcon />
    </ToggleButton>
    <ToggleButton value="line">
      <CommitIcon />
    </ToggleButton>
    <ToggleButton value="freehand">
      <GestureIcon />
    </ToggleButton>
  </ToggleButtonGroup>
  )
}