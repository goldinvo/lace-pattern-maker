import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

/*

# Lace Pattern Tool
**Lace Pattern Tool** is an interactive canvas designed for making bobbin lace 
patterns. It is easy-to-learn and free-to-use!

If you enjoyed using this tool or have any feedback, bug reports, or feature requests, please 
email me at goldin@goldinvo.com. 

## Quick Start
Hover over buttons to see the actions they perform and the keyboard shortcuts associated with them.
1. Navigate the canvas by zooming (scroll) and panning (Pan mode).
2. Use Draw mode to draw points, lines, and freehand draw.
3. Use Select mode to make a selection, either by using the default Box select or by using Lasso select.
With select mode you can Group Move, Group Delete, cut/copy/paste, or perform transformations.
    - To use many of these features, you must first plot a **"Control Point"** by double clicking.
4. Export/Import a text representation of the canvas, or Save/Load to your browser's local storage (there is only one save file!),
5. Print your finished pattern at the correct scale using the Print Dialog form. 

## Further Information
Visit my [blog post](https://goldinvo.com/blog/2024/06/29/lace-pattern-tool) details about
using this tool, or watch the video below.

*/

function AboutDialog({ open, handleClose }) {
 
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            About
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
          <h1>Lace Pattern Tool</h1>
    <p><strong>Lace Pattern Tool</strong> is an interactive canvas designed for making bobbin lace patterns. It is easy-to-learn and free-to-use!</p>

    <p>If you enjoyed using this tool or have any feedback, bug reports, or feature requests, please email me at <a href="mailto:goldin@goldinvo.com">goldin@goldinvo.com</a>.</p>

    <h2>Quick Start</h2>
    <p>Hover over buttons to see the actions they perform and the keyboard shortcuts associated with them.</p>
    <ol>
        <li>Navigate the canvas by zooming (scroll) and panning (Pan mode).</li>
        <li>Use Draw mode to draw points, lines, and freehand draw.</li>
        <li>Use Select mode to make a selection, either by using the default Box select or by using Lasso select. With select mode you can Group Move, Group Delete, cut/copy/paste, or perform transformations.
            <ul>
                <li>To use many of these features, you must first plot a <strong>"Control Point"</strong> by double-clicking.</li>
            </ul>
        </li>
        <li>Export/Import a text representation of the canvas, or Save/Load to your browser's local storage (there is only one save file!).</li>
        <li>Print your finished pattern at the correct scale using the Print Dialog form.</li>
    </ol>

    <h2>Further Information</h2>
    <p>Visit my <a href="https://goldinvo.com/blog/2024/06/29/lace-pattern-tool">blog post</a> for details about using this tool, or watch the video below.</p>
    <iframe width="889" height="500" src="https://www.youtube.com/embed/yQAynfm4L6E" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
  );
}

export default AboutDialog;


