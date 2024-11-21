
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
  Autocomplete,
  Accordion ,
  AccordionSummary ,
  AccordionDetails

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
  const OnMobile                          = OnMobileScreen();

  const [open, setOpen]                   = useState(false);
  const [onData, setonData]               = useState(itemx);
  const [onSubmitLoad, setonSubmitLoad]   = useState(false);

  const [onExpand, setonExpand]             = useState(false);
  const [onExpandB, setonExpandB]           = useState(false);

  const [roleID, setroleID]               = useState(null);
  const [accountIDS, setaccountIDS]       = useState(null);

  const [onChanged, setonChanged]       = useState(false);

    const seeROLES = receivedItems?.ROLES.map( (e, index)=> { 
                                                          return {  id:                   e.roleID,  
                                                                    value:                e.roleName, 
                                                                    label:                e.roleName, 
                                                                    description:          e.roleName, 
                                                                    ...e
                                                                  } 
                                                      } 
                                        )


    const seeACCOUNTS = receivedItems?.ACCOUNTS.map((i)=>{
                                    return {    
                                                id:         i.increment,
                                                label:      i.accountID,
                                                value:      i.accountID,
                                                user:       i.accountUserFirstName ? i.accountUserName : i.accountUserNick ? i.accountUserNick : '',
                                                disabled:   i.accountUserID == itemx.userID ? false : Fnc.isNull(i.accountUserID,0) ? false : true
                                            }
                                        })
    const idsToCheck = itemx?.list_accountsIDs?.split(',');

    const ndx_accts   = itemx ? seeACCOUNTS.filter(i => idsToCheck?.includes(i.value)).map(i => i) : [];
    const ndx_role    = seeROLES.find((e)=> e.id == itemx.userRoleID)


  const onChanging =(i,e,u)=>{

    const ifStatus = e == 'userStatusLabel' ? {'status': u} : {}
    const newArr = {...onData, ...ifStatus, [e]: i, }

    setonData({...newArr })
  
  }

  const onDropDown =(i,e)=>{

    if(i == null || i == undefined){
      e(null)
    } else {
      e(i)
    }

    if ( e == setroleID ){
      setonData({...onData, userRoleID: i.id  })
    }



  }

  const inputComplete = (i,ii) => {
    if(i == "" || i == null || i == undefined){
      return true
    } else {
      return false
    }
  };

  const checkIfComplete = () => {
    if(onData.id != 0 && !onChanged &&  ( onData.userNick == itemx.userNick && onData.userRoleID == itemx.userRoleID && onData.userFirstName == itemx.userFirstName && onData.userLastName == itemx.userLastName &&  onData.userEmail == itemx.userEmail && onData.userTelegram == itemx.userTelegram && onData.userStatusLabel == itemx.userStatusLabel)  ){
      return true
    } else if( onData.id == 0 && ( Fnc.isNull(onData.userNick) || Fnc.isNull(onData.userRoleID) || Fnc.isNull(onData.userUsername) || Fnc.isNull(onData.userPassword)  || Fnc.isNull(onData.userStatusLabel) || onData?.userNick.length < 5 || onData?.userUsername.length < 5 || onData?.userPassword.length < 5 ) ) {
      return true
    } else if( onData.id != 0 && !onChanged && ( Fnc.isNull(onData.userNick) || Fnc.isNull(onData.userRoleID)  || Fnc.isNull(onData.userStatusLabel) || onData?.userNick.length < 5 ) ) {
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

  const getOldValuesNotInNew  = (oldArray, newArray) => {
    if(!Fnc.isNull(oldArray)){
      return oldArray.filter(value => !newArray.includes(value));
    } else {
      return ''
    }

};

  const onSubmitting =()=>{

    setonSubmitLoad(true)

    if( checkIfComplete() ){
        returnData( 'error', 'Incomplete details' )
        setonSubmitLoad(false)
    } else {
        proceedSubmit()
    }

    async function proceedSubmit() {

      const arrAccounts   = accountIDS.map(q => q.value);
      
      const remAccount    = onData?.list_accountsIDs ? onData?.list_accountsIDs.split(',') : ''

      const JSONData = [{
                          id:                 onData.id ? onData.id : '0',
                          userID:             onData.userID,
                          userNick:           onData.userNick,
                          userRoleID:         onData.userRoleID,
                          userFirstName:      onData.userFirstName,
                          userLastName:       onData.userLastName,
                          userUsername:       onData.userUsername,
                          userPassword:       onData.userPassword,
                          userEmail:          onData.userEmail,
                          userTelegram:       onData.userTelegram,
                          status:             onData.userStatusLabel == 'Active' ? '0' : onData.userStatusLabel == 'Pending' ? '1' : '2',
                          userAccountIDs:     arrAccounts,
                          userAccountIDsOld:  remAccount,
                        }]

      try {

        const response = await axios.post(LinkUPLOAD('users'),UpsertDATA({JSONData}));
        const feed =  response.data;
        console.log(feed)
        if( feed.added >= 1 ){

          delayReturn( 'success', 'Added', false )
          
        } else if( feed.updated >= 1 ){

          delayReturn( 'success', 'Updated', false )

        } else if( feed.duplicate >= 1 ){

          delayReturn( 'warning', 'Duplicate', true )
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

    setaccountIDS(ndx_accts ? ndx_accts : null)
    setroleID(ndx_role ? ndx_role : null)

  setonData({...itemx, id: itemx?.id ? itemx.id : 0,  userPassword: '', userAccountsOld: itemx.list_accountsIDs ? itemx.list_accountsIDs : ''})
    setonChanged(false)
  }, [receivedData,itemx]);

  const renderTags = (value,getTagProps,arr,setArr) => {
    return value.map((i, index) => (
      <Chip
        key={i.id}
        size='small'
        style={{backgroundColor:'#9370db'}}
        label={'ID: '+i.label}
        {...getTagProps({ index })}
        onDelete={() => {
          const newValues = arr.filter(
            (e) => e.value != i.value
          );
          setArr(newValues);
          setonChanged(true)
        }}
      />
    ));
  };

  return (

      <Dialog open={open} >

        <DialogTitle sx={{ m: 1, p: 1, marginBottom:'-10px' }}>
            <Typography variant="h6" component="div" margin={1}>
            USERS FORM
            </Typography>
            <Divider />
        </DialogTitle>

        <DialogContent>


        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
            label={"Nickname"}
            error={inputComplete(onData.userNick) || onData?.userNick?.length < 5 }
            InputProps={{  maxLength: 22, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
            value={onData.userNick ? onData.userNick : ''}
            onChange={(e) => onChanging(Fnc.wordAlphaIDs(e.currentTarget.value), "userNick")}
            fullWidth size='small'
            autoComplete='off'
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
        <Autocomplete
                value={roleID} 
                onChange={(event, newValue) =>onDropDown(newValue,setroleID)}
                options={seeROLES}
                getOptionLabel={(option) => option.value ? option.value : ''}
                isOptionEqualToValue={(option, value) => option.id === roleID?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fnc.isNull(roleID) ? true : false}
                    label={ <>Role</>}
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                          '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, 
                          '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, 
                        }}
                  />
                )}
              />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
            label={"Firstname"}
            error={inputComplete(onData.userFirstName) || onData?.userFirstName?.length < 2 }
            InputProps={{  maxLength: 22, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
            value={onData.userFirstName ? onData.userFirstName : ''}
            onChange={(e) => onChanging(Fnc.wordAlphaIDs(e.currentTarget.value), "userFirstName")}
            fullWidth size='small'
            autoComplete='off'
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
            label={"Lastname"}
            error={inputComplete(onData.userLastName) || onData?.userLastName?.length < 2 }
            InputProps={{  maxLength: 22, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
            value={onData.userLastName ? onData.userLastName : ''}
            onChange={(e) => onChanging(Fnc.wordAlphaIDs(e.currentTarget.value), "userLastName")}
            fullWidth size='small'
            autoComplete='off'
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Accordion expanded={onExpandB} onChange={(e)=>{setonExpandB(onExpandB ? false : true)}}>
            <AccordionSummary expandIcon={<Icon icon={"oui:arrow-up"} />}>
              <Typography sx={{fontSize: OnMobile ? '12px' : ''}}>Contacts</Typography>
            </AccordionSummary>
            <AccordionDetails >
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Email"}
                      error={inputComplete(onData.userEmail) || onData?.userEmail?.length < 5 }
                      InputProps={{  maxLength: 22, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                      value={onData.userEmail ? onData.userEmail : ''}
                      onChange={(e) => onChanging(Fnc.wordNoSpace(e.currentTarget.value), "userEmail")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Telegram"}
                      error={inputComplete(onData.userTelegram) || onData?.userTelegram?.length < 5 }
                      InputProps={{  maxLength: 22, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                      value={onData.userTelegram ? onData.userTelegram : ''}
                      onChange={(e) => onChanging(Fnc.wordNoSpace(e.currentTarget.value), "userTelegram")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
              </Grid>

            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Accordion expanded={onExpand} onChange={(e)=>{setonExpand(onExpand ? false : true)}}>
            <AccordionSummary expandIcon={<Icon icon={"oui:arrow-up"} />} >
              <Typography sx={{fontSize: OnMobile ? '12px' : ''}}>Credentials</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Username"}
                      error={inputComplete(onData.userUsername) || onData?.userUsername?.length < 5 }
                      InputProps={{  maxLength: 35, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                      value={onData.userUsername ? onData.userUsername : ''}
                      onChange={(e) => onChanging(Fnc.wordAlphaIDs(e.currentTarget.value), "userUsername")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Password"}
                      error={inputComplete(onData.userPassword) || onData?.userPassword?.length < 5 }
                      InputProps={{  maxLength: 35, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                      value={onData.userPassword ? onData.userPassword : ''}
                      onChange={(e) => onChanging(Fnc.wordAlphaIDs(e.currentTarget.value), "userPassword")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
              </Grid>

            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>

                <Chip icon={<Icon icon="mdi:check-circle"/>} 
                      label='Active' size='small'
                      variant={'contained'} 
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      color={onData.userStatusLabel =='Active' ? 'success' : 'default'}
                      onClick={()=>onChanging('Active',"userStatusLabel",0)}  />
                &nbsp;
                <Chip icon={<Icon icon="mdi:clock-outline"/>} 
                      label='Pending' variant={'contained'}  size='small'
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      color={onData.userStatusLabel =='Pending' ? 'warning' : 'default'} 
                      onClick={()=>onChanging('Pending',"userStatusLabel",1)} />
                &nbsp;
                <Chip icon={<Icon icon="mdi:close-circle"/>} 
                      label='Disabled' variant={'contained'}  size='small'
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      color={onData.userStatusLabel =='Disabled' ? 'error' : 'default'} 
                      onClick={()=>onChanging('Disabled',"userStatusLabel",2)} />
              
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                    multiple
                    options={seeACCOUNTS}
                    value={accountIDS ? accountIDS : []} 
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value)=>{return option.id === value.id}}
                    onChange={(event, newValues) =>(onDropDown(newValues,setaccountIDS),setonChanged(true))}
                    renderTags={(value, getTagProps)=>renderTags(value, getTagProps,accountIDS,setaccountIDS)}
                    renderOption={(props, option) => (
                      <React.Fragment key={option.id}>
                        <span {...props} style={{ pointerEvents: option.disabled ? 'none' : 'auto',opacity: option.disabled ? 0.5 : 1,fontSize: '12px'}}>
                          ID: {option.label}
                         {option.user && <>&nbsp; <span style={{ fontSize: '11px', color: 'gray'}}>({option.user})</span></>}
                        </span>
                      </React.Fragment>
                    )}
                    renderInput={(params) => <TextField {...params} 
                    sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                    label="Accounts" />}
                    />
        </Grid>



        <Grid item xs={12}>
          <Divider />
        </Grid>

      </Grid>

        </DialogContent>
        
        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

        { 
                !onSubmitLoad  ? 

                  <>
                  { !checkIfComplete() || onChanged ?
                  <Button onClick={()=>onSubmitting()} 
                          disabled={onSubmitLoad}
                          sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: OnMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='contained'>
                          SUBMIT
                  </Button>
                  : null
                  }
                  <Button onClick={()=>setOpen(false)} sx={{borderRadius:'0',width:'50%',fontSize: OnMobile ? '11px' : ''}} variant='outlined' loading='true' >CANCEL</Button>
                  </>
                :
                  <Button sx={{...Cs.buttonClass('outlined','violet'), width:'100%',borderRadius:'0',fontSize: OnMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='outlined'>
                            SUBMITTING
                  </Button>
              }

        </DialogActions>
      </Dialog>

  );
}