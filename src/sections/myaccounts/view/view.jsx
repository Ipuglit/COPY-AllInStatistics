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
          Paper,
          Chip,
          Card,CardContent,
          TextField,
          Autocomplete,
          IconButton,
          InputAdornment
        } from '@mui/material/';

import { Charts_Accounts, ViaList, FilterThis, ModalViewTop } from '../index'

import { RawFetch } from 'src/hooks/raw/';



import { OnSearching, OnSorting, OnLoading } from 'src/items/menu'


import {Alerting} from 'src/items/alert_snack/'


import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

export default function Viewing() {

    const onMobile  = Fnc.OnMobile()

    const [onSearching, setonSearching]     = useState('')
    const [onSelectApps, setonSelectApps]   = useState([])
    const [onSelectClubs, setonSelectClubs]   = useState([])
    const [onSelectAccounts, setonSelectAccounts]   = useState([])
    const [onSorts, setonSorts]             = useState('asc')
    const [onAlert, setonAlert]             = useState({onOpen: 0, severity: '', title:'', message: ''});

    const [onDialog, setonDialog]               = useState(false);
    const [onDialogData, setonDialogData]       = useState({open: false, data: []});

    const [rawREFRESH,  setrawREFRESH]        = useState(0)


    const defaultRAW = {
                        FOR:            'MINE',
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
                      }

    const [rawFETCH_ACC,  setrawFETCH_ACC]  = useState(defaultRAW);
    const [rawFETCH_ALL,  setrawFETCH_ALL]  = useState(defaultRAW);

    const fetchCLUBS    = RawFetch(rawFETCH_ACC,rawREFRESH,'clubslist')
    const fetchAPPS     = RawFetch(rawFETCH_ACC,rawREFRESH,'applicationslist')
    const fetchGAMES    = RawFetch(rawFETCH_ACC,rawREFRESH,'games')
    const fetchUNIONS   = RawFetch(rawFETCH_ACC,rawREFRESH,'unions')
    const fetchACCTS    = RawFetch(rawFETCH_ACC,rawREFRESH,'accountslist')

    const fetchCLUBSF   = RawFetch(rawFETCH_ALL,rawREFRESH,'clubslist')
    const fetchAPPSF    = RawFetch(rawFETCH_ALL,rawREFRESH,'applicationslist')
    const fetchACCTSF   = RawFetch(rawFETCH_ALL,rawREFRESH,'accountslist')

    const totalVALUE =(val)=>{
      return fetchACCTS?.data?.reduce((i,e)=> i + e[val], 0).toFixed(2)
    }

    const highestTOP =(arr,i,n,limit)=>{

      const totalValue    = arr?.reduce((acc, item) => acc + item[i], 0).toFixed(2);
      const negaValue     = arr?.reduce((acc, item) => item[i] < 0 ? acc + item[i] : acc, 0).toFixed(2);
      const posiValue     = arr?.reduce((acc, item) => item[i] > 0 ? acc + item[i] : acc, 0).toFixed(2);

      const totalFill = (r)=> {return r < 0 ? negaValue : posiValue}

      const sumValue    = arr?.map(e => ({
                                          name:           e[n],
                                          value:          e[i],
                                          percent:        (e[i] < 0 ? '-' : '') + eval( (e[i] / totalFill(e[i]) ) * 100).toFixed(2),
                                          total:          totalValue,
                                          negative:       negaValue,
                                          positive:       posiValue,
                                          hey: arr?.[i]+'s'
                                        }));

      const filterReturn = sumValue?.filter(e=>e?.value != 0)
      return filterReturn?.slice(0, limit ? limit : 1000000000)?.sort((a, b) => b.value - a.value);
    }

    const topAPP    = highestTOP(fetchAPPS?.data,'total_points_usd','appName',2);
    const topCLUB   = highestTOP(fetchCLUBS?.data,'total_points_usd','clubName',2);
    const topACC    = highestTOP(fetchACCTS?.data,'total_points_usd','accountID',2);
    const topGAME   = highestTOP(fetchGAMES?.data,'total_points_usd','gameName',2);

    const createCARD = (title,value,date) => {
      const hZise = title == 'Winnings' || title == 'Losses' ? '' : 'violet'
      return (
        <Card elevation={1} 
              sx={{borderRadius:0, height:onMobile ? '100px' : '100%', marginBottom:onMobile ? '-60px' : ''}}>
          <CardContent sx={{}}>

            <Typography variant="subtitle" component="div" gutterBottom color={hZise} sx={{fontWeight:'300'}}>
              {title}
            </Typography>

            <Typography variant="h5" color="textSecondary" sx={{marginTop: '-10px'}}>
              {
                fetchAPPS?.load && fetchCLUBS?.load && fetchACCTS?.load && fetchGAMES?.load
                ?
                <>
                    {Fnc.numExceeds(totalVALUE(value))} <span style={{fontSize:'12px'}}>USD</span>
                </>
                :
                <span style={{fontSize:'12px'}}>LOADING...</span>
              }

            </Typography>

          </CardContent>
        </Card>
      );
    };


    const ReturnedFilter=(i)=>{
      setrawFETCH_ACC({
                        ...rawFETCH_ACC,
                        ACCOUNT:      i?.ACCTS?.length > 0 ? i?.ACCTS : 'ALL',
                        APP:          i?.APPS?.length > 0 ? i?.APPS : 'ALL',
                        CLUB:         i?.CLUBS?.length > 0 ? i?.CLUBS : 'ALL',
                        DATEFROM:     i?.DATEFROM,
                        DATEUNTIL:    i?.DATEUNTIL,
                      })
      setrawREFRESH(Fnc.numRandom())
    }


  return (
    <Container sx={{width:'100%',}}>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>

        <Typography variant="h6">
          MY ACCOUNTS
        </Typography>

        <span style={{float:'right'}}>
          <FilterThis LOAD={fetchACCTS.load} 
                      RECEIVE={{APPS: fetchAPPSF, CLUBS: fetchCLUBSF, ACCTS: fetchACCTSF, GAMES: fetchGAMES, UNIONS: []}}  
                      RETURN={ReturnedFilter} />
        </span>

      </Stack>

      <Grid container columns={{ xs: 12, sm: 12, md: 12 }} sx={{marginTop:'-40px'}}>

        <Grid item xs={12} sm={6} md={4} padding={1}>
          <Paper  elevation={1} 
                  sx={{ padding: 2, textAlign: 'center', cursor:'pointer', '&:hover': { color: '#a88ce2' }, }}
                  onClick={()=>fetchACCTS?.load && setonDialogData({open: true, data: fetchACCTS?.data, title: 'ACCOUNT'})}>
            {
              topACC?.length > 0
              ?
              <>
            <span style={{fontSize:'13px',fontWeight: '700'}}>Top Accounts:</span>
              <div style={{marginBottom:'8px', marginTop:'-6px'}}>
              {topACC?.map((e,index)=>{
                  return  <p key={index} style={{fontSize:index == 0 ? '11.5px' : '11px', fontWeight: index == 0 ? '900' : '', textAlign:'left',marginBottom:'-10px'}}>
                              {index+1}. ID: {e.name} <span style={{float:'right',}}>{e.percent == 0.00 ? 0 : e.percent}%</span>
                          </p>
              })}
              </div>
              </>
              :
              !fetchACCTS?.load
              ?
              'Loading...'
              :
              'No Record'
            }
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} padding={1}>
          <Paper  elevation={1} 
                  sx={{ padding: 2, textAlign: 'center', cursor:'pointer', '&:hover': { color: '#a88ce2' }, }}
                  onClick={()=>fetchAPPS?.load && setonDialogData({open: true, data: fetchAPPS?.data, title: 'APPLICATION'})}>
            {
              topAPP?.length > 0
              ?
              <>
              <span style={{fontSize:'13px',fontWeight: '700'}}>Top Applications:</span>
              <div style={{marginBottom:'8px', marginTop:'-6px'}}>
              {topAPP?.map((e,index)=>{
                  return  <p key={index} style={{fontSize:index == 0 ? '11.5px' : '11px', fontWeight: index == 0 ? '900' : '', textAlign:'left',marginBottom:'-10px'}}>
                              {index+1}. {e.name} <span style={{float:'right',}}>{e.percent == 0.00 ? 0 : e.percent}%</span>
                          </p>
              })}
              </div>
              </>
              :
              !fetchAPPS?.load
              ?
              'Loading...'
              :
              'No Record'
            }
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} padding={1}>
          <Paper elevation={1} 
                sx={{ padding: 2, textAlign: 'center', cursor:'pointer', '&:hover': { color: '#a88ce2' }, }}
                onClick={()=>fetchCLUBS?.load && setonDialogData({open: true, data: fetchCLUBS?.data, title: 'CLUB'})}>
            {
              topCLUB?.length > 0
              ?
              <>
              <span style={{fontSize:'13px',fontWeight: '700'}}>Top Clubs:</span>
              <div style={{marginBottom:'8px', marginTop:'-6px'}}>
              {topCLUB?.map((e,index)=>{
                  return  <p key={index} style={{fontSize:index == 0 ? '11.5px' : '11px', fontWeight: index == 0 ? '900' : '', textAlign:'left',marginBottom:'-10px'}}>
                              {index+1}. {e.name} <span style={{float:'right',}}>{e.percent == 0.00 ? 0 : e.percent}%</span>
                          </p>
              })}
              </div>
              </>
              :
              !fetchCLUBS?.load
              ?
              'Loading...'
              :
              'No Record'
            }
          </Paper>
        </Grid>
        

        <Grid item xs={12} sm={12} md={9} sx={{order: onMobile ? 6 : 5}}>

          { fetchACCTS.load == false ? 
              <OnLoading type={'table'}  />
              :
              fetchACCTS?.tally == 0 ?
                  <Alert variant="outlined" severity="info" width="100%">
                    No data found..
                  </Alert>
              :
              <ViaList  DATA={fetchACCTS} 
                        SORT={onSorts} 
                        SEARCH={onSearching} 
                        FILTER={{APPS: onSelectApps, CLUBS: onSelectClubs, ACCTS: onSelectAccounts}} />

            }
            {
              false &&
              <Charts_Accounts  onData={{data: fetchACCTS.data, load: fetchACCTS.load, games :fetchGAMES.data}}
                                onTitle={'Points'}
                                onFiltered={[]}
                                subheader=""
                                barWidth='50'
                                sublabel='USD' />
            }
          </Grid>

        <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', order: onMobile ? 5 : 6}}>

          <Grid container spacing={2} padding={1} columns={{ xs: 12, sm: 12, md: 12 }} direction="column" sx={{paddingBottom:'55px'}}>

              <Grid item xs={6} sm={6} md={3} >
                {createCARD('Bonus','total_bonus_usd')}
              </Grid>

              <Grid item xs={4} sm={6} md={3}>
                {createCARD('Points','total_points_usd')}
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                {createCARD('Losses','total_loss_usd')}
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                {createCARD('Winnings','total_win_usd')}
              </Grid>

          </Grid>

        </Grid>
      </Grid>

      <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />

      <ModalViewTop onData={onDialogData} returnData={setonDialogData} />

          {Fnc.JSONS(fetchAPPS,false)}
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
