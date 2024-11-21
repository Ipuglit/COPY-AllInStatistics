// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function Remarks({ onClose, onData, onReturn }) {

  const onMobile    = Fnc.OnMobile()

    const itemx = onData.data

    const [value, setValue]   = useState('');

    const onSubmit =(i)=>{
      onReturn({row: itemx.ROW, what: onData.name, REMARKS: value})
    }

    useEffect(() => {
      setValue(itemx?.REMARKS ? itemx?.REMARKS : '')
    }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize: onMobile ? '11px' : '12px', marginBottom:'35px' }}>
              {
                !Fnc.isNull(itemx.APPID,0)
                ?
                <>
                <p style={{marginTop:'-2px',color:'gray'}} >{itemx.APPNAME}</p>
                <p style={{marginTop:'-15px'}}>{itemx.CLUBNAME}</p>
                </>
                :
                <p style={{marginTop:'-2px',color:'orange'}} >Please select a club!</p>
              }

            </Box>
            <TextField
              label="Type your remarks"
              multiline
              rows={4}
              value={value}
              onChange={(e)=>setValue(e.target.value)}
              style={{ width: '100%' }}
              sx={{ 
                '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
              }}
            />

            {
              //<pre>{JSON.stringify(onData,null,2)}</pre>
            }
            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            {
              Fnc.isNull(value) || value == itemx?.REMARKS
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}