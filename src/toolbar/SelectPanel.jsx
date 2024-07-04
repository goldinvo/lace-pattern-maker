import Button from '@mui/material/Button';

export default function SelectPanel(props) {    
    return (
        <>
        <Button disabled={!props.stateView.selectionExists} variant="contained" onClick={props.handleCopy}>Copy</Button>
        <Button disabled={!props.stateView.clipboard || !props.stateView.curMetaPoint} variant="contained" onClick={props.handlePaste}>Paste</Button>
        {props.stateView.selectionExists && <Button variant="contained" onClick={props.handleDelete}>Delete</Button>}
        {props.snapToggle}
        </>
    )
}