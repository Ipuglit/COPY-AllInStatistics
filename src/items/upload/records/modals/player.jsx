
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



export default function UpdatePlayer({dataReceived,dataSubmitted}) {
    
  const bit                                     = dataReceived.ITEMS;

  const [items, setItems]                       = useState([]);
  
  const [listofUplines, setlistofUplines]       = useState([]);
  const [listofAccounts, setlistofAccounts]     = useState([]);
  const [listofClubs, setlistofClubs]           = useState([]);


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
    setlistofAccounts([])
    setlistofClubs([])
  };

  const filterAccounts=(i,ii)=>{

    const x = dataReceived.ACCOUNTS.filter( (e) => e.appID == i && e.accountID != ii );
    if(x){
        const data = x.map(y => {
                                                        return {
                                                                    label:                        y.accountID,
                                                                    value:                        y.accountID,
                                                                    name:                         y.accountNickname,
                                                                    idd:                          y.id,
                                                                    appID:                        y.appID,
                                                                    appName:                      y.appName,
                                                                };
                                                        })
        setlistofAccounts(data)
    } else {
        return setlistofAccounts([])
    }

  }

  const onchangeClub =(i,ii)=>{
        var arrAdd = []

        const y = dataReceived.ACCOUNTS.find( (e) => e.accountID == items.playerID );

        if(y){
            if(y.appID == i.appID){
                arrAdd = { isplayerApp: 'SAME', }
            } else {
                arrAdd = { isplayerApp: 'WRONG', }
            }
        } else {
            arrAdd = { isplayerApp: items.playerID != null && items.playerID != 0 && items.playerID != '' ? 'NEW' : 'NONE', }
        }

        const data = {
                        ...items,
                        ...arrAdd,
                        clubIDD:        i.idd,
                        clubName:       i.value,
                        uplineRake:    i.percent,
                        appID:          i.appID,
                        appName:        i.appName
                    };
                
        filterAccounts(i.appID,items.playerID)
        floodUpline(items.playerID,data,i.idd)
  }

  const onchangePlayer = (i) => {


    const x = dataReceived.ACCOUNTS.find( (e) => e.accountID == i );

    if(x){
        
        if(x.appID == items.appID){
            const arr = {
                            ...items,
                            playerID:       i, 
                            playerName:     x.accountNickname,
                            playerApp:      x.appID,
                            isplayerApp: 'SAME',
                        }

            floodUpline(i,arr,items.clubIDD)
        } else {
            const arr = {
                            ...items,
                            playerID:       i, 
                            playerName:     x.accountNickname,
                            playerApp:      x.appID,
                            isplayerApp: 'WRONG',
                        }

            floodUpline(i,arr,items.clubIDD)
        }

    } else {

        const arr = {
                        ...items,
                        playerID:       i, 
                        playerName:     i != null && i != 0 && i != '' ? 'New Player?' : 'Type player ID', 
                        playerApp:      '0',
                        isplayerApp:    i != null && i != 0 && i != '' ? 'NEW' : 'NONE', 
                    }

        floodUpline(i,arr,items.clubIDD)
    }
    
  };

  const onchangeUpline = (i) => {
   // console.log(i)

    const x = dataReceived.UPLINES.find( (e) => e.playerID == items.playerID && e.clubIDD == items.clubIDD );
    if(x && i != null){

        if(x.appID == items.appID){

            setItems({
                ...items,
                uplineID:               i.label, 
                uplineName:             i.name, 
                agencyRake:          x.percentage,
                isuplineApp:            'SAME', 
            })

        } else {
            setItems({
                ...items,
                uplineID:               i.label, 
                uplineName:             i.name, 
                agencyRake:          x.percentage,
                isuplineApp:            'WRONG', 
            })
        }

    } else {
        setItems({
            ...items,
            uplineID:               i != null ? i.value : null, 
            uplineName:             i != null ? i.name : null, 
            agencyRake:          '0',
            isuplineApp:            i != null ? (i.value != null && i.value != 0 && i.value != '' ? 'NEW': 'NONE') : 'NONE', 
        })
    }

    verifyItems()
  };

  const onchangePercent =(i,e)=>{
    if(e == 'CLUB'){
        setItems({
            ...items,
            uplineRake:        i
        });
    } else if(e == 'UPLINE'){
        setItems({
            ...items,
            agencyRake:        i
        });
    }

    verifyItems()
  }

  const floodUpline = (i,arr,club) => {

    const x = dataReceived.UPLINES.find( (e) => e.playerID == i && e.clubIDD == club );

    if(x){

        if(x.appID == items.appID){
            setItems({
                ...items,
                ...arr,
                uplineID:               x.uplineID,
                uplineName:             x.uplineNickname,
                agencyRake:          x.percentage,
                uplineClub:             x.clubIDD,
                uplineApp:              x.appID,
                isuplineApp:            'SAME',
            })
        } else {
            setItems({
                ...items,
                ...arr,
                uplineID:               x.uplineID,
                uplineName:             x.uplineNickname,
                agencyRake:          x.percentage,
                uplineClub:             x.clubIDD,
                uplineApp:              x.appID,
                isuplineApp:            'WRONG',
            })
        }
    } else {
        setItems({
            ...items,
            ...arr,
            uplineID:               null,
            uplineName:             '',
            agencyRake:          '0',
            uplineClub:             '0',
            uplineApp:              '0',
            isuplineApp:            'NONE',
        })
    }

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

  const verifyItems = () => {

    if(items.isplayerApp == 'SAME' || items.isplayerApp == 'NEW'){
        setonEdit(true)
    } else {
        setonEdit(false)
    }

  };

  useEffect(() => {
    if(dataReceived.DIALOG == true){

        setonOpen(dataReceived.DIALOG)

        setItems({
                    ...items,
                    dateClosed:     bit.dateClosed, 
                    playerID:       bit.playerID, 
                    playerName:     bit.playerName,
                    isplayerApp:    bit.isplayerApp, 
                    appID:          bit.appID, 
                    appName:        bit.appName, 
                    clubIDD:        bit.clubIDD, 
                    clubName:       bit.clubName, 
                    uplineRake:    bit.uplineRake,
                    uplineID:       bit.uplineID,
                    uplineName:     bit.uplineName,
                    agencyRake:  bit.agencyRake,
                    isuplineApp:    bit.uplineID == 0 || bit.uplineID == '' ? 'NONE' : ''
                })

        const dataClubs = dataReceived.CLUBS.map(i => {
            return {
                    label:                        i.name,
                    value:                        i.name,
                    idd:                          i.idd,
                    appID:                        i.appID,
                    appName:                      i.appName,
                    percent:                      i.percent,
                    };
                    })

        setlistofClubs(dataClubs)
        filterAccounts(bit.appID,bit.playerID)
       dataReceived.DIALOG = false
    }
  }, [dataReceived]);


  useEffect(() => {
    if(items){
        verifyItems()
    }
  }, [items]);
  return (

      <Dialog open={onOpen} >

        <DialogTitle style={{marginTop: '10px'}}>

            <Typography variant="h4" component="div" >
              PLAYER DETAILS
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

      <Grid container spacing={1} sx={{ padding: '0rem', marginTop:'20px', paddingRight:'60px',paddingLeft:'50px' }}>
        
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
                    label={'Rakeback %'}
                    size='small'
                    autoComplete="off"
                    value={items.uplineRake}
                    onChange={(e) => onchangePercent(e.target.value,'CLUB')}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                              <Icon icon="gravity-ui:percent" color='violet' sx={{ mr: 0.3 }}  />
                          </InputAdornment>
                        ),
                      }}  />
        </Grid>


        <Grid item xs={12} md={12} xl={12} sx={{marginTop:'15px',}}>

        <TextField
                    required
                    sx={Cls.inputFormat('18','18',items.isplayerApp == 'WRONG' || items.isplayerApp == 'NONE' ? '#ff2f1c' : items.isplayerApp == 'NEW' ? 'orange' : '')}
                    label={items.isplayerApp == 'WRONG' ? 'Player is from other Poker App!' : items.isplayerApp == 'NONE' ? 'Type player ID' : items.isplayerApp == 'NEW' ? 'New Player?' : items.playerName}
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
                        sx={Cls.inputFormat('18','18',items.isuplineApp == 'WRONG' || items.isuplineApp == 'NONE' ? '#ff2f1c' : items.isuplineApp == 'NEW' ? 'orange' : '')}
                        options={Fnc.sortArray(listofAccounts,'value')} 
                        onChange={ (e,newValue) => { onchangeUpline(newValue) } }
                        value={items.uplineID != "0" && items.uplineID != null ? items.uplineID : null}
                        isOptionEqualToValue={(option, value) => Fnc.equalAutoComplete(option, value)}
                        renderInput={(params) => (
                        <TextField  {...params} label={items.isuplineApp == 'WRONG' ? 'Upline is from other Poker App!' : items.isuplineApp == 'NONE' ? 'Choose an upline' : items.isuplineApp == 'NEW' ? 'New Upline? ('+items.uplineName+')' : 'Upline '+items.uplineName} />
                        )}
                         /> 
        </Grid>

        <Grid item xs={4} md={4} xl={3} sx={{marginTop:'15px',}}>
        <TextField
                    required
                    sx={Cls.inputFormat('18','18')}
                    label={'Rakeback %'}
                    size='small'
                    autoComplete="off"
                    value={items.agencyRake}
                    onChange={(e) => onchangePercent(e.target.value,'UPLINE')}
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
            onEdit ? 
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