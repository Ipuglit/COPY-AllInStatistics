import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';


import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------
export default function OnSorting({RETURN}) {

    const [changer, setChanger] = useState('asc');
    const onChange =(i)=>{
        if(i == 'asc'){
            setChanger('desc')
            RETURN('desc')
        } else {
            setChanger('asc')
            RETURN('asc')
        }
    }
    return ( 

            <IconButton onClick={()=>{onChange(changer)}} >
                <Iconify icon={changer == 'asc' ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"} />
            </IconButton>

    );
}
