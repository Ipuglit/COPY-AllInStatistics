// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box,Grid,Divider,Chip} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';
import { Description } from '@mui/icons-material';

export default function DDownAccount({ DATA, RETURN, WHAT}) {

    const [selected, setSelected]         = useState([]);
    
    const onMobile    = Fnc.OnMobile()

    const seen = new Set();
    const dataARRAYS = DATA?.data?.map((i,index)=>{
                                    return {    
                                                id:           i.increment,
                                                label:        i.accountID,
                                                value:        i.userFirstname ? i.userFirstname+' '+i.userLastname : i.userNickname ? i.userNickname : i.accountNickname,
                                                accountID:    i.accountID,
                                                accountName:  i.userFirstname ? i.userFirstname+' '+i.userLastname : i.userNickname ? i.userNickname : i.accountNickname,
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
                    filterOptions={Fnc.filterOptions}
                    renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>ID: {option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.accountName}</span>
                        </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Filter by "+WHAT}
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