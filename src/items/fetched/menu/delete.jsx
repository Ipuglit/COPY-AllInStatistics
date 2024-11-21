import { useState,useEffect } from 'react';

import React from 'react';

import { Button } from '@mui/material/';

import * as Cls from 'src/hooks/classes'
import * as Eq from 'src/hooks/calculations'

import { Icon } from '@iconify/react';

export default function MenuOnDelete({ bySending, onReceiving }) {

    const IDs = bySending.ids
    const Arr = bySending.arrays
    
    const handleClick = () => {
                                    onReceiving([])
                                    const returnedData = Eq.convertDATA(Arr,'DELETE')
                                    onReceiving(returnedData)
                                };

  return (
      <Button variant={IDs.length > 0 ? 'contained' : 'outlined'} 
              onClick={()=>(IDs.length > 0 ? handleClick() : null)}
              startIcon={<Icon icon="tabler:trash-x-filled"/>}
              sx={IDs.length > 0 ? Cls.buttonClass('contained','red') : Cls.buttonClass('outlined','')}>
        Delete
      </Button>
  );
}