
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
    }

  }
  
  function handleKeyUp(e) {
    if (previousMode && e.key === "Alt") {
      props.handleMode(e, previousMode);
      setPreviousMode(null);
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
    color='blue'
  />: '';

  return (
  <Stack 
    spacing={1}
    sx={{position: 'fixed', backgroundColor: 'rgba(255, 255, 235, .8)', border: 1, top: 90, right: 20, padding: '10px', borderRadius: '10px',}}
>
    <ToggleButtonGroup
      value={props.stateView.mode}
      exclusive
      onChange={props.handleMode}
      aria-label="mode"
    >
      <Tooltip title = "Select">
        <ToggleButton value="select" aria-label="select">
          <SvgIcon><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m320-410 79-110h170L320-716v306Zm286 305q-23 11-46 2.5T526-134L406-392l-93 130q-17 24-45 15t-28-38v-513q0-25 22.5-36t42.5 5l404 318q23 17 13.5 44T684-440H516l119 255q11 23 2.5 46T606-105ZM399-520Z"/></svg></SvgIcon>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Draw"> 
        <ToggleButton value="draw" aria-label="draw">
          <SvgIcon><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-17 0-28.5-11.5T160-160v-97q0-16 6-30.5t17-25.5l504-503q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L353-143q-11 11-25.5 17t-30.5 6h-97Zm40-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-32-16-55.5T702-359q-14-10-30-10t-27 12q-11 12-11 29.5t14 27.5q14 11 23 20t9 20q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM360-720q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 26 12 46t31 35q13 11 29 9.5t27-14.5q11-13 10-29t-14-27q-7-5-11-10t-4-10q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28Z"/></svg></SvgIcon>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Pan"> 
        <ToggleButton value="pan" aria-label="pan">
          <SvgIcon><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M402-40q-30 0-56-13.5T303-92L67-438q-8-12-7-26t12-24q19-19 45-22t47 12l116 81v-383q0-17 11.5-28.5T320-840q17 0 28.5 11.5T360-800v460q0 24-21.5 35.5T297-307l-85-60 157 229q5 8 14 13t19 5h278q33 0 56.5-23.5T760-200v-560q0-17 11.5-28.5T800-800q17 0 28.5 11.5T840-760v560q0 66-47 113T680-40H402Zm78-880q17 0 28.5 11.5T520-880v360q0 17-11.5 28.5T480-480q-17 0-28.5-11.5T440-520v-360q0-17 11.5-28.5T480-920Zm160 40q17 0 28.5 11.5T680-840v320q0 17-11.5 28.5T640-480q-17 0-28.5-11.5T600-520v-320q0-17 11.5-28.5T640-880ZM486-300Z"/></svg></SvgIcon>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Delete"> 
        <ToggleButton value="delete" aria-label="delete">
          <SvgIcon><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M690-240h150q17 0 28.5 11.5T880-200q0 17-11.5 28.5T840-160H610l80-80Zm-483 80q-8 0-15.5-3t-13.5-9l-73-73q-23-23-23.5-57t22.5-58l440-456q23-24 56.5-24t56.5 23l199 199q23 23 23 57t-23 57L532-172q-6 6-13.5 9t-15.5 3H207Zm279-80 314-322-198-198-442 456 64 64h262Zm-6-240Z"/></svg></SvgIcon>
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>

    { (props.stateView.mode === "select") && <SelectPanel 
                                    stateView={props.stateView}
                                    handleDelete={props.handleDelete} 
                                    handleRotate={props.handleRotate}
                                    handleCopy={props.handleCopy} 
                                    handlePaste={props.handlePaste}
                                    />}

    { (props.stateView.mode === "draw") && <DrawPanel 
                                  stateView={props.stateView}
                                  drawMode={props.drawMode} 
                                  handleDrawMode={props.handleDrawMode}
                                  />}

    

    <ButtonGroup variant='outlined' fullWidth>
      <Button disabled={props.stateView.disableUndo || props.stateView.undoStack.length <= 0} onClick={props.handleUndo}>Undo</Button>
      <Button disabled={props.stateView.disableUndo || props.stateView.redoStack.length <= 0} onClick={props.handleRedo}>Redo</Button>
    </ButtonGroup>
    {(props.stateView.mode === 'draw' || props.stateView.mode === 'select') && snapToggle}
    {curPosChip}
    {metaChip}

  </Stack>
  )
}