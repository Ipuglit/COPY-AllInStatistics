
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, Alert, Box,Stack,Chip } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'

import { RawApplications } from 'src/hooks/raw/applications'
import { RawRoles } from 'src/hooks/raw/roles'
import { RawUsers } from 'src/hooks/raw/users'

import {AlertSnack} from 'src/items/alert_snack'

import { UpsertDATA, LinkUPSERTS } from 'src/hooks/upsert/upsert-data'

import OnMobileScreen from 'src/items/screen/resize';

export function AddingItem({receivedData,title}) {
  
  const item        = receivedData


  const rawApp      = RawApplications().data

  const [dataList, setdataList] = useState(item);

  const [FXRates, setFXRates] = useState([]);
  const [FXRatesUp, setFXRatesUp] = useState([]);
  const [open, setOpen] = useState(false);


  const [searching, setSearching] = useState("");
  
  const [onAlertShow, setonAlertShow] = useState(false);
  const [onAlertType, setonAlertType] = useState("");
  const [onAlertMessage, setonAlertMessage] = useState("");


  const [onEdit, setonEdit] = useState(false);
  const [onAdd, setonAdd] = useState(false);

  const OnMobile= OnMobileScreen();



  const ondialogClose = () => {
    if(onAdd){
      setOpen(false);
      setdataList([]);
    } else {
      setOpen(false);
      setdataList([]);
    }
  };

  const onchangeItem = (val, x) => {
    x(val)

      const z = FXRates.filter((o) => o.curr == val || o.usd == val);
      if(val == ""){
        setFXRatesUp(FXRates)
      } else {
        setFXRatesUp(z)
      }
    
      //console.log(JSON.stringify(z))

  };

  const style_chip = { backgroundColor: 'transparent', border: '1px solid violet', color: 'violet' }


  useEffect(() => {

    if(item.modal == "Open"){
        item.modal = "Open";
        setOpen(true);
        const arr = JSON.parse(item.rates)
        
        const FXValues = Object.values(arr);
        const FXKeys   = Object.keys(arr);

        const FXs = FXKeys.map((i,c) => ({curr:i, usd:FXValues[c]}));
        setFXRates(FXs)
        setFXRatesUp(FXs)
    } else {
        setOpen(false);
    }
    setonAdd(false)
    setonEdit(false)
    setdataList(item);

  }, [receivedData,item]);

  return (

      <Dialog open={open} >


        <DialogContent>


      <Grid container spacing={OnMobile ? 1 : 2} sx={{ padding: OnMobile ? '0rem' : '2rem' }}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            {title} FORM
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h8" component="div">
            {item.datestamped}
          </Typography>
        </Grid>
        {
          FXRates ?
            <Grid item xs={6}>
              <TextField
                label="Search"
                name="Search"
                size="small"
                InputProps={{ maxLength: 6 }}
                value={searching}
                onChange={(e) => onchangeItem(Fnc.wordNoSpaceCapital(e.currentTarget.value), setSearching)}
                fullWidth
                required
              />
            </Grid>
          :
          null
        }

        <Grid item xs={12} style={{ overflowY: 'auto', maxHeight: '280px' }}>

            {
              FXRates ?
              FXRatesUp.map((i, index) => (
                <Chip key={index} label={i.curr+": "+i.usd}  style={style_chip} sx={{ margin: '5px' }} variant="outlined" />
               ))
               :
               <Grid item xs={22} sm={22} md={22}>
                <Alert variant="outlined" severity="info" width="100%">
                    Nothing found..
                </Alert>
             </Grid>
            }


          
        </Grid>


        <Grid item xs={12}>
                {
                  item.statusLabel == "Active" ? 
                    <Button size='large'>
                        <Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  /> 
                        <span style={{color: "green"}}> Active </span>
                    </Button>
                  : item.statusLabel == "Pending" ? 
                    <Button size='large'>
                        <Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  />
                        <span style={{color: "orange"}}> Pending </span>
                    </Button>
                  :
                    <Button size='large'>
                        <Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 5 }}  />
                        <span style={{color: "red"}}> Disabled </span>
                    </Button>
                }
        </Grid>
        

      </Grid>
      
      <Grid container justifyContent="flex-end">
          <Grid item xs={2} >
              <Button onClick={ondialogClose} sx={{ color: 'gray'}} >{onEdit ? "CANCEL" : "CLOSE" }</Button>
          </Grid>
      </Grid>
                
        </DialogContent>

        {onAlertShow ? AlertSnack(onAlertType,onAlertMessage) : null}

      </Dialog>

  );
}