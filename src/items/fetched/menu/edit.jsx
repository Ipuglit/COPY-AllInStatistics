import { useState,useEffect } from 'react';

import React from 'react';

import { Button } from '@mui/material/';

import * as Cls from 'src/hooks/classes'
import * as Eq from 'src/hooks/calculations'

import { Icon } from '@iconify/react';

export default function MenuOnEdit({ bySending, onReceiving }) {

    const IDs = bySending.ids
    const Arr = bySending.arrays

    const handleClick = (i) => {
                                    onReceiving([])
                                    const returnedData = Eq.convertDATA(Arr,'UPDATE')
                                    onReceiving(returnedData)
                                };

  return (
      <Button variant={IDs.length > 0 ? 'contained' : 'outlined'} 
              onClick={()=>(IDs.length > 0 ? handleClick() : null)}
              startIcon={<Icon icon="fluent:edit-28-filled"/>}
              sx={IDs.length > 0 ? Cls.buttonClass('contained','violet') : Cls.buttonClass('outlined','')}>
        Edit
      </Button>
  );
}