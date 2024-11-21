import { useState, useEffect } from 'react';
import { LinearProgress, Typography, Box, Tooltip, Paper } from "@mui/material";

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function LinePercent({onData}) {

    const i = onData
    const perc = Math.abs(i?.percent)
    const isNeg = parseFloat(i?.value) < 0 ? true : false
    const zero = onData?.value == 0 ? true : false
    return (

<>
<Paper variant='div'>
            <Typography sx={{marginBottom:'-7px', marginTop:"-1px", fontSize: i.name != 'Points' ? '11px' : '12px', color: zero ? 'grey' : i.name != 'Points' ? 'lightgray' : '',fontWeight:i.name == 'Points' ? '700' : '0'}}>
                {i.name} &nbsp; <span style={{color:zero ? 'gray' : 'lightgray'}}>{i.title && '('+i.title+')'}</span>
            </Typography>
            
            <Box position="relative" display="inline-flex" width="100%">

                <Tooltip title={(i.value ? i.value : 0)+' USD'}>
                    <LinearProgress variant="determinate" 
                                    value={perc ? perc : 0} 
                                    sx={{width:'80%', height:'6px', backgroundColor: zero ? 'grey' : '', '& .MuiLinearProgress-bar': {  backgroundColor:  isNeg ? '#ed3330' : '#8A2BE2', },}}/>
                </Tooltip>
                <Box    top={-8}
                        left="84%"
                        position="absolute"
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{ transform: 'translateX(-50%)', width:'35%' }} >

                    <Typography variant="body2" color="textSecondary" sx={{fontSize:i.name != 'Points' ? '11px' : '13px',  color: zero ? 'grey' : i.name != 'Points' ? 'lightgray' : ''}}>{perc ? (perc != 0 && isNeg ? '-' : '')+perc : 0}%</Typography>

                </Box>
            </Box>
</Paper>
</>





  );
}