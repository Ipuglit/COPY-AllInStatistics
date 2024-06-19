import { useState,useEffect } from 'react';

import PropTypes from 'prop-types';


import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import OnMobileScreen from 'src/items/screen/resize';

import {Stack,Button,Grid,Divider,Box,Link,Tooltip,Typography,CardHeader,List,ListItem,ListItemAvatar,Avatar,ListItemText} from '@mui/material/';

import { Icon } from '@iconify/react';


import * as Fnc from 'src/hooks/functions'

// ----------------------------------------------------------------------

export default function ViaList({ DATA_EN, DATA_TO, DATA_RE }) {
    
    const EN = DATA_EN[0]

    function viewDetails(i){
        DATA_RE(i)
      };

      const SX_TYP2  = {
        mb: 0,
        color: 'text.disabled',
        marginTop: '-4px',
        fontSize: '12px'
      }

  return (
    <>
        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 10, md: 15 }}>
            {
            DATA_TO.map((i, index) => (
                <Grid item xs={4} sm={5} md={5} key={index}>
                    <Box component="section" sx={{ p: 0, border: '1px dashed grey' }}>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

                            <ListItem secondaryAction={
                                <Button sx={{ mt: 0, color: 'text.disabled', }}  size="small"
                                        endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' />}
                                        onClick={() => viewDetails({ modal: "Open", ...i, })}  >
                                    <span style={{color: "violet"}}> View </span>
                                </Button> }  >

                                <ListItemAvatar>
                                        <Avatar alt={i[EN.title]} src={i[EN.avatar]} />
                                </ListItemAvatar>
                                
                                <ListItemText>

                                    <Typography variant="caption" component="div" sx={{color: 'text.disabled',}} >
                                                {i[EN.header]}
                                    </Typography>
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
                                                            
                                            <Typography variant="body2" component="div" >
                                                {i[EN.title]}
                                            </Typography>

                                        </div>
                                        
                                        <Divider variant="li" style={{marginBottom:'6px', marginTop:'3px', maxWidth:'130px'}}/>

                                        {EN.description.map((e, ndx) => (
                                                <Typography key={ndx} variant="caption" component='div' sx={SX_TYP2}>
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
                                        )) }

                                </ListItemText>   
                            </ListItem>

                    </List>
                    </Box>
                </Grid>
             ))
            }


        </Grid>
    </>
  );
}
