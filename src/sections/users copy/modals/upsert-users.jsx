import { useState,useEffect } from 'react';

import React from 'react';
import axios from 'axios';

import {Button,
        Chip,
        Avatar,
        Box,
        Divider,
        Typography,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Grid,
        FormControl,
        InputLabel,
        Select,
        TextField,
        MenuItem,
        TableRow,} from '@mui/material/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Eq from 'src/hooks/calculations'


import { imagetoRESIZE, imageUPLOADS } from 'src/hooks/imageupload'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import {AlertSnack} from 'src/items/alert_snack'
import { Icon } from '@iconify/react';


export default function ModalUpsertUsers({ DATA, RETURN }) {
    
    const [onAlert, setonAlert]                   = useState({open:false,type:'',message:''});
    const [onData, setonData]                     = useState([]);
    const [isSuccess, setisSuccess]               = useState(false);


    const rawROLES = DATA.roles.map((e)=>({id: e.id, value:e.name}))
    
    const OnAlerting =(open,type,message,time)=>{

        setonAlert({open:open,type:type,message:message})
        const T = setTimeout(() => {
            setonAlert({open:false,type:'',message:''})
        }, time ? time : 2000);
        return () => clearTimeout(T);
  
    }

    const OnClosing =(i)=>{
        RETURN({modal: false, roles: [], value: [], changed: i,})
        setonData({modal: false, roles: [], value: [], changed: i,})
    }

    const onchangeItem=(i,ii)=>{

      setisSuccess(false)
      if(ii == 'roleName'){
        const idd = rawROLES.find((e)=> e.value == i )
        setonData({...onData, [ii]:i, roleID: idd.id  })
      } else {
        setonData({...onData, [ii]:i })
      }

    }

    const onchangeStatus=(i,ii)=>{
      setonData({...onData, statusLabel:i, status:ii })
      setisSuccess(false)
    }

    const onUploadImage = async (event) => {
      const file            = event.target.files[0];
      const imagePreview    = await imagetoRESIZE(file);
      setonData({...onData, avatar:onData['username']+'.jpg', avatarpreview: imagePreview })
    };

    const oncheckDATA=(i,ii)=>{
        if( Fnc.isNull(onData.roleName) ){
          OnAlerting(true,'error','Select a role')
        } else if( Fnc.isNull(onData.nickname) ){
          OnAlerting(true,'error','Nickname missing')
        } else if( onData.nickname.length < 5 ){
          OnAlerting(true,'error','Nickname should atleast have 5 characters')
        } else if( !Fnc.isNull(onData.email) && !Fnc.checkEmail(onData.email) ){
          OnAlerting(true,'error','Email wrong format')
        } else if( Fnc.isNull(onData.username) ){
          OnAlerting(true,'error','Username missing')
        } else if( onData.username.length < 5 ){
          OnAlerting(true,'error','Username should atleast have 5 characters')
        } else if( Fnc.isNull(onData.statusLabel) ){
          OnAlerting(true,'error','Select a status')
        } else {

          const newArr = {
                          ...onData,
                          id:       Fnc.isNull(onData.id) ? 0 : onData.id,
                          nickname: Fnc.textSanitize(onData.nickname),
                          firstname: Fnc.textSanitize(onData.firstname),
                          lastname: Fnc.textSanitize(onData.lastname),
                          username: Fnc.textSanitize(onData.username),
                        }

          setonData(newArr)
          submitDATA([newArr])

        }
    }

    async function submitDATA(i) {
        setisSuccess(false)
      try {

        const response = await axios.post(LinkUPLOAD('users'),UpsertDATA({JSONData: i}));
        const feed =  response.data;

        if(feed.hits > 0){
          OnAlerting(true,'error','Username taken! ('+feed.hitsList+')')
        } else if(feed.added > 0){
          OnAlerting(true,'success','User added!')
        } else if(feed.updated > 0){
          OnAlerting(true,'success','User updated!')
        } else if(feed.added == 0){
          OnAlerting(true,'error','User not added!')
        } else if(feed.updated == 0){
          OnAlerting(true,'error','User not updated!')
        } else {
          OnAlerting(true,'warning','Please try again!')
        }

        if(i[0]['avatarpreview'] != '' && feed['avatar'] != 'NONE'){
            imageUPLOADS('users',i[0]['avatarpreview'],feed['avatar']);          
        }

        setisSuccess(true)

      } catch (error) {
        OnAlerting(true,'error','Something went wrong! Error')
        setisSuccess(false)
      }

    }
  
    useEffect(() => {
      setonData(DATA.value)
      setisSuccess(false)
    }, [DATA.modal == true]);

  return (

    <Dialog open={DATA.modal} fullWidth>

        <DialogTitle style={{marginTop: '10px', }}>

            <Typography variant="h5" component="div" >
                {DATA.what == 'edit' ? "EDIT" : "ADD"} USER
            </Typography>
            
        </DialogTitle>

        <DialogContent >

          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>

            <Grid item xs={12} sm={12} md={12} style={{marginTop: '-25px'}}>
              <Box
                width='100%'
                my={4}
                display="flex"
                alignItems="center"
                gap={10}
              >
              <Avatar
                alt="image"
                src={onData.avatarpreview ? onData.avatarpreview : onData.avatarFull}
                sx={{ width: 60, height: 60, marginLeft:'10px' }}
              />
                <input type="file" 
                        accept='.jpeg, .jpg, .png' 
                        style={{height:'50px',lineHeight:'50px', marginLeft:'-50px', width:'100%',border: '1px dashed lightgrey'}}  
                        onChange={onUploadImage} />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={6}  style={{marginTop: '-25px'}}>
                    <FormControl fullWidth size='small'>
                        <InputLabel 
                            id="filter-select-label" 
                            //style={{color: '#BA55D3'}}
                            >Role</InputLabel>
                        <Select
                          labelId="filter-select-label"
                          id="filter-select"
                          error={Fnc.isNull(onData.roleName)}
                          value={onData.roleName ? onData.roleName : ''}
                          label="Role"
                          required
                          onChange={(e) => onchangeItem(e.target.value, "roleName")} >
                          {
                              rawROLES.map((i, index) => (
                                <MenuItem key={index} value={i.value} >{i.value}</MenuItem>
                                ))
                          }
                        </Select>
                    </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6}  style={{marginTop: '15px'}}>

            </Grid>

            <Grid item xs={12} sm={6} md={6}>

              <TextField label="Nickname"
                          name="Nickname"
                          size="small"
                          error={Fnc.isNull(onData.nickname)}
                          InputProps={{ maxLength: 22 }}
                          value={onData.nickname ? onData.nickname : ''}
                          onChange={(e) => onchangeItem(Fnc.textNickname(e.currentTarget.value), "nickname")}
                          fullWidth
                          required
                        />

            </Grid>

            <Grid item xs={12} sm={6} md={6}>

            </Grid>

            <Grid item xs={6} sm={6} md={6}>

              <TextField
                label="First name"
                name="Firstname"
                size="small"
                error={Fnc.isNull(onData.firstname)}
                InputProps={{ maxLength: 22 }}
                value={onData.firstname ? onData.firstname : ''}
                onChange={(e) => onchangeItem(Fnc.textName(e.currentTarget.value), "firstname")}
                fullWidth
                required
              />
              
            </Grid>

            <Grid item xs={6} sm={6} md={6}>

              <TextField
                label="Last name"
                name="Lastname"
                size="small"
                error={Fnc.isNull(onData.lastname)}
                InputProps={{ maxLength: 22 }}
                value={onData.nickname ? onData.lastname : ''}
                onChange={(e) => onchangeItem(Fnc.textName(e.currentTarget.value), "lastname")}
                fullWidth
                required
              />
              
            </Grid>



            <Grid item xs={6} sm={6} md={6}>
              <TextField
                label="Email"
                size="small"
                //nputLabelProps={{ style: { color: '#BA55D3' }, }}
                InputProps={{ maxLength: 18 }}
                value={onData.email ? onData.email : ''}
                onChange={(e) => onchangeItem(Fnc.wordNoSpace(e.currentTarget.value), "email")}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
              <TextField
                label="Telegram"
                size="small"
                //nputLabelProps={{ style: { color: '#BA55D3' }, }}
                InputProps={{ maxLength: 18 }}
                value={onData.telegram ? onData.telegram : ''}
                onChange={(e) => onchangeItem(Fnc.wordNoSpace(e.currentTarget.value), "telegram")}
                fullWidth
                required
              />
            </Grid>

            <Divider/>

            <Grid item xs={6} sm={6} md={6}>
              <TextField
                label="Username"
                name="Username"
                size="small"
                error={Fnc.isNull(onData.username)}
                //nputLabelProps={{ style: { color: '#BA55D3' }, }}
                InputProps={{ maxLength: 18 }}
                value={onData.username ? onData.username : ''}
                onChange={(e) => onchangeItem(Fnc.textUsername(e.currentTarget.value), "username")}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
              <TextField
                label="Password"
                name="Username"
                size="small"
                type='password'
                error={false}
                //nputLabelProps={{ style: { color: '#BA55D3' }, }}
                InputProps={{ maxLength: 18 }}
                value={Fnc.isNull(onData.id,'Num') ? onData.password : onData.newpassword}
                onChange={(e) => onchangeItem(Fnc.wordNoSpace(e.currentTarget.value), Fnc.isNull(onData.id,'Num') ? "password" : "newpassword")}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
                <Chip icon={<Icon icon="mdi:check-circle"/>} 
                      label='Active' 
                      variant={'contained'} 
                      color={onData.statusLabel =='Active' ? 'success' : 'default'}
                      onClick={()=>onchangeStatus('Active',0)}
                      size='small' />
                &nbsp;
                <Chip icon={<Icon icon="mdi:clock-outline"/>} 
                      label='Pending' variant={'contained'}  
                      color={onData.statusLabel =='Pending' ? 'warning' : 'default'} 
                      onClick={()=>onchangeStatus('Pending',1)}
                      size='small' />
                &nbsp;
                <Chip icon={<Icon icon="mdi:close-circle"/>} 
                      label='Disabled' variant={'contained'}  
                      color={onData.statusLabel =='Disabled' ? 'error' : 'default'} 
                      onClick={()=>onchangeStatus('Disabled',2)}
                      size='small' />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions style={{padding:'20px'}}>

            <Button sx={{...Cls.buttonClass('contained','violet'), width:'50%',borderRadius:'0',}} 
                    variant='contained' 
                    disabled={isSuccess}
                    onClick={() => oncheckDATA()}>
                    {isSuccess ? 'Submitting' : DATA.what == 'edit' ? 'Update' : "Add"}
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
      //<pre style={{fontSize:'9px'}}>{JSON.stringify(onData,null,2)}</pre>
    }
    </Dialog>
  );
}