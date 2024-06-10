import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import { RawApplications } from 'src/hooks/raw/applications';
import { RawRoles } from 'src/hooks/raw/roles';

import * as Func from 'src/utils/functions'
// ----------------------------------------------------------------------

const SORT_STATUS = [
  { id: 0, value: 'ALL', label: 'All' },
  { id: 1, value: 'ACTIVE', label: 'Active' },
  { id: 2, value: 'PENDING', label: 'Pending' },
  { id: 3, value: 'ACTIVEPENDING', label: 'Active & Pending' },
  { id: 4, value: 'DISABLED', label: 'Disabled' },
];

export default function OnSorting({byRoles,byStatus,byApp,}) {

  const SORT_APPS = RawApplications("ALL").data

  const SORT_ROLES = RawRoles("LOWERMID").data

  const [openRole, setopenRole] = useState(null);
  const [openStatus, setopenStatus] = useState(null);
  const [openApp, setopenApp] = useState(null);

  const [filterRole, setfilterRole]       = useState(99999);
  const [filterStatus, setfilterStatus]   = useState(0);
  const [filterApp, setfilterApp]         = useState(99999);
  const [filterSort, setfilterSort]       = useState(0);
  
  const closeMenu = () => {
    setopenRole(null);
    setopenStatus(null);
    setopenApp(null);
  };

  const filtering = (i,ii) => {
    ii(i);
  };

  const itemsRoles = (event) => {
    if(event.currentTarget.value == 99999){
      setfilterRole(event.currentTarget.value)
      byRoles("ALL")
    } else {
      setfilterRole(event.currentTarget.value)
      byRoles(SORT_APPS[event.currentTarget.value].id)
    }
    setopenRole(null);
  };

  const itemsStatus = (event) => {
      setfilterStatus(event.currentTarget.value)
      setopenStatus(null);
      byStatus(SORT_STATUS[event.currentTarget.value].value)
  };

  const itemsApps = (event) => {
    if(event.currentTarget.value == 99999){
      setfilterApp(event.currentTarget.value)
      byApp("ALL")
    } else {
      setfilterApp(event.currentTarget.value)
      byApp(SORT_APPS[event.currentTarget.value].id)
    }
    setopenApp(null);
};

  const onSort = (event) => {
    setfilterRole(event.target.value);
  };

  return (
    <>


<Button
        disableRipple
        color="inherit"
        onClick={(event) => { filtering(event.currentTarget, setopenStatus) }}
        endIcon={<Iconify icon={openStatus ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Filter:&nbsp;&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {SORT_STATUS[filterStatus].label}
        </Typography>
      </Button>

      <Menu
        open={!!openStatus}
        anchorEl={openStatus}
        onClose={closeMenu}
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
        {SORT_STATUS.map((option, index) => (
          <MenuItem key={option.value} value={option.id} selected={index === filterStatus} onClick={itemsStatus}>
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
        onClick={(event) => { filtering(event.currentTarget, setopenRole) }}
        endIcon={<Iconify icon={openRole ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {filterRole == 99999 ? "Everyone" : Func.capitalizeFirst(SORT_ROLES[filterRole].name)}
        </Typography>
      </Button>

      <Menu
        open={!!openRole}
        anchorEl={openRole}
        onChange={onSort}
        onClose={closeMenu}
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
          <MenuItem value={99999} name={"Everyone"} onClick={itemsRoles}>
            Everyone
          </MenuItem>

        {SORT_ROLES.map((i, index) => (
          <MenuItem key={index} value={index} name={i.name} selected={index === filterRole} onClick={itemsRoles}>
            {i.name}
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
        onClick={(event) => { filtering(event.currentTarget, setopenApp) }}
        endIcon={<Iconify icon={openApp ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {filterApp == 99999 ? "All" : SORT_APPS[filterApp].name}
        </Typography>
      </Button>

      <Menu
        open={!!openApp}
        anchorEl={openApp}
        onClose={closeMenu}
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
          <MenuItem value={99999} name={"All"} onClick={itemsApps}>
            All
          </MenuItem>
        {SORT_APPS.map((i, index) => (
          <MenuItem key={index} value={index} name={i.name} selected={index === filterApp} onClick={itemsApps}>
            {i.name}
          </MenuItem>
        ))}
      </Menu>

    </>
  );
}
