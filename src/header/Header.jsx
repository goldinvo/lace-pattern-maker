import {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PrintDialogue from './PrintDialog.jsx';
import ImportExport from './ExportImport.jsx';


function Header(props) {
  const [printOpen, setPrintOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);

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
          onClick={() => setImportExportOpen(true)}
        > Export/Import
        </Button> 
        <ImportExport 
          open={importExportOpen} 
          handleClose={()=>{setImportExportOpen(false); props.setExportJSON('')}} 
          exportJSON={props.exportJSON}
          setExportJSON={props.setExportJSON}
          handleImport={props.handleImport}
          handleExport={props.handleExport}
        />
 
        <Button
          sx={{ my: 2, color: 'black', display: 'block' }}
          onClick={() => setPrintOpen(!printOpen)}
        > Print
        </Button> 
        <PrintDialogue open={printOpen} handleClose={()=>setPrintOpen(false)} handlePrint={props.handlePrint}/>

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