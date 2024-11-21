import React, { useState,useEffect } from 'react';
import {Box} from '@mui/material/'

import { DataGrid, GridToolbar, } from "@mui/x-data-grid";

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'

// ----------------------------------------------------------------------

export default function ImageUploading({ DATA_EN, DATA_TO, DATA_RE }) {

    const inputRefAvatar      = React.createRef();
    const inputRefBackground  = React.createRef();

    const handleAvatarClick = () => {
      inputRefAvatar.current.click();
    };
  
    const defaultImage = (i)=>{
        
    }

  return (

    <Box  component="form"
    onMouseEnter={() => setonHover(true)}
    onMouseLeave={() => setonHover(false)}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 4,
      marginBottom: '-30px',
      marginTop: '-30px',
    }} >

    <img alt="Profile Picture" variant="square"
                                key={Math.random()}
                                src={onData?.imagePreview ? onData?.imagePreview :  `${'https://www.all-in-statistics.pro'+onData?.imageFull}?${new Date().getTime()}`}
                                style={{  height: '100px', 
                                          minWidth:'100px', 
                                          mb: 0, 
                                          bgcolor: 'primary.main', 
                                          border: '2px dashed grey', 
                                          cursor: 'pointer', 
                                        }} 
                              onError={(e) => {
                                e.target.src = 'https://www.all-in-statistics.pro/images/announcements/default_bg.jpg';
                              }}
                              onClick={handleAvatarClick} />
      <div style={{marginTop:'-20px', }}>
          <Icon icon="ep:upload-filled" height={30} sx={{marginBottom:'-5px',}}/>
      </div>

<input type="file" hidden accept='.jpeg, .jpg, .png' ref={inputRefAvatar} onChange={onUploadImage} />

</Box>

  );
}
