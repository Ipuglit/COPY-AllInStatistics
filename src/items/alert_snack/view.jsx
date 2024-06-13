import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function AlertSnack(i,ii) {

  return (

      <Snackbar open={true} autoHideDuration={3500} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={i} sx={{ width: '100%' }} >
            {ii}
        </Alert>
      </Snackbar>

  );
}