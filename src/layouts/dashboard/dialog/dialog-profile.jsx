
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
  Tooltip,
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

export  function Profiling({onOpen,onClose,onReturn}) {
  
  const itemx                             = JSON.parse(localStorage.getItem('slk-user'));

  const onMobile = Fnc.OnMobile()

  const [open, setOpen]                   = useState(false);
  const [onExpand, setonExpand]           = useState(false);
  const [onExpandB, setonExpandB]         = useState(false);

  const [onData, setonData]               = useState(itemx);
  const [onSubmitLoad, setonSubmitLoad]   = useState(false);

  const checkIfComplete = () => {
    if( onData.nickname == itemx.nickname && onData.firstname == itemx.firstname && onData.lastname == itemx.lastname && onData.username == itemx.username && onData.email == itemx.email  && onData.telegram == itemx.telegram  &&  onData.avatar == itemx.preview ){
      return true
    } else if( ( Fnc.isNull(onData.nickname) || ( Fnc.isNull(onData.username) && Fnc.isNull(onData.password) && onData?.username.length < 5 && onData?.password.length < 5) || onData?.nickname.length < 5 ) ) {
      return true
    } else {
      return false
    }
  };

  const onChange =(i,e)=>{
    setonData({...onData, [e]: i})
  }

  const onClosed =(i)=>{
    onClose(i)
  }

  const onUploadImage = async (event) => {

    try{
      const file            = event.target.files[0];
      const imagePreview    = await imagetoRESIZE(file);
      setonData({...onData, preview: imagePreview })
    } catch (error){

    }

  };

  const delayReturn =(i,e,a)=>{
    const T = setTimeout(() => {
      setOpen(a)
      onReturn(i,e)
    }, 1500);
    return () => clearTimeout(T);
  }

  const onSubmitting =()=>{

    setonSubmitLoad(true)

    if( checkIfComplete() ){
        setonSubmitLoad(false)
    } else {

        proceedSubmit()
    }

    async function proceedSubmit() {

      try {

        const response = await axios.post(LinkUPLOAD('profile'),UpsertDATA({JSONData: [{...onData}]}));
        const feed =  response.data;

        if(onData.preview != ''){
          imageUPLOADS('users',onData.preview,feed.id);  
        }
 
        if( feed.updated >= 1 ){

          delayReturn( 'success', 'Updated!', false )

        } else if( feed.hits >= 1 ){

          delayReturn( 'warning', 'Duplicate!', true )
          setonSubmitLoad(false)
          
        } else {

          delayReturn( 'error', 'Please try again', true )
          setonSubmitLoad(false)

        }

      } catch (error) {
        console.log(error)
        delayReturn( 'error', 'Please try again', true )
        setonSubmitLoad(false)

      }
    }

  }

  useEffect(() => {

    if(onOpen.open == true){
        setOpen(true);
    } else {
        setOpen(false);
    }
    setonSubmitLoad(false)
    setonData({...itemx, preview: '', password: ''})
  }, [onOpen]);

  const fileInputRef = React.createRef();
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (

      <Dialog open={open} >

        <DialogContent>

        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 1, sm: 1, md: 1 }}>

        <Grid item xs={12} sm={12} md={12}>
              <Box  component="form"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 4,
                      marginBottom: '-30px',
                      marginTop: '-30px'
                    }} >
  
                  <Tooltip title={'Upload image'} arrow>
                    <Avatar alt="Profile Picture"
                                              src={onData.preview ? onData.preview : Fnc.ifImage(`${onData.avatar}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+onData.avatar}?${new Date().getTime()}`)}
                                              sx={{ width: onMobile ? 120 : 150, height: onMobile ? 120 : 150, mb: 0, border: '2px dashed gray',
                                                '&:hover': {
                                                  cursor: 'pointer',
                                                  bgcolor: 'lightgray',
                                                },
                                              }} 
                                              onError={(e) => {
                                                e.target.src = '/images/avatars/default.jpg';
                                              }}
                                              onClick={handleAvatarClick} />

                  </Tooltip>

                <input type="file" hidden
                        accept='.jpeg, .jpg, .png' 
                        ref={fileInputRef}
                        style={{width:'100%', marginLeft:'60%'}}  
                        onChange={onUploadImage} />

              </Box>

        </Grid>

        <Grid item xs={12} sm={12} md={12}>
            <TextField  label="Nickname"
                        variant="outlined"
                        value={onData.nickname}
                        onChange={(e) => onChange(e.target.value,'nickname')}
                        fullWidth size='small'
                        InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                        InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                        margin="normal" />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
            <TextField  label="Firstname"
                        variant="outlined"
                        value={onData.firstname}
                        onChange={(e) => onChange(e.target.value,'firstname')}
                        fullWidth size='small'
                        InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                        InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                        margin="normal" />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
            <TextField  label="Lastname"
                        variant="outlined"
                        value={onData.lastname}
                        onChange={(e) => onChange(e.target.value,'lastname')}
                        fullWidth size='small'
                        InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                        InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                        margin="normal" />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Accordion expanded={onExpand} onChange={(e)=>{setonExpand(onExpand ? false : true)}}>
            <AccordionSummary expandIcon={<Icon icon={"oui:arrow-up"} />}>
              <Typography>Contacts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Email"}
                      error={!Fnc.isEmail(onData.email) || onData?.email?.length < 5 }
                      InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                      value={onData.email ? onData.email : ''}
                      onChange={(e) => onChange(Fnc.wordNoSpace(e.currentTarget.value), "email")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Telegram"}
                      //error={inputComplete(onData.telegram) || onData?.telegram?.length < 5 }
                      InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                      value={onData.telegram ? onData.telegram : ''}
                      onChange={(e) => onChange(Fnc.wordNoSpace(e.currentTarget.value), "telegram")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
              </Grid>

            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Accordion expanded={onExpandB} onChange={(e)=>{setonExpandB(onExpandB ? false : true)}}>
            <AccordionSummary expandIcon={<Icon icon={"oui:arrow-up"} />}>
              <Typography>Credentials</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Username"}
                      error={onData?.username?.length < 5 }
                      InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                      value={onData.username ? onData.username : ''}
                      onChange={(e) => onChange(Fnc.wordAlphaIDs(e.currentTarget.value), "username")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label={"Password"}
                      error={onData?.password?.length < 5 }
                      InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                      InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                      value={onData.password ? onData.password : ''}
                      onChange={(e) => onChange(Fnc.wordAlphaIDs(e.currentTarget.value), "password")}
                      fullWidth size='small'
                      autoComplete='off'
                      required
                    />
                </Grid>
              </Grid>

            </AccordionDetails>
          </Accordion>
        </Grid>

      </Grid>



   
        </DialogContent>
        
        <DialogActions style={{padding:'20px', marginTop:'-20px',display: 'flex', justifyContent: 'center'}}>

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
                  <Button onClick={()=>onClosed({open:false})} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}} variant='standard' loading='true' >CANCEL</Button>
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