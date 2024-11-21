// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import OnMobileScreen from 'src/items/screen/resize';

import * as Fn from '../functions/dialogs'
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function Formulas({ onClose, onData, onAccounts, onReturn }) {

    const itemx = onData

    const OnMobile= OnMobileScreen();

    const seeACCOUNTS = onAccounts.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  itemx.id,
                                                                    value:                e.accountID, 
                                                                    label:                e.accountID, 
                                                                    description:          e.accountNickname, 
                                                                    playerApp:            e.appID,
                                                                    playerID:             e.accountID,
                                                                    playerNick:           e.accountNickname,
                                                                    playerUserID:         e.userID,
                                                                    playerUserNick:       e.userNickname ? e.userNickname : '',
                                                                    playerUserName:       e.userFirstname ? e.userFirstname+' '+e.userLastname : ''  
                                                                  } 
                                                      } 
                                        )
    
    const newACCOUNTS = seeACCOUNTS.filter((e)=> e.value != itemx.uplineID && e.value != itemx.agencyID && e.value != itemx.downlineID && itemx.appID == e.playerApp)                       

    const Ndx = newACCOUNTS.filter((e)=> e.value == itemx.playerID )

    const [value, setValue]   = useState(null);
    const [changed, setChanged]   = useState(false);

    const handleChanged = (event, newValue) => {
      setValue({...newValue});
      setChanged(newValue.playerID == itemx.playerID ? false : true)
    };

    const onSubmit =(i)=>{
      onClose(false)
      onReturn({...value, what: 'player'})

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

              <p style={{marginTop:'-5px', marginBottom:'-2px' }}>
                Player {itemx.playerRake}% Rakeback &nbsp;
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
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                    {
                      option.playerUserName ? 
                      <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}> ({option.playerUserName})</span>
                      : 
                      option.playerUserNickname ? 
                      <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}> ({option.playerUserNickname})</span>
                      : 
                      null
                    }
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ value ? ( value.playerUserName ? value.playerUserName : 'No player user' ) : "Select an player"}
                    variant="outlined"
                    fullWidth
                    InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                    InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                  />
                )}
              />


            {
              //<pre>{JSON.stringify(onData,null,2)}</pre>
            }
            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

            {
              value == undefined || !value.playerID || !changed
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: OnMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: OnMobile ? '11px' : ''}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}