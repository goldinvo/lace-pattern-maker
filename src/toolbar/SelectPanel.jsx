import Button from '@mui/material/Button';

export default function SelectPanel(props) {    
    return (
        <>
        <Button disabled={!props.selectionExists} variant="contained" onClick={props.handleCopy}>Copy</Button>
        <Button disabled={!props.clipboard || !props.metaExists} variant="contained" onClick={props.handlePaste}>Paste</Button>
        {props.selectionExists && <Button variant="contained" onClick={props.handleDelete}>Delete</Button>}
        {props.snapToggle}
        </>
    )
}