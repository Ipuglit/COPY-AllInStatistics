import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Tooltip from '@mui/material/Tooltip';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export default function PostCard({ index, data, upsertData }) {

  function viewDetails(i){
    upsertData(i)

  };

  return (
    <Grid  xs={2} sm={3} md={3.3} key={index}>
      <Card>
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 2 / 4)',
          }}
        >
        <SvgColor
          color="paper"
          src="/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={data.accountNickname}
          src={data.userAvatar}
          style={data.statusLabel == "Disabled" ?  { filter: 'grayscale(100%)' } : null}
          sx={{
            zIndex: 9,
            width: 55,
            height: 55,
            position: 'absolute',
            left: (theme) => theme.spacing(1.9),
            bottom: (theme) => theme.spacing(-2),
          }}
        />
        <Box
          component="img"
          alt={data.accountNickname}
          style={data.statusLabel == "Disabled" ?  { filter: 'grayscale(100%)' } : null}
          src={data.appImage}
          sx={{
            top: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            position: 'absolute',
          }}
        />
        </Box>

        <Box
          sx={{
            p: (theme) => theme.spacing(3.5, 1.5, 1, 1.5),
          }}
        >


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

                <Typography variant="body2"
                            component="div"
                            sx={{
                              mb: 0,
                              size: 20,
                              color: 'text.disabled',
                            }}>
                  {data.appName}
                </Typography>

          </div>

          <Link
            color="inherit"
            variant="h6"
            underline="hover"
            sx={{
              height: 25,
              overflow: 'hidden',
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }}
          >
            <span style={{fontSize:"16px"}}>{data.accountNickname}</span>
          </Link>

              <Typography variant="caption"
                            component="div"
                            sx={{
                              mb: 0,
                              color: 'text.disabled',
                            }}>
                  {data.accountRole}
                </Typography>

                <Typography variant="caption"
                            component="div"
                            sx={{
                              mb: 0,
                              color: 'text.disabled',
                            }}>
                  ID: {data.accountID}
                </Typography>

                <Typography variant="caption"
                            component="div"
                            sx={{
                              mb: 0,
                              color: 'text.disabled',
                            }}>
                  {data.accountClubsCount == 1 ? "1 club" : data.accountClubsCount > 1 ? data.accountClubsCount+" clubs" : "No club"}
                </Typography>

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
                          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" color='purple' />}
                          onClick={() => viewDetails({
                                                        modal: "Open",
                                                        ...data,
                                                    })}  >
                      <span style={{color: "violet"}}> View </span>
                  </Button>
                </Stack>

          </Stack>

        </Box>

      </Card>
    </Grid>
  );
}
