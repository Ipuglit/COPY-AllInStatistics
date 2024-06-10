import { useState } from 'react';

import Stack from '@mui/material/Stack';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OnSearching({bySearching,}) {

  const [searchValue, setsearchValue] = useState("");
  
  const onSearch = (event) => {
    const sanitizedValue = event.currentTarget.value.replace(/[^a-zA-Z0-9$!#&?.\s]/g, '');
    setsearchValue(sanitizedValue);
  };

  const submitSearch = () => {
    bySearching(searchValue)
  }

  const submitEnter = (event) => {
    if (event.key === 'Enter') {
      bySearching(searchValue)
    }
  };

  return (
    <>

      <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-end">

            <TextField
                label="Search"
                variant="standard"
                size="small"
                value={searchValue}
                onKeyDown={submitEnter}
                onChange={onSearch}
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

    </>
  );
}
