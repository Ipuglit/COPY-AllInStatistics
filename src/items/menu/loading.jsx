import { useState } from 'react';

import Stack from '@mui/material/Stack';
import { Alert, Skeleton, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { Height } from '@mui/icons-material';

// ----------------------------------------------------------------------
export default function OnLoading({TYPE}) {

    const SX_table  = {marginTop:'10px', width: '100%', height: '250px'}
    const SX_list   = {marginTop:'10px', width: '100%', height: '70px'}

  return (
            TYPE == 'table' 
            ?
            <Skeleton variant="rectangular" sx={SX_table} />
            :
            TYPE == 'list' 
            ?
            <>
              <Skeleton variant="rounded" sx={SX_list} />
              <Skeleton variant="rounded" sx={SX_list} />
              <Skeleton variant="rounded" sx={SX_list} />
            </>

            :
            <Skeleton variant="rectangular" sx={SX_table} />
        );


}
