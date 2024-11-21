// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fn from '../functions/dialogs'

import { Icon } from '@iconify/react';

export default function Agency({ onClose, onData, onAccounts, onReturn }) {
    const itemx = onData

    const seeACCOUNTS = onAccounts.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  itemx.id,
                                                                    value:                e.accountID, 
                                                                    label:                e.accountID, 
                                                                    description:          e.accountNickname, 
                                                                    agencyApp:            e.appID,
                                                                    agencyID:             e.accountID,
                                                                    agencyNick:           e.accountNickname,
                                                                    agencyUserID:         e.userID,
                                                                    agencyUserNick:       e.userNickname ? e.userNickname : '',
                                                                    agencyUserName:       e.userFirstname ? e.userFirstname+' '+e.userLastname : ''  
                                                                  } 
                                                      } 
                                        )
    
    const newACCOUNTS = seeACCOUNTS.filter((e)=> e.value != itemx.playerID && e.value != itemx.uplineID && e.value != itemx.downlineID && itemx.appID == e.agencyApp)                       

    const Ndx = newACCOUNTS.filter((e)=> e.value == itemx.agencyID)

    const [value, setValue]   = useState(null);
    const [changed, setChanged]   = useState(false);

    const handleChanged = (event, newValue) => {
      setValue({...newValue});
      setChanged(newValue.agencyID == itemx.agencyID ? false : true)
    };

    const onSubmit =(i)=>{
      onClose(false)
      onReturn({...value, what: 'agency'})
    }

    useEffect(() => {
      setValue(Ndx[0] ? Ndx[0] : null)
    }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px' }}>
              <p style={{marginTop:'-2px',color:'gray'}} >{itemx.appName}</p>
              <p style={{marginTop:'-15px'}}>{itemx.clubName}</p>
              <p style={{marginTop:'-5px'}}>Player ID: {itemx.playerID}</p>
              <p style={{marginTop:'-15px'}}>User: {itemx.playerUserName ? itemx.playerUserName : itemx.playerUserNick ? itemx.playerUserNick : 'None'}</p>

              <p style={{marginTop:'-5px', marginBottom:'-2px' }}>
                Agency with {itemx.agencyRake}% Rakeback &nbsp;
                <i style={{fontSize:'10px',color:'gray'}}>(Click DEALS to change)</i>
              </p>
            </Box>

            <br/>

            <Autocomplete
                value={value}
                onChange={handleChanged}
                options={newACCOUNTS}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                filterOptions={Fn.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props}>{option.label}</span>
                    <span style={{ color: 'grey', fontSize: '0.85em' }}> &nbsp;&nbsp;&nbsp;— {option.description}</span>
                    {
                      option.agencyUserName ? 
                      <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.agencyUserName})</span>
                      : 
                      option.agencyUserNickname ? 
                      <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.agencyUserNickname})</span>
                      : 
                      null
                    }
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ value ? ( value.agencyUserName ? value.agencyUserName : 'No agency user' ) : "Select an agency"}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />


            {
              //<pre>{JSON.stringify(value,null,2)}</pre>
            }
            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

            {
              value == undefined || !value.agencyID || !changed
              ?
              null
              :
              <Button variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined'  onClick={onClose}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}