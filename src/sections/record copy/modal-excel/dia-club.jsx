// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {FormControlLabel,Checkbox,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function Club({ onClose, onData, onItems, onReturn }) {

  const onMobile    = Fnc.OnMobile()

    const itemx = onData.data
    const listDDown = onItems.CLUBS

    const seeCLUBS = listDDown?.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.clubID, 
                                                                    label:                e.clubName, 
                                                                    description:          e.appName, 
                                                                    appID:                e.appID,
                                                                    appName:              e.appName,
                                                                    clubID:               e.clubID,
                                                                    clubName:             e.clubName,
                                                                  } 
                                                      } 
                                        )

    const Ndx = seeCLUBS.filter((e)=> e.clubID == itemx.CLUBID )

    const [value, setValue]       = useState(null);
    const [checked, setChecked]   = useState(false);

    const handleChanged = (event, newValue) => {
      setValue(newValue);
    };

    const handleCheck = (event) => {
      setChecked(event.target.checked);
    };

    const onSubmit =(i)=>{
      onReturn({
                  ...value, 
                  row:      itemx.ROW, 
                  what:     onData.name, 
                  apply:    checked, 
                  subClub:  itemx.CLUBID, 
                  club:     itemx.CLUB
                })
    }

    useEffect(() => {
      setValue(Ndx[0] ? Ndx[0] : null)
    }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize: onMobile ? '11px' : '12px' }}>
              {
                !Fnc.isNull(itemx.APPID,0)
                ?
                <>
                <p style={{marginTop:'-2px',color:'gray'}} >{itemx.APPNAME}</p>
                <p style={{marginTop:'-15px', marginBottom:'-2px'}}>{itemx.CLUBNAME}</p>
                </>
                :
                <p style={{marginTop:'-2px',color:'orange', marginBottom:'-2px'}} >Please select a club!</p>
              }

            </Box>

            <Autocomplete
                value={value}
                disableClearable
                onChange={handleChanged}
                options={seeCLUBS}
                style={{marginTop:'35px'}}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>ID: {option.clubID}</span>
                          <span style={{ color: 'grey', fontSize: '0.70em'}}> ( {option.description} )</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ value?.appName ? value?.appName  : "Select a club"}
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                      '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                    }}
                  />
                )}
              />
              
            {
            itemx?.CLUBID != value?.value &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleCheck}
                  name="acceptTerms"
                  sx={{ '&.Mui-checked': { color: checked ? 'violet' : '' } }}
                />
              }
              label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checked ? 'violet' : ''}}>Apply to all club '{itemx.CLUBSUB ? itemx.CLUBSUB : itemx.CLUBNAME}'</span>}
            />
            }

            {
             //<pre>{JSON.stringify(itemx,null,2)}</pre>
            }
            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            {
              Fnc.isNull(value) || value.clubID == itemx.CLUBID
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                      variant='contained' 
                      onClick={()=>onSubmit()}>
                SUBMIT
              </Button>
            }

            <Button variant='outlined' 
                    disabled={itemx?.CLUBID == 0}
                    onClick={onClose} 
                    sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>
              CANCEL
            </Button>

      </DialogActions>

    </>
  );
  
}