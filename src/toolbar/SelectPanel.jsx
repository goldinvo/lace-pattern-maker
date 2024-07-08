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


export default function SelectPanel(props) {
  const [isCutClicked, setIsCutClicked] = useState(false);
  const [isCopyClicked, setIsCopyClicked] = useState(false);
  const [isPasteClicked, setIsPasteClicked] = useState(false);
  
  const handleCut = () => {
    props.handleCopy()
    props.handleDelete();
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
      <ButtonGroup variant="outlined" fullWidth>
        
        <Button 
          disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint} 
          onClick={handleCut}
        >
          {isCutClicked ? <CheckOutlinedIcon/> : <ContentCutOutlinedIcon/>}
        </Button>
        <Button 
          disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint} 
          onClick={handleCopy}
        >
          {isCopyClicked ? <CheckOutlinedIcon/> : <ContentCopyOutlinedIcon/>}
        </Button>
        <Button 
          disabled={!props.stateView.clipboard || !props.stateView.curMetaPoint} 
          onClick={handlePaste}
        >
          {isPasteClicked ? <CheckOutlinedIcon/> : <ContentPasteOutlinedIcon/>}
        </Button>
      </ButtonGroup>

      <ButtonGroup variant="outlined" fullWidth> 
        <Button onClick={props.handleRotate} disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint}>
          <Rotate90DegreesCwOutlinedIcon/>
        </Button>
        <Button onClick={() => props.handleReflect({vertical: true})} disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint}>
          <FlipOutlinedIcon/>
        </Button>
        <Button onClick={() => props.handleReflect({horizontal: true})} disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint}>
          <FlipOutlinedIcon sx={{transform: 'rotate(90deg);'}}/>
        </Button>
      </ButtonGroup>
      <Button variant="outlined" fullWidth onClick={props.handleDelete} disabled={!props.stateView.selectionExists}>
        <DeleteOutlinedIcon/>
      </Button>
    </>
  );
}
