import { useState } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

const MODE = [
  { id: 0,
    value: 'LIGHT',
    label: 'Light mode',
    icon: '/assets/icons/sun.svg',
  },
  {
    id: 1,
    value: 'DARK',
    label: 'Dark mode',
    icon: '/assets/icons/moon.svg',
  },
];

// ----------------------------------------------------------------------

export default function ThemeMode() {

  const themeModed    = JSON.parse(localStorage.getItem("theme-mode"))
  
  if(!themeModed){
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
        <img src={MODE[selected].icon} alt={MODE[selected].label} />
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
            <Box component="img" alt={i.label} src={i.icon} sx={{ width: 28, mr: 2 }} />

            {i.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
