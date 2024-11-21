import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box,Stack,Container,Button,Typography,Alert,Fade,IconButton, Divider,Chip,Tooltip  } from '@mui/material';
import { Icon } from '@iconify/react';

import { RawFetch } from 'src/hooks/raw/';

import { OnNothing, OnLoading, OnSearching, OnEdit } from 'src/items/menu'

import {Alerting} from 'src/items/alert_snack/'

import Loading_Skeletons from 'src/items/loaders/loadings'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { Table_Accounts, Table_Lines, FilterThis } from '../'

// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

    const dataVIEW    = localStorage.getItem('slk-dataview')

    const onMobile    = Fnc.OnMobile()



    const [onLoaded, setonLoaded]                         = useState(false)
    const [onSwitch, setonSwitch]                         = useState('records')

    const [onFilters, setonFilters]                             = useState({APP: '', CLUB:'', PLAYER: '', DATEOPEN: null , DATECLOSE: null})

    const [onSearches, setonSearches]                           = useState('')


    const defaultRAW = {
                          FOR:            "MY",
                          STATUS:         'ACTIVE',
                          ACCOUNT:        'ALL',
                        }

    const [rawRELOAD, setrawRELOAD]                             = useState(0)
    const [rawFETCH,  setrawFETCH]                              = useState(defaultRAW);

    const fetchRECORDS        = RawFetch(rawFETCH, rawRELOAD, 'recordsnew');

    const ReturnedFilter=(i)=>{
      if(i?.REFRESH != 0){
        setonFilters({APP: '', CLUB:'', PLAYER: '', DATEOPEN: null , DATECLOSE: null})
        setrawRELOAD(Fnc.numRandom())
      } else {
        setonFilters({APP: i?.APPS, CLUB:i?.CLUBS, PLAYER: i?.ACCTS, DATEOPEN: i?.DATEFROM , DATECLOSE: i?.DATEUNTIL})
      }
    }

    const onviewSwitch =(i)=>{
      setonSwitch(i)
      setonLoaded(false)

      if(i == 'records'){
        setrawFETCH({STATUS: 'ACTIVE', ACCOUNT: 'ALL', FOR: 'MY' })
      } else {
        setrawFETCH({STATUS: 'ACTIVE', ACCOUNT: 'ALL', FOR: 'LINE' })
      }

      setrawRELOAD( Fnc.numRandom() )
    }

    useEffect(() => {

      if(fetchRECORDS.load == true){
        setonLoaded(true)
      } else {
        setonLoaded(false)
      }

    }, [rawRELOAD, fetchRECORDS.load == true]);

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant={onMobile ? "h5" : "h4"}>
          {onSwitch == 'new' ? 'ADDING' : onSwitch == 'xlxs' ? 'EDITING' : ''} {TheTitle}
        </Typography>

      </Stack>
                
        <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

          <Grid xs={12} sm={12} md={12} style={{marginTop:'-12px'}}>

            <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={11} sm={6} md={6}>

                    <Button variant={onSwitch == 'records' ? "contained" : "outlined"} 
                            sx={{...Cls.buttonClass(onSwitch == 'records' ? 'contained' : 'outlined','violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            onClick={()=>onviewSwitch('records')}
                            size='small' >
                       {onMobile ? 'ACCOUNTS' : 'MY ACCOUNTS'}
                    </Button>

                    &nbsp;

                    <Button variant={onSwitch == 'lines' ? "contained" : "outlined"} 
                            sx={{...Cls.buttonClass(onSwitch == 'lines' ? 'contained' : 'outlined','violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            onClick={()=>onviewSwitch('lines')}
                            size='small' >
                        {onMobile ? 'LINES' : 'MY LINES'}
                    </Button>

                </Grid>

            </Grid>

              <Box component="section" sx={{ p: 1, border: '1px dashed grey', marginTop:'15px',  }}>

                <Stack style={{margin:'10px'}}>
                  <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>

                    <Grid xs={9} sm={5} md={5}>
                      <OnSearching byLabel={onSwitch == 'players' ? 'Search records' : 'Search records'} bySearching={setonSearches} />
                    </Grid>

                    <Grid xs={3} sm={7} md={7}  justifyContent="flex-end" alignItems="flex-end">

                      <Box sx={{  display: 'flex', justifyContent: 'flex-end', }}>
                        <FilterThis LOAD={[]} 
                                    DATA={fetchRECORDS?.data}
                                    RECEIVE={{APPS: [], CLUBS: [], ACCTS: [], GAMES: [], UNIONS: []}}  
                                    RETURN={ReturnedFilter} />
                      </Box>

                    </Grid>

                  </Grid>
                  
                </Stack>
                {
                  !fetchRECORDS?.load
                  ?
                  <OnLoading TYPE='table' />
                  :
                  fetchRECORDS?.load && fetchRECORDS?.tally > 0 && onSwitch == 'records'
                  ?
                  <Table_Accounts DATA={fetchRECORDS} 
                              RETURN={''} 
                              FILTER={{ ...onFilters, SEARCH:onSearches }} 
                              ITEM={{APPS: '',CLUBS:'',ACCOUNTS:'',DEALS:'',FORMULA:'',DEFAULTFORMULA: [],FXUSD:''}} 
                              />
                  :
                  fetchRECORDS?.load && fetchRECORDS?.tally > 0 && onSwitch == 'lines'
                  ?
                  <Table_Lines DATA={fetchRECORDS} 
                              RETURN={''} 
                              FILTER={{ ...onFilters, SEARCH:onSearches }} 
                              ITEM={{APPS: '',CLUBS:'',ACCOUNTS:'',DEALS:'',FORMULA:'',DEFAULTFORMULA: [],FXUSD:''}} 
                              />
                  :
                  <OnNothing LABEL='No record found...' /> 
                }

              </Box>

          </Grid>


        </Grid>

            {Fnc.JSONS(fetchRECORDS,false)}


    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
