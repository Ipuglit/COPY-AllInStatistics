// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box,FormControlLabel,Checkbox} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function Remarks({ onClose, onData, onReturn }) {

  const onMobile    = Fnc.OnMobile()

    const itemx = onData?.data

    const [value, setValue]                 = useState('');
    const [checkClub, setcheckClub]         = useState(false);
    const [checkPlayer, setcheckPlayer]     = useState(false);

    const onSubmit =(i)=>{
      onReturn({
                  row: itemx.ROW, 
                  what: onData.name, 
                  REMARKS: value,
                  applyClub:      checkClub, 
                  applyPlayer:    checkPlayer,
                  subClub:        itemx?.CLUBID,
                  subPlayer:      itemx?.PLAYERID,})
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

<br/>  <br/>
        {
            !Fnc.isNull(itemx?.PLAYERID,0) && onData?.name != 'PLAYER' &&
            <>
            <FormControlLabel
            sx={{marginTop:'-10px'}}
              control={
                <Checkbox
                  size='small'
                  checked={checkPlayer}
                  onChange={(e)=>setcheckPlayer(e.target.checked)}
                  name="acceptTerms"
                  sx={{ '&.Mui-checked': { color: checkPlayer ? 'violet' : '' } }}
                />
              }
              label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkPlayer ? 'violet' : ''}}>Apply to all player ID: '{itemx?.PLAYERID}'</span>}
            />
            </>

          }
          {
            !Fnc.isNull(itemx?.CLUBID,0) &&
            <>
          <br/>
          <FormControlLabel
          sx={{marginTop:'-10px'}}
            control={
              <Checkbox
                size='small'
                checked={checkClub}
                onChange={(e)=>setcheckClub(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkClub ? 'violet' : '' } }}
              />
            }
            label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkClub ? 'violet' : ''}}>Apply to all club '{itemx?.CLUBNAME}'</span>}
          />
            </>
          }

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

            <Button variant='standard' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}