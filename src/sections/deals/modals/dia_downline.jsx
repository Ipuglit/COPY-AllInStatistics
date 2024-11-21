// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fn from '../functions/dialogs'

import { Icon } from '@iconify/react';

export default function Downline({ onClose, onData, onAccounts, onReturn }) {
    const itemx = onData

    const seeACCOUNTS = onAccounts.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  itemx.id,
                                                                    value:                e.accountID, 
                                                                    label:                e.accountID, 
                                                                    description:          e.accountNickname, 
                                                                    downlineApp:          e.appID,
                                                                    downlineID:           e.accountID,
                                                                    downlineNick:         e.accountNickname,
                                                                    downlineUserID:       e.userID,
                                                                    downlineUserNick:     e.userNickname ? e.userNickname : '',
                                                                    downlineUserName:     e.userFirstname ? e.userFirstname+' '+e.userLastname : ''  
                                                                  } 
                                                      } 
                                        )
    
    const newACCOUNTS = seeACCOUNTS.filter((e)=> e.value != itemx.playerID && e.value != itemx.uplineID && e.value != itemx.agencyID && itemx.appID == e.downlineApp)                       

    const Ndx = newACCOUNTS.filter((e)=> e.value == itemx.downlineID)

    const [value, setValue]   = useState(null);
    const [changed, setChanged]   = useState(false);

    const handleChanged = (event, newValue) => {
      setValue({...newValue});
      setChanged(newValue.downlineID == itemx.downlineID ? false : true)
    };

    const onSubmit =(i)=>{
      onClose(false)
      onReturn({...value, what: 'downline'})
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
              <p style={{marginTop:'-15px', marginBottom:'-2px'}}>User: {itemx.playerUserName ? itemx.playerUserName : itemx.playerUserNick ? itemx.playerUserNick : 'None'}</p>

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
                      option.downlineUserName ? 
                      <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.downlineUserName})</span>
                      : 
                      option.downlineUserNickname ? 
                      <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.downlineUserNickname})</span>
                      : 
                      null
                    }
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ value ? ( value.downlineUserName ? value.downlineUserName : 'No downline user' ) : "Select an downline"}
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
              value == undefined || !value.downlineID || !changed
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