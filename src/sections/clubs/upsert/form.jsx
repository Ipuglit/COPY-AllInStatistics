
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
  Paper

} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'


import { AlertSnack } from 'src/items/alert_snack'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import { imagetoRESIZE, imageUPLOADS } from 'src/hooks/imageupload'

import OnMobileScreen from 'src/items/screen/resize';

export default function UploadingExcel({receivedData, receivedItems, returnData}) {
  
  const inputRefAvatar                    = React.createRef();
  const inputRefBackground                = React.createRef();

  const itemx                             = receivedData

  const [open, setOpen]                   = useState(false);
  const [onData, setonData]               = useState(itemx);
  const [onSubmitLoad, setonSubmitLoad]   = useState(false);

  const [unionType, setunionType]         = useState(null);
  const [unionID, setunionID]             = useState(null);
  const [appsID, setappsID]               = useState(null);

  const OnMobile= OnMobileScreen();

    const seeAPPS = receivedItems?.APPS.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.appName, 
                                                                    label:                e.appName, 
                                                                    description:          e.appName, 
                                                                    ...e
                                                                  } 
                                                      } 
                                        )

    const seeTYPES = [{id: 1, value: 'UNION', label: 'UNION'},{id: 2, value: 'PRIVATE', label: 'PRIVATE'}]

    const seeUNIONS = receivedItems?.UNIONS.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.unionID, 
                                                                    label:                e.unionName, 
                                                                    description:          e.unionType, 
                                                                    ...e
                                                                  } 
                                                      } 
                                        )

    const ndx_app   = seeAPPS.find((e)=> e.id == itemx.appID)
    const ndx_type  = seeTYPES.find((e)=> e.value == itemx.clubType)
    const ndx_union = seeUNIONS.find((e)=> e.value == itemx.unionID)

    const handleAvatarClick = () => {
      inputRefAvatar.current.click();
    };

  const onUploadImage = async (event) => {
    const file            = event.target.files[0];
    const imagePreview    = await imagetoRESIZE(file);
    setonData({...onData, imagePreview: imagePreview })
  };

  const onChanging =(i,e,u)=>{

    const ifStatus = e == 'statusLabel' ? {'status': u} : {}
    const newArr = {...onData, ...ifStatus, [e]: i, }

    setonData({...newArr })
  
  }

  const onDropDown =(i,e)=>{

    if(i == null || i == undefined){
      e(null)
    } else {
      e(i)
    }

    if(e == setunionType){

      if(i && i.value == 'PRIVATE'){
        setunionID(null)
      }

      setonData({
                  ...onData, 
                  unionType:  i ? i.value : null, 
                  unionSet:   i&&i.value == 'PRIVATE' ? true : !i ? true : false, 
                  unionID:    i&&i.value == 'PRIVATE' ? '0' : onData.unionID   
                })


    } else if( e == setunionID){
      setonData({...onData, unionID: i ? i.unionID : '0'  })
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

  const checkIfComplete = () => {
    if(onData.id != 0 && onData?.imagePreview == '' && ( onData?.idd == itemx.clubID && onData?.name == itemx.clubName && onData?.appID == itemx.appID && onData?.details == itemx.clubDetails && onData?.status == itemx.clubStatus ) && Fnc.isNull(onData?.unionType) && ( onData?.unionType == 'PRIVATE'  ? !Fnc.isNull(onData?.unionID,0) : Fnc.isNull(onData?.unionID,0)) ){
      return true
    } else if( Fnc.isNull(onData?.idd) || onData?.idd.length < 5 || Fnc.isNull(onData?.name) || onData?.name.length < 5 || Fnc.isNull(onData?.appID,0) || Fnc.isNull(onData?.unionType) || ( onData?.unionType == 'PRIVATE'  ? !Fnc.isNull(onData?.unionID,0) : Fnc.isNull(onData?.unionID,0)) ) {
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

      const newJSon = {
                        ...onData, 
                        name:         Fnc.textSanitize(onData?.name),
                        idd:          Fnc.textSanitize(onData?.idd),
                        details:      Fnc.textSanitize(onData?.details),
                        referralID:   Fnc.textSanitize(onData?.referralID),
                      }

      try {

        const response = await axios.post(LinkUPLOAD('clubs'),UpsertDATA({JSONData: [{...newJSon}]}));
        const feed =  response.data;

        if(onData['imagePreview'] != ''){
          imageUPLOADS('clubs',onData['imagePreview'],feed.lastID);          
        }

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
    const reFill = itemx?.id ? 
    {
      id:           itemx?.id,
      idd:          itemx?.clubID,
      name:         itemx?.clubName,
      appID:        itemx?.appID,
      unionType:    itemx?.clubType,
      unionID:      itemx?.unionID,
      unionSet:     true,
      image:        itemx?.clubImage,
      imageFull:    itemx?.clubImageFull,
      details:      itemx?.clubDetails ? itemx?.clubDetails : '',
      status:       itemx?.clubStatus,
      statusLabel:  itemx?.clubStatusLabel,
      imagePreview: '',
      referralID:   0,
    } 
    : 
    {id: 0, idd: '', name: '', appID: '', unionType: '', unionID: '', unionSet: true, imageFull:'',image:'', imagePreview: '', status: 0, statusLabel: 'Active', details:''}
    
    setunionType(ndx_type ? ndx_type : null)
    setunionID(ndx_union ? ndx_union : null)
    setappsID(ndx_app ? ndx_app : null)
    
    setonData(reFill);

  }, [receivedData,itemx]);

  return (

      <Dialog open={open} >

        <DialogTitle sx={{ m: 1, p: 1, marginBottom:'-10px' }}>
            <Typography variant="h6" component="div" margin={1}>
            CLUB FORM
            </Typography>
            <Divider />
        </DialogTitle>

        <DialogContent>

        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>

        <Grid item xs={12} sm={12} md={12}>
              <Box  component="form"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 4,
                      marginBottom: '-30px',
                      marginTop: '-30px',
                    }} >

                    <img alt="Profile Picture" variant="square"
                                                key={Math.random()}
                                                src={onData?.imagePreview ? onData?.imagePreview :  Fnc.ifImage(`${onData?.imageFull}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+onData?.imageFull}?${new Date().getTime()}`)}
                                                style={{  height: '100px', 
                                                          minWidth:'100px', 
                                                          mb: 0, 
                                                          bgcolor: 'primary.main', 
                                                          border: '2px dashed grey', 
                                                          cursor: 'pointer', 
                                                        }} 
                                              onError={(e) => {
                                                e.target.src = 'https://www.all-in-statistics.pro/images/clubs/defaults.png';
                                              }}
                                              onClick={handleAvatarClick} />

                <input type="file" hidden accept='.jpeg, .jpg, .png' ref={inputRefAvatar} onChange={onUploadImage} />

              </Box>

              
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
        <Autocomplete
                value={appsID} size='small'
                onChange={(event, newValue) =>onDropDown(newValue,setappsID)}
                options={seeAPPS}
                getOptionLabel={(option) => option.value ? option.value : ''}
                isOptionEqualToValue={(option, value) => option.id === appsID?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{fontSize: '12px', }}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fnc.isNull(appsID) ? true : false}
                    label={ 'Application'}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBaseInput': { fontSize: OnMobile ? '11px' : ''}, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                  />
                )}
              />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
            label={(onData?.name?.length < 5 ? <>ID <span style={{fontSize:'11px'}}> (atleast 5 characters)</span></>  : !Fnc.isNull(itemx.recorded_last) ? '(unable to change if with records)' : 'ID' )}
            size='small'
            disabled={!Fnc.isNull(itemx.recorded_last)}
            error={inputComplete(onData.idd) || onData?.idd?.length < 5 }
            InputProps={{  maxLength: 22, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
            value={onData.idd ? onData.idd : ''}
            onChange={(e) => onChanging(Fnc.wordAlphaIDs(e.currentTarget.value), "idd")}
            fullWidth
            autoComplete='off'
            required
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
            label={(onData?.name?.length < 5 ? <>Name <span style={{fontSize:'11px'}}> (atleast 5 characters)</span></> : 'Name' )}
            size='small'
            error={inputComplete(onData.name) || onData?.name.length < 5}
            InputProps={{  maxLength: 22, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
            value={onData.name ? onData.name : ''}
            onChange={(e) => onChanging(Fnc.wordNormal(e.currentTarget.value), "name")}
            fullWidth
            autoComplete='off'
            required
          />
        </Grid>

        <Grid item xs={12} sm={5} md={5}>
        <Autocomplete
                value={unionType} 
                size='small'
                onChange={(event, newValue) =>onDropDown(newValue,setunionType)}
                options={seeTYPES}
                getOptionLabel={(option) => option.value ? option.value : ''}
                isOptionEqualToValue={(option, value) => option.id === unionType?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id} >
                    <span {...props} style={{fontSize: '12px', }}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fnc.isNull(unionType) ? true : false}
                    label={ 'Union Type'}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '' }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                  />
                )}
              />
                            {Fnc.JSONS(itemx,false)}
        </Grid>

        <Grid item xs={12} sm={7} md={7}>
        <Autocomplete
                value={unionID} 
                size='small'
                disabled={onData?.unionSet}
                onChange={(event, newValue) =>onDropDown(newValue,setunionID)}
                options={seeUNIONS}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === unionID?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                    <span style={{ color: 'grey', fontSize: '11.5px' }}> &nbsp;&nbsp;&nbsp; {option.description}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fnc.isNull(unionID) && unionType?.value == 'UNION' ? true : false}
                    label={ 'Union'}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                  />
                )}
              />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Details"
            size='small'
            name="Details"
            multiline
            rows={2}
            variant="outlined"
            InputProps={{  maxLength: 100, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
            InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
            value={onData.details ? onData.details : ''}
            onChange={(e) => onChanging(Fnc.wordNormal(e.currentTarget.value), "details")}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>

                <Chip icon={<Icon icon="mdi:check-circle"/>} 
                      label='Active' size='small'
                      variant={'contained'} 
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      color={onData.statusLabel =='Active' ? 'success' : 'default'}
                      onClick={()=>onChanging('Active',"statusLabel",0)}  />
                &nbsp;
                <Chip icon={<Icon icon="mdi:clock-outline"/>} 
                      label='Pending' variant={'contained'}   size='small'
                      color={onData.statusLabel =='Pending' ? 'warning' : 'default'} 
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      onClick={()=>onChanging('Pending',"statusLabel",1)} />
                &nbsp;
                <Chip icon={<Icon icon="mdi:close-circle"/>} 
                      label='Disabled' variant={'contained'}  size='small'
                      color={onData.statusLabel =='Disabled' ? 'error' : 'default'} 
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      onClick={()=>onChanging('Disabled',"statusLabel",2)} />
              
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

      {Fnc.JSONS(onData, false)}

      {
        itemx.id ? 
        <Grid item xs={12}>


                <Chip label={
                              <span style={{fontSize:"10px"}}>
                                {itemx.countAccounts_active == 0 ? 'No active account' : itemx.countAccounts_active == 1 ? '1 active account' : itemx.countAccounts_active+' active accounts' }
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />
                &nbsp;

                <Chip label={
                              <span style={{fontSize:"10px"}}>
                                {itemx.recorded_last ? "Latest record: "+itemx.recorded_last : "No records found"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />

              {
                itemx.recorded_last && !Fnc.isNull(itemx.total_agencybonus,0)
                ?
                <>
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"10px"}}>
                                {itemx.total_agencybonus > 1 ? "Agency Bonus: "+itemx.total_agencybonus +' USD' : "No agency bonus"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />
                </>
                :
                null
              }

              {
                itemx.recorded_last && !Fnc.isNull(itemx.total_agencyaction,0)
                ?
                <>
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"10px"}}>
                                {itemx.total_agencyaction > 1 ? "Agency Action: "+itemx.total_agencyaction +' USD' : "No agency action"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />
                </>
                :
                null
              }

              {
                itemx.recorded_last && !Fnc.isNull(itemx.total_playerresult,0)
                ?
                <>
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"11px"}}>
                                {itemx.total_playerresult > 1 ? "Player Result: "+itemx.total_playerresult +' USD' : "No player result"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />
                </>
                :
                null
              }

        </Grid>
        :
        null
      }

      </Grid>

        </DialogContent>
        
        <DialogActions style={{padding:'20px', marginTop:'-15px',display: 'flex', justifyContent: 'center'}}>


        { 
                !onSubmitLoad ? 

                  <>
                  { !checkIfComplete() || onData.imagePreview != '' ?
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