import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import * as Fnc from 'src/hooks/functions'

import { RawFetch } from 'src/hooks/raw/';

import {DialogFullAnnounce} from '../dialog/dialog-announce'

import {Profiling} from '../dialog/dialog-profile'


import {Alerting} from 'src/items/alert_snack/'


// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function ProfilePopover({openAnnounce}) {
  
  const account                       = JSON.parse( localStorage.getItem("slk-user") )
  const isEditor                      = ['1','2','3']?.includes(account?.roleID) ? false : true

  const [rawRELOAD, setrawRELOAD]       = useState(1)
  
  const [rawFETCH,  setrawFETCH]  = useState({
                                                            FOR:            'ALL',
                                                            STATUS:         'ALL',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                            USER:           'ALL',
                                                            ACCOUNT:        'ALL',
                                                            ROLE:           'ALL',
                                                            DATEFROM:       'ALL',
                                                            DATEUNTIL:      'ALL',
                                                            IFZERO:         'ALLs',
                                                            LIMIT:          'ALL',
                                                          });

 const fetchANNOUNCE                          = RawFetch(rawFETCH,rawRELOAD,'announcementlist')

  const [open, setOpen]                       = useState(null);
  const [onProfile, setonProfile]             = useState(false);
  const [onAlert, setonAlert]                 = useState({onOpen: 0, severity: '', title:'', message: ''});
  const [onAnnounceOpen, setonAnnounceOpen]     = useState(false);


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
    setrawRELOAD(Fnc.numRandom())
  };

  const handleClose = () => {
    setOpen(null);
  };

  const onUpdateSuccess =(severe,msg)=>{

    setonAlert({onOpen: Fnc.numRandom(), severity:severe, message:msg})
    const T = setTimeout(() => {
      window.location.reload();
    }, 500);

  }

  const logOut = () => {
    window.location.replace("/login"); 
    window.location.href = "/login";
  }

  useEffect(()=>{
    const announceStatus = sessionStorage.getItem('slk-announce');
    if (announceStatus === 'false' && fetchANNOUNCE?.load == true) {
      setonAnnounceOpen(true)
      sessionStorage.setItem('slk-announce', 'true');
    }
  },[fetchANNOUNCE?.load])

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={Fnc.ifImage(`${account?.avatar}?${Math.random()}`,`${'https://www.all-in-statistics.pro/'+account?.avatar}?${Math.random()}`)}
          alt={account?.nickname}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account?.nickname}
        </Avatar>
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
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }} hidden>
          <Typography variant="subtitle2" noWrap>
            {account?.nickname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account?.email}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account?.telegram}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'none' }} />

          <MenuItem  onClick={()=>{setonProfile({open: true}),setOpen(null)}} sx={{marginTop:1}}>
            Profile
          </MenuItem>

          <MenuItem  onClick={()=>{setonAnnounceOpen(true),setOpen(null),setrawRELOAD(Fnc.numRandom())}} sx={{marginTop:1}}>
            Announcements 
          </MenuItem>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={logOut}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>

      <Profiling onOpen={onProfile} onClose={setonProfile} onReturn={onUpdateSuccess} />
      <DialogFullAnnounce OPEN={onAnnounceOpen} CLOSE={setonAnnounceOpen} DATA={fetchANNOUNCE}/>
      <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />
    </>
  );
}
