
import { useState, useEffect } from 'react';
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
  Avatar 

} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'


import { RawRoles } from 'src/hooks/raw/roles'
import { RawCompany } from 'src/hooks/raw/company'

import { AlertSnack } from 'src/items/alert_snack'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import { imagetoRESIZE, imageUPLOADS } from 'src/hooks/imageupload'

import OnMobileScreen from 'src/items/screen/resize';


export  function Upserting({receivedData, returnData}) {

  const itemx                             = receivedData

  const [open, setOpen]                   = useState(false);
  const [onData, setonData]               = useState(itemx);
  const [onSubmitLoad, setonSubmitLoad]   = useState(false);

  const OnMobile= OnMobileScreen();

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

  const inputComplete = (i,ii) => {
    if(i == "" || i == null || i == undefined){
      return true
    } else {
      return false
    }
  };

  const checkIfComplete = () => {
    if(onData.id != 0 && ( onData.name == itemx.appName &&  onData.status == itemx.appStatus && onData.details == itemx.appDetails && onData.imagePreview == '' )  ){
      return true
    } else if( onData.id == 0 && Fnc.isNull(onData.name) ) {
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

    if( checkIfComplete() ){
        returnData( 'error', 'Incomplete details' )
        setonSubmitLoad(false)
    } else {
        setonSubmitLoad(true)
        proceedSubmit()
    }

    async function proceedSubmit() {

      try {
        const response = await axios.post(LinkUPLOAD('applications'),UpsertDATA({JSONData: [{...onData}]}));
        const feed =  response.data;

        if(onData['imagePreview'] != ''){
          imageUPLOADS('applications',onData['imagePreview'],feed.lastID);          
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
      name:         itemx?.appName,
      companyID:    itemx?.appCompanyID,
      image:        itemx?.appImage,
      imageFull:    itemx?.appImageFull,
      details:      itemx?.appDetails,
      status:       itemx?.appStatus,
      statusLabel:  itemx?.appStatusLabel,
      imagePreview: '',
      referralID:   0,
    } 
    : 
    {id: 0, name: '', companyID: '',companyName: '',imageFull:'',image:'', imagePreview: '', status: 0, statusLabel: 'Active', details:'', referralID: 0,}
    
    setonData(reFill);

  }, [receivedData,itemx]);

  return (

      <Dialog open={open} >

        <DialogContent>

        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>
        
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            APPLICATION FORM
          </Typography>
        </Grid>

        <Grid item xs={12}>
        <Box
                width='100%'
                my={4}
                display="flex"
                alignItems="center"
                gap={10}
                sx={{marginBottom:'5px',marginTop:'10px'}}
              >
              <Avatar
                alt="image"
                src={onData.imagePreview ? onData.imagePreview : Fnc.ifImage(onData.imageFull,'/images/applications/default.jpg')}
                sx={{ width: 60, height: 60, marginLeft:'10px' }}
              />
                <input type="file" 
                        accept='.jpeg, .jpg, .png' 
                        style={{height:'50px',lineHeight:'50px', marginLeft:'-50px', width:'100%',border: '1px dashed lightgrey'}}  
                        onChange={onUploadImage} />
              </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Name"
            size="small"
            error={inputComplete(onData.name)}
            //InputLabelProps={{ style: { color: '#BA55D3' }, }}
            InputProps={{ maxLength: 22 }}
            value={onData.name ? onData.name : ''}
            onChange={(e) => onChanging(Fnc.wordNormal(e.currentTarget.value), "name")}
            fullWidth
            autoComplete='off'
            required
          />
        </Grid>





        <Grid item xs={12}>
          <TextField
            label="Details"
            multiline
            rows={2}
            variant="outlined"
            error={inputComplete(onData.details)}
            //InputLabelProps={{ style: { color: '#BA55D3' }, }}
            InputProps={{ maxLength: 100 }}
            value={onData.details ? onData.details : ''}
            onChange={(e) => onChanging(Fnc.wordNormal(e.currentTarget.value), "details")}
            fullWidth
            required
          />

        </Grid>

        <Grid item xs={12}>

                <Chip icon={<Icon icon="mdi:check-circle"/>} 
                      label='Active' 
                      variant={'contained'} size='small'
                      color={onData.statusLabel =='Active' ? 'success' : 'default'}
                      onClick={()=>onChanging('Active',"statusLabel",0)}  />
                &nbsp;
                <Chip icon={<Icon icon="mdi:clock-outline"/>} 
                      label='Pending' variant={'contained'}  size='small'
                      color={onData.statusLabel =='Pending' ? 'warning' : 'default'} 
                      onClick={()=>onChanging('Pending',"statusLabel",1)} />
                &nbsp;
                <Chip icon={<Icon icon="mdi:close-circle"/>} 
                      label='Disabled' variant={'contained'}  size='small'
                      color={onData.statusLabel =='Disabled' ? 'error' : 'default'} 
                      onClick={()=>onChanging('Disabled',"statusLabel",2)} />
              
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

      {
        itemx.id ? 
        <Grid item xs={12}>


                <Chip label={
                              <span style={{fontSize:"12px"}}>
                                {itemx.count_accounts == 0 ? 'No account' : itemx.count_accounts == 1 ? '1 account' : itemx.count_accounts+' accounts' }
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"12px"}}>
                                {itemx.count_clubs == 0 ? 'No clubs' : itemx.count_clubs == 1 ? '1 club' : itemx.count_clubs+' clubs' }
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"12px"}}>
                                {itemx.recorded_last ? "Latest record: "+itemx.recorded_last : "No records found"}
                              </span>
                            }  variant={'outlined'}  color={'default'} size='small' />

              {
                itemx.recorded_last && !Fnc.isNull(itemx.total_agencybonus,0)
                ?
                <>
                &nbsp;
                <Chip label={
                              <span style={{fontSize:"12px"}}>
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
                              <span style={{fontSize:"12px"}}>
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
                              <span style={{fontSize:"12px"}}>
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

        {
          Fnc.JSONS(onData,false)
        }
   
        </DialogContent>
      
        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>
              { 
                !onSubmitLoad ? 

                  <>
                  { !checkIfComplete() || onData.imagePreview != '' ?
                  <Button onClick={()=>onSubmitting()} 
                          disabled={onSubmitLoad}
                          sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='contained'>
                          SUBMIT
                  </Button>
                  : null
                  }
                  <Button onClick={()=>setOpen(false)} sx={{borderRadius:'0',width:'50%'}} variant='outlined' loading='true' >CANCEL</Button>
                  </>
                :
                  <Button sx={{...Cs.buttonClass('outlined','violet'), width:'100%',borderRadius:'0',}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='outlined'>
                            SUBMITTING
                  </Button>
              }



        </DialogActions>
      </Dialog>

  );
}