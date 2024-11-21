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

import Loading_Skeletons from 'src/items/loaders/loadings'

import { OnSearching, OnLoading, OnSorting } from 'src/items/menu'

import {Upserting} from '../upsert/form';

import {Alerting} from 'src/items/alert_snack/'

import { ViaTable,ViaList,ViaCards,ViaItems } from './'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

export default function Viewing({TheTitle}) {

    const dataView  = localStorage.getItem('slk-dataview')

    const [onview, setonView]               = useState(dataView);
    const [onSwitch, setonSwitch]           = useState('lists');
    const [onUpserting, setonUpserting]     = useState([])
    const [onSearching, setonSearching]     = useState('')
    const [onSorts, setonSorts]             = useState('desc')
    const [onAlert, setonAlert]             = useState({onOpen: 0, severity: '', title:'', message: ''});

    const [rawREFRESH,  setrawREFRESH]      = useState(0)
    const [rawFETCH_ALL,  setrawFETCH_ALL]  = useState({
                                                            FOR:            'ALL',
                                                            STATUS:         'ALL',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                            USER:           'ALL',
                                                            ROLE:           'ALL',
                                                            IFZERO:         'ALL',
                                                            DATEFROM:       'ALL',
                                                            DATEUNTIL:      'ALL',
                                                            LIMIT:          'ALL',
                                                          });

    const fetchFXUSD = RawFetch(rawFETCH_ALL,rawREFRESH,'fxUSDlist')

    const onReturned =(i)=>{
      setonUpserting(i)
    }
    
    const onUpserted =(severe,msg)=>{

      setonAlert({onOpen: Fnc.numRandom(), severity:severe, message:msg})

      if(severe == 'success'){
        setrawREFRESH( Fnc.numRandom() )
      }

    }

    const onChangeView = (event, i) => {
      setonView(i);
      localStorage.setItem('slk-dataview',i)
    };

    const onAddNew=()=>{
      setonUpserting({modal:true})
    }
 
  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant="h4">
          {TheTitle}
        </Typography>

      </Stack>

      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

      <Grid item xs={6} sm={6} md={6}>
          <Button variant={onSwitch == 'lists' ?  "contained" : 'text'} 
                  sx={{...Cls.buttonClass(onSwitch == 'lists' ?  "contained" : 'outlined','violet'), fontSize:'14px',borderRadius:'0', marginTop:'-12px'}} 
                  onClick={()=>{setonSwitch('lists'),setrawREFRESH(Fnc.numRandom())}}
                  size='small' >
              LIST OF ITEMS 
          </Button>
      </Grid>
      
      <Grid item xs={6} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', }}>

      </Grid>

      <Grid item xs={12} sm={12} md={12}>


            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'15px' }}>

                <Stack >
                  <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>

                    <Grid item xs={6} sm={6} md={6}>
                      <OnSearching byLabel={'Search...'} bySearching={setonSearching} />
                      {dataView == 'card' &&
                      <OnSorting RETURN={(e)=>setonSorts(e)} /> }
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>
                      <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-end">

                          <ToggleButtonGroup value={onview} onChange={onChangeView} exclusive size="small"  >

                                <ToggleButton value="table">
                                      <Icon icon="fluent-mdl2:table" color='gray' width={22} sx={{ mr: 5 }}  />
                                </ToggleButton>

                                <ToggleButton value="card">
                                      <Icon icon="clarity:view-cards-line" color='gray' width={22} sx={{ mr: 5 }}  />
                                </ToggleButton>

                          </ToggleButtonGroup>

                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={12} md={12} >
                      { fetchFXUSD.load == false ? 
                          <OnLoading type={'table'}  />
                        :
                        fetchFXUSD?.tally == 0 ?
                            <Alert variant="outlined" severity="info" width="100%">
                                  Nothing found..
                            </Alert>
                        :
                        <>

                        {
                          dataView == 'card' ? 
                          <ViaList DATA={fetchFXUSD} RETURN={onReturned} SEARCH={onSearching} SORT={onSorts}/>
                        : 
                          <ViaTable DATA={fetchFXUSD} RETURN={onReturned} SEARCH={onSearching} />
                        }

                      </>
                      }
                    </Grid>
                  </Grid>

                </Stack>

            </Box>

        </Grid>

      </Grid>

      <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />

      <Upserting receivedData={onUpserting} returnData={onUpserted}/>
    {
      Fnc.JSONS(fetchFXUSD,false)
    }
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
