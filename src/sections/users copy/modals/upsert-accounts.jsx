import { useState,useEffect } from 'react';

import React from 'react';
import axios from 'axios';

import {Button,
        Chip,
        Divider,
        Typography,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Grid,
        Autocomplete,
        InputLabel,
        Select,
        TextField,
        MenuItem,
        TableRow,} from '@mui/material/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Eq from 'src/hooks/calculations'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import {AlertSnack} from 'src/items/alert_snack'
import { Icon } from '@iconify/react';



export default function ModalUpsertAccounts({ DATA, RETURN, ITEMS }) {
    
    const itemx = DATA.value
    const isEdit = DATA.type == 'edit' ? true : false


    const [onAlert, setonAlert]                   = useState({open:false,type:'',message:''});
    const [onData, setonData]                     = useState({});
    const [isSuccess, setisSuccess]               = useState(false);

    const [iApp, setiApp]                         = useState(null);
    const [iUser, setiUser]                       = useState(null);

    const listUSERS   = ITEMS.USERS.data
    const listAPPS    = ITEMS.APPS.data

    const seeAPPS = listAPPS.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.id, 
                                                                    label:                e.appName,
                                                                    appID:                e.appID,
                                                                    appName:              e.appName,
                                                                    appStatus:            e.appStatus,
                                                                  } 
                                                      } 
                                        )

    const seeUSERS = listUSERS.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.id, 
                                                                    label:                e.firstname ? e.firstname+' '+e.lastname : e.nickname,
                                                                    userID:               e.id,
                                                                    userName:             e.firstname ? e.firstname+' '+e.lastname : '',
                                                                    userNick:             e.nickname,
                                                                  } 
                                                      } 
                                        )

    //const Ndx_App = seeCLUBS.filter((e)=> e.clubID == itemx.CLUBID )

    const Ndx_App   = seeAPPS.find((e)=> e.id == itemx?.appID )
    const Ndx_User  = seeUSERS.find((e)=> e.id == itemx?.userID )


    
    const OnAlerting =(open,type,message,time)=>{

        setonAlert({open:open,type:type,message:message})
        const T = setTimeout(() => {
            setonAlert({open:false,type:'',message:''})
        }, time ? time : 2000);
        return () => clearTimeout(T);
  
    }

    const OnClosing =(i)=>{
      RETURN(Fnc.numRandom(),false,'close')
    }

    const onchangeItem=(i,ii)=>{
      setonData({ ...onData, [ii]: ii == 'accountID' ? [i] : i, id: isEdit ? onData.id : 0, oldaccountID: isEdit ? onData.accountID[0] : 0  })
    }

    const onchangeDDown =(i,e)=>{
      e(i)
      if( e == setiApp ){
        setonData({ ...onData, appID: i?.id  })
      } else {
        setonData({ ...onData, userID: i?.id  })
      }
  }

    const onchangeStatus=(i,ii)=>{
      setonData({...onData, statusLabel:i, status:ii })
      setisSuccess(false)
    }


    const oncheckDATA=(i,ii)=>{
      setisSuccess(true)
      const checkAccountID = onData.accountID[0].length >= 5 ? true : false 
        if( checkAccountID ){
            const IDSplit = onData?.accountID[0].split(',');

            const newArr = IDSplit.map((p, index) => {
              return {
                ...onData, 
                accountID:  Fnc.wordUpper(p), 
                userID:     onData.userID ? onData.userID : 0
              };
            }); 
      
            const result = newArr.map((y) => {
              if (String(y.accountID).length >= 5) {
                return '';
              } else {
                return 'INC'; 
              }
            });
      
              if( Fnc.isNull(iApp?.id,0) ){
                OnAlerting(true,'error','Select an application')
                setisSuccess(false)
              } else if( result == 'INC' || onData.accountID[0] == undefined ){
                OnAlerting(true,'error','Account ID/s should atleast have 5 characters')
                setisSuccess(false)
              } else if( Fnc.isNull(onData.accountNickname) && isEdit){
                OnAlerting(true,'error','Account nickname should atleast have 5 characters')
                setisSuccess(false)
              } else if( Fnc.isNull(onData.statusLabel) ){
                OnAlerting(true,'error','Select a status')
                setisSuccess(false)
              } else {
                submitDATA(newArr)
              }
            
        } else {
            OnAlerting(true,'error','Account ID/s should atleast have 5 characterss')
        }


    }

    async function submitDATA(i) {

      try {

        const response = await axios.post(LinkUPLOAD('accounts'),UpsertDATA({JSONData: i}));

        const feed =  response.data;
        console.log(feed)
        if(feed.hits > 0){
          OnAlerting(true,'error','Account ID already taken! ('+feed.hitsList+')')
          setisSuccess(false)
        } else if(feed.added > 0){

          OnAlerting(true,'success','Account added!')
          const T = setTimeout(() => {
              OnClosing()
          }, 1500);
          return () => clearTimeout(T);
          
        } else if(feed.updated > 0){

          OnAlerting(true,'success','Account updated!')
          const T = setTimeout(() => {
              OnClosing()
          }, 1500);
          return () => clearTimeout(T);

        } else if(feed.record > 0){
          OnAlerting(true,'error','Cannot update used account ID!')
          setisSuccess(false)
        } else if(feed.updated == 0){
          OnAlerting(true,'error','Account not updated!')
          setisSuccess(false)
        } else {
          OnAlerting(true,'warning','Please try again!')
          setisSuccess(false)
        }

        setisSuccess(false)

      } catch (error) {
        OnAlerting(true,'error','Something went wrong! Error')
        setisSuccess(false)
      }

    }

    useEffect(() => {

      setonData({...itemx, accountID: [itemx.accountID], oldaccountID: itemx.accountID })
      setisSuccess(false)
      setiApp(Ndx_App ? Ndx_App : null)
      setiUser(Ndx_User ? Ndx_User : null)


    }, [DATA.modal == true]);

  return (

    <Dialog open={DATA.modal ? DATA.modal : false } fullWidth>

        <DialogTitle style={{marginTop: '10px', }}>
            <Typography variant="h5" component="div" >
                {isEdit ? 'EDIT' : 'ADD'} ACCOUNT
            </Typography>
        </DialogTitle>

        <DialogContent >

          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>

            <Grid item xs={12} sm={12} md={12} > </Grid>

            <Grid item xs={12} sm={6} md={6} >
              <Autocomplete
                  value={iApp}
                  onChange={(event, newValue) =>onchangeDDown(newValue,setiApp)}
                  options={seeAPPS}
                  getOptionLabel={(option) => option.label ? option.label : ''}
                  isOptionEqualToValue={(option, value) => option.id === iApp?.id}
                  filterOptions={Fnc.filterOptions}
                  renderOption={(props, option) => (
                    <React.Fragment key={option.id}>
                      <span {...props}>{option.label}</span>
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={iApp ? false :true}
                      label={ iApp?.id ? "Application"  : "Select a application"}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={6} > </Grid>

            <Grid item xs={12} sm={6} md={6} >
            <Autocomplete
                value={iUser}
                onChange={(event, newValue) =>onchangeDDown(newValue,setiUser)}
                options={seeUSERS}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === iUser?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ iUser?.id ? "User"  : <span>Select a user <i style={{fontSize:'13px'}}>(optional)</i></span>}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} > </Grid>

            <Grid item xs={12} sm={12} md={12} >
              <TextField
                  label={<span>Account ID {isEdit ? '' : <>/s <i style={{fontSize:'13px'}}>(Separated by comma)</i></>}</span>}
                  //error={Fnc.isNull(isEdit ? onData.accountID[0] : onData?.accountID)}
                  InputProps={{ maxLength: 22 }}
                  value={onData?.accountID}
                  onChange={(e) => onchangeItem(isEdit ? Fnc.wordAlphaID(e.currentTarget.value) : Fnc.wordAlphaIDs(e.currentTarget.value), "accountID")}
                  fullWidth
                  required
                />
            </Grid>

              {
                !isEdit ? null :
              <Grid item xs={12} sm={12} md={12} >
                <TextField
                    label={<span>Account Nickname</span>}
                    error={Fnc.isNull(onData.accountNickname)}
                    InputProps={{ maxLength: 22 }}
                    value={onData?.accountNickname}
                    onChange={(e) => onchangeItem(Fnc.wordNoSpaceCapital(e.currentTarget.value), "accountNickname")}
                    fullWidth
                    required
                  />
              </Grid>
              }

            <Divider/>


            <Grid item xs={12}>
                <Chip icon={<Icon icon="mdi:check-circle"/>} 
                      label='Active' 
                      variant={'contained'} 
                      color={onData.statusLabel =='Active' ? 'success' : 'default'}
                      onClick={()=>onchangeStatus('Active',0)}  />
                &nbsp;
                <Chip icon={<Icon icon="mdi:clock-outline"/>} 
                      label='Pending' variant={'contained'}  
                      color={onData.statusLabel =='Pending' ? 'warning' : 'default'} 
                      onClick={()=>onchangeStatus('Pending',1)} />
                &nbsp;
                <Chip icon={<Icon icon="mdi:close-circle"/>} 
                      label='Disabled' variant={'contained'}  
                      color={onData.statusLabel =='Disabled' ? 'error' : 'default'} 
                      onClick={()=>onchangeStatus('Disabled',2)} />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions style={{padding:'20px'}}>

            <Button sx={{...Cls.buttonClass('contained','violet'), width:'50%',borderRadius:'0',}} 
                    variant='contained' 
                    disabled={isSuccess}
                    onClick={() => oncheckDATA()}>
                    {isSuccess ? 'SUBMITTING' : !isSuccess && isEdit ? 'UPDATE' : "ADD"}
            </Button>
            <Button variant='outlined' 
                    onClick={() => OnClosing(isSuccess)}
                    sx={{borderRadius:'0',width:'50%'}}>
                    Close
            </Button>


        </DialogActions>
    {
      onAlert.open ? 
      AlertSnack(onAlert.type,onAlert.message)
      :
      null
    }
    {
     //<pre style={{fontSize:'9px'}}>{JSON.stringify(seeAPPS,null,2)}</pre>
    }
    {
      //String(isEdit)
    }
    </Dialog>
  );
}