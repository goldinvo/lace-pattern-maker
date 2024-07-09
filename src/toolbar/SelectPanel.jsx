import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Rotate90DegreesCwOutlinedIcon from '@mui/icons-material/Rotate90DegreesCwOutlined';
import FlipOutlinedIcon from '@mui/icons-material/FlipOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import { SvgIcon, Tooltip } from '@mui/material';

export default function SelectPanel(props) {
  const [isCutClicked, setIsCutClicked] = useState(false);
  const [isCopyClicked, setIsCopyClicked] = useState(false);
  const [isPasteClicked, setIsPasteClicked] = useState(false);
  
  const handleCut = () => {
    props.handleCut();
    setIsCutClicked(true);
    setTimeout(() => setIsCutClicked(false), 1000);
  }

  const handleCopy = () => {
    props.handleCopy();
    setIsCopyClicked(true);
    setTimeout(() => setIsCopyClicked(false), 1000);
  };

  const handlePaste = () => {
    props.handlePaste();
    setIsPasteClicked(true);
    setTimeout(() => setIsPasteClicked(false), 1000);
  };


  return (
    <>
      <Tooltip title="Lasso Select (A)">
        <ToggleButton 
          fullWidth
          size="small"
          value="lasso"
          selected={props.stateView.lasso}
          onChange={() => props.toggleLasso(!props.stateView.lasso)}
        >
          <SvgIcon>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m161-516-80-8q6-46 20.5-89.5T141-696l68 42q-20 31-31.5 66T161-516Zm36 316q-33-32-57-70.5T101-352l76-26q12 35 31 65.5t45 56.5l-56 56Zm110-552-42-68q39-25 82.5-39.5T437-880l8 80q-37 5-72 16.5T307-752ZM479-82q-35 0-69.5-5.5T343-106l26-76q27 9 54 14.5t56 5.5v80Zm226-626q-26-26-56.5-45T583-784l26-76q43 15 81.5 39t70.5 57l-56 56Zm86 594L679-226v104h-80v-240h240v80H735l112 112-56 56Zm8-368q0-29-5.5-56T779-592l76-26q13 32 18.5 66.5T879-482h-80Z"/></svg>
          </SvgIcon>
        </ToggleButton>
      </Tooltip>

      <ButtonGroup variant="outlined" fullWidth>
        <Tooltip title="Cut (Ctrl/Cmd + X)"><span style={{width: '100%'}}>
          <Button 
            disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint} 
            onClick={handleCut}
          >
            {isCutClicked ? <CheckOutlinedIcon/> : <ContentCutOutlinedIcon/>}
          </Button>
        </span></Tooltip>
        <Tooltip title="Copy (Ctrl/Cmd + C)"><span style={{width: '100%'}}>
          <Button 
            disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint} 
            onClick={handleCopy}
          >
            {isCopyClicked ? <CheckOutlinedIcon/> : <ContentCopyOutlinedIcon/>}
          </Button>
        </span></Tooltip>
        <Tooltip title="Paste (Ctrl/Cmd + V)"><span style={{width: '100%'}}>
          <Button 
            disabled={!props.stateView.clipboard || !props.stateView.curMetaPoint} 
            onClick={handlePaste}
          >
            {isPasteClicked ? <CheckOutlinedIcon/> : <ContentPasteOutlinedIcon/>}
          </Button>
        </span></Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" fullWidth> 
        <Tooltip title="Rotate Clockwise 90 Degrees"><span style={{width: '100%'}}>
          <Button onClick={props.handleRotate} disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint}>
            <Rotate90DegreesCwOutlinedIcon/>
          </Button>
        </span></Tooltip>
        <Tooltip title="Reflect Vertically"><span style={{width: '100%'}}>
          <Button onClick={() => props.handleReflect({vertical: true})} disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint}>
            <FlipOutlinedIcon/>
          </Button>
        </span></Tooltip>
        <Tooltip title="Reflect Horizontally"><span style={{width: '100%'}}>
          <Button onClick={() => props.handleReflect({horizontal: true})} disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint}>
            <FlipOutlinedIcon sx={{transform: 'rotate(90deg);'}}/>
          </Button>
        </span></Tooltip>
      </ButtonGroup>

      <Tooltip title="Delete Selection (Bksp)"><span style={{width: '100%'}}>
        <Button variant="outlined" fullWidth onClick={props.handleDelete} disabled={!props.stateView.selectionExists}>
          <DeleteOutlinedIcon/>
        </Button>
      </span></Tooltip>
    </>
  );
}
