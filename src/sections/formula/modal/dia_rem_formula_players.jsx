// DialogComponent.js
import React, {useEffect, useState} from 'react';

import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fn from '../functions/dialogs'
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function Remove_FormulaPlayers({ onClose, onData, onReturn }) {

    const itemx = onData
    const onMobile = Fnc.OnMobile()
    const onSubmit =(i)=>{
        //onClose(false)
        const newArr = {  ...itemx,
                          action: 'remove',
                          id:   itemx.id ? itemx.id : 0,
                        }
        onReturn({...newArr, what: 'dealformula'})

      }

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px' }}>
              <p style={{marginTop:'-2px',color:'gray'}} >{itemx.appName}</p>
              <p style={{marginTop:'-15px',fontSize:'15px'}}>{itemx.clubName}</p>
              <p style={{marginTop:'-20px',color:'gray'}} >ID: {itemx.clubID}</p>


              <p style={{marginTop:'-5px', marginBottom:'-2px' }}>
                Player ID: {itemx.playerID} &nbsp;
              </p>
              <p style={{marginTop:'-5px', marginBottom:'-2px',color:'gray' }}>
                User: {itemx.playerUserName ? itemx.playerUserName : itemx.playerUserNick ?  itemx.playerUserNick : 'No user'}
              </p>

              <p style={{marginTop:'5px', marginBottom:'-2px' }}>
                Agency Action <br/> {itemx.agency_action_name} FORMULA
              </p>
              <p style={{marginTop:'-3px', marginBottom:'-2px',color:'gray' }}>
                Formula: {itemx.agency_action_formula}
              </p>

              <p style={{marginTop:'5px', marginBottom:'-2px' }}>
                Agency Bonus <br/> {itemx.agency_bonus_name} FORMULA
              </p>
              <p style={{marginTop:'-3px', marginBottom:'-2px',color:'gray' }}>
                Formula: {itemx.agency_bonus_formula}
              </p>

              <p style={{marginTop:'5px', marginBottom:'-2px' }}>
                Player Result <br/> {itemx.player_result_name} FORMULA
              </p>
              <p style={{marginTop:'-3px', marginBottom:'-2px',color:'gray' }}>
                Formula: {itemx.player_result_formula}
              </p>

              <p style={{marginTop:'5px', marginBottom:'-2px' }}>
                Remarks: 
              </p>
              <p style={{marginTop:'-3px', marginBottom:'-2px',color:'gray' }}>
                {itemx.remarks ? itemx.remarks : 'None'}
              </p>

            </Box>

          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

            <Button sx={{...Cs.buttonClass('contained','red'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>Remove</Button>
            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}