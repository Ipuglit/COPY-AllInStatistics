import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const MODE = [
  { id: 0,
    value: 'light',
    label: 'Light mode',
    color:  'black',
    icon: 'line-md:sun-rising-filled-loop',
  },
  {
    id: 1,
    value: 'dark',
    label: 'Dark mode',
    color:  'white',
    icon: 'line-md:moon-filled-loop',
  },
];

// ----------------------------------------------------------------------

export default function ThemeMode() {

  const themeModed    = JSON.parse(localStorage.getItem("theme-mode"))
  
  if(!themeModed || !themeModed.theme){

    localStorage.setItem("theme-mode",JSON.stringify({
                                                      id: MODE[0].id,
                                                      theme: MODE[0].value,
                                                    }))

  }

  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(themeModed.id ? themeModed.id : 0);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const itemSelected = (event) => {
    setSelected(event.target.value)
    localStorage.setItem("theme-mode",JSON.stringify({
                                                      id: MODE[event.target.value].id,
                                                      theme: MODE[event.target.value].value,
                                                    }))
    setOpen(null);
    window.location.reload();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Icon icon={MODE[selected].icon} color={MODE[selected].color} width={26} sx={{ mr: 0.3 }}  />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 180,
          },
        }}
      >
        {MODE.map((i) => (
          <MenuItem
            key={i.value}
            value={i.id}
            selected={i.value === MODE[selected].value}
            onClick={itemSelected}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Icon icon={i.icon} color={MODE[selected].color} width={24} sx={{ mr: 0.3 }}  />

            {i.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
