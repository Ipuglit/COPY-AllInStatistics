import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';
import { RawRoles } from 'src/hooks/raw/roles';
import { RawCompany } from 'src/hooks/raw/company';
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
  { id: 0, value: 'u.id', label: 'ID' },
  { id: 1, value: 'a.name', label: 'Name' },
  { id: 2, value: 'c.name', label: 'Company' },
  { id: 3, value: '(SELECT COUNT(id) FROM accounts WHERE appID = a.id AND status = 0)', label: 'Active Accounts' },
  { id: 3, value: '(SELECT COUNT(id) FROM clubs WHERE appID = a.id AND status = 0)', label: 'Active Clubs' },
  { id: 4, value: 'u.status', label: 'Status' },
];

export default function OnSorting({byCompany,byStatus,bySort,bySortBy}) {

  const SORT_COMPANY  = RawCompany("ALL").data

  const [openCompany, setopenCompany]     = useState(null);
  const [openStatus, setopenStatus]       = useState(null);
  const [openSort, setopenSort]           = useState(null);
  const [openSortBy, setopenSortBy]       = useState(null);

  const [filterCompany, setfilterCompany]       = useState(99999);
  const [filterStatus, setfilterStatus]         = useState(0);
  const [filterSort, setfilterSort]             = useState(0);
  const [filterSortBy, setfilterSortBy]         = useState(0);

  const closeMenu = () => {
    setopenCompany(null)
    setopenStatus(null);
    setopenSort(null);
    setopenSortBy(null)
  };

  const filtering = (i,ii) => {
    ii(i);
  };

  const itemsCompany = (event) => {
    if(event.currentTarget.value == 99999){
      setfilterCompany(event.currentTarget.value)
      byCompany("ALL")
    } else {
      setfilterCompany(event.currentTarget.value)
      byCompany(SORT_COMPANY[event.currentTarget.value].id)
      console.log(SORT_COMPANY[event.currentTarget.value].id)
    }
    setopenCompany(null);

  };

  const itemsStatus = (event) => {
      setfilterStatus(event.currentTarget.value)
      setopenStatus(null);
      byStatus(SORT_STATUS[event.currentTarget.value].value)
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
    setfilterCompany(event.target.value);
  };

  const resetSorting = (event) => {
    setfilterCompany(99999)
    setfilterStatus(0)
    setfilterSort(0)
    setfilterSortBy(0)
    byCompany("ALL")
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

        <Button disableRipple color="inherit"
            onClick={(event) => { filtering(event.currentTarget, setopenStatus) }}
            endIcon={<Iconify icon={openStatus ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />} >
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

    <Button disableRipple color="inherit"
        onClick={(event) => { filtering(event.currentTarget, setopenCompany) }}
        endIcon={<Iconify icon={openCompany ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {filterCompany == 99999 ? "All" : capitalFirst(SORT_COMPANY[filterCompany].name)}
        </Typography>
      </Button>

      <Menu
        open={!!openCompany}
        anchorEl={openCompany}
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
          <MenuItem value={99999} name={"All"} onClick={itemsCompany}>
            All
          </MenuItem>

        {SORT_COMPANY.map((o, index) => (
          <MenuItem key={o.id} value={index} selected={index === filterCompany} onClick={itemsCompany}>
            {o.name}
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
