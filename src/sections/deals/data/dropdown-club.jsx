// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box,Grid,Divider,Chip} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Fn from '../functions/dialogs'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function DDownClubs({ DATA, RETURN}) {

    const onMobile    = Fnc.OnMobile()

    const [selected, setSelected]         = useState(null);

    const seeARRAYS = DATA.data.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.clubID, 
                                                                    label:                e.clubName, 
                                                                    description:          e.clubID, 
                                                                    appID:                e.appID,
                                                                    appName:              e.appName,
                                                                    clubID:               e.clubID,
                                                                    clubName:             e.clubName,
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
                      getOptionLabel={(option) => option.label ? option.label : 'All clubs'}
                      isOptionEqualToValue={(option, value) => value.clubID === selected.clubID}
                      filterOptions={Fn.filterOptions}
                      renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                          <span {...props} style={{fontSize:'12px'}}>{option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>ID: {option.clubID}</span>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={ selected ? ( selected.clubID ? selected.appName+' Club ID: '+selected.clubID : 'No club' ) : "Filter by club"}
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