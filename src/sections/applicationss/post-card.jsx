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

export default function PostCard({ index, data, upsertData }) {

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
      <Label
        variant="standard"
        color={'info'}
        sx={{
          zIndex: 9,
          bottom: 16,
          right: 6,
          position: 'absolute',
          textTransform: 'uppercase',
        }}
      >
                    {data.statusLabel == "Active" ? 
                            <Icon icon="mdi:check-circle" color='green' width={35}  />  
                    :
                    data.statusLabel == "Pending" ?
                            <Tooltip title="Pending" placement="right" arrow>
                                <Icon icon="mdi:clock-outline" color='orange' width={35} />
                            </Tooltip>  
                    :
                            <Tooltip title="Disabled" placement="right" arrow>
                                <Icon icon="mdi:close-circle" color='red' width={35}  />
                            </Tooltip>  
                    } 
      </Label>
          <Box
            component="img"
            alt={data.name}
            src={data.imageFull}
            style={data.statusLabel == "Disabled" ?  { filter: 'grayscale(100%)' } : null}
            sx={{
              top: 0,
              width: 1,
              height: 1,
              objectFit: 'cover',
              position: 'absolute',
            }}
          />
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {data.name}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          

        <Typography component="div" variant="subtitle1" sx={{ color: 'text.disabled', }} >
            <span style={{fontSize:"12px"}}>{data.company}</span>
        </Typography>

        <Typography component="div" variant="subtitle1" sx={{ color: 'text.disabled', }} >
            <span style={{fontSize:"12px"}}>{data.company}</span>
        </Typography>

      <Typography
      component="span"
      variant="body1"
      sx={{
        color: 'text.disabled',
      }}
    >
      <span style={{fontSize:"12px"}}>{data.usercount != 0 || data.usercount != null ? data.usercount+" users" : null}</span>
    </Typography>
        </Stack>
      </Stack>
      <Stack
                  direction="row"
                  flexWrap="wrap"
                  spacing={1.5}
                  justifyContent="flex-end"
                  sx={{
                    mt: 1,
                    color: 'text.disabled',
                  }}
                >
      <Stack direction="row" >
                  <Button sx={{ mt: 0, color: 'text.disabled', }} 
                          size="small"
                          endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='orange' width={35} />}
                          onClick={() => viewDetails({
                                                        modal: "Open",
                                                        ...data,
                                                    })}  >
                      <span style={{color: "violet"}}> View </span>
                  </Button>
                </Stack>
                </Stack>
    </Card>
  );
}

