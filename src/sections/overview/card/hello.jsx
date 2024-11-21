import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import './css/hello.css';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export function Hello({value}) {
    const onMobile = Fnc.OnMobile()




    return (

<>
    <div className='hellodiv'>
        Hi {value}
    </div> 

    <br/>

    <div className='hellodiv' style={{marginTop:'-15px',fontSize:onMobile ? '14px' : '16px', overflow:'hidden'}}>
        <span className='hellospan' style={{fontSize:onMobile ? '11px' : '16px', width: '100%', overflow:'hidden',}}>
            WELCOME TO ALL IN STATISTICS
        </span>
    </div>
</>





  );
}