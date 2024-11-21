
import { useState, useEffect } from 'react';
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
  Avatar 

} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import OnMobileScreen from 'src/items/screen/resize';


export  function Upserting({receivedData, returnData}) {

  const itemx                               = receivedData
  const rates                               = itemx.length > 0 ? JSON.parse(itemx?.fxRates) : []
  const [open, setOpen]                     = useState(false);
  const [onData, setonData]                 = useState([]);
  const [onDataRates, setonDataonDataRates] = useState([]);
  const [searching, setSearching]           = useState("");

  const OnMobile= OnMobileScreen();

  const filterSearch =(val)=>{

        setSearching(val)
        const z = onData.filter((o) => String(o.curr).toLowerCase().includes(val.toLowerCase()) || o.usd == val);
        if(val == ""){
          setonDataonDataRates(onData)
        } else {
          setonDataonDataRates(z)
        }

  }

  useEffect(() => {
    setOpen(receivedData.modal ? true : false)

    if(receivedData.modal){

      const arr = JSON.parse(itemx.fxRates)
      const FXValues = Object.values(arr);
      const FXKeys   = Object.keys(arr);
  
      const FXs = FXKeys.map((i,c) => ({curr:i, usd:FXValues[c]}));
  
      setonData(FXs)
      setonDataonDataRates(FXs)

    }

  }, [itemx]);


  return (

      <Dialog open={open} >


        <DialogContent>


      <Grid container spacing={OnMobile ? 1 : 2} sx={{ padding: OnMobile ? '0rem' : '.5rem' }}>
        
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            FX RATE     {itemx.length}
          </Typography>
        </Grid>


        <Grid item xs={12}>
          <p style={{fontSize:'13px',color:'lightgray'}}>Date: {itemx.fxDateFormat}</p>
          <p style={{fontSize:'13px',color:'lightgray', marginTop:'-10px'}}>Provider: {itemx.fxProvider}</p>
        </Grid>

        <Grid item xs={12}>
        <TextField
                label="Search"
                name="Search"
                size="small"
                InputProps={{ maxLength: 6 }}
                value={searching}
                onChange={(e)=>filterSearch(e.target.value)}
                fullWidth
                required
              />
        </Grid>

        <Grid item xs={12} sx={{maxHeight: '300px', overflow: 'auto',marginTop:'10px'}}>
          {onDataRates.map((i, index) => (
                <Chip key={index} size='small' label={i.curr+": "+i.usd}  sx={{ backgroundColor: 'transparent', border: '1px solid violet', color: 'violet', margin: '5px' }} variant="outlined" />
               ))}
        </Grid>


        <Grid item xs={12}>
          <Divider />
        </Grid>


      </Grid>

        {
          Fnc.JSONS(onData,false)
        }
   
        </DialogContent>
      
        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>
          <Button onClick={()=>setOpen(false)} sx={{borderRadius:'0',width:'50%'}} variant='outlined' loading='true' >CANCEL</Button>
        </DialogActions>

      </Dialog>

  );
}