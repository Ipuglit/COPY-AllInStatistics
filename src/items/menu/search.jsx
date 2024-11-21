import { useState } from 'react';

import Stack from '@mui/material/Stack';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'
import OnMobileScreen from 'src/items/screen/resize';
// ----------------------------------------------------------------------
export default function OnSearching({byLabel,bySearching}) {

  const OnMobile= OnMobileScreen();

  const [searchValue, setsearchValue]   = useState("");
  const [searching, setSearching]       = useState(false);

  const onSearch = (event) => {

    const sanitizedValue = Fnc.wordNorm(event.currentTarget.value);
    setsearchValue(sanitizedValue);
    if(searching){
      setSearching(false)
    }
    
    if( event.currentTarget.value == '' ){
      bySearching('')
    }

  };

  const submitSearch = () => {

    if( !searching && searchValue != '' ){
      bySearching(searchValue)
      setSearching(true)
    } else {
      bySearching('')
      setsearchValue('');
      setSearching(false)
    }

  }

  const submitEnter = (event) => {

    if (event.key === 'Enter' ) {
      bySearching(searchValue)
      if(searchValue != ''){
        setSearching(true)
      } else {
        setSearching(false)
      }
    }

  };

  return (
    <>

            <TextField
                variant="outlined"
                label={byLabel ? byLabel : "Search"}
                size="small"
                value={searchValue}
                onKeyDown={submitEnter}
                onChange={onSearch}
                sx={{maxWidth:'300px','& .MuiOutlinedInput-root': { borderRadius: 0, },}}
                autoComplete='off'
                InputLabelProps={{  sx: { fontSize: OnMobile ? '13px' : '',  }, }}
                InputProps={{
                  fontSize: OnMobile ? '12px' : '',
                  endAdornment: (
                    <InputAdornment position="end" >
                      <IconButton onClick={()=>submitSearch()}>
                          <Iconify icon={searching ? "mdi:close-circle" : "eva:search-fill"} color={searching ? "red" : ""} sx={{height: OnMobile ? '15px' : '',}}/>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

    </>
  );
}
