import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fn from '../functions/dialogs'

import { Icon } from '@iconify/react';

export default function Club({ onClose, onData, onAccounts, onClubs, onReturn }) {
    const item = onData

    const seeCLUBS = onClubs.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  item.id,
                                                                    value:                e.clubID, 
                                                                    label:                e.clubName, 
                                                                    description:          e.clubID, 
                                                                    clubID:               e.clubID,
                                                                    clubName:             e.clubName,
                                                                    appID:                e.appID,
                                                                    appName:              e.appName,
                                                                  } 
                                                      } 
                                        )

    const checkID = !Fn.isNull(item.playerID,0) ? item.playerID :  !Fn.isNull(item.uplineID,0) ? item.uplineID : !Fn.isNull(item.agencyID,0) ? item.agencyID : !Fn.isNull(item.downlineID,0) ? item.downlineID : 0
    const newACCOUNTS = onAccounts.filter((e)=> e.accountID == checkID)
    const checkAPP    = newACCOUNTS[0].appID

    const newCLUBS = seeCLUBS.filter((e)=> e.appID == checkAPP)                       

    const Ndx = newCLUBS.filter((e)=> e.value == item.clubID)

    const [value, setValue]   = useState(null);
    const [changed, setChanged]   = useState(false);

    const handleChanged = (event, newValue) => {
      setValue({...newValue});
      setChanged(newValue.clubID == item.clubID ? false : true)
    };

    const onSubmit =(i)=>{
      onClose(false)
      onReturn({...value, what: 'club'})
    }

    useEffect(() => {
      setValue(Ndx[0] ? Ndx[0] : null)
    }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px' }}>

              <p style={{marginTop:'-2px',color:'gray'}} >{item.appName}</p>
              <p style={{marginTop:'-15px'}}>{item.clubName}</p>
              <p style={{marginTop:'-5px'}}>Player ID: {item.playerID}</p>
              <p style={{marginTop:'-15px', marginBottom:'-2px'}}>User: {item.playerUserName ? item.playerUserName : item.playerUserNick ? item.playerUserNick : 'None'}</p>
            
            </Box>

            <br/>

            <Autocomplete
                value={value}
                onChange={handleChanged}
                options={newCLUBS}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                filterOptions={Fn.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                    <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>ID: {option.description}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ value ? ( value.clubName ? value.clubName : 'No club' ) : "Select a club"}
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
              !changed
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