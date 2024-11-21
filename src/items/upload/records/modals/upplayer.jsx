
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

export default function UpdateUPPlayer({dataReceived,dataSubmitted}) {
    
  const bit                                     = dataReceived.ITEMS;

  const [items, setItems]                       = useState([]);
  const [listofUplines, setlistofUplines]       = useState([]);

  
  const [listofAccounts, setlistofAccounts]     = useState([]);

  const [onOpen, setonOpen]                     = useState(false);
  const [onEdit, setonEdit]                     = useState(false);
  const [onSubmit, setonSubmit]                 = useState(false);
  const [onAlert, setonAlert]                   = useState(false);
  const [semiTotal,setsemiTotal]                = useState(0)

  const onPC = useMediaQuery('(min-width: 700px)');

  const ondialogClose = () => {
    setonOpen(false);
    setonEdit(false)
    setsemiTotal(0)
    dataReceived = null
    setonAlert(false)
  };

  const filterUplines=(i)=>{

    const dataUpline = dataReceived.ACCOUNTS
                        .filter( (e) => e.appID == bit.appID && e.accountID != i )    
                        .map(i => {
                        return {
                                label:                        i.accountID,
                                value:                        i.accountID,
                                name:                         i.accountNickname,
                                appID:                        i.appID,
                                appName:                      i.appName,
                                };
                                })
                        .sort((a, b) => {
                            if (a.label < b.label) return -1;
                            if (a.label > b.label) return 1;
                            return 0;
                        });

    setlistofUplines(dataUpline)

  }

  const onchangePlayer = (i) => {

    const x = dataReceived.ACCOUNTS.find( (e) => e.accountID == i );
    const y = dataReceived.UPLINES.find( (e) => e.playerID == i && e.clubIDD == items.clubIDD );
    
    if(x){

        setItems({
                            ...items,
                            playerID:       i, 
                            playerName:     x.accountNickname,
                            playerAppID:    x.appID,
                            uplineID:       y ? y.uplineID : null,
                            uplineName:     y ? y.uplineNickname : '',
                            agencyRake:  y ? y.percentage : 0,
                            uplineAppID:    y ? y.appID : 0,
                        })

    } else {

        setItems({
                        ...items,
                        playerID:       i, 
                        playerName:     i != null && i != 0 && i != '' ? 'New Player?' : 'Type player ID', 
                        playerAppID:    '0', 
                        uplineID:       null,
                        uplineName:     '',
                        agencyRake:  0,
                        uplineAppID:    0,
                    })

    }
    filterUplines(i)
  };

  const onchangeUpline = (i) => {
    if(i){
      const x = dataReceived.UPLINES.find( (e) => e.playerID == items.playerID && e.uplineID == i.value && e.clubIDD == items.clubIDD );

      setItems({
                  ...items,
                  uplineID:               i.label, 
                  uplineName:             i.name, 
                  agencyRake:          x ? x.percentage : 0,
                  uplineAppID:            x ? x.appID : 0,
              })

    } else {
      
      setItems({
                  ...items,
                  uplineID:               0, 
                  uplineName:             '', 
                  agencyRake:          0,
                  uplineAppID:            0,
              }) 
    }

  };

  const onchangePercent =(i,e)=>{
    setItems({
        ...items,
        agencyRake:        i
    });
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
    if( Fnc.isNull(items.playerID,'Num') || verifyPlayerApp() == 'WRONG'  ){
        return false
    } else {
        return true
    }
}

const verifyPlayerApp =()=>{
    if ( Fnc.isNull(items.playerID,'Num')){
        return ''
    } else if( Fnc.isNull(items.playerAppID,'Num')  ){
        return 'NEW'
    } else if( items.playerAppID != items.appID ){
        return 'WRONG'
    } else {
        return ''
    }
}

const verifyUplineApp =()=>{
    if ( Fnc.isNull(items.uplineID,'Num')){
        return ''
    } else if( Fnc.isNull(items.uplineAppID,'Num')  ){
        return 'NEW'
    } else if( items.uplineAppID != items.appID ){
        return 'WRONG'
    } else {
        return ''
    }
}

  useEffect(() => {
    if(dataReceived.DIALOG == true){

        setonOpen(dataReceived.DIALOG)

        setItems({
                    ...items,
                    dateClosed:     bit.dateClosed, 
                    playerID:       bit.playerID, 
                    playerName:     bit.playerName,
                    playerAppID:    bit.playerAppID,  
                    playerState:    bit.playerState,
                    uplineID:       bit.uplineID,
                    uplineName:     bit.uplineName,
                    agencyRake:  bit.agencyRake,
                    uplineAppID:    bit.uplineAppID,
                    uplineClubIDD:  bit.uplineClubIDD,
                    appID:          bit.appID,
                    appName:        bit.appName,
                    clubIDD:        bit.clubIDD,
                    clubName:       bit.clubName,
                })

        filterUplines(bit.playerID)

        dataReceived.DIALOG = false
    }
  }, [dataReceived]);


  return (

      <Dialog open={onOpen} >

        <DialogTitle style={{marginTop: '10px'}}>

            <Typography variant="h4" component="div" >
              PLAYER DETAILS
            </Typography>

            <Typography variant="subtitle1" component="div" style={{marginTop: '-2px',marginBottom: '12px'}}>

            {bit ? 
                     Fnc.isNull(bit.appName) || Fnc.isNull(bit.appID,'Num') ? 
                        <Chip label={'Please select a club!'} size='small' color="error"  />
                    : 
                        <Chip label={bit.appName} size='small' />
                : null }
                
            </Typography>

            {
              bit ?
              <Typography variant="caption" component="div">
                Club: {Fnc.isNull(bit.clubIDD) ? 'NO CLUB' : bit.clubName}
              </Typography>
              : null
            }
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

      <Grid container spacing={1} sx={{ padding: '0rem', marginTop:'20px', paddingRight:'60px',paddingLeft:'50px' }}>
        
        <Grid item xs={12} md={12} xl={12} sx={{marginTop:'15px',}}>

        <TextField
                    required
                    sx={Cls.inputFormat('18','18',verifyPlayerApp() == 'WRONG' ? '#ff2f1c' : verifyPlayerApp() == 'NEW' ? 'orange' : '')}
                    label={verifyPlayerApp() == 'WRONG' ? 'WRONG GAME!' : verifyPlayerApp() == 'NEW' ? 'NEW  PLAYER?' : items.playerName}
                    size='small'
                    autoComplete="off"
                    value={items.playerID}
                    onChange={(e) => onchangePlayer(e.target.value)}
                    fullWidth />
        </Grid>


        <Grid item xs={8} md={8} xl={9} sx={{marginTop:'15px',}}>

            <Autocomplete 
                        size='small'
                        clearOnBlur
                        sx={Cls.inputFormat('18','18',verifyUplineApp() == 'WRONG' ? '#ff2f1c' : verifyUplineApp() == 'NEW' ? 'orange' : '')}
                        options={listofUplines} 
                        onChange={ (e,newValue) => { onchangeUpline(newValue) } }
                        value={items.uplineID != "0" && items.uplineID != null ? items.uplineID : null}
                        isOptionEqualToValue={(option, value) => Fnc.equalAutoComplete(option, value)}
                        renderInput={(params) => (
                        <TextField  {...params} label={verifyUplineApp() == 'WRONG' ? 'Upline is from other Poker App!' : verifyUplineApp() == 'NONE' ? 'Choose an upline' : verifyUplineApp() == 'NEW' ? 'New Upline? ('+items.uplineName+')' : 'Upline '+items.uplineName} />
                        )}
                         /> 

        </Grid>

        <Grid item xs={4} md={4} xl={3} sx={{marginTop:'15px',}}>

            <TextField
                        required
                        sx={Cls.inputFormat('18','18')}
                        label={'Rake %'}
                        size='small'
                        autoComplete="off"
                        value={items.agencyRake}
                        onChange={(e) => onchangePercent(Fnc.numberHundred(e.target.value),'UPLINE')}
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