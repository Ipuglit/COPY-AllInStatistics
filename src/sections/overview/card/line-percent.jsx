import { useState, useEffect } from 'react';
import { LinearProgress, Typography, Box, Tooltip } from "@mui/material";

import './css/hello.css';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function LinePercent({onData}) {

    const i = onData
    const perc = Math.abs(i?.percent)
    const isNeg = parseFloat(i?.value) < 0 ? true : false

    return (

<>
            <Typography sx={{marginBottom:'-12px', marginTop:"-1px", fontSize:'11px'}}>
                {i.name} &nbsp; <span style={{color:'lightgray'}}>({i.title})</span>
            </Typography>
            
            <Box position="relative" display="inline-flex" width="100%">

                <Tooltip title={i.value ? i.value : 0}>
                    <LinearProgress variant="determinate" 
                                    value={perc ? perc : 0} 
                                    sx={{width:'75%', height:'6px', '& .MuiLinearProgress-bar': {  backgroundColor: isNeg ? '#ed3330' : '#8A2BE2', },}}/>
                </Tooltip>

                <Box    top={-8}
                        left="97%"
                        position="absolute"
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{ transform: 'translateX(-50%)', width:'5%' }} >

                    <Typography variant="body2" color="textSecondary" sx={{fontSize:'13px',}}>{perc ? (perc != 0 && isNeg ? '-' : '')+perc : 0}%</Typography>

                </Box>
            </Box>
</>





  );
}