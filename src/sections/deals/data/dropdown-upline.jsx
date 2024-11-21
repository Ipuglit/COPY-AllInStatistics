// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box,Grid,Divider,Chip} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Fn from '../functions/dialogs'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';
import { Description } from '@mui/icons-material';

export default function DDownUpline({ DATA, RETURN}) {

    const onMobile    = Fnc.OnMobile()

    const [selected, setSelected]         = useState(null);

    const seeARRAYS = DATA.data.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.accountID, 
                                                                    description:          e.accountID, 
                                                                    label:                e.userFirstname ? e.userFirstname+' '+e.userLastname : e.userNickname ? e.userNickname : e.accountNickname, 
                                                                    uplineID:             e.accountID,
                                                                    uplineNick:           e.userFirstname ? e.userFirstname+' '+e.userLastname : e.userNickname ? e.userNickname : e.accountNickname, 
                                                                  } 
                                                      } 
                                        )

   const onChange = (i) => {
        if(Fn.isNull(i)){
            setSelected(null)
            RETURN(0)
        } else {
            setSelected(i)
            RETURN(i)
        }
   }
                                        
  return (

                  <Autocomplete
                      value={selected ? selected : null}
                      size='small'
                      onChange={(event, newValue)=> onChange(newValue)}
                      options={(seeARRAYS ? seeARRAYS : [])}
                      getOptionLabel={(option) => option.value ? option.value : 'All uplines'}
                      isOptionEqualToValue={(option, value) => value.uplineID === selected.uplineID}
                      filterOptions={Fn.filterOptions}
                      renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                          <span {...props} style={{fontSize:'12px'}}>ID: {option.value}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.label}</span>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={ selected ? 'Upline: '+selected.label : "Filter by upline"}
                          variant="outlined"
                          fullWidth
                          sx={{ 
                            '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                            '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                          }}
                        />
                      )}
                    />
  );
  
}