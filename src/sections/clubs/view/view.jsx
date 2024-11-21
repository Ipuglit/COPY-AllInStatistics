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
          ToggleButtonGroup,
          IconButton,
          Tooltip
        } from '@mui/material/';

import OnMobileScreen from 'src/items/screen/resize';
      
import { RawFetch } from 'src/hooks/raw/';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import { OnSearching, OnSorting, OnLoading } from 'src/items/menu'

import { 
          ViaTable,
          ViaCards,
          Upserting,
          UploadingExcel,
          Upserting_Union,
          UploadingExcel_Union,
          ViaTable_Unions,
          ViaCards_Unions,
          FilterThis
        } from './'

import {Alerting} from 'src/items/alert_snack/'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

    const fetchDefault = {
                            FOR:            'ALL',
                            STATUS:         'ALL',
                            SEARCH:         'ALL',
                            APP:            'ALL',
                            CLUB:           'ALL',
                            USER:           'ALL',
                            ACCOUNT:        'ALL',
                            ROLE:           'ALL',
                            UNIONS:         'ALL',
                            UNIONTYPE:      'ALL',
                            DATEFROM:       'ALL',
                            DATEUNTIL:      'ALL',
                            IFZERO:         'ALLS',
                            LIMIT:          'ALL',
                          }

export default function Viewing() {

    const dataView                                = localStorage.getItem('slk-dataview')
    const onMobile                                = OnMobileScreen();

    const [onview, setonView]                     = useState(dataView);
    const [onSwitch, setonSwitch]                 = useState('clubs');
    const [onUpserting, setonUpserting]           = useState([])
    const [onUploading, setonUploading]           = useState([])
    const [onUpsertingUnion, setonUpsertingUnion] = useState([])
    const [onUploadingUnion, setonUploadingUnion] = useState([])
    const [onSearching, setonSearching]           = useState('')
    const [onSorts, setonSorts]                   = useState('asc')
    const [onAlert, setonAlert]                   = useState({onOpen: 0, severity: '', message: ''});

    const [rawREFRESH,  setrawREFRESH]            = useState(0)



    const [rawFETCH_ALL,  setrawFETCH_ALL]        = useState(fetchDefault);

    const fetchAPPS     = RawFetch(rawFETCH_ALL,rawREFRESH,'applications')
    const fetchCLUBS    = RawFetch(rawFETCH_ALL,rawREFRESH,'clubslist')
    const fetchUNIONS   = RawFetch(rawFETCH_ALL,rawREFRESH,'unions')
    const fetchGAMES    = RawFetch(rawFETCH_ALL,rawREFRESH,'games')

    const fetchAPPSF     = RawFetch(fetchDefault,rawREFRESH,'applications')
    const fetchCLUBSF    = RawFetch(fetchDefault,rawREFRESH,'clubslist')
    const fetchUNIONSF   = RawFetch(fetchDefault,rawREFRESH,'unions')
    const fetchGAMESF    = RawFetch(fetchDefault,rawREFRESH,'games')

    const ReturnedFilter=(i)=>{
      setrawFETCH_ALL({
                        ...rawFETCH_ALL,
                        UNIONS:       i?.UNIONS?.length > 0 ? i?.UNIONS : 'ALL',
                        UNIONTYPE:    i?.UNIONTYPE?.length > 0 ? i?.UNIONTYPE : 'ALL',
                        APP:          i?.APPS?.length > 0 ? i?.APPS : 'ALL',
                        CLUB:         i?.CLUBS?.length > 0 ? i?.CLUBS : 'ALL',
                        DATEFROM:     i?.DATEFROM,
                        DATEUNTIL:    i?.DATEUNTIL,
                        STATUS:       i?.STATUS,
                      })
                      console.log(i)
      setrawREFRESH(Fnc.numRandom())
    }

    const onReturned =(i)=>{
      if(onSwitch == 'clubs'){
        setonUpserting(i)
      } else if(onSwitch == 'unions'){
        setonUpsertingUnion(i)
      }
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

    const onAddNew=(i)=>{
      if(i == 'clubs'){
        setonUpserting({modal:"Open"})
      } else if(i == 'unions'){
        setonUpsertingUnion({modal:"Open"})
      }
    }

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
      <Typography variant={onMobile ? "h5" :"h4"}>
          {onSwitch == 'unions' ?  "UNIONS" : 'CLUBS'} 
        </Typography>

      </Stack>

      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

      <Grid item xs={6} sm={6} md={6}>
          <Button variant={onSwitch == 'clubs' ?  "contained" : 'text'} 
                  sx={{...Cls.buttonClass(onSwitch == 'clubs' ?  "contained" : 'outlined','violet'), fontSize:onMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                  onClick={()=>{setonSwitch('clubs'),setrawREFRESH(Fnc.numRandom())}}
                  size='small' >
             {onMobile ? 'CLUBS' : 'LIST OF CLUBS '}
          </Button>
          &nbsp;
          <Button variant={onSwitch == 'unions' ?  "contained" : 'text'} 
                  sx={{...Cls.buttonClass(onSwitch == 'unions' ?  "contained" : 'outlined','violet'), fontSize:onMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                  onClick={()=>{setonSwitch('unions'),setrawREFRESH(Fnc.numRandom())}}
                  size='small' >
             {onMobile ? 'UNIONS' : 'LIST OF UNIONS '}
          </Button>
      </Grid>
      
      <Grid item xs={6} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
          <IconButton variant='standard' 
                      size='small' 
                      onClick={()=>onSwitch == 'clubs' ? setonUploading({modal: true}) : setonUploadingUnion({modal: true})}
                      disabled={!fetchCLUBS.load}
                      sx={{marginTop:'-8px', marginRight:'10px'}}>
            <Tooltip title='Upload excel file'>
            <Icon icon="line-md:file-upload-twotone" color={!fetchCLUBS.load ? 'gray' : '#9370db'} width={23}/>
            </Tooltip>
          </IconButton>

          <Button variant={onSwitch == 'adding' ?  "contained" : 'outlined'}  
                  onClick={()=>( onAddNew(onSwitch) )}
                  disabled={!fetchCLUBS.load}
                  sx={{...Cls.buttonClass(onSwitch == 'adding' ?  "contained" : 'outlined','violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                  size='small' >
                       {onMobile ? <Icon icon="line-md:plus" color={!fetchCLUBS.load ? 'gray' : '#9370db'} width={21} /> : 'ADD NEW'}
          </Button>
      </Grid>


      <Grid item xs={12} sm={12} md={12}>

            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'15px' }}>

                <Stack>
                  <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>
                    <Grid item xs={2} sm={1} md={1}>
                      <FilterThis LOAD={fetchCLUBS.load} 
                                  RECEIVE={{APPS: fetchAPPSF, CLUBS: fetchCLUBSF, ACCTS: [], GAMES: fetchGAMESF, UNIONS: fetchUNIONSF}}  
                                  RETURN={ReturnedFilter} />
                    </Grid>
                    <Grid item xs={10} sm={5} md={5}>

                      <OnSearching byLabel={'Search...'} bySearching={setonSearching} />
                      {dataView == 'card' &&
                      <OnSorting RETURN={(e)=>setonSorts(e)} /> }
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
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
                      { fetchCLUBS.load == false ? 
                         <OnLoading type={'table'}  />
                        :
                        fetchCLUBS?.tally == 0 ?
                            <Alert variant="outlined" severity="info" width="100%">
                                  Nothing found..
                            </Alert>
                        :
                        <>

                        {
                          dataView == 'card' || dataView == 'list' 
                          ? 
                          <>
                            {
                              onSwitch == 'clubs' 
                              ?
                              <ViaCards DATA={fetchCLUBS} RETURN={onReturned} SEARCH={onSearching} SORT={onSorts} />
                              :
                              <ViaCards_Unions DATA={fetchUNIONS} RETURN={onReturned} SEARCH={onSearching} SORT={onSorts} />
                            }
                          </>
                        :
                          <>
                            {
                              onSwitch == 'clubs' 
                              ?
                              <ViaTable DATA={fetchCLUBS} ITEMS={{GAMES: fetchGAMES.data}} RETURN={onReturned} SEARCH={onSearching} />
                              :
                              <ViaTable_Unions DATA={fetchUNIONS} ITEMS={{GAMES: fetchGAMES.data}} RETURN={onReturned} SEARCH={onSearching} />
                            }
                          </>
                            
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
                receivedItems={{APPS: fetchAPPS.data, UNIONS: fetchUNIONS.data,}} 
                returnData={onUpserted}/>

    <Upserting_Union  receivedData={onUpsertingUnion} 
                receivedItems={{APPS: fetchAPPS.data, UNIONS: fetchUNIONS.data,}} 
                returnData={onUpserted}/>

    <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />
                  
    {
      Fnc.JSONS(fetchUNIONS,false)
    }

    <UploadingExcel DATA={onUploading} ALERT={onUpserted} ITEMS={{APPS: fetchAPPS.data, UNIONS: fetchUNIONS.data, }}/>
    <UploadingExcel_Union DATA={onUploadingUnion} ALERT={onUpserted} ITEMS={{APPS: fetchAPPS.data, UNIONS: fetchUNIONS.data, }}/>
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
