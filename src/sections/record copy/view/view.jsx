import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box,Stack,Container,Button,Typography,Alert,Fade,IconButton, Divider,Chip,Tooltip  } from '@mui/material';
import { Icon } from '@iconify/react';

import { RawFetch } from 'src/hooks/raw/';

import { OnSearching, OnEdit } from 'src/items/menu'

import { TheDialog } from '../modal-xlxs'

import Loading_Skeletons from 'src/items/loaders/loadings'

import {UploadingExcel} from '../index'

import * as Fnc from 'src/hooks/functions'
import * as Fn from '../functions/functions'
import * as Fill from '../functions/values'
import * as Cls from 'src/hooks/classes'

import {    DDownClubs, 
            DDownApps, 
            DDownAccount, 
            DDownDate,  
            Table_Data,
            Uploading,
            Editing
        } from '../'

// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

    const dataVIEW    = localStorage.getItem('slk-dataview')

    const onMobile    = Fnc.OnMobile()

    const [onFade, setonFade]                             = useState(false)
    const [onLoaded, setonLoaded]                         = useState(false)
    const [onDialog, setonDialog]                         = useState({open: false, data: [], name: ''})
    const [onSwitch, setonSwitch]                         = useState('records')
    const [onWhat, setonWhat]                             = useState('')

    const [onXLXS, setonXLXS]                                   = useState([])

    const [onAlert, setonAlert]                                 = useState({onOpen: 0, severity: '', message: ''});

    const [onEditData, setonEditData]                           = useState([])
    const [onUploading, setonUploading]                         = useState([])
    const [onfilterCLUBS, setonfilterCLUBS]                     = useState('')
    const [onfilterAPPS, setonfilterAPPS]                       = useState('')
    const [onfilterPLAYERS, setonfilterPLAYERS]                 = useState('')
    const [onfilterUPLINES, setonfilterUPLINES]                 = useState('')
    const [onfilterDateOPEN, setonfilterDateOPEN]               = useState(null)
    const [onfilterDateCLOSE, setonfilterDateCLOSE]             = useState(null)

    const [onSearchAccounts, setonSearchAccounts]         = useState('')

    const [AddDealPlayer, setAddDealPlayer]               = useState(0)
    const [AddDealUpline, setAddDealUpline]               = useState(0)

    const [rawRELOAD, setrawRELOAD]                       = useState(0)
    const [rawRELOADREC, setrawRELOADREC]                       = useState(0)
    const [rawRELOADFORMULA, setrawRELOADFORMULA]                       = useState(0)
    const [rawFETCH_REC,  setrawFETCH_REC] = useState({
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


    const defaultFORMULA =    fetchFORMULA.data.filter((e)=> e['name'] == 'STANDARD' || e['name'] == 'WITH CHIPRATE')
    const isEditing = onEditData.length > 0 ? true : false

    const filteredAPPS =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonfilterAPPS(i)
      } else {
        setonfilterAPPS(0)
      }
    }

    const filteredCLUBS =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonfilterCLUBS(i)
      } else {
        setonfilterCLUBS(0)
      }
    }

    const filteredPLAYERS =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonfilterPLAYERS(i)
      } else {
        setonfilterPLAYERS(0)
      }
    }

    const filteredUPLINE =(i)=>{
      if(i != 0 || !Fnc.isNull(i,0)){
        setonfilterUPLINES(i)
      } else {
        setonfilterUPLINES(0)
      }
    }

    const onviewSwitch =(i)=>{

      setonSwitch(i)
      setonEditData([])

      if(i == 'deleted'){
        setrawFETCH_REC({...rawFETCH_REC,STATUS: 'DISABLED' })
        setrawRELOADREC( Fnc.numRandom() )
        setonWhat('DELETE')
      } else {
        setonLoaded(false)
        setAddDealPlayer(0)
        setAddDealUpline(0)
        setrawFETCH_REC({...rawFETCH_REC,STATUS: 'ACTIVE' })
        setrawRELOAD( Fnc.numRandom() )
        setrawRELOADREC( Fnc.numRandom() )
        setrawRELOADFORMULA( Fnc.numRandom() )
        setonWhat('')
      }

    }

    const returnedXLXS =(i)=>{
        if(i.status == 'VALID'){
            setonSwitch('xlxs')
            setonXLXS(i.data)
            setonWhat('NEW')
        } else if(i.status == 'INVALID'){
            setonSwitch('error')
            setonXLXS([])
            setonWhat('')
        }
    }

      const returnedXLXSNew =(i)=>{
        console.log(i)

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
            console.log(severe,msg)
        }
  
      }


    useEffect(() => {
        setonFade(true)
    }, []);

    useEffect(() => {

      if(fetchDEALPLAYERS.load == true && fetchDEALUPLINES.load == true && fetchDEALFORMULA.load == true && fetchACCOUNTS.load== true && fetchCLUBS.load== true ){
        setonLoaded(true)
      } else {
        setonLoaded(false)
      }

    }, [rawRELOAD, fetchDEALPLAYERS.load == true, fetchDEALUPLINES.load == true, fetchDEALFORMULA.load == true, fetchACCOUNTS.load== true, fetchCLUBS.load== true ]);

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant={onMobile ? "h5" : "h4"}>
          {onSwitch == 'new' ? 'ADDING' : onSwitch == 'xlxs' ? 'EDITING' : ''} {TheTitle}
        </Typography>

      </Stack>
                
        <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

          <Grid xs={12} sm={12} md={12} style={{marginTop:'-10px'}}>

            <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={11} sm={6} md={6}>
                    <Button variant={onSwitch == 'records' ? "contained" : "outlined"} 
                            sx={{...Cls.buttonClass(onSwitch == 'records' ? 'contained' : 'outlined','violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            onClick={()=>onviewSwitch('records')}
                            size='' >
                       {onMobile ? 'ACTIVE' : 'ACTIVE ITEMS'}
                    </Button>
                    &nbsp;
                    <Button variant={onSwitch == 'deleted' ? "contained" : "outlined"} 
                            sx={{...Cls.buttonClass(onSwitch == 'deleted' ? 'contained' : 'outlined',onSwitch == 'deleted' ? 'red' : 'violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            onClick={()=>onviewSwitch('deleted')}
                            size='' >
                       {onMobile ? 'DELETED' : 'DELETED ITEMS'}
                    </Button>
                </Grid>

                <Grid xs={1} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', }}>

                    <IconButton variant='standard' 
                                size='small' 
                                onClick={()=>setonUploading({modal: true}) }
                                disabled={!fetchRECORDS.load}
                                sx={{marginTop:'-8px', marginRight:'10px'}}>
                      <Tooltip title='Upload excel file'>
                      <Icon icon="line-md:file-upload-twotone" color={!fetchRECORDS.load ? 'gray' : '#9370db'} width={23}/>
                      </Tooltip>
                    </IconButton>

                    <Button variant={"outlined"}
                            sx={{...Cls.buttonClass(onSwitch == 'new' ? 'contained' : 'outlined','violet'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0'}} 
                            onClick={()=>onviewSwitch('new')}
                            disabled={!fetchRECORDS.load}
                            size='' >
                       {onMobile ? <Icon icon="line-md:plus" width={21} /> : 'ADD NEW'}
                    </Button>
                </Grid>

            </Grid>

            { 
            onSwitch == 'records' || onSwitch == 'deleted'
            ?
            <>


            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'15px' }}>

              <Grid container spacing={{ xs: 1, sm: 1, md:1 }} padding={{ xs: 1, sm: 1, md:1 }}>

                  <Grid  xs={6} sm={3} md={3} >
                    <DDownApps DATA={fetchCLUBS} RETURN={filteredAPPS} />  
                  </Grid>

                  <Grid  xs={6} sm={3} md={3} >
                    <DDownClubs DATA={fetchCLUBS} RETURN={filteredCLUBS} />
                  </Grid>

                  <Grid  xs={6} sm={3} md={3} >
                    <DDownAccount DATA={fetchACCOUNTS} RETURN={filteredPLAYERS} WHAT='player' />  
                  </Grid>

                  <Grid  xs={6} sm={3} md={3} >
                  <DDownAccount DATA={fetchACCOUNTS} RETURN={filteredUPLINE} WHAT='upline'  /> 
                  </Grid>

                  <Grid  xs={12} sm={6} md={3} >
                    <DDownDate  onLabel={'Filter by date open'} 
                                onValue={{open: onfilterDateOPEN, closed: onfilterDateCLOSE}} 
                                onReturn={(e)=>setonfilterDateOPEN(e)} 
                                onWhat='open' /> 
                  </Grid>

                  <Grid  xs={12} sm={6} md={3} >
                    <DDownDate  onLabel={'Filter by date close'} 
                                onValue={{open: onfilterDateOPEN, closed: onfilterDateCLOSE}} 
                                onReturn={(e)=>setonfilterDateCLOSE(e)} 
                                onWhat='close'  /> 
                  </Grid>

              </Grid>
            
            </Box>

              <Box component="section" sx={{ p: 1, border: '1px dashed grey', marginTop:'10px',  }}>

                <Stack style={{margin:'10px'}}>
                  <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{padding:'7px'}}>

                    <Grid xs={9} sm={5} md={5}>
                      <OnSearching byLabel={onSwitch == 'players' ? 'Search records' : 'Search records'} bySearching={setonSearchAccounts} />
                    </Grid>

                    <Grid xs={3} sm={7} md={7}  justifyContent="flex-end" alignItems="flex-end">

                      <Box sx={{  display: 'flex', justifyContent: 'flex-end', }}>
                        <Button variant={"outlined"}
                                disabled={!isEditing}
                                sx={{...Cls.buttonClass(isEditing ? 'contained' : 'outlined',isEditing ? 'violet' : 'gray'), fontSize: onMobile ? '11px' : '14px',borderRadius:'0',}} 
                                onClick={()=>returnedEDIT(onEditData,'edit')}
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

                      </Box>

                    </Grid>

                  </Grid>
                  
                </Stack>

                <Table_Data DATA={fetchRECORDS} 
                            RETURN={''} 
                            FILTER={{SEARCH:onSearchAccounts, APP:onfilterAPPS, CLUB:onfilterCLUBS, PLAYER:onfilterPLAYERS,UPLINE:onfilterUPLINES, DATEOPEN: onfilterDateOPEN, DATECLOSE: onfilterDateCLOSE }} 
                            ITEM={{APPS: '',CLUBS:'',ACCOUNTS:'',DEALS:'',FORMULA:'',DEFAULTFORMULA: defaultFORMULA,FXUSD:'',GAMES: fetchGAMES.data}} 
                            CHECKED={setonEditData} 
                            />
              </Box>

            </>
            :
            <Grid xs={12} sm={12} md={12} >

                {
                onSwitch == 'new' && onLoaded == true
                ?
                <Uploading  RETURN={returnedXLXS}
                            ITEM={{APPS: '', CLUBS:fetchCLUBS, ACCOUNTS:fetchACCOUNTS, DEALPLAYERS:fetchDEALPLAYERS, DEALUPLINES:fetchDEALUPLINES, DEALFORMULA:fetchDEALFORMULA, FORMULA:fetchFORMULA, DEFAULTFORMULA:defaultFORMULA, RATES:fetchUSD}}  />
                :
                onSwitch == 'xlxs'
                ?
                <Box component="section" sx={{ p: 1, border: '1px dashed grey', marginTop:'10px',  }}>
                <Editing DATA={onXLXS ? onXLXS : []}
                        SWITCH={setonSwitch}
                        WHAT={onWhat}
                        REFRESH={setrawRELOADFORMULA}
                        ITEM={{EDIT: Fill.FillEditing(onEditData), APPS: '', CLUBS:fetchCLUBS, ACCOUNTS:fetchACCOUNTS, DEALPLAYERS:fetchDEALPLAYERS, DEALUPLINES:fetchDEALUPLINES, DEALFORMULA:fetchDEALFORMULA, FORMULA:fetchFORMULA, DEFAULTFORMULA:defaultFORMULA, RATES:fetchUSD}}  />
                </Box>
                :
                onSwitch == 'error'
                ?
                <Button variant="outlined" 
                        style={{width:'100%',height:'150px',marginTop:'60px',fontSize:'16px'}}
                        sx={Cls.buttonClass('outlined','red')} 
                        onClick={()=>(setonSwitch('new'))}
                        startIcon={<Icon icon="h:warning-circle-duotone"/>} >
                Invalid file format! Retry
                </Button>
                :
                <Loading_Skeletons />
                }
            
            </Grid>

            }
          </Grid>


        </Grid>
        <TheDialog    onOpen={onDialog.open} 
                      onClose={setonDialog} 
                      onSubmitted={returnedDELETED}
                      onName={onDialog.name} 
                      onData={onDialog.data} 
                      onItems={{}} />
            {Fnc.JSONS(fetchRECORDS,false)}

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

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
