// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box,Grid,Divider,Chip} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function DDownApps({ DATA, RETURN}) {

    const [selected, setSelected]         = useState([]);
    
    const onMobile    = Fnc.OnMobile()

    const seen = new Set();
    const dataARRAYS = DATA?.data?.map((i,index)=>{
                                    return {    
                                                id:         i.increment,
                                                label:      i.appName,
                                                value:      i.appID,
                                                appID:      i.appID,
                                            }
                                        }).filter(i => {
                                          if (!seen.has(i.value)) {
                                              seen.add(i.value);
                                              return true;
                                          }})


   const onChange = (i) => {
        if(Fnc.isNull(i)){
            setSelected([])
            RETURN(0)
        } else {
            setSelected(i)
            RETURN(i)
        }
   }
             
   const renderTags = (value,getTagProps,arr,setArr) => {
    return value.map((i, index) => (
      <Chip
        key={i.id}
        size='small'
        style={{backgroundColor:'#9370db'}}
        label={i.label}
        {...getTagProps({ index })}
        onDelete={() => {
          const newValues = arr.filter(
            (e) => e.value !== i.value
          );
          setArr(newValues);
          RETURN(newValues)
        }}
      />
    ));
  };

  return (
          <>
                <Autocomplete
                    multiple
                    disabled={!DATA?.load}
                    options={dataARRAYS}
                    value={selected}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value)=>{return option.id === value.id}}
                    onChange={(event, newValues)=>onChange(newValues)}
                    renderTags={(value, getTagProps)=>renderTags(value, getTagProps, selected, setSelected)}
                    renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                        </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Filter by application"}
                        variant="outlined"
                        fullWidth
                        size='small'
                        sx={{ 
                              '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                              '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                            }}
                      />
                    )}
                    />
          </>

  );
  
}