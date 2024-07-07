import React, { useState } from 'react';
import Button from '@mui/material/Button';

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
      <Button 
        disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint} 
        variant="outlined" 
        onClick={handleCopy}
      >
        {copyText}
      </Button>
      <Button 
        disabled={!props.stateView.clipboard || !props.stateView.curMetaPoint} 
        variant="outlined" 
        onClick={handlePaste}
      >
        {pasteText}
      </Button>
      {props.stateView.selectionExists && (
        <Button variant="outlined" onClick={props.handleDelete}>
          Delete
        </Button>
      )}
      {props.snapToggle}
    </>
  );
}
