import { useState,useEffect } from 'react';

import {  Box,
          Link,
          Card,
          Typography,
          Tooltip,
          Avatar,
          Stack,
          Button,
          Grid,
          Divider
          } from '@mui/material/';

// ----------------------------------------------------------------------

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'

// ----------------------------------------------------------------------

export default function ViaCardUser({ DATA_EN, DATA_TO, DATA_RE }) {

  const EN = DATA_EN[0]

  function viewDetails(i){
    DATA_RE(i)
  };

  const SX_SVG = {
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }

const SX_AVA = {
            zIndex: 9,
            width: 55,
            height: 55,
            position: 'absolute',
            left: (theme) => theme.spacing(1.9),
            bottom: (theme) => theme.spacing(-2),
          }

const SX_BOX = {
            top: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            position: 'absolute',
          }

const SX_LINK = {
              height: 25,
              overflow: 'hidden',
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }
const SX_TYP  = {
            mb: 0,
            color: 'text.disabled',
          }

const SX_TYP2  = {
            mb: 0,
            color: 'text.disabled',
            marginTop: '-4px',
            fontSize: '11px'
          }
  return (
    <>
<Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 10, md: 20 }}>
  {              
      DATA_TO.map((i, index) => (

        <Grid item xs={2} sm={3} md={3.3} key={index}>

        <Card>
          
          <Box sx={{ position: 'relative', pt: 'calc(100% * 2 / 4)', }} >
          <SvgColor color="paper" src="/assets/icons/shape-avatar.svg" sx={SX_SVG} />

          <Avatar 
            alt={i[EN.title]} 
            src={i[EN.avatar]} 
            style={i[EN.status] == "Disabled" ?  { filter: 'grayscale(100%)' } : null} sx={SX_AVA} />

          <Box
            component="img"
            alt={i[EN.title]}
            style={i[EN.status] == "Disabled" ?  { filter: 'grayscale(100%)' } : null}
            src={i[EN.image]}
            sx={SX_BOX}
          />
          </Box>

          <Box sx={{ p: (theme) => theme.spacing(3.5, 1.5, 1, 1.5), }} >


            <div style={{ display: 'flex', alignItems: 'center' }}>

                    {i[EN.status] == "Active" ? 
                            <Tooltip title="Active" placement="right" arrow>
                                <Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0.3 }}  />
                            </Tooltip>  
                    :
                    i[EN.status] == "Pending" ?
                            <Tooltip title="Pending" placement="right" arrow>
                                <Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0.3 }}  />
                            </Tooltip>  
                    :
                            <Tooltip title="Disabled" placement="right" arrow>
                                <Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 0.3 }}  />
                            </Tooltip>  
                    } 

                  <Typography variant="body2" component="div" sx={SX_TYP}>
                    {i[EN.header]}
                  </Typography>

            </div>

            <Link color="inherit" variant="h6" underline="hover" sx={SX_LINK} >
              <span style={{fontSize:"16px"}}>{i[EN.title]}</span>
            </Link>

              {
                EN.description.map((e, ndx) => (
                  <Typography key={ndx} variant="caption" component="div" sx={SX_TYP2}>
                    {e.count ? 
                      <>
                        {i[e.value] == 0 || i[e.value] == undefined || i[e.value] == null ?
                          <>No {e.label}</>
                        : i[e.value] == 1 ?
                          <>1 {e.label}</>
                        :
                          <>{i[e.value]} {e.label}s</>
                        }
                      </>
                    :
                    <span>{e.label ? e.label : null} {i[e.value]}</span>
                    }
                  </Typography>
                ))  
              }

              <Stack direction="row" flexWrap="wrap" spacing={1.5} justifyContent="flex-end" sx={{ mt: 1, color: 'text.disabled', }} >
                  <Stack direction="row" >
                    
                    <Button sx={{ mt: 0, color: 'text.disabled', }}  size="small"
                            endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' />}
                            onClick={() => viewDetails({ modal: "Open", ...i, })}  >
                        <span style={{color: "violet"}}> View </span>
                    </Button>

                  </Stack>
              </Stack>

          </Box>

        </Card>
      </Grid>

      ))

  }
</Grid>
    </>
  );

}
