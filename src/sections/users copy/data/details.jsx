import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Menu, MenuItem } from '@mui/material';

const musicList = [
  { id: 1, title: 'Song One', artist: 'Artist One', imageUrl: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Song Two', artist: 'Artist Two', imageUrl: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Song Three', artist: 'Artist Three', imageUrl: 'https://via.placeholder.com/150' },
];

export default function ViaDetails({}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }; 
    return (
      <List>
        {musicList.map(music => (
          <ListItem key={music.id}>
            <ListItemAvatar>
              <Avatar src={music.imageUrl} />
            </ListItemAvatar>
            <ListItemText primary={music.title} secondary={music.artist} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="more" onClick={handleClick}>
                <p>a</p>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Play</MenuItem>
                <MenuItem onClick={handleClose}>Add to Playlist</MenuItem>
                <MenuItem onClick={handleClose}>Share</MenuItem>
              </Menu>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
};
