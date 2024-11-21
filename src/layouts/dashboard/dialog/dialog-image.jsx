import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export const DialogFullImage = ({ DATA, CLOSE }) => {
  return (
    <Dialog
      open={DATA?.open}
      maxWidth="false"  
      fullScreen 
    >
        
      <DialogTitle>

        <IconButton
          edge="end"
          color="inherit"
          onClick={()=>CLOSE({open: false, image: ''})}
          aria-label="close"
          sx={{ float:'right',right: 2, top: 2 }}
        >
          <CloseIcon />
        </IconButton>

      </DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <img 
          src={DATA?.image} 
          alt="Full screen" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain'
          }} 
        />
      </DialogContent>

    </Dialog>
  );
};

