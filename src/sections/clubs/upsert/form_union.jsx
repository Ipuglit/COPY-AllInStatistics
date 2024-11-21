
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

export default function UploadingExcel_Union({receivedData, receivedItems, returnData}) {
  
  const inputRefAvatar                    = React.createRef();

  const itemx                             = receivedData

  const [open, setOpen]                   = useState(false);
  const [onData, setonData]               = useState(itemx);
  const [onSubmitLoad, setonSubmitLoad]   = useState(false);

  const [unionType, setunionType]         = useState(null);
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

    const ndx_app   = seeAPPS.find((e)=> e.id == itemx.appID)
    const ndx_type  = seeTYPES.find((e)=> e.value == itemx.clubType)

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
      setonData({
                  ...onData, 
                  unionType:  i ? i.value : null, 
                  unionID:    i&&i.value == 'PRIVATE' ? '0' : onData.unionID   
                })


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
    if(onData.id != 0 && ( onData?.name == itemx.unionName && onData?.appID == itemx.appID && onData?.details == itemx.unionDetails && onData?.status == itemx.unionStatus ) ){
      return true
    } else if( Fnc.isNull(onData?.name) || onData?.name.length < 5  ) {
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
                        type:         Fnc.textSanitize(onData?.type),
                        details:      Fnc.textSanitize(onData?.details),
                      }

      try {

        const response  = await axios.post(LinkUPLOAD('unions'),UpsertDATA({JSONData: [{...newJSon}]}));
        const feed      =  response.data;

        if(onData['imagePreview'] != ''){
          //imageUPLOADS('unions',onData['imagePreview'],feed.lastID);          
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
      name:         itemx?.unionName,
      appID:        itemx?.appID,
      type:         itemx?.unionType,
      image:        itemx?.unionImage,
      imageFull:    itemx?.unionImageFull,
      details:      itemx?.unionDetails ? itemx?.unionDetails : '',
      status:       itemx?.unionStatus,
      statusLabel:  itemx?.unionStatusLabel,
      imagePreview: '',
    } 
    : 
    {id: 0, name: '', appID: '0', type: 'UNION', imageFull:'',image:'', imagePreview: '', status: 0, statusLabel: 'Active', details:''}
    
    setunionType(ndx_type ? ndx_type : null)
    setappsID(ndx_app ? ndx_app : null)
    
    setonData(reFill);

  }, [receivedData,itemx]);

  return (

      <Dialog open={open} >

        <DialogTitle sx={{ m: 1, p: 1, marginBottom:'-10px' }}>
            <Typography variant="h6" component="div" margin={1}>
            UNION FORM
            </Typography>
            <Divider />
        </DialogTitle>

        <DialogContent>


        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>

        <Grid item xs={12} sm={12} md={12} hidden>
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
        <Autocomplete hidden
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

        <Grid item xs={12} sm={5} md={5} hidden>
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

        {Fnc.JSONS(onData,false)}

      </Grid>

        </DialogContent>
        
        <DialogActions style={{padding:'20px', marginTop:'-15px',display: 'flex', justifyContent: 'center'}}>


        { 
                !onSubmitLoad ? 

                  <>
                  { !checkIfComplete()  ?
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