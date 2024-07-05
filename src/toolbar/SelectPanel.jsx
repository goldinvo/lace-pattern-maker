import Button from '@mui/material/Button';

export default function SelectPanel(props) {    
    return (
        <>
        <Button disabled={!props.stateView.selectionExists || !props.stateView.curMetaPoint} variant="outlined" onClick={props.handleCopy}>Copy</Button>
        <Button disabled={!props.stateView.clipboard || !props.stateView.curMetaPoint} variant="outlined" onClick={props.handlePaste}>Paste</Button>
        {props.stateView.selectionExists && <Button variant="outlined" onClick={props.handleDelete}>Delete</Button>}
        {props.snapToggle}
        </>
    )
}