
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Icon } from '@iconify/react';

export default function AddingAccount(receivedData) {
  const item = receivedData.receivedData
  const [open, setOpen] = useState(false);

  const [istatus, setistatus] = useState(item.statusLabel);

  const ondialogClose = () => {
    setOpen(false);
  };

  const onchangeStatus = () => {
    if(istatus == "Active"){
      setistatus("Pending")
    } else if(istatus == "Pending"){
      setistatus("Disabled")
    } else {
      setistatus("Active")
    }
  };

  useEffect(() => {

    if(item.modal == "Open"){
        item.modal = "Openned";
        setOpen(true);
    } else {
        setOpen(false);
    }
    
  }, [receivedData]);

  return (

      <Dialog open={open} >

        <DialogTitle>

        </DialogTitle>

        <DialogContent>

        <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Account Form
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Account ID"
            name="Account ID"
            size="small"
            value={item.accountID}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Nickname"
            name="Nickname"
            size="small"
            value={item.accountNickname}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Role"
            name="Role"
            size="small"
            value={item.accountRole}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Application"
            name="Application"
            size="small"
            value={item.appName}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
            
                {
                  istatus == "Active" ? 
                    <Button onClick={onchangeStatus}>
                        <Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  /> 
                        <span style={{color: "green"}}> Active </span>
                    </Button>
                  : istatus == "Pending" ? 
                    <Button onClick={onchangeStatus}>
                        <Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  />
                        <span style={{color: "orange"}}> Pending </span>
                    </Button>
                  :
                    <Button onClick={onchangeStatus}>
                        <Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 5 }}  />
                        <span style={{color: "red"}}> Disabled </span>
                    </Button>
                }
        </Grid>
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<Icon icon="carbon:view-off-filled" color='gray' width={22} sx={{ mr: 5 }}  />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Accordion Title</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Accordion Content
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

      </Grid>
    </form>

        </DialogContent>



        <DialogActions>

            
            <Button onClick={ondialogClose}>Cancel</Button>
            <Button type="submit">Save Account</Button>
        </DialogActions>

      </Dialog>

  );
}