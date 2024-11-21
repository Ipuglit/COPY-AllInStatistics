
import { useState, useEffect } from 'react';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Select,
  Autocomplete,
  Chip,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Typography,
} from '@mui/material';

import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import {AlertSnack} from 'src/items/alert_snack'
import { nullFormat } from 'numeral';



export default function UpdateDateClosed({dataReceived,dataSubmitted}) {
    
  const bit                                     = dataReceived.ITEMS;

  const [items, setItems]                       = useState([]);
  
  const [saveDate, setsaveDate]                 = useState(null);

  const [onOpen, setonOpen]                     = useState(false);
  const [onSubmit, setonSubmit]                 = useState(false);
  const [onAlert, setonAlert]                   = useState(false);

  const toDay                                   = new Date();

  const onPC = useMediaQuery('(min-width: 700px)');

  const ondialogClose = () => {

        setonOpen(false);
        dataReceived = null
        setonAlert(false)

  };

   const dateDay = (i) => {
    const n = new Date(i)
    const o = { weekday: 'long'};
    const w = n.toLocaleDateString('en-US', o);
    return w;
  }

  const onchangeDateClosed =(newValue)=>{

        const data = {
                        ...items,
                        dateOpenned:        Fnc.dateDash( Fnc.lastSunday(newValue) ),
                        dateClosed:         Fnc.dateDash(newValue),
                        dateClosedDay:      dateDay(newValue),
                    };

        setItems(data)
        setsaveDate(newValue)
        verifyDate()
  }


  const onsubmitItem = (i) => {

        dataSubmitted({
                        type: '',
                        total: '',
                        index: dataReceived.INDEX,
                        values: i,
                        })
                        
        const T = setTimeout(() => {
          setonOpen(false)
        ondialogClose()
        }, 500);
        return () => clearTimeout(T);

  };

  const verifyDate = () => {

    const today = new Date();
    const dateToCheck = new Date(items.dateClosed);

    if(items.dateClosed == null || items.dateClosed == '' ){
        return false
    } else if (dateToCheck > today){
        return false
    } else {    
        return true
    }

};

const isDate = (i) => {
    const date = new Date(i);
    return date instanceof Date && !isNaN(date);
};


  useEffect(() => {
    if(dataReceived.DIALOG == true){

        setonOpen(dataReceived.DIALOG)
        
        setItems({
                    ...items,
                    dateClosed:     isDate(bit.dateClosed) ? bit.dateClosed : null, 
                    dateClosedDay:      bit.dateClosedDay, 
                    appID:          bit.appID, 
                    appName:        bit.appName, 
                    clubIDD:        bit.clubIDD, 
                    clubName:       bit.clubName, 
                })
       setsaveDate(isDate(bit.dateClosed) ? dayjs(bit.dateClosed) : dayjs(toDay))
       dataReceived.DIALOG = false
    }
    verifyDate()
  }, [dataReceived]);

  return (

      <Dialog open={onOpen} >

        <DialogTitle style={{marginTop: '10px'}}>

            <Typography variant="h4" component="div" >
              DATE CLOSED
            </Typography>

            <Typography variant="subtitle1" component="div" style={{marginTop: '-2px',marginBottom: '12px'}}>
                {bit ? 
                     items.appName == '' || items.appName == null ? 
                        <Chip label={'Please select a club!'} size='small' color="error"  />
                    : bit.appName == items.appName ? 
                        <Chip label={bit.appName} size='small' />
                    :   <> 
                            {
                                bit.appID == 0 ? null :
                                <Chip label={bit.appName} size='small' />
                            }
                            <Chip label={'New: '+items.appName} size='small' color="success" />
                        </>
                : null }
                
            </Typography>

            {
              bit ?
              (
                <>
              <Typography variant="caption" component="div">
                Closed: {Fnc.dateWord(bit.dateClosed)}
              </Typography>

                {
                    bit.clubName ?
                    <Typography variant="caption" component="div">
                        Club: {bit.clubName}
                    </Typography>
                    : null
                }
                </>
              )
              : null
            }

        </DialogTitle>

        <DialogContent>
        <Divider />

      <Grid container spacing={2} sx={{ padding: '0rem', marginTop:'20px'}}>
        
        <Grid item xs={12} md={12} xl={12}>

            <LocalizationProvider dateAdapter={AdapterDayjs}>

                <DateCalendar   value={saveDate ? saveDate : toDay}
                                onChange={onchangeDateClosed}
                                disableFuture />
                <Button sx={{marginTop: '-30px !important', float:'right'}} size={'small'} onClick={()=>setsaveDate(dayjs(toDay))}>
                    Today
                </Button>
            </LocalizationProvider>

        </Grid>

      </Grid>
               
        </DialogContent>

        <Divider />

        <DialogActions sx={{marginBottom:'15px', marginRight:'40px',display: 'flex', justifyContent: 'center'}}>
        {
          onAlert ? 
          <>
          <Button color="secondary" >SAVING...</Button>
          </>
          :
          <>
          {
            verifyDate() ? 
            <Button onClick={()=>{setonAlert(true),onsubmitItem(items)}} color="secondary">SAVE CHANGES</Button>
            : null
          }
          <Button onClick={ondialogClose} sx={{ color: 'gray'}} >{onSubmit ? "CANCEL" : "CLOSE" }</Button>
          </>
        }


        </DialogActions>



      </Dialog>

  );
}