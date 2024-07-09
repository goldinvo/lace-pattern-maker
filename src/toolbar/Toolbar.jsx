
import { useEffect, useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import SvgIcon from '@mui/material/SvgIcon';
import SelectPanel from "./SelectPanel.jsx";
import DrawPanel from "./DrawPanel.jsx"
import Button from '@mui/material/Button';
import { absoluteToUser } from '../utils.js';
import CoordinateChip from "./CoordinateChip.jsx";
import Tooltip from "@mui/material/Tooltip";
import ButtonGroup from "@mui/material/ButtonGroup"
import HighlightAltOutlinedIcon from '@mui/icons-material/HighlightAltOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined';
import { META_COLOR } from '../constants.js';


export default function Toolbar(props) {
  const [previousMode, setPreviousMode] = useState(null);
  useEffect(() => {   
  
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  
  }, [props.stateView, previousMode]);
  
  if (!props.stateView) return; // Need canvas to mount first so we have fabric state.
  
  function handleKeyDown(e) {
    if (e.key === "Alt" && !props.stateView.disableModeSwitch) {
      setPreviousMode(props.stateView.mode);
      props.handleMode(e,"pan");
    } else if (e.key === "Backspace" && props.stateView.selectionExists) {
      props.handleDelete();
      e.preventDefault();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "z" && !props.stateView.disableUndo) {
      e.shiftKey ? props.handleRedo() : props.handleUndo();
      e.preventDefault();
    } else if (e.key === "Shift" && props.stateView.mode ==="select") {
      props.toggleLasso(true);
    }

  }
  
  function handleKeyUp(e) {
    if (previousMode && e.key === "Alt") {
      props.handleMode(e, previousMode);
      setPreviousMode(null);
    } else if (e.key === "Shift" && props.stateView.mode ==="select") {
      props.toggleLasso(false);
    }
  }
  
  const snapToggle = <FormControlLabel 
  disabled={props.stateView.mode !== "draw" && props.stateView.mode !== "select"}
  control={<Switch checked={props.stateView.snap} onChange={props.handleSnap} />}
  label="Snap to Grid"
  />;
  const curPosChip = <CoordinateChip
    point={absoluteToUser(props.stateView.curPos)}
  />;
  const metaChip = props.stateView.curMetaPoint ? <CoordinateChip 
    point={absoluteToUser({x: props.stateView.curMetaPoint.left, y: props.stateView.curMetaPoint.top})}
    onDelete={props.handleRemoveMeta}
    color={META_COLOR}
  />: '';

  return (
  <Stack 
    spacing={1}
    sx={{position: 'fixed', alignItems: 'center', backgroundColor: 'rgba(255, 255, 235, .8)', border: 1, top: 90, right: 20, padding: '10px', borderRadius: '10px',}}
>
    <ToggleButtonGroup
      value={props.stateView.mode}
      exclusive
      onChange={props.handleMode}
      aria-label="mode"
    >
      <Tooltip title = "Select">
        <ToggleButton value="select" aria-label="select">
          <HighlightAltOutlinedIcon/>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Draw"> 
        <ToggleButton value="draw" aria-label="draw">
          <DrawOutlinedIcon/>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Pan"> 
        <ToggleButton value="pan" aria-label="pan">
          <PanToolOutlinedIcon/>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Delete"> 
        <ToggleButton value="delete" aria-label="delete">
          <CancelOutlinedIcon/>
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>

    { (props.stateView.mode === "select") && <SelectPanel 
                                    stateView={props.stateView}
                                    handleDelete={props.handleDelete} 
                                    handleRotate={props.handleRotate}
                                    handleCopy={props.handleCopy} 
                                    handlePaste={props.handlePaste}
                                    handleReflect={props.handleReflect}
                                    toggleLasso={props.toggleLasso}
                                    />}

    { (props.stateView.mode === "draw") && <DrawPanel 
                                  stateView={props.stateView}
                                  drawMode={props.drawMode} 
                                  handleDrawMode={props.handleDrawMode}
                                  />}

    

    <ButtonGroup variant='outlined' fullWidth>
      <Button disabled={props.stateView.disableUndo || props.stateView.undoStack.length <= 0} onClick={props.handleUndo}><UndoOutlinedIcon/></Button>
      <Button disabled={props.stateView.disableUndo || props.stateView.redoStack.length <= 0} onClick={props.handleRedo}><RedoOutlinedIcon/></Button>
    </ButtonGroup>
    {(props.stateView.mode === 'draw' || props.stateView.mode === 'select') && snapToggle}
    {curPosChip}
    {metaChip}

  </Stack>
  )
}