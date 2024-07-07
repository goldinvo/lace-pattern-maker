import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function SelectPanel(props) {
  const [copyText, setCopyText] = useState('Copy');
  const [pasteText, setPasteText] = useState('Paste');

  const handleCopy = () => {
    props.handleCopy();
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy'), 1000);
  };

  const handlePaste = () => {
    props.handlePaste();
    setPasteText('Pasted!');
    setTimeout(() => setPasteText('Paste'), 1000);
  };

  return (
    <>
      <ButtonGroup variant="outlined" fullWidth>
        <Button 
          disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint} 
          onClick={handleCopy}
        >
          {copyText}
        </Button>
        <Button 
          disabled={!props.stateView.clipboard || !props.stateView.curMetaPoint} 
          onClick={handlePaste}
        >
          {pasteText}
        </Button>
      </ButtonGroup>

      <ButtonGroup variant="outlined" fullWidth> 
        <Button onClick={props.handleDelete} disabled={!props.stateView.selectionExists}>
          Delete
        </Button>
        <Button onClick={props.handleRotate} disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint}>
          Rotate
        </Button>
      </ButtonGroup>
    </>
  );
}
