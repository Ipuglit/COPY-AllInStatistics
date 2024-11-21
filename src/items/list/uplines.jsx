import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { Icon } from '@iconify/react';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import OnMobileScreen from 'src/items/screen/resize';

// ----------------------------------------------------------------------

function onSelect(i){
    return i
}

export default function PostList({ data, UpsertDATA, ...other }) {

    const onReturn =(e)=>{
        UpsertDATA(e)
    }

  return (
<>
    <Card {...other}>

        <Scrollbar>
            <Stack spacing={3} sx={{ pl: 20, pr: 20, '@media (max-width: 600px)':{pl: 2, pr: 2,} }}>
                {data.map((i, index) => (
                    <ItemList key={index} i={i} onReturn={onReturn} />
                ))}
                </Stack>
        </Scrollbar>

        <Box sx={{ p: 90, textAlign: 'right' }}></Box>
        
    </Card>
</>
  );
}

PostList.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.array.isRequired,
};

// ----------------------------------------------------------------------

function ItemList({ i, onReturn }) {

    const viewItems = () => {
        onReturn({...i,modal:'Open'})
    }

    const OnMobile= OnMobileScreen();


  return (
    <Stack direction="row" alignItems="center" spacing={3} key={i.id} sx={{ width: '100%' }}>
        
      <Box
        component="img"
        alt={i.accountID}
        src={i.userAvatar}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 275, flexGrow: 1, '@media (max-width: 600px)':{minWidth: 115, flexGrow: 1,} }} >

        <Typography variant="subtitle1" fontSize="small" sx={{ color: 'text.secondary' }} noWrap>
          {i.accountRole}
        </Typography>

        <Link color="inherit" variant="subtitle2" fontSize="large" underline="hover" noWrap>
          {i.accountNickname}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          ID: {i.accountID}
        </Typography>

        <Typography variant="subtitle1" fontSize="small" sx={{ color: 'text.secondary' }} noWrap>
          {i.appName}
        </Typography>



        {
        OnMobile ?
        <Typography variant="caption" align="left" sx={{ pr: 2, flexShrink: 0, color: 'text.secondary' }} noWrap >
        {
        i.statusLabel == "Active" ? 
            <Button size="small"
                startIcon={<Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  />} >
                <span style={{color: "green"}}> Active </span>
            </Button>
        : i.statusLabel == "Pending" ? 
            <Button size="small"
                startIcon={<Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  />} >
                <span style={{color: "orange"}}> Pending </span>
            </Button>
        :
            <Button size="small"
                startIcon={<Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 0 }}  />} >
                <span style={{color: "red"}}> Disabled </span>
            </Button>
        }
        </Typography>
        :
        null
        }

      </Box>

      {
        !OnMobile ?
        <Box sx={{  minWidth: 30, flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }} >

            <Typography variant="caption" align="left" sx={{ pr: 2, flexShrink: 0, color: 'text.secondary' }} noWrap >
                {
                i.statusLabel == "Active" ? 
                    <Button size="small"
                        startIcon={<Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  />} >
                        <span style={{color: "green"}}> Active </span>
                    </Button>
                : i.statusLabel == "Pending" ? 
                    <Button size="small"
                        startIcon={<Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  />} >
                        <span style={{color: "orange"}}> Pending </span>
                    </Button>
                :
                    <Button size="small"
                        startIcon={<Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 0 }}  />} >
                        <span style={{color: "red"}}> Disabled </span>
                    </Button>
                }
            </Typography>

        </Box>
        :
        null
        }

      <Box sx={{  minWidth: 30, flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }} >

            <Button
                size="small"
                color="inherit"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" color='purple' />}
                onClick={viewItems}
                >
                <span style={{color: "purple"}}> View </span>
            </Button>

      </Box>



    </Stack>
  );
}

ItemList.propTypes = {
  news: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
  }),
};
