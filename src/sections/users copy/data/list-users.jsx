import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar , ListItemText, IconButton, Menu, MenuItem, Chip } from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import { Icon } from '@iconify/react';

export default function ViaUsers({DATA,RETURN}) {

 const item = DATA ? DATA : []

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

 const [select,setSelect] = useState(null)

 const onSelect =(i)=>{
    console.log(i)
 }

  const ITEMS = DATA.map((e)=>{
    return {
                id:         e.id,
                name:       e.firstname ? e.firstname + ' ' + e.lastname : e.nickname,
                email:      e.email,
                telegram:   e.telegram,
                role:       e.roleName,
                image:      e.avatarFull ? e.avatarFull : ' ',
                imageDef:   "/images/avatars/default_img_avatar.jpg",
                status:     e.statusLabel,
            }
  })


  return (
    <List>
      {ITEMS.map((i) => (
        <ListItem   key={i.id} 
                    disableGutters 
                    sx={{ paddingRight: '20px',paddingLeft: '20px', backgroundColor: '',border: '1px dashed violet',  marginBottom:'5px', transition: '0.2s', '&:hover': { boxShadow: '10px 10px 20px rgba(0,0,0,0.5)', transform: 'scale(1.05)', }, }}
                    onClick={()=>onSelect(i)}>
          <ListItemAvatar>
            <Avatar alt={i.name} src={Fnc.ifImage(i.avatarFull,i.imageDef)} />
          </ListItemAvatar>
          <ListItemText
            primary={i.name}
            secondary={
              <>
                <div>{i.email}</div>
                <div>
                    <IconButton>
                        <Icon icon="mdi:close-circle"/>
                    </IconButton>
                     {i.role}
                </div>
              </>
            }
          />
          <IconButton onClick={handleClick}>
            <i>a</i>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Edit</MenuItem>
            <MenuItem onClick={handleClose}>Delete</MenuItem>
          </Menu>
        </ListItem>
      ))}
      {JSON.stringify(DATA,null,2)}
    </List>
  );
};
