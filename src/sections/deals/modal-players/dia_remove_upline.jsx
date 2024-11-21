// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fn from '../functions/dialogs'
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

import OnMobileScreen from 'src/items/screen/resize';

export default function Remove_Player({ onClose, onData, onReturn }) {

    const itemx = onData
    const OnMobile= OnMobileScreen();

    const onSubmit =(i)=>{

        const newArr = {  ...itemx,
                          action: 'remove',
                        }
        onReturn({...newArr, what: 'dealuplines'})

      }

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px' }}>
              <p style={{marginTop:'-2px',color:'gray'}} >{itemx.appName}</p>
              <p style={{marginTop:'-15px',fontSize:'15px'}}>{itemx.clubName}</p>
              <p style={{marginTop:'-20px'}}>Deal: {itemx.rakeback} / {itemx.rebate}</p>

              <p style={{marginTop:'5px', marginBottom:'-2px' }}>
                Upline ID: {itemx.uplineID} &nbsp;
              </p>
              <p style={{marginTop:'-5px', marginBottom:'-2px' }}>
              User: {itemx.uplineUserName ? itemx.uplineUserName : itemx.uplineUserNick ?  itemx.uplineUserNick : 'No user'}
              </p>
              <p style={{marginTop:'-5px', marginBottom:'-2px' }}>
                {100 - itemx.rakeback}% Rakeback &nbsp;
              </p>

            </Box>

          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

        <Button sx={{...Cs.buttonClass('contained','red'), width:'50%',borderRadius:'0',}} variant='contained' onClick={()=>onSubmit()}>REMOVE</Button>
        <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%'}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}