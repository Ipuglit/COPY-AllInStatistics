// DialogComponent.js
import React, {useEffect, useState} from 'react';

import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fn from '../functions/dialogs'
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function Remove_Formula({ onClose, onData, onReturn }) {

    const itemx = onData
    const onMobile = Fnc.OnMobile()
    const onSubmit =(i)=>{
        //onClose(false)
        const newArr = {  ...itemx,
                          action: 'remove',
                          id:   itemx.id ? itemx.id : 0,
                        }
        onReturn({...newArr, what: 'formula'})

      }

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px' }}>

              <p style={{marginTop:'-1px', marginBottom:'-2px' }}>
                Type: {itemx.type} &nbsp;
              </p>

              <p style={{marginTop:'10px', marginBottom:'-2px' }}>
                Title: {itemx.name} &nbsp;
              </p>

              <p style={{marginTop:'10px', marginBottom:'-2px' }}>
                Formula: <br/> {itemx.formula} &nbsp;
              </p>

              <p style={{marginTop:'5p10pxx', marginBottom:'-2px' }}>
                Remarks: <br/> {itemx.note ? itemx.note : 'None...'}
              </p>

              <p style={{marginTop:'10px', marginBottom:'-1px' }}>
                Stated:  {itemx.stated}
              </p>

            </Box>
            {
                //<pre>{JSON.stringify(itemx,null,2)}</pre>
            }
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

        <Button sx={{...Cs.buttonClass('contained','red'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>Remove</Button>
        <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}