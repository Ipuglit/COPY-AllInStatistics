import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { Alert, Collapse, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { Height } from '@mui/icons-material';

// ----------------------------------------------------------------------
export default function OnNothing({LABEL,TYPE}) {
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 20);
        return () => clearTimeout(timer);
      }, []);

  return ( 
                <Alert  severity={TYPE ? TYPE : "info"}
                        style={{height:'100px', alignItems:'center', marginTop:'10px', opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease-in-out'}} >
                    {LABEL ? LABEL : 'No record found...'}
                </Alert>
        );
}
