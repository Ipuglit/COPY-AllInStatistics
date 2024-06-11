import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export default function OnMobileScreen() {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
      };
  
      window.addEventListener('resize', handleResize);
  
      handleResize(); // Check initial width on component mount
  
      return () => window.removeEventListener('resize', handleResize); // Cleanup
    }, []);

  return isMobile;
}

