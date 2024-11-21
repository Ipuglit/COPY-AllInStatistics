import React, {useEffect, useState} from 'react';
import {Snackbar, Alert, AlertTitle} from '@mui/material/';


export default function Alerting({onOpen, severity, message}) {

    const [off,setOff] = useState(false)

    useEffect(() => {

        setOff(true)
  
            const T = setTimeout(() => {
                setOff(false)
            }, 1500);
            return () => clearTimeout(T);

      }, [onOpen]);

    return (
                <Snackbar   open={off} 
                            autoHideDuration={1500} 
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}   >

                    <Alert severity={severity} sx={{ minWidth: '150px'}}>
                        {message}
                    </Alert>
                    
                </Snackbar>
            );

}