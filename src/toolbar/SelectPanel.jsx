import Button from '@mui/material/Button';

export default function SelectPanel({handleCopy}) {
    return (
        <Button variant="contained" onClick={handleCopy}>Copy Selection</Button>
    )
}