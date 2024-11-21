import { useState, useEffect } from 'react';
import {
          Stack,
          Button,
          Container,
          Grid,
          Skeleton,
          Alert,
          Typography,
          Divider,
          Box,
          ToggleButton,
          ToggleButtonGroup
        } from '@mui/material/';


import { RawFetch } from 'src/hooks/raw/';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';


import { OnSearching,OnLoading } from 'src/items/menu'



import { ViaTable } from './'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

    const dataView  = localStorage.getItem('slk-dataview')

    const [onview, setonView]               = useState(dataView);
    const [onSwitch, setonSwitch]           = useState('lists');
    const [onUpserting, setonUpserting]     = useState([])
    const [onSearching, setonSearching]     = useState('')
    const [onAlert, setonAlert]             = useState({onOpen: 0, severity: '', title:'', message: ''});

    const [rawREFRESH,  setrawREFRESH]      = useState(0)
    const [rawFETCH_ALL,  setrawFETCH_ALL]  = useState({
                                                            FOR:            TheFor,
                                                            STATUS:         'ALL',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                            USER:           'ALL',
                                                            ROLE:           'ALL',
                                                            IFZERO:         'ALL',
                                                            DATEFROM:       'ALL',
                                                            DATEUNTIL:      'ALL',
                                                            LIMIT:          '200',
                                                          });

    const fetchACCTS    = RawFetch(rawFETCH_ALL,rawREFRESH,'accountslist')
    const fetchHISTORY  = RawFetch(rawFETCH_ALL,rawREFRESH,'historylist')

    const onReturned =(i)=>{
      setonUpserting(i)
    }
    
    const onUpserted =(severe,msg)=>{

      setonAlert({onOpen: Fnc.numRandom(), severity:severe, message:msg})

      if(severe == 'success'){
        setrawREFRESH( Fnc.numRandom() )
      }

    }

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant="h4">
          {TheTitle}
        </Typography>

      </Stack>

      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

      <Grid item xs={12} sm={12} md={12}>

      <Grid item xs={6} sm={6} md={6}>
          <Button variant={onSwitch == 'lists' ?  "contained" : 'text'} 
                  sx={{...Cls.buttonClass(onSwitch == 'lists' ?  "contained" : 'outlined','violet'), fontSize:'14px',borderRadius:'0', marginTop:'-12px'}} 
                  onClick={(e)=>setrawREFRESH( Fnc.numRandom() )}
                  size='small' >
              LIST OF ITEMS 
          </Button>
      </Grid>



            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'15px' }}>

                <Stack>
                  <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>

                    <Grid item xs={6} sm={6} md={6}>
                      <OnSearching byLabel={'Search...'} bySearching={setonSearching} />
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>

                    </Grid>
                    
                    <Grid item xs={12} sm={12} md={12} >
                      { fetchHISTORY.load == false ? 
                          <OnLoading type={'table'}  />
                        :
                        fetchHISTORY?.tally == 0 ?
                            <Alert variant="outlined" severity="info" width="100%">
                                  Nothing found..
                            </Alert>
                        :
                        <ViaTable DATA={fetchHISTORY} RETURN={onReturned} SEARCH={onSearching} FOR={TheFor}/>
                      }
                    </Grid>
                  </Grid>

                </Stack>

            </Box>

        </Grid>

      </Grid>
    {
      Fnc.JSONS(fetchHISTORY,false)
    }
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
