import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';


import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------
export default function OnModify({DATA,RETURN}) {

    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = (i) => {
      setAnchorEl(null);
      RETURN(i)
    };

  return ( 
            <div>
            <IconButton onClick={handleClick} >
                <Iconify icon={"iconamoon:menu-kebab-vertical-circle-bold"} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem  onClick={()=>handleClose('edit')}>
                <Iconify icon={"mdi:edit"} /> &nbsp; Edit
                </MenuItem>
                <MenuItem onClick={()=>handleClose('remove')}>
                <Iconify icon={"ion:trash"} /> &nbsp;  Remove
                </MenuItem>
            </Menu>
            </div>
        );
}
