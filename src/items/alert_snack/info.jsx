import React, {useEffect, useState} from 'react';
import {Snackbar, Alert, AlertTitle} from '@mui/material/';


export default function Informing({onOpen, severity, message}) {

    const [off,setOff] = useState('none')

    useEffect(() => {
        if(onOpen != 0){
            
        }
        setOff('')
  
            const T = setTimeout(() => {
                setOff('none')
            }, 15000);
            return () => clearTimeout(T);

      }, [onOpen != 0]);

    return (

            <Alert severity={severity} variant="outlined" style={{display: off, margin:'20px'}} onClose={() => setOff('none')}>
                {message}
            </Alert>

            );

}