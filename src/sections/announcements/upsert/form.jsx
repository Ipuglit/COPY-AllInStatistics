
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
  Tooltip,
  Stack,
  IconButton,

} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'


import { AlertSnack } from 'src/items/alert_snack'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import { imagetoRESIZE, imageUPLOADS } from 'src/hooks/imageupload'

import OnMobileScreen from 'src/items/screen/resize';
import Iconify from 'src/components/iconify';
import { fa } from '@faker-js/faker';

export  function Upserting({receivedData, receivedItems, returnData}) {
  
  const OnMobile                          = OnMobileScreen();
  const today                             = new Date().toISOString().split('T')[0];
  const itemx                             = receivedData

  const [open, setOpen]                   = useState(false);
  const [onData, setonData]               = useState(itemx);
  const [onHover, setonHover]             = useState(false);
  const [onSubmitLoad, setonSubmitLoad]   = useState(false);

  const inputRefAvatar      = React.createRef();
  const inputRefBackground  = React.createRef();

  const handleAvatarClick = () => {
    inputRefAvatar.current.click();
  };

  const handleBackgroundClick = () => {
    inputRefBackground.current.click();
  };

  const onChanging =(i,e,u)=>{

    const ifStatus = e == 'statusLabel' ? {'status': u} : {}
    const newArr = {...onData, ...ifStatus, [e]: i, }
    setonData({...newArr })

  }

  const onSame=(i,ii)=>{
    return onData[i] == itemx[ii] ? true : false
  }

  const checkIfComplete = () => {
    if(onData.id != 0 && onData.previewBackground =='' && ( onSame('datestart','datestart') && onSame('datestop','datestop') && onSame('title','title') && onSame('subtitle','subtitle') &&  onSame('details','details') && onSame('link','link') && onSame('linkLabel','linkLabel') && onSame('status','status') )  ){
      return true
    } else if( Fnc.isNull(onData.datestart) || Fnc.isNull(onData.datestop) || Fnc.isNull(onData.title) || Fnc.isNull(onData.subtitle) || Fnc.isNull(onData.details) || onData.statusLabel == '' ) {
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
    proceedSubmit()
    if( checkIfComplete() ){
        returnData( 'error', 'Incomplete details' )
        setonSubmitLoad(false)
    } else {

    }

    async function proceedSubmit() {

      const newJSon = {
                        ...onData, 
                        title:      Fnc.textSanitize(onData?.title),
                        subtitle:   Fnc.textSanitize(onData?.subtitle),
                        details:    Fnc.textSanitize(onData?.details),
                        link:       Fnc.textSanitize(onData?.link),
                        linkLabel:  Fnc.textSanitize(onData?.linkLabel),
                      }

      try {

        const response = await axios.post(LinkUPLOAD('announcements'),UpsertDATA({JSONData: [{...newJSon}]}));
        const feed =  response.data;

        if( onData['previewBackground'] ){
          imageUPLOADS('announcements',onData['previewBackground'],feed.lastID);          
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

  const fill=(i,e)=>{
    return !Fnc.isNull(i) ? i : '' || e
  }

  useEffect(() => {

    if(itemx.modal == "Open"){
        itemx.modal = "Open";
        setOpen(true);
    } else {
        setOpen(false);
    }
    setonSubmitLoad(false)

    setonData({
                  ...itemx, 
                  id:                     fill(itemx?.id,0), 
                  type:                   fill(itemx?.type,''), 
                  permission:             fill(itemx?.permission,''), 
                  position:               fill(itemx?.position,''), 
                  title:                  fill(itemx?.title,''),
                  subtitle:               fill(itemx?.subtitle,''),
                  details:                fill(itemx?.details,''),
                  link:                   fill(itemx?.link,''),
                  linkLabel:              fill(itemx?.linkLabel,'Go to link'),
                  datestart:              fill(itemx?.datestart,today),
                  datestop:               fill(itemx?.datestop,today),
                  settings:               fill(itemx?.settings,[]),
                  status:                 itemx?.datestop < today ? '2' : fill(itemx?.status,'0'),
                  statusLabel:            itemx?.datestop < today ? 'Inactive' :fill(itemx?.statusLabel,'Active'),
                  previewBackground:      '', 
                  previewAvatar:''
                 })


  }, [receivedData,itemx]);

  const onUploadImage = async (event,assign) => {

    try{
      const file            = event.target.files[0];
      const imagePreview    = await imagetoRESIZE(file);
      setonData({...onData, [assign]: imagePreview })
    } catch (error){

    }

  };

  return (

      <Dialog open={open} >

        <DialogTitle sx={{ m: 1, p: 1, marginBottom:'-10px' }}>
            <Typography variant="h6" component="div" margin={1}>
            ANNOUNCEMENT FORM
            </Typography>
            <Divider />
        </DialogTitle>

        <DialogContent>

        <Grid container padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2}}>

        <Grid item xs={12} sm={12} md={12}>
              <Box  component="form"
                    onMouseEnter={() => setonHover(true)}
                    onMouseLeave={() => setonHover(false)}
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
                                                src={onData?.previewBackground ? onData?.previewBackground :  Fnc.ifImage(`${onData?.imageBackground}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+onData?.imageBackground}?${new Date().getTime()}`)}
                                                style={{ height: '100px', minWidth:'100px', mb: 0, bgcolor: 'primary.main', border: '2px dashed grey', cursor: 'pointer', }} 
                                                onError={(e) => {
                                                  e.target.src = 'https://www.all-in-statistics.pro/images/announcements/default_bg.jpg';
                                                }}
                                                onClick={handleAvatarClick} />
                <input type="file" hidden accept='.jpeg, .jpg, .png'ref={inputRefAvatar} onChange={(e)=>onUploadImage(e,'previewBackground')} />

              </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
              label={('Date Start' )}
              maxLength={10}
              type={'date'}
              error={Fnc.isNull(onData?.datestart) }
              inputProps={{  
                            sx: { fontSize: OnMobile ? '12px' : '', '& input[type="date"]::-ms-clear': { display: 'none', }, }, 
                            max: onData?.datestop,
                          }}
              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  },shrink: true, }}
              value={onData.datestart ? onData.datestart : ''}
              onChange={(e) => onChanging( Fnc.wordNormal(e.currentTarget.value), "datestart")}
              fullWidth variant='outlined'
              autoComplete='off'
              required size='small'
            />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
              label={('Date Ends' )}
              maxLength={10}
              type={'date'}
              error={Fnc.isNull(onData?.datestop) }
              inputProps={{  
                            sx: { fontSize: OnMobile ? '12px' : '',  }, 
                            min: onData?.datestart,
                          }}
              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
              value={onData.datestop ? onData.datestop : ''}
              onChange={(e) => onChanging( Fnc.wordNormal(e.currentTarget.value), "datestop")}
              fullWidth variant='outlined'
              autoComplete='off'
              required size='small'
              clearable={'false'}
            />

        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
              label={('Title' )}
              maxLength={10}
              error={Fnc.isNull(onData?.title) }
              InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
              value={onData.title ? onData.title : ''}
              onChange={(e) => onChanging( Fnc.wordNormal(e.currentTarget.value), "title")}
              fullWidth variant='outlined'
              autoComplete='off'
              required size='small'
            />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
              label={('Subtitle' )}
              maxLength={30}
              error={Fnc.isNull(onData?.subtitle) }
              InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
              value={onData.subtitle ? onData.subtitle : ''}
              onChange={(e) => onChanging( Fnc.wordNormal(e.currentTarget.value), "subtitle")}
              fullWidth variant='outlined'
              autoComplete='off'
              required size='small'
            />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
              label={('Link' )}
              error={Fnc.isNull(onData?.link) }
              maxLength={35}
              InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
              value={onData.link ? onData.link : ''}
              onChange={(e) => onChanging( Fnc.wordNoSpace(e.currentTarget.value), "link")}
              fullWidth variant='outlined'
              autoComplete='off'
              required size='small'
            />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <TextField
              label={('Link Label' )}
              error={Fnc.isNull(onData?.linkLabel) }
              maxLength={35}
              InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
              value={onData.linkLabel ? onData.linkLabel : ''}
              onChange={(e) => onChanging( Fnc.wordNormal(e.currentTarget.value), "linkLabel")}
              fullWidth variant='outlined'
              autoComplete='off'
              required size='small'
            />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField
              multiline
              rows={2}
              label={('Details' )}
              maxLength={70}
              error={Fnc.isNull(onData?.details) }
              InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
              value={onData.details ? onData.details : ''}
              onChange={(e) => onChanging( Fnc.wordNorm(e.currentTarget.value), "details")}
              fullWidth variant='outlined'
              autoComplete='off'
              required size='small'
            />
        </Grid>



        <Grid item xs={12} sm={12} md={12}>

                <Chip icon={<Icon icon="mdi:check-circle"/>} 
                      label='Active'  size='small'
                      variant={'contained'} 
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      color={onData.statusLabel =='Active' ? 'success' : 'default'}
                      onClick={()=>onChanging('Active',"statusLabel",0)}  />
                &nbsp;
                <Chip icon={<Icon icon="mdi:close-circle"/>} 
                      label='Disabled' variant={'contained'}   size='small'
                      sx={{fontSize: OnMobile ? '11px' : ''}}
                      color={onData.statusLabel =='Disabled' ? 'error' : 'default'} 
                      onClick={()=>onChanging('Disabled',"statusLabel",2)} />
              
        </Grid>


      </Grid>


      {Fnc.JSONS(onData,false)}
   
        </DialogContent>
        
        <DialogActions style={{padding:'20px', marginTop:'-30px',display: 'flex', justifyContent: 'center'}}>

        { 
                !onSubmitLoad ? 

                  <>
                  {
                    !checkIfComplete() &&
                  <Button onClick={()=>onSubmitting()} 
                          disabled={onSubmitLoad}
                          sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: OnMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='contained'>
                          SUBMIT
                  </Button>
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