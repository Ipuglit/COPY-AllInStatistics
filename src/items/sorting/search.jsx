import { useState } from 'react';

import { Grid,Stack,TextField, InputAdornment, IconButton,ToggleButtonGroup,ToggleButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import * as Fnc from 'src/hooks/functions'
// ----------------------------------------------------------------------
export const SEARCH_BY = ({Returned}) => {  

  const [searchValue, setsearchValue] = useState("");
  
  const SX = {
    width: Fnc.isMobile() ? 185 : 255,
   '& .MuiInputBase-input': { fontSize: Fnc.isMobile() ? 10 : 12 }, // Target input field
   '& .MuiInputLabel-root': { fontSize: Fnc.isMobile() ? 10 : 12 }, // Target label
   }

  const onSearch = (event) => {
    const sanitizedValue = event.currentTarget.value.replace(/[^a-zA-Z0-9$!#&?.\s]/g, '');
    setsearchValue(sanitizedValue);
  };

  const submitSearch = () => {
    Returned(searchValue)
  }

  const submitEnter = (event) => {
    if (event.key === 'Enter') {
      Returned(searchValue)
    }
  };

  return (
    <>
                <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-start">
                    <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-end">

                            <TextField
                                label="SEARCH"
                                size="small"
                                value={searchValue}
                                onKeyDown={submitEnter}
                                onChange={onSearch}
                                sx={SX}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" >
                                    <IconButton onClick={submitSearch}>
                                        <Iconify icon="eva:search-fill" />
                                    </IconButton>
                                    </InputAdornment>
                                ),
                                }}
                            />
                        
                    </Stack>
                </Stack>

    </>
  );
}
