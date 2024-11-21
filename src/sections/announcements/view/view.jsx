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

import OnMobileScreen from 'src/items/screen/resize';

import { RawFetch } from 'src/hooks/raw/';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import { OnSearching, OnSorting, OnLoading } from 'src/items/menu'

import {Upserting} from '../upsert/form';

import { ViaTable,ViaList,ViaCards } from '.'

import {Alerting} from 'src/items/alert_snack/'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

export default function Viewing({TheTitle}) {

    const dataView  = localStorage.getItem('slk-dataview')
    const OnMobile= OnMobileScreen();
    
    const [onview, setonView]               = useState(dataView);
    const [onSwitch, setonSwitch]           = useState('lists');
    const [onUpserting, setonUpserting]     = useState([])

    const [onSearching, setonSearching]     = useState('')
    const [onSorts, setonSorts]             = useState('asc')
    const [onAlert, setonAlert]             = useState({onOpen: 0, severity: '', message: ''});

    const [rawREFRESH,  setrawREFRESH]      = useState(0)
    const [rawFETCH_ALL,  setrawFETCH_ALL]  = useState({
                                                            FOR:            'ALL',
                                                            STATUS:         'ALL',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                            USER:           'ALL',
                                                            ACCOUNT:        'ALL',
                                                            ROLE:           'ALL',
                                                            DATEFROM:       'ALL',
                                                            DATEUNTIL:      'ALL',
                                                            IFZERO:         'ALLs',
                                                            LIMIT:          'ALL',
                                                          });

    const fetchAPPS     = RawFetch(rawFETCH_ALL,rawREFRESH,'applications')
    const fetchUSERS    = RawFetch(rawFETCH_ALL,rawREFRESH,'userz')
    const fetchACCTS    = RawFetch(rawFETCH_ALL,rawREFRESH,'accountslist')
    const fetchGAMES    = RawFetch(rawFETCH_ALL,rawREFRESH,'games')

    const fetchANNOUNCE = RawFetch(rawFETCH_ALL,rawREFRESH,'announcementlist')

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
      setonUpserting({modal:"Open"})
    }
 
  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant={OnMobile ? "h5" :"h4"}>
          {TheTitle}
        </Typography>

      </Stack>

      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

      <Grid item xs={6} sm={6} md={6}>
          <Button variant={onSwitch == 'lists' ?  "contained" : 'text'} 
                  sx={{...Cls.buttonClass(onSwitch == 'lists' ?  "contained" : 'outlined','violet'), fontSize:OnMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                  onClick={()=>{setonSwitch('lists'),setrawREFRESH(Fnc.numRandom())}}
                  size='small' >
              {OnMobile ? 'ITEMS' : 'LIST OF ITEMS '}
          </Button>
      </Grid>
      
      <Grid item xs={6} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
          <Button variant={onSwitch == 'adding' ?  "contained" : 'outlined'}  
                  onClick={()=>( onAddNew() )}
                  disabled={!fetchACCTS.load}
                  sx={{...Cls.buttonClass(onSwitch == 'adding' ?  "contained" : 'outlined','violet'), fontSize:OnMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                  size='small' >
             {OnMobile ? <Icon icon="line-md:plus" color={!fetchACCTS.load ? 'gray' : '#9370db'} width={21} /> : 'ADD NEW'}
          </Button>
      </Grid>


      <Grid item xs={12} sm={12} md={12}>

            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'15px' }}>

                <Stack>
                  <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>

                    <Grid item xs={9} sm={9} md={9}>
                      <OnSearching byLabel={'Search...'} bySearching={setonSearching} />
                      {dataView == 'card' &&
                      <OnSorting RETURN={(e)=>setonSorts(e)} /> }
                    </Grid>

                    <Grid item xs={3} sm={3} md={3}>
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
                      { fetchACCTS.load == false ? 
                         <OnLoading type={'table'}  />
                        :
                        fetchACCTS?.tally == 0 ?
                            <Alert variant="outlined" severity="info" width="100%">
                                  Nothing found..
                            </Alert>
                        :
                        <>
                        {dataView == 'card' ? 
                          <ViaCards DATA={fetchANNOUNCE} ITEMS={{GAMES: fetchGAMES.data}} VIEW={e=>console.log(e)} RETURN={onReturned} SEARCH={onSearching} />
                          : 
                          <ViaTable DATA={fetchANNOUNCE} ITEMS={{GAMES: fetchGAMES.data}} RETURN={onReturned} SEARCH={onSearching} />
                        }
                        </>
                        

                      }
                    </Grid>

                  </Grid>

                </Stack>

            </Box>

        </Grid>

      </Grid>

    <Upserting  receivedData={onUpserting} 
                receivedItems={{APPS: fetchAPPS.data, USERS: fetchUSERS.data}} 
                returnData={onUpserted}/>

    <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
