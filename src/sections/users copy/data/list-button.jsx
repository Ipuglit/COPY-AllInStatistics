import React, { useState, useEffect } from 'react';
import {
        Card,
        CardHeader,
        CardMedia,
        CardContent,
        IconButton,
        Avatar,
        Typography,
        Divider,
        Tooltip,
        Chip,
        Button,
        Box
        } from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Eq from 'src/hooks/calculations'
import * as Cls from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function ViaListButton({DATA, TYPE, RETURN, EDIT}) {

    const [selectedITEM, setselectedITEM] = useState('');
  // -------------- -------------- -------------- --------------

  const iEDIT =(i) => {
    return ''
  }

  const iCHIP =(i) => {
    return <Chip label={i} variant="outlined" color='default' size='small' />
}

  const iSTATUS =(i,ii,iii) => {
        return <>
                  {
                    i == 'Active' 
                    ? 
                    <Tooltip title="Active account">
                      <Chip icon={<Icon icon="mdi:check-circle"/>} label={ii} variant={iii == selectedITEM ? 'contained' : 'outlined'}  color='success' size='small' />
                    </Tooltip>
                    :
                    i == 'Pending' 
                    ?
                    <Tooltip title="Pending account">
                      <Chip icon={<Icon icon="mdi:clock-outline"/>} label={ii} variant={iii == selectedITEM ? 'contained' : 'outlined'}  color='warning' size='small' />
                    </Tooltip>
                    :
                    <Tooltip title="Disabled account">
                      <Chip icon={<Icon icon="mdi:close-circle"/>} label={ii} variant={iii == selectedITEM ? 'contained' : 'outlined'}  color='error' size='small' />
                    </Tooltip>
                  }
              </>
  }

    const handleSELECT =(i) => {
        if(i == selectedITEM){
            setselectedITEM('')
            RETURN('')
        } else {
            setselectedITEM(i)
            RETURN(i)
        }
    }

    const handleEDIT =() => {
      EDIT(selectedITEM)
    }

    useEffect(() => {
        setselectedITEM('')
    }, []);

  return (
    <>
    {
        TYPE == 'USERS' ?
        DATA.map((i) => (
          <div key={i.id} >
            <Card   
                    onClick={()=>handleSELECT(i.id)}
                    sx={{ backgroundColor: i.id == selectedITEM ? 'mediumpurple' : '',border: i.id == selectedITEM ? '1px dashed violet' : '1px',  marginBottom:'5px', transition: '0.2s', '&:hover': { boxShadow: '10px 10px 20px rgba(0,0,0,0.5)',backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))', cursor:'pointer', transform: 'scale(1.01)', }, }}>
                <CardHeader avatar={ <Avatar alt={i.nickname} src={Fnc.ifImage(i.avatarFull,'/images/avatars/default_img_avatar.jpg')} /> }
                            title={i.nickname}
                            style={{marginTop:'-20px', marginBottom:'-15px'}}
                            subheader={!Fnc.isNull(i.firstname) ? i.firstname+' '+i.lastname : '' } />

                <CardContent style={{marginTop:'-15px', marginBottom:'-15px'}}>

                    { iSTATUS(i.statusLabel,i.statusLabel,i.id) }
                    &nbsp; 
                    { iCHIP(i.roleName) }
                    
                </CardContent>

            </Card>

            {
              i.id == selectedITEM 
              ?
              <Box sx={{display: 'flex',justifyContent: 'flex-end', marginBottom:'5px'}} >
                <Button variant='contained' 
                        size='small' 
                        onClick={()=>handleEDIT()}
                        startIcon={<Icon icon="fluent:edit-16-filled"/>} sx={Cls.buttonClass('contained','violet')}>
                  Edit user
                </Button>
              </Box>
              :
              null
            }

          </div>

        
        ))
        :
        null
    }
    </>
        );
}