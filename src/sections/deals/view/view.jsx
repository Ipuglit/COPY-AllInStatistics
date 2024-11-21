import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box,Stack,Container,Button,Typography,Alert,Fade,IconButton, Divider,Chip,ButtonGroup  } from '@mui/material';
import { Icon } from '@iconify/react';

import { RawFetch } from 'src/hooks/raw/';

import { OnSearching } from 'src/items/menu'
import OnMobileScreen from 'src/items/screen/resize';

import Loading_Skeletons from 'src/items/loaders/loadings'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { DDownClubs, DDownApps, DDownPlayer, DDownUpline, ViaTable_Players, ViaTable_Uplines, ViaList_DealClubs, Upserting } from '../'

// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

    const dataVIEW    = localStorage.getItem('slk-dataview')
    const OnMobile    = OnMobileScreen();

    const [onFade, setonFade]                             = useState(false)
    const [onView, setonView]                             = useState('list')
    const [onSwitch, setonSwitch]                         = useState('players')

    const [onClubDeal, setonClubDeal]                     = useState('')
    const [onAppDeal, setonAppDeal]                       = useState('')
    const [onPlayerDeal, setonPlayerDeal]                 = useState('')
    const [onUplineDeal, setonUplineDeal]                 = useState('')

    const [onHistoryDeal, setonHistoryDeal]                 = useState('')

    const [onSearchClubs, setonSearchClubs]               = useState('')
    const [onSearchAccounts, setonSearchAccounts]         = useState('')

    const [AddDealPlayer, setAddDealPlayer]               = useState(0)
    const [AddDealUpline, setAddDealUpline]               = useState(0)

    const [refreshDealPlayer, setrefreshDealPlayer]         = useState(0)
    const [refreshDealUpline, setrefreshDealUpline]         = useState(0)

    const [rawRELOAD_DEALS, setrawRELOAD_DEALS]           = useState(1)
    const [rawRELOAD_CLUBS, setrawRELOAD_CLUBS]           = useState(1)

    const [rawFETCH_DEALS,  setrawFETCH_DEALS] = useState({
                                                          FOR:            "ALL",
                                                          STATUS:         'ACTIVE',
                                                          SORTBY:         'ALL',
                                                          SORT:           'DESC',
                                                          LIMIT:          1000,
                                                          SEARCH:         'ALL',
                                                          DATE:           'ALL',
                                                          APP:            'ALL',
                                                          CLUB:           'ALL',
                                                          PLAYER:         'ALL',
                                                          UPLINE:         'ALL',
                                                        });

    const [rawFETCH_CLUBS,  setrawFETCH_CLUBS] = useState({
                                                            FOR:            "ALL",
                                                            STATUS:         'ALL',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                          });

    const fetchACCOUNTS       = RawFetch(rawFETCH_DEALS,rawRELOAD_CLUBS,'accounts')
    const fetchCLUBS          = RawFetch(rawFETCH_CLUBS,rawRELOAD_CLUBS,'clubz')
    const fetchFORMULA        = RawFetch(rawFETCH_DEALS,rawRELOAD_CLUBS,'formula')

    const fetchDEALPLAYERS    = RawFetch(rawFETCH_DEALS,refreshDealPlayer,'dealplayers')
    const fetchDEALFORMULA    = RawFetch(rawFETCH_DEALS,refreshDealPlayer,'dealformula')
    const fetchDEALUPLINES    = RawFetch(rawFETCH_DEALS,refreshDealPlayer,'dealuplines')


    const filteredAPPS =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonAppDeal(i)
      } else {
        setonAppDeal(0)
      }
    }

    const filteredCLUBS =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonClubDeal(i)
      } else {
        setonClubDeal(0)
      }
    }

    const filteredPLAYERS =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonPlayerDeal(i)
      } else {
        setonPlayerDeal(0)
      }
    }

    const filteredUPLINE =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonUplineDeal(i)
      } else {
        setonUplineDeal(0)
      }
    }

    const onviewDEAL =(i)=>{
      setAddDealPlayer(0)
      setAddDealUpline(0)
      setonSwitch(i)
      if(i == 'players' && onSwitch != i){
        setrefreshDealPlayer( Fnc.numRandom() )
      } else if(i == 'uplines' && onSwitch != i){
        setrefreshDealUpline( Fnc.numRandom() )
      }

    }

    

    useEffect(() => {
        setonFade(true)
    }, []);

    useEffect(() => {
      //console.log(fetchACCOUNTS)
    }, [fetchACCOUNTS.load == true]);


    useEffect(() => {

      if(!Fnc.isNull(refreshDealPlayer)){


      }

    }, [refreshDealPlayer, fetchDEALPLAYERS.load == true]);

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant={OnMobile ? "h5" :"h4"}>
          {TheTitle}
        </Typography>

      </Stack>

      
                
        <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }}>

          <Grid xs={12} sm={12} md={12}>

            <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={OnMobile ? 11 : 12} sm={OnMobile ? 10 : 9} md={9}>
                    <Button variant={onSwitch == 'players' ? "contained" : "text"} 
                            sx={{...Cls.buttonClass(onSwitch == 'players' ? 'contained' : 'outlined','violet'), fontSize:OnMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                            onClick={()=>onviewDEAL('players')}
                            size='small' >
                              {OnMobile ? 'PLAYERS' : 'LIST OF PLAYERS DEAL'}
                      
                    </Button>
                    &nbsp;
                    <Button variant={onSwitch == 'uplines' ? "contained" : "text"} 
                            sx={{...Cls.buttonClass(onSwitch == 'uplines' ? 'contained' : 'outlined','violet'), fontSize:OnMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                            onClick={()=>onviewDEAL('uplines')}
                            size='small' >
                              {OnMobile ? 'UPLINES' : 'LIST OF UPLINES DEAL'}
                    </Button>
                </Grid>

                <Grid xs={OnMobile ? 1 : 12} sm={3} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                    <Button variant={"outlined"} onClick={()=>( onSwitch == 'players' ? setAddDealPlayer( Fnc.numRandom()) : setAddDealUpline( Fnc.numRandom()) )}
                            sx={{...Cls.buttonClass('outlined','violet'), fontSize:'14px',borderRadius:'0', marginTop:'-12px'}} 
                            disabled={!fetchFORMULA.load || !fetchDEALUPLINES.load || !fetchDEALPLAYERS.load}
                            size='small' >
                       {OnMobile ? <Icon icon="line-md:plus" color={!fetchDEALPLAYERS.load ? 'gray' : '#9370db'} width={21} /> : 'ADD NEW'}
                    </Button>
                </Grid>

            </Grid>

          <Grid xs={12} sm={12} md={12}>

            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'16px' }}>

              <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>

                  <Grid xs={6} sm={3} md={3} style={{padding:'5px'}}>
                    <DDownApps DATA={fetchCLUBS} RETURN={filteredAPPS} />  
                  </Grid>

                  <Grid xs={6} sm={3} md={3} style={{padding:'5px'}}>
                    <DDownClubs DATA={fetchCLUBS} RETURN={filteredCLUBS} />
                  </Grid>

                  <Grid xs={6} sm={3} md={3} style={{padding:'5px'}}>
                    <DDownUpline DATA={fetchACCOUNTS} RETURN={filteredUPLINE} /> 
                  </Grid>

                  <Grid xs={6} sm={3} md={3} style={{padding:'5px'}}>
                    {
                      onSwitch == 'players'
                      ?
                      <DDownPlayer DATA={fetchACCOUNTS} RETURN={filteredPLAYERS} /> 
                      :
                      null
                    }

                  </Grid>

              </Grid>
            
            </Box>

          </Grid>


              <Box component="section" sx={{ p: 1, border: '1px dashed grey', marginTop:'10px',  }}>

                <Stack style={{margin:'10px'}}>
                  <OnSearching byLabel={onSwitch == 'players' ? 'Search player deals' : 'Search upline deals'} bySearching={setonSearchAccounts} />
                </Stack>

              {
                onSwitch == 'players' 
                ?
                <ViaTable_Players DATA={fetchDEALPLAYERS} VIEW={setonHistoryDeal} BYAPP={onAppDeal} BYCLUB={onClubDeal} BYUPLINE={onUplineDeal} BYPLAYER={onPlayerDeal} ADD={AddDealPlayer} REFRESH={setrefreshDealPlayer} SEARCH={onSearchAccounts} CLUBS={fetchCLUBS} UPLINES={fetchDEALUPLINES} ACCOUNTS={fetchACCOUNTS} FORMULA={fetchFORMULA} FORMULADEAL={fetchDEALFORMULA} />
                :
                <ViaTable_Uplines DATA={fetchDEALUPLINES} VIEW={setonHistoryDeal} BYAPP={onAppDeal} BYCLUB={onClubDeal} BYUPLINE={onUplineDeal} BYPLAYER={onPlayerDeal} ADD={AddDealUpline} REFRESH={setrefreshDealUpline} SEARCH={onSearchAccounts}  CLUBS={fetchCLUBS} UPLINES={fetchDEALUPLINES} ACCOUNTS={fetchACCOUNTS}  />
              }


              </Box>

          </Grid>


        {
            onView == 'list' 
            ?
            <>
            <Grid xs={12} sm={12} md={12}>
              {
                //<ViaTable DATA={''} CLUBS={fetchCLUBS} ACCOUNTS={fetchACCOUNTS}  />
              }

            </Grid>
            </>
            :
            onView == 'new' 
            ?
          <Grid xs={12} sm={12} md={12}>
            <Upserting CLUBS={fetchCLUBS} ACCOUNTS={fetchACCOUNTS} UPLINES={''}  />
          </Grid>
            :
            null
        }

        </Grid>

    {
      
   // <pre>{JSON.stringify(fetchFORMULA,null,2)}</pre>
    }

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
