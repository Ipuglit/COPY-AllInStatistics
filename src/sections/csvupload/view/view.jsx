import { useState, useEffect } from 'react';

import {Stack,Button,Container,Alert,Typography,Divider,Grid} from '@mui/material';


import * as Fnc from 'src/hooks/functions'
import { UploadClubs, UploadRecords } from 'src/items/upload/'

// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

  const [jsonsData, setjsonsData]     = useState('');

  const [whichis, setWhichis]         = useState('');

  const JSONData =(i)=>{
    setjsonsData(i)
  }

  const WhichIS =(i)=>{
    setWhichis(i)
  }

  return (

    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">FILE UPLOADS</Typography>
      </Stack>

      <Grid container  sx={{ marginTop:'20px', paddingRight:'60px',paddingLeft:'50px' }}>
          <Grid item xs={12} md={12} xl={12}>
              <Button onClick={()=>WhichIS('CLUB')}>Club</Button>
              <Button onClick={()=>WhichIS('RECORD')}>Records</Button>
          </Grid>

          <Grid item xs={12} md={12} xl={12}>
            {
              whichis == 'CLUB' ?
                  <UploadClubs ReData={JSONData} /> 
              : whichis == 'RECORD' ?
                  <UploadRecords ReData={JSONData} />
              : null
            }
              


          </Grid>

          <Grid item xs={22} sm={22} md={22}>
        
        <pre style={{fontSize:'9px'}}>
          {
         // JSON.stringify(jsonsData, null, 2)
          }
          </pre>

      </Grid>

      </Grid>



    </Container>
  );
}

