import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

import { alpha } from '@mui/material/styles';
import { useProfiling } from 'src/routes/hooks/use-profiling'
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';


import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import { navPublic, navPrivate } from './config-navigation';
import  {GoTo}  from 'src/layouts/dashboard/control';
import * as Fnc from 'src/hooks/functions'
// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {

  if(localStorage.getItem("slk-user") === null){
    window.location.replace("/login"); 
    window.location.href = "/login";
  }



  const account = JSON.parse( localStorage.getItem("slk-user") )

  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    
    if (openNav) {
      onCloseNav();
    }
    
  }, [pathname]);

  useEffect(() => {
    GoTo()
  }, []);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.2,
        py: 4,
        px: 2.2,
        display: 'flex',
        borderRadius: 1,
        border: '1px dashed mediumpurple',
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.15),
      }}
    >
      <Avatar src={Fnc.ifImage(`${account.avatar}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+account.avatar}?${new Date().getTime()}`)} alt="photoURL" />

      <Box sx={{ ml: 1.5, }}>
        <Typography variant="subtitle1" sx={{fontSize:'14px'}}> 
          {account.nickname.toUpperCase()}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize:'11px' }}>
          {account.role}
        </Typography>
      </Box>
    </Box>
  );

  const renderPublicMenu = (
    <Stack component="nav" spacing={0.1} sx={{ px: 3}}>
      {navPublic()?.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderPrivateMenu = (
    <Stack component="nav" spacing={0.1} sx={{ px: 3 }}>
      {navPrivate()?.map((item) => (
        <NavItem key={item.title} item={item}/>
      ))}
    </Stack>
  );
  
  const renderUpgrade = (
    <Box sx={{ px: 2.5, pb: 3, mt: 10 }} s>
      <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
        <Box
          component="img"
          src="/assets/illustrations/illustration_avatar.png"
          sx={{ width: 100, position: 'absolute', top: -50 }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Get more?</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            From only $69
          </Typography>
        </Box>

        <Button
          href="https://material-ui.com/store/items/minimal-dashboard/"
          target="_blank"
          variant="contained"
          color="inherit"
        >
          Upgrade to Pro
        </Button>
      </Stack>
    </Box>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      


      {renderAccount}

      {renderPublicMenu}

      <Divider sx={{ borderStyle: 'dashed', m: 0, marginBottom:'10px', marginTop:'12px' }} />

      {renderPrivateMenu}

      <Box sx={{ flexGrow: 1 }} />


    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
      
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 30,
        borderRadius: 0.40,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        fontSize:'12.5px',
        ...(active && {
          color: '#191919',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: 'mediumpurple',
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.56),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 22, height: 22, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
