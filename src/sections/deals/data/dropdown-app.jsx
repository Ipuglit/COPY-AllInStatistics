// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box,Grid,Divider,Chip} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Fn from '../functions/dialogs'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function DDownApps({ DATA, RETURN}) {

    const onMobile    = Fnc.OnMobile()

    const [selected, setSelected]         = useState(null);

    const seeARRAYS = DATA.data.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.appID, 
                                                                    label:                e.appName, 
                                                                    appID:                e.appID,
                                                                    appName:              e.appName,
                                                                  } 
                                                      } 
                                        )


    const uniqueARAYS = seeARRAYS.filter((item, index, self) => {
      return self.findIndex(t => t.appID === item.appID) === index;
    });

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
                      options={(uniqueARAYS ? uniqueARAYS : [])}
                      getOptionLabel={(option) => option.label ? option.label : 'All applications'}
                      isOptionEqualToValue={(option, value) => value.appID === selected.appID}
                      filterOptions={Fn.filterOptions}
                      renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                          <span {...props} style={{fontSize:'12px'}}>{option.label}</span>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={ selected ? 'Application' : "Filter by application"}
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