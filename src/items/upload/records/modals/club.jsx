
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


import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import {AlertSnack} from 'src/items/alert_snack'
import { nullFormat } from 'numeral';



export default function UpdateClub({dataReceived,dataSubmitted}) {
    
  const bit                                     = dataReceived.ITEMS;

  const [items, setItems]                       = useState([]);
  
  const [listofClubs, setlistofClubs]           = useState([]);


  const [onOpen, setonOpen]                     = useState(false);
  const [onSubmit, setonSubmit]                 = useState(false);
  const [onAlert, setonAlert]                   = useState(false);
  const [semiTotal,setsemiTotal]                = useState(0)

  const onPC = useMediaQuery('(min-width: 700px)');

  const ondialogClose = () => {
    setonOpen(false);
    setsemiTotal(0)
    dataReceived = null
    setonAlert(false)
  };


  const onchangeClub =(i,ii)=>{
        var arrAdd = []
        const data = {
                        ...items,
                        ...arrAdd,
                        clubIDD:        i.idd,
                        clubName:       i.value,
                        uplineRake:    i.percent,
                        appID:          i.appID,
                        appName:        i.appName
                    };
        setItems(data)
        onchangeVerify()
  }

  const onchangePercent =(i)=>{
    setItems({
        ...items,
        uplineRake:        i
    });
    onchangeVerify()
  }

  const onsubmitItem = (i) => {

    dataSubmitted({
                    type: '',
                    total: '',
                    index: dataReceived.INDEX,
                    values: i,
                    })
                    
    const T = setTimeout(() => {
      ondialogClose()
    }, 500);
    return () => clearTimeout(T);

  };

  const onchangeVerify =()=>{
        if(Fnc.isNull(items.clubIDD) || Fnc.isNull(items.clubName) || Fnc.isNull(items.uplineRake,'Num')){
            return false
        } else {
            return true
        }
  }

  useEffect(() => {
    if(dataReceived.DIALOG == true){

        setonOpen(dataReceived.DIALOG)

        setItems({
                    ...items,
                    dateClosed:     bit.dateClosed, 
                    appID:          bit.appID, 
                    appName:        bit.appName, 
                    clubIDD:        bit.clubIDD, 
                    clubName:       bit.clubName, 
                    uplineRake:    bit.uplineRake, 
                })

        const dataClubs = dataReceived.CLUBS.map(i => {
            return {
                    label:                        i.name,
                    value:                        i.name,
                    idd:                          i.idd,
                    percent:                      i.percent,
                    appID:                        i.appID,
                    appName:                      i.appName,
                    };
                    })

        const uniqueArray = [...new Map(dataClubs.map(item => [item.value, item])).values()];

        setlistofClubs(uniqueArray)
     
       dataReceived.DIALOG = false
    }
  }, [dataReceived]);

  return (

      <Dialog open={onOpen} >

        <DialogTitle style={{marginTop: '10px'}}>

            <Typography variant="h4" component="div" >
              CLUB DETAILS
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
              <Typography variant="caption" component="div">
                Closed: {Fnc.dateWord(bit.dateClosed)}
              </Typography>
              : null
            }

        </DialogTitle>

        <DialogContent>
        <Divider />

      <Grid container spacing={2} sx={{ padding: '0rem', marginTop:'20px'}}>
        
      <Grid item xs={8} md={8} xl={9}>
                    <Autocomplete 
                        size='small'
                        clearOnBlur
                        sx={Cls.inputFormat('18','18',items.appID == 0 ? '#ff2f1c' : '')}
                        options={Fnc.sortArray(listofClubs,'value')} 
                        onChange={ (e,newValue) => { onchangeClub(newValue,'CLUB') } }
                        isOptionEqualToValue={(option, value) => Fnc.equalAutoComplete(option, value)}
                        value={ items.appID == 0 ? null : (items.clubName != null ? items.clubName : null)}
                        renderInput={(params) => (
                        <TextField  {...params} 
                                    InputProps={{ ...params.InputProps, endAdornment: undefined }}
                                    label={items.appID != 0 ? (items.clubIDD ? 'Club ID: '+items.clubIDD : 'Choose a club') : 'Club "'+items.clubName+'" not found!'}/>
                        )}
                         /> 
        </Grid>

        <Grid item xs={4} md={4} xl={3} >
        <TextField
                    required
                    sx={ Cls.inputFormat('18','18')}
                    label={'Rake'}
                    size='small'
                    autoComplete="off"
                    value={items.uplineRake}
                    onChange={(e) => onchangePercent(Fnc.numberHundred(e.target.value))}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                              <Icon icon="gravity-ui:percent" color='violet' sx={{ mr: 0.3 }}  />
                          </InputAdornment>
                        ),
                      }}  />
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
            onchangeVerify() ? 
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