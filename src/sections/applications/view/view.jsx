import { useState, useEffect } from 'react';
import {
          Stack,
          Button,
          Container,
          Grid,
          IconButton ,
          Alert,
          Typography,
          Tooltip,
          Box,
          ToggleButton,
          ToggleButtonGroup
        } from '@mui/material/';

import OnMobileScreen from 'src/items/screen/resize';

import { RawFetch } from 'src/hooks/raw/';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import { OnSearching, OnSorting, OnLoading } from 'src/items/menu'

import {Alerting} from 'src/items/alert_snack/'

import { ViaTable,ViaList,ViaCards,ViaItems, UploadingExcel, Upserting } from './'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

export default function Viewing() {

    const dataView  = localStorage.getItem('slk-dataview')
    const onMobile= OnMobileScreen();

    const [onview, setonView]               = useState(dataView);
    const [onSwitch, setonSwitch]           = useState('lists');
    const [onUpserting, setonUpserting]     = useState([])
    const [onUploading, setonUploading]     = useState([])
    const [onSearching, setonSearching]     = useState('')
    const [onSorts, setonSorts]             = useState('asc')
    const [onAlert, setonAlert]             = useState({onOpen: 0, severity: '', title:'', message: ''});

    const [rawREFRESH,  setrawREFRESH]      = useState(0)
    const [rawFETCH_ALL,  setrawFETCH_ALL]  = useState({
                                                            FOR:            'ALL',
                                                            STATUS:         'ALL',
                                                            SEARCH:         'ALL',
                                                            SORTBY:         'ALL',
                                                            SORT:           'DESC',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                          });

    const fetchAPPS     = RawFetch(rawFETCH_ALL,rawREFRESH,'applications')
    const fetchGAMES    = RawFetch(rawFETCH_ALL,rawREFRESH,'games')
    
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
 
        <Typography variant={onMobile ? "h5" :"h4"}>
          APPLICATIONS
        </Typography>

      </Stack>

      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

      <Grid item xs={6} sm={6} md={6}>
          <Button variant={onSwitch == 'lists' ?  "contained" : 'text'} 
                  sx={{...Cls.buttonClass(onSwitch == 'lists' ?  "contained" : 'outlined','violet'), fontSize:onMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                  onClick={()=>{setonSwitch('lists'),setrawREFRESH(Fnc.numRandom())}}
                  size='small' >
              {onMobile ? 'ITEMS' : 'LIST OF ITEMS '}
          </Button>
      </Grid>
      
      <Grid item xs={6} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', }}>

          <IconButton variant='standard' 
                      size='small' 
                      onClick={()=>setonUploading({modal: true})}
                      disabled={!fetchAPPS.load}
                      sx={{marginTop:'-8px', marginRight:'10px'}}>
            <Tooltip title='Upload excel file'>
            <Icon icon="line-md:file-upload-twotone" color={!fetchAPPS.load ? 'gray' : '#9370db'} width={23}/>
            </Tooltip>
          </IconButton>

          <Button variant={onSwitch == 'adding' ?  "contained" : 'outlined'}  
                  onClick={()=>( onAddNew() )}
                  disabled={!fetchAPPS.load}
                  sx={{...Cls.buttonClass(onSwitch == 'adding' ?  "contained" : 'outlined','violet'), fontSize:onMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                  size='small' >
             {onMobile ? <Icon icon="line-md:plus" color={!fetchAPPS.load ? 'gray' : '#9370db'} width={21} /> : 'ADD NEW'}
          </Button>
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
                      { fetchAPPS.load == false ? 
                          <OnLoading type={'table'}  />
                        :
                        fetchAPPS?.tally == 0 ?
                            <Alert variant="outlined" severity="info" width="100%">
                                  Nothing found..
                            </Alert>
                        :
                        <>

                        {dataView == 'card' ? 

                          <ViaCards DATA={fetchAPPS} RETURN={onReturned} SEARCH={onSearching} SORT={onSorts} />
                        : 
                          <ViaTable DATA={fetchAPPS} ITEMS={{GAMES: fetchGAMES.data}} RETURN={onReturned} SEARCH={onSearching} />
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
      
      <UploadingExcel DATA={onUploading} ALERT={onUpserted} ITEMS={{APPS: fetchAPPS.data, UNIONS: [], }}/>
    {
    //<pre style={{fontSize:'10px'}}>{JSON.stringify(fetchAPPS,null,2)}</pre>
    }
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
