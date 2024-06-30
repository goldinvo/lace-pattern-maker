import {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function Header({handlePrint}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppBar>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="https://goldinvo.com"
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: 'monospace',
            fontWeight: 600,
            color: 'black',
            textDecoration: 'none',
          }}
        >
          goldinvo.com
        </Typography>
        <Button
          sx={{ my: 2, color: 'black', display: 'block' }}
          onClick={handleClickOpen}
        > Print
        </Button> 
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>Print</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="name"
            name="email"
            label="x"
            type="email"
            // fullWidth
            // variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>




        <Button
          sx={{ my: 2, color: 'black', display: 'block' }}
          href="http://goldinvo.com/blog/2024/06/29/lace-pattern-tool.html"  
        > 
          About
        </Button>
        (App is work in progress)
      </Toolbar>
    </AppBar>
  );
}
export default Header;