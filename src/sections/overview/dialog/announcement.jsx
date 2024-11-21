
import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  Chip,
  Box,
  Avatar,
  Tooltip,
  Accordion ,
  AccordionSummary ,
  AccordionDetails,
  FormControlLabel,
  Checkbox
} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'


import { AlertSnack } from 'src/items/alert_snack'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import { imagetoRESIZE, imageUPLOADS } from 'src/hooks/imageupload'

import OnMobileScreen from 'src/items/screen/resize';
import { CheckBox } from '@mui/icons-material';

import { Card_Image } from '../card/card-image-item'
import { Hello } from '../card/hello'
export default function Announcements({onOpen,onItems,onItem,onReturn}) {

    const [open, setOpen]                   = useState(false);
    const [avail, setAvail]           = useState(false);

    const check = onItems?.data?.id;

    const u =  JSON.parse( localStorage.getItem('slk-user') );

  useEffect(() => {
    if(onItems?.open == true){
        setOpen(true);

        const T = setTimeout(() => {
          setAvail(true)
        }, 2000);
        return () => clearTimeout(T);
    }



  }, [onOpen,onItems]);

  const handleClose = () => {
    if(avail){
      setOpen(false);
    }

  };

  return (

      <Dialog open={open} onClose={handleClose} fullWidth  PaperProps={{
        sx: {
            backgroundColor: 'transparent', boxShadow: 'none',
        },
    }}>
        
        {
            check != undefined 
            ?
            <Card_Image onReceived={onItems} />
            :
            <DialogContent sx={{backgroundColor: 'rgba(0, 0, 0, .5)', boxShadow: 'none',}} onClick={handleClose}>

                <Typography variant='h4' align="center" sx={{justifySelf:'center'}}>
                    <Hello value={u.firstname ? u.firstname : u.nickname}/> 
                </Typography>
            </DialogContent>
        }

      </Dialog>

  );
}