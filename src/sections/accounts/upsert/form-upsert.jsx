
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

import { Icon } from '@iconify/react';

export default function AddingAccount(receivedData) {
  const item = receivedData.receivedData
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
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
            Account ID: {item.accountID}
        </DialogTitle>

        <DialogContent>

            <DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </DialogContentText>

            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />

            <Button>
                
                {
                  item.statusLabel == "Active" ? 
                   <><Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  /> <span style={{color: "green"}}> Active </span></>
                  : item.statusLabel == "Pending" ? 
                   <><Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  /><span style={{color: "orange"}}> Pending </span></>
                  :
                   <><Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 5 }}  /><span style={{color: "red"}}> Disabled </span></>
                }

            </Button>

        </DialogContent>



        <DialogActions>

            
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save Account</Button>
        </DialogActions>

      </Dialog>

  );
}