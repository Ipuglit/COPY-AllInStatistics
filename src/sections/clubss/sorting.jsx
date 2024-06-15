import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';
import { RawApplications } from 'src/hooks/raw/applications';
import { RawRoles } from 'src/hooks/raw/roles';
import { RawUnions } from 'src/hooks/raw/unions';
import * as Func from 'src/utils/functions'
// ----------------------------------------------------------------------

const SORT_STATUS = [
  { id: 0, value: 'ALL', label: 'All' },
  { id: 1, value: 'ACTIVE', label: 'Active' },
  { id: 2, value: 'PENDING', label: 'Pending' },
  { id: 3, value: 'ACTIVEPENDING', label: 'Active & Pending' },
  { id: 4, value: 'DISABLED', label: 'Disabled' },
];

const ORDER_BY = [
  { id: 0, value: 'ASC', label: <Icon icon="bxs:up-arrow"/> },
  { id: 1, value: 'DESC', label: <Icon icon="bxs:down-arrow" className="reset-icon" /> },
];

const ORDER_BY_THIS = [
  { id: 0, value: 'NONE', label: 'ID' },
  { id: 1, value: 'app.name', label: 'Application' },
  { id: 2, value: 'c.type', label: 'Type' },
  { id: 3, value: 'uni.name', label: 'Union' },
  { id: 4, value: 'c.status', label: 'Status' },
];

export default function OnSorting({byUnions,byStatus,byApp,bySort,bySortBy}) {

  const SORT_APPS = RawApplications("ALL").data

  const SORT_UNIONS = RawUnions("ALL").data

  const [openRole, setopenRole] = useState(null);
  const [openStatus, setopenStatus] = useState(null);
  const [openApp, setopenApp] = useState(null);
  const [openSort, setopenSort] = useState(null);
  const [openSortBy, setopenSortBy] = useState(null);

  const [filterRole, setfilterRole]       = useState(99999);
  const [filterStatus, setfilterStatus]   = useState(0);
  const [filterApp, setfilterApp]         = useState(99999);
  const [filterSort, setfilterSort]       = useState(0);
  const [filterSortBy, setfilterSortBy]   = useState(0);

  const closeMenu = () => {
    setopenRole(null);
    setopenStatus(null);
    setopenApp(null);
    setopenSort(null);
    setopenSortBy(null)
  };

  const filtering = (i,ii) => {
    ii(i);
  };

  const itemsUnions = (event) => {
    if(event.currentTarget.value == 99999){
      setfilterRole(event.currentTarget.value)
      byUnions("ALL")
    } else if(event.currentTarget.value == 999999){
      setfilterRole(event.currentTarget.value)
      byUnions("PRIVATE")
    } else {
      setfilterRole(event.currentTarget.value)
      byUnions(SORT_UNIONS[event.currentTarget.value].id)
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

  const itemsSort = (event) => {
    setfilterSort(event.currentTarget.value)
    setopenSort(null);
    bySort(ORDER_BY[event.currentTarget.value].value)
  };

  const itemsSortBy = (event) => {
    setfilterSortBy(event.currentTarget.value)
    setopenSortBy(null);
    bySortBy(ORDER_BY_THIS[event.currentTarget.value].value)
  };

  const onSort = (event) => {
    setfilterRole(event.target.value);
  };

  const resetSorting = (event) => {
    setfilterRole(99999)
    setfilterStatus(0)
    setfilterApp(99999)
    setfilterSort(0)
    setfilterSortBy(0)
    byUnions("ALL")
    byApp("ALL")
    byStatus("ALL")
    bySort("ASC")
    bySortBy("NONE")
  };

  const capitalFirst = (str) => {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  return (
    <>

<Stack mb={0} direction="row" alignItems="right" justifyContent="flex-start">
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
        {filterRole == 99999 ? "All" : filterRole == 999999 ? "Private" :  capitalFirst(SORT_UNIONS[filterRole].name)}
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
          <MenuItem value={99999} name={"ALL"} onClick={itemsUnions}>
            All
          </MenuItem>
          <MenuItem value={999999} name={"PRIVATE"} onClick={itemsUnions}>
            Private
          </MenuItem>

        {SORT_UNIONS.map((i, index) => (
          <MenuItem key={index} value={index} name={i.name} selected={index === filterRole} onClick={itemsUnions}>
            {capitalFirst(i.name)}
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
      </Stack>

    {
    // ------------------------------------------------------------ 
    // ------------------------------------------------------------
    }

      <Stack mb={0} direction="row" alignItems="right" justifyContent="flex-start">



      <Button
        disableRipple
        color="inherit"
        onClick={(event) => { filtering(event.currentTarget, setopenSort) }}

      >
        Sort:&nbsp;&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {ORDER_BY[filterSort].label}
        </Typography>
      </Button>

      <Menu
        open={!!openSort}
        anchorEl={openSort}
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
          {ORDER_BY.map((i, index) => (
          <MenuItem key={index} value={index} name={i.value} selected={index === filterSort} onClick={itemsSort}>
            {i.label}
          </MenuItem>
        ))}
      </Menu>


      <Button
        disableRipple
        color="inherit"
        onClick={(event) => { filtering(event.currentTarget, setopenSortBy) }}
        endIcon={<Iconify icon={openSortBy ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >

        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {ORDER_BY_THIS[filterSortBy].label}
        </Typography>
      </Button>

      <Menu
        open={!!openSortBy}
        anchorEl={openSortBy}
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
          {ORDER_BY_THIS.map((i, index) => (
          <MenuItem key={index} value={index} name={i.value} selected={index === filterSortBy} onClick={itemsSortBy}>
            {i.label}
          </MenuItem>
        ))}
      </Menu>

        <Stack direction="row" >
            <Button sx={{ mt: 0, color: 'text.disabled',  }} onClick={resetSorting}>
                <Icon icon="grommet-icons:power-reset" /> &nbsp; Reset
            </Button >
        </Stack>

      </Stack>

    </>
  );
}
