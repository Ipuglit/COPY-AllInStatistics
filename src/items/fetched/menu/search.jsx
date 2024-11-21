import { useState,useEffect } from 'react';

import React from 'react';

import {Box,
        TextField,
        InputAdornment,
        IconButton
        } from '@mui/material/';

import * as Fnc from 'src/hooks/functions'

import { Icon } from '@iconify/react';

export default function MenuOnSearch({ onSearching, onText }) {

    const [searchValue, setsearchValue] = useState('');

    const onSearch = (event) => {
        const sanitizedValue = Fnc.textSanitize(event.currentTarget.value);
        setsearchValue(sanitizedValue);
    };
    
    const onsubmitClear = () => {
        onSearching('ALL')
        setsearchValue('')
    }

    const onsubmitSearch = () => {
        onSearching(searchValue)
    }
    
    const onsubmitEnter = (event) => {
        if (event.key === 'Enter') {
            onSearching(searchValue)
        }
    };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
      <TextField  size='small'
                  variant="outlined"
                  placeholder="Search..."
                  value={onText ? onText : searchValue}
                  onChange={onSearch}
                  onKeyDown={onsubmitEnter}
                  style={{ marginBottom: '20px', borderRadius: '0px' }}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" >
                        
                            {
                            onText 
                            ?
                            <IconButton onClick={()=>onsubmitClear()}>
                                <Icon icon="mdi:close-circle" style={{color:'red'}}/> 
                            </IconButton>
                            :
                            <IconButton onClick={()=>onsubmitSearch()}>
                                <Icon icon="line-md:search-twotone"/>
                            </IconButton>
                            }
                        
                        </InputAdornment>
                    ),
                    }}
                  />
    </Box>
  );
}