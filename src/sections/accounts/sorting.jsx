import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_ACCOUNTS = [
  { value: 'Everyone', label: 'Everyone' },
  { value: 'Player', label: 'Player' },
  { value: 'Agent', label: 'Agent' },
  { value: 'Super Agent', label: 'Super Agent' },
  { value: 'Agency', label: 'Agency' },
];

const SORT_STATUS = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVEPENDING', label: 'Active & Pending' },
  { value: 'DISABLED', label: 'Disabled' },
];

export default function OnSorting() {
  const [open, setOpen] = useState(null);
  const [open2, setOpen2] = useState(null);

  const [filtered, setFiltered] = useState("Everyone");
  const [filtered2, setFiltered2] = useState("All");

  
  const openFilter = (event) => {
    setOpen(event.currentTarget);
  };

  const openFilter2 = (event) => {
    setOpen2(event.currentTarget);
  };

  const itemFilter = (event, index) => {
    setOpen(null);
    setFiltered(index)
    console.log(index);
  };

  const itemFilter2 = () => {
    setOpen2(null);
  };

  const onSort = (event) => {
    setFiltered(event.target.value);
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={openFilter}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Filter:&nbsp;&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Everyone
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onChange={onSort}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_ACCOUNTS.map((option, index) => (
          <MenuItem key={option.value} selected={index === filtered} onClick={(i) => itemFilter(i, index)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>

    {
    // ------------------------------------------------------------ 
    // ------------------------------------------------------------
    }

      <Button
        disableRipple
        color="inherit"
        onClick={openFilter2}
        endIcon={<Iconify icon={open2 ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        All
        </Typography>
      </Button>

      <Menu
        open={!!open2}
        anchorEl={open2}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_STATUS.map((option) => (
          <MenuItem key={option.value} value={option.value} selected={option.value === 'All'} onClick={itemFilter2}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>

    </>
  );
}
