import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Label from 'src/components/label';

import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export default function PostCard({ data,upsertData }) {

  const viewItems = () => {
    upsertData({...data,modal:'Open'})
}

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>

          <Box
            component="img"
            alt={data.name}
            src={data.imageFull ? data.imageFull : "public/images/clubs/default.png"}
            style={data.statusLabel == "Disabled" ?  { filter: 'grayscale(100%)' } : null}
            sx={{
              top: 1,
              width: 1,
              height: 1,
              objectFit: 'cover',
              position: 'absolute',
            }}
          />
      </Box>


      <Stack spacing={1} sx={{ p: 2 }}>

        <Box sx={{ minWidth: 275, flexGrow: 1, '@media (max-width: 600px)':{minWidth: 115, flexGrow: 1,} }} >

        <div style={{ display: 'flex', alignItems: 'center' }}>

            {data.statusLabel == "Active" ? 
                    <Tooltip title="Active" placement="right" arrow>
                        <Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0.3 }}  />
                    </Tooltip>  
            :
            data.statusLabel == "Pending" ?
                    <Tooltip title="Pending" placement="right" arrow>
                        <Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0.3 }}  />
                    </Tooltip>  
            :
                    <Tooltip title="Disabled" placement="right" arrow>
                        <Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 0.3 }}  />
                    </Tooltip>  
            } 

            <Typography variant="subtitle2" component="div"sx={{mb: 0, size: 19, }}>
              {data.name}
            </Typography>

        </div>

            
            <Typography component="div" variant="subtitle1" sx={{ color: 'text.disabled', }} noWrap style={{ marginTop: '-4px' }}>
                <span style={{fontSize:"12px"}}>{data.appName}</span>
            </Typography>

            <Typography component="div" variant="subtitle1" sx={{ color: 'text.disabled', }} noWrap style={{ marginTop: '-10px' }}>
                <span style={{fontSize:"10px"}}>ID: {data.idd}</span>
            </Typography>

            <Typography variant="subtitle1" fontSize="small" sx={{ color: 'text.secondary' }} noWrap style={{ marginTop: '-5px' }}>
                <span style={{fontSize:"10px"}}>{data.type == "PRIVATE" ? "PRIVATE" : data.type == "UNION" ? data.unionName : "NONE"}</span>
            </Typography>

            <Typography component="div" variant="subtitle1" sx={{ color: 'text.disabled', }} noWrap style={{ marginTop: '-10px' }}>
                <span style={{fontSize:"10px"}}>{data.usersActive == 0 ? "No accounts" : data.usersActive == 1 ? "1 account" : data.usersActive+" accounts"}</span>
            </Typography>

        </Box>

      </Stack>

      <Box sx={{ p: (theme) => theme.spacing(0, 1.5, 1, 1.5), }} >

          <Stack
                  direction="row"
                  flexWrap="wrap"
                  spacing={1.5}
                  justifyContent="flex-end"
                  size="small"
                  sx={{ mt: 0, color: 'text.disabled', bottom: 16, right: 6, }} 
                  >
                <Stack direction="row" >
                    <Button sx={{ mt: 0, color: 'text.disabled', }} 
                            size="small"
                            endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' />}
                            onClick={viewItems} >
                        <span style={{color: "violet"}}> View </span>
                    </Button>
                </Stack>
                
          </Stack>

        </Box>

    </Card>
  );
}

