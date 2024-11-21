
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
  Autocomplete

} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'


import { AlertSnack } from 'src/items/alert_snack'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import { imagetoRESIZE, imageUPLOADS } from 'src/hooks/imageupload'

import OnMobileScreen from 'src/items/screen/resize';

export default function Upserting({receivedData, receivedItems, returnData}) {
  
  const itemx                             = receivedData

  const [open, setOpen]                   = useState(false);
  const [onData, setonData]               = useState({id: 0});
  const [onSubmitLoad, setonSubmitLoad]   = useState(false);

  const [appsID, setappsID]               = useState(null);
  const [userID, setuserID]               = useState(null);

  const onMobile= OnMobileScreen();

    const seeAPPS = receivedItems?.APPS.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.appName, 
                                                                    label:                e.appName, 
                                                                    description:          e.appName, 
                                                                    ...e
                                                                  } 
                                                      } 
                                        )

    const seeUSERS = receivedItems?.USERS.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.firstname ? e.firstname+' '+e.lastname : e.nickname, 
                                                                    label:                e.firstname ? e.firstname+' '+e.lastname : e.nickname, 
                                                                    description:          e.userNickname, 
                                                                    ...e
                                                                  } 
                                                      } 
                                        )

    const ndx_app   = seeAPPS.find((e)=> e.id == itemx.appID)
    const ndx_user  = seeUSERS.find((e)=> e.id == itemx.accountUserID)

  const onChanging =(i,e,u)=>{

    const ifStatus = e == 'accountStatusLabel' ? {'status': u} : {}
    const newArr = {...onData, ...ifStatus, [e]: i, }
    setonData({...newArr })

  }

  const onDropDown =(i,e)=>{

    if(i == null || i == undefined){
      e(null)
    } else {
      e(i)
    }

    if( e == setuserID){
      setonData({...onData, accountUserID: i ? i.id : '0'  })
    } else if ( e == setappsID ){
      setonData({...onData, appID: i ? i.appID : '0'  })
    }


  }

  const inputComplete = (i,ii) => {

    if(i == "" || i == null || i == undefined){
      return true
    } else {
      return false
    }

  };

  const editableID = onData?.id == 0 || onData?.count_asPlayer == 0 && onData?.count_asUpline == 0 && onData?.count_asAgency == 0 && onData?.count_asDownline == 0 ? false : true

  const checkIfComplete = () => {
    if(onData.id != 0 && ( onData.appID == itemx.appID && onData.accountID == itemx.accountID && onData.accountNick == itemx.accountNick && onData.accountUserID == itemx.accountUserID &&  onData.accountStatusLabel == itemx.accountStatusLabel && onData.accountUserNick == itemx.accountUserNick)  ){
      return true
    } else if( ( Fnc.isNull(onData.accountID) || Fnc.isNull(onData.accountNick) || Fnc.isNull(onData.appID,0) || Fnc.isNull(onData.accountStatusLabel,0) || onData?.accountID.length < 5 || onData?.accountNick.length < 5 ) ) {
      return true
    } else {
      return false
    }
  };

  const delayReturn =(i,e,a)=>{
    const T = setTimeout(() => {
      returnData( i, e )
      setOpen(a)
    }, 1500);
    return () => clearTimeout(T);
  }

  const onSubmitting =()=>{

    setonSubmitLoad(true)

    if( checkIfComplete() ){
        returnData( 'error', 'Incomplete details' )
        setonSubmitLoad(false)
    } else {
        proceedSubmit()
    }

    async function proceedSubmit() {
      var addNick = 0
      const JSONData = String(onData?.accountID).split(',').map(i => {
        if(String(i).length > 4){
          addNick++
          return {
                    id:               onData.id ? onData.id : '0',
                    accountID:        Fnc.textSanitize(i), // Trim any whitespace
                    accountNickname:  Fnc.textSanitize(onData.accountNick) + (addNick  == 1 ? '' : addNick),
                    userID:           onData.accountUserID ? onData.accountUserID : 0,
                    appID:            onData.appID,
                    status:           onData.accountStatusLabel == 'Active' ? '0' : onData.accountStatusLabel == 'Pending' ? '1' : '2',
                    oldaccountID:     onData.oldaccountID ? onData.oldaccountID : '0',
                  }
        } else {
          returnData( 'error', 'Each ID should be atleast 5 characters' )
        }
      })
                      
      try {

        const response = await axios.post(LinkUPLOAD('accounts'),UpsertDATA({JSONData}));
        const feed =  response.data;

        if( feed.added >= 1 ){

          delayReturn( 'success', 'Added', false )
          
        } else if( feed.updated >= 1 ){

          delayReturn( 'success', 'Updated', false )

        } else if( feed.duplicate >= 1 ){

          delayReturn( 'warning', 'Duplicate', true )
          setonSubmitLoad(false)

        } else if( feed.record >= 1 ){

          delayReturn( 'warning', 'Unable to change account with existing record!', true )
          setonSubmitLoad(false)

        } else {

          delayReturn( 'error', 'Please try again', true )
          setonSubmitLoad(false)

        }

      } catch (error) {

        delayReturn( 'error', 'Please try again', true )
        setonSubmitLoad(false)

      }
    }

  }

  useEffect(() => {

    if(itemx.modal == "Open"){
        itemx.modal = "Open";
        setOpen(true);
    } else {
        setOpen(false);
    }
    setonSubmitLoad(false)

    setappsID(ndx_app ? ndx_app : null)
    setuserID(ndx_user ? ndx_user : null)

    setonData({...itemx, id: itemx?.id ? itemx?.id : 0, oldaccountID: itemx?.accountID})
  }, [receivedData,itemx]);

  return (

      <Dialog open={open} >

        <DialogTitle sx={{ m: 1, p: 1 }} id="customized-dialog-title">
            <Typography variant="h6" component="div" margin={1}>
              ACCOUNT FORM
            </Typography>
            <Divider />
        </DialogTitle>

        <DialogContent>

        <Grid container padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>

        <Grid item xs={12} sm={12} md={12}>
        <Autocomplete
                value={appsID} 
                onChange={(event, newValue) =>onDropDown(newValue,setappsID)}
                options={seeAPPS}
                getOptionLabel={(option) => option.value ? option.value : ''}
                isOptionEqualToValue={(option, value) => option.id === appsID?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fnc.isNull(appsID) ? true : false}
                    label={ 'Application'}
                    variant="outlined"
                    fullWidth  size='small'
                    sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, }}
                  />
                )}
              />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
        <Autocomplete
                value={userID}  
                onChange={(event, newValue) =>onDropDown(newValue,setuserID)}
                options={seeUSERS}
                getOptionLabel={(option) => option.value ? option.value : ''}
                isOptionEqualToValue={(option, value) => option.id === userID?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fnc.isNull(userID) ? true : false}
                    label={ <>User <span style={{fontSize:'12px'}}>(if user exist)</span></>}
                    variant="outlined"
                    fullWidth size='small'
                    sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, }}
                  />
                )}
              />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
            label={(onData?.accountID?.includes(',') ? 'ID (atleast 5 characters each)' : editableID ? <span style={{color:'#ff4554',fontWeight:'700'}}>ID's with records cannot be changed</span> : 'ID (atleast 5 characters)' )}
            error={inputComplete(onData.accountID,'id') || onData?.accountID?.length < 5 }
            disabled={editableID}
            InputProps={{  sx: { fontSize: onMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
            value={onData.accountID ? onData.accountID : ''}
            onChange={(e) => onChanging( onData?.id > 0 ? Fnc.wordAlphaID(e.currentTarget.value) :  Fnc.wordAlphaIDs(e.currentTarget.value), "accountID")}
            fullWidth variant='outlined'
            autoComplete='off'
            required size='small'
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
            label={"Nickname "+(onData?.accountNick?.length < 5 ? '(atleast 5 characters)' : '' )}
            error={inputComplete(onData.accountNick) || onData?.accountNick.length < 5 }
            inputProps={{  sx: { fontSize: onMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
            value={onData.accountNick ? onData.accountNick : ''}
            onChange={(e) => onChanging(Fnc.wordNormal(e.currentTarget.value), "accountNick")}
            fullWidth variant='outlined'
            autoComplete='off'
            required size='small'
          />
        </Grid>


        <Grid item xs={12} sm={12} md={12}>

                <Chip icon={<Icon icon="mdi:check-circle"/>} 
                      label='Active'  size='small'
                      variant={'contained'} 
                      sx={{fontSize: onMobile ? '11px' : ''}}
                      color={onData.accountStatusLabel =='Active' ? 'success' : 'default'}
                      onClick={()=>onChanging('Active',"accountStatusLabel",0)}  />
                &nbsp;
                <Chip icon={<Icon icon="mdi:clock-outline"/>} 
                      label='Pending' variant={'contained'}  size='small' 
                      sx={{fontSize: onMobile ? '11px' : ''}}
                      color={onData.accountStatusLabel =='Pending' ? 'warning' : 'default'} 
                      onClick={()=>onChanging('Pending',"accountStatusLabel",1)} />
                &nbsp;
                <Chip icon={<Icon icon="mdi:close-circle"/>} 
                      label='Disabled' variant={'contained'}   size='small'
                      sx={{fontSize: onMobile ? '11px' : ''}}
                      color={onData.accountStatusLabel =='Disabled' ? 'error' : 'default'} 
                      onClick={()=>onChanging('Disabled',"accountStatusLabel",2)} />
              
        </Grid>


      {
        itemx.id ? 
        <Grid item xs={12}>

                <Chip label={
                              <span style={{fontSize:"11px"}}>
                                {itemx.recorded_last ? "Latest record: "+itemx.recorded_last : "No records found"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small'  />


              {
                itemx.recorded_last && !Fnc.isNull(itemx.total_playerresult,0)
                ?
                <>
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"11px"}}>
                                {itemx.total_playerresult > 1 ? "Player Result: "+itemx.total_playerresult +' USD' : "No player result"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small'  />
                </>
                :
                null
              }


              {
                itemx.count_clubs
                ?
                <>
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"11px"}}>
                                {itemx.list_clubNames ? "Clubs: "+itemx.list_clubNames : "No clubs"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small'  />
                </>
                :
                null
              }

        </Grid>
        :
        null
      }

      </Grid>


      {Fnc.JSONS(onData,false)}
   
        </DialogContent>
        
        <DialogActions style={{padding:'20px', marginTop:'-15px',display: 'flex', justifyContent: 'center'}}>

        { 
                !onSubmitLoad ? 

                  <>
                  { !checkIfComplete() ?
                  <Button onClick={()=>onSubmitting()} 
                          disabled={onSubmitLoad}
                          sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='contained'>
                          SUBMIT
                  </Button>
                  : null
                  }
                  <Button onClick={()=>setOpen(false)} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}} variant='outlined' loading='true' >CANCEL</Button>
                  </>
                :
                  <Button sx={{...Cs.buttonClass('outlined','violet'), width:'100%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='outlined'>
                            SUBMITTING
                  </Button>
              }

        </DialogActions>
      </Dialog>

  );
}