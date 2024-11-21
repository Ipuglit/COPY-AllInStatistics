import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box,Stack,Container,Button,Typography,Alert,Fade,IconButton, Divider,Chip,Tooltip  } from '@mui/material';
import { Icon } from '@iconify/react';

import { RawFetch } from 'src/hooks/raw/';

import { OnNothing, OnLoading, OnSearching, OnEdit } from 'src/items/menu'

import {Alerting} from 'src/items/alert_snack/'

import { ExcelDialog } from '../modal-excel'

import {UploadingExcel,FilterThis} from '../index'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { Table_Records } from '../'

// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

    const dataVIEW                                              = localStorage.getItem('slk-dataview')

    const onMobile                                              = Fnc.OnMobile()

    const [onDialog, setonDialog]                               = useState({open: false, data: [], name: ''})
    const [onSwitch, setonSwitch]                               = useState('records')

    const [onAlert, setonAlert]                                 = useState({onOpen: 0, severity: '', message: ''});

    const [onEditData, setonEditData]                           = useState([])
    const [onUploading, setonUploading]                         = useState([])

    const [onSearchAccounts, setonSearchAccounts]               = useState('')

    const [onFilters, setonFilters]                             = useState({APP: '', CLUB:'', PLAYER: '', LINE: '', DATEOPEN: null , DATECLOSE: null})

    const [rawRELOAD, setrawRELOAD]                             = useState(0)
    const [rawRELOADREC, setrawRELOADREC]                       = useState(0)
    const [rawRELOADFORMULA, setrawRELOADFORMULA]               = useState(0)
    
    const [rawFETCH_REC,  setrawFETCH_REC] = useState({
                                                                FOR:            "ALL",
                                                                STATUS:         'ACTIVE',
                                                                SORTBY:         'ALL',
                                                                SORT:           'DESC',
                                                                LIMIT:          100000,
                                                                SEARCH:         'ALL',
                                                                DATE:           'ALL',
                                                                APP:            'ALL',
                                                                CLUB:           'ALL',
                                                                PLAYER:         'ALL',
                                                                UPLINE:         'ALL',
                                                              });

    const [rawFETCH_DEALS,  setrawFETCH_DEALS] = useState({
                                                          FOR:            "ALL",
                                                          STATUS:         'ACTIVE',
                                                          SORTBY:         'ALL',
                                                          SORT:           'DESC',
                                                          LIMIT:          100000,
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


    const fetchRECORDS        = RawFetch(rawFETCH_REC,rawRELOADREC,'recordsnew')

    const fetchAPPS           = RawFetch(rawFETCH_DEALS,rawRELOAD,'applications')
    const fetchACCOUNTS       = RawFetch(rawFETCH_DEALS,rawRELOAD,'accounts')
    const fetchCLUBS          = RawFetch(rawFETCH_CLUBS,rawRELOAD,'clubz')
    const fetchFORMULA        = RawFetch(rawFETCH_DEALS,rawRELOADFORMULA,'formula')
    const fetchUSD            = RawFetch(rawFETCH_DEALS,rawRELOAD,'fxUSD')
    const fetchGAMES          = RawFetch(rawFETCH_DEALS,rawRELOAD,'games')

    const fetchDEALPLAYERS    = RawFetch(rawFETCH_DEALS,rawRELOAD,'dealplayers')
    const fetchDEALFORMULA    = RawFetch(rawFETCH_DEALS,rawRELOAD,'dealformula')
    const fetchDEALUPLINES    = RawFetch(rawFETCH_DEALS,rawRELOAD,'dealuplines')

    const isEditing = onEditData.length > 0 ? true : false

    const ReturnedFilter=(i)=>{
      if(i?.REFRESH != 0){
        setonFilters({APP: '', CLUB:'', PLAYER: '', DATEOPEN: null , DATECLOSE: null})
        setrawRELOAD(Fnc.numRandom())
        setrawRELOADREC(Fnc.numRandom())
        setrawRELOADFORMULA(Fnc.numRandom())
      } else {
        setonFilters({APP: i?.APPS, CLUB:i?.CLUBS, PLAYER: i?.ACCTS, LINE: i?.LINES, DATEOPEN: i?.DATEFROM , DATECLOSE: i?.DATEUNTIL})
      }
    }

    const onviewSwitch =(i)=>{

      setonSwitch(i)
      setonEditData([])

      if(i == 'deleted'){
        setrawFETCH_REC({...rawFETCH_REC,STATUS: 'DISABLED' })
        setrawRELOADREC( Fnc.numRandom() )
      } else {
        setrawFETCH_REC({...rawFETCH_REC,STATUS: 'ACTIVE' })
        setrawRELOAD( Fnc.numRandom() )
        setrawRELOADREC( Fnc.numRandom() )
        setrawRELOADFORMULA( Fnc.numRandom() )
      }

    }

      const returnedEDIT =(i,e)=>{

        if(e == 'edit'){
          setonSwitch('xlxs')
        } else {
          setonDialog({open: true, data: i, name: 'DELETE'})
        }

      }

      const returnedDELETED =(i)=>{

        if(i.WHAT == 'DELETE'){
          setonDialog({open: false, data: i, name: 'DELETE'})
          setrawRELOADREC( Fnc.numRandom() )
          setonEditData([])
        }

      }

      const onUpserted =(severe,msg)=>{

        setonAlert({onOpen: Fnc.numRandom(), severity:severe, message:msg})
  
        if(severe == 'success'){
          setrawRELOADREC( Fnc.numRandom() )
          setonEditData([])
        }
  
      }


  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant={onMobile ? "h5" : "h4"}>
          {onSwitch == 'new' ? 'ADDING' : onSwitch == 'xlxs' ? 'EDITING' : ''} {TheTitle}
        </Typography>

      </Stack>
                
        <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

          <Grid xs={12} sm={12} md={12} style={{marginTop:'-9px'}}>

            <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={11} sm={6} md={6}>
                    <Button variant={onSwitch == 'records' ? "contained" : "outlined"} 
                            sx={{...Cls.buttonClass(onSwitch == 'records' ? 'contained' : 'outlined','violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            onClick={()=>onviewSwitch('records')}
                            size='small' >
                       {onMobile ? 'ACTIVE' : 'ACTIVE ITEMS'}
                    </Button>
                    &nbsp;
                    <Button variant={onSwitch == 'deleted' ? "contained" : "outlined"} 
                            sx={{...Cls.buttonClass(onSwitch == 'deleted' ? 'contained' : 'outlined',onSwitch == 'deleted' ? 'red' : 'violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            onClick={()=>onviewSwitch('deleted')}
                            size='small' >
                       {onMobile ? 'DELETED' : 'DELETED ITEMS'}
                    </Button>
                </Grid>

                <Grid xs={1} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', }}>

                    <IconButton variant='standard' 
                                size='small' 
                                onClick={()=>setonUploading({modal: true, data: []}) }
                                disabled={!fetchRECORDS.load}
                                sx={{marginTop:'-8px', marginRight:'10px', display:'none'}}>
                      <Tooltip title='Upload excel file'>
                      <Icon icon="line-md:file-upload-twotone" color={!fetchRECORDS.load ? 'gray' : '#9370db'} width={23}/>
                      </Tooltip>
                    </IconButton>

                    <Button variant={"outlined"}
                            sx={{...Cls.buttonClass(onSwitch == 'adding' ?  "contained" : 'outlined','violet'), fontSize:onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            //onClick={()=>onviewSwitch('new')}
                            onClick={()=>setonUploading({modal: true, data: []}) }
                            disabled={!fetchRECORDS.load}
                            size='small' >
                       {onMobile ? <Icon icon="line-md:plus" width={21} /> : 'ADD NEW'}
                    </Button>
                </Grid>

            </Grid>


              <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'17px' }}>

                <Stack >
                  <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>

                    <Grid xs={9} sm={5} md={5}>
                      <OnSearching byLabel={onSwitch == 'players' ? 'Search records' : 'Search records'} bySearching={setonSearchAccounts} />
                    </Grid>

                    <Grid xs={3} sm={7} md={7}  justifyContent="flex-end" alignItems="flex-end">

                      <Box sx={{  display: 'flex', justifyContent: 'flex-end', }}>

                        <Button variant={"outlined"}
                                disabled={!isEditing}
                                sx={{...Cls.buttonClass(isEditing ? 'contained' : 'outlined',isEditing ? 'violet' : 'gray'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0',}} 
                                //onClick={()=>returnedEDIT(onEditData,'edit')}
                                onClick={()=>setonUploading({modal: true, data: onEditData, what: onSwitch == 'deleted' ? 'RESTORE' : 'OLD'})}
                                size='' >

                          {onMobile ? (onSwitch == 'deleted' ? <Icon icon="hugeicons:restore-bin" width={21} />
                          :<Icon icon="fluent:edit-48-filled"  width={21} />) : (onSwitch == 'deleted' ? 'RESTORE' : 'EDIT')}
                        </Button>
                        &nbsp;
                        {
                          onSwitch != 'deleted' &&
                          <Button variant={"outlined"}
                                  disabled={!isEditing}
                                  sx={{...Cls.buttonClass(isEditing ? 'contained' : 'outlined',isEditing ? 'red' : 'gray'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0',}} 
                                  onClick={()=>returnedEDIT(onEditData,'delete')}
                                  size='' >
                            {onMobile ? <Icon icon="clarity:trash-solid" width={21} /> : 'DELETE'}
                          </Button>
                        }
                        &nbsp;
                        <FilterThis LOAD={[]} 
                                    DATA={fetchRECORDS?.data}
                                    RECEIVE={{APPS: [], CLUBS: [], ACCTS: [], GAMES: [], UNIONS: []}}  
                                    RETURN={ReturnedFilter} />
                      </Box>

                    </Grid>

                  </Grid>
                  
                </Stack>
                {
                  !fetchRECORDS?.load && fetchRECORDS?.tally == 0
                  ?
                  <OnLoading TYPE='table' />
                  :
                  fetchRECORDS?.load && fetchRECORDS?.tally > 0
                  ?
                  <Table_Records  DATA={fetchRECORDS} 
                                  FILTER={{ ...onFilters, SEARCH:onSearchAccounts }} 
                                  CHECKED={setonEditData} 
                                  ITEMS={{GAMES: fetchGAMES?.data}}
                                />
                  :
                  <OnNothing LABEL='No record found...' /> 
                }

              </Box>

          </Grid>

        </Grid>

        <ExcelDialog  onOpen={onDialog.open} 
                      onClose={setonDialog} 
                      onSubmitted={returnedDELETED}
                      onName={onDialog.name} 
                      onData={onDialog.data} 
                      onItems={{}} />

            {Fnc.JSONS(fetchDEALPLAYERS,false)}

        <UploadingExcel DATA={onUploading} ALERT={onUpserted} ITEMS={{
                                                                        APPS:           fetchAPPS?.data, 
                                                                        CLUBS:          fetchCLUBS?.data,
                                                                        ACCOUNTS:       fetchACCOUNTS?.data,
                                                                        DEALSPLAYER:    fetchDEALPLAYERS?.data,
                                                                        DEALSUPLINE:    fetchDEALUPLINES?.data,
                                                                        UNIONS:         [], 
                                                                        GAMES:          fetchGAMES?.data,
                                                                        FORMULA:        fetchFORMULA?.data,
                                                                        RATES:          fetchUSD?.data,
                                                                        }}
                                                                        REFRESH={setrawRELOADFORMULA}/>

    <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
