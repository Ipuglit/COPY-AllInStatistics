import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box,Stack,Container,Button,Typography,Alert,Fade,IconButton, Divider,Chip,ButtonGroup  } from '@mui/material';
import { Icon } from '@iconify/react';

import {AlertSnack} from 'src/items/alert_snack'
import { OnLoading } from 'src/items/menu'
import { RawFetch, RawUsers } from 'src/hooks/raw/';
import { RawAccountz } from 'src/hooks/raw/';
import { RawRolez } from 'src/hooks/raw/';
import { UpsertRegisterAccounts, ModalUpsertUsers, ModalUpsertAccounts } from '..'

import Loading_Skeletons from 'src/items/loaders/loadings'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { ViaTableAccounts, ViaListButton, ViaDetails } from '..'


import {  MenuOnEdit, 
          MenuOnDelete,
          MenuOnSearch
        } from 'src/items/fetched/'

        // ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {



    const [rawRELOADUSERS, setrawRELOADUSERS]       = useState(1)
    const [rawRELOADACCS,   setrawRELOADACCS]       = useState(1)

    const [rawFETCHALL,  setrawFETCHALL] = useState({
                                                          FOR:            "ALL",
                                                          STATUS:         'ALL',
                                                          SORTBY:         'ALL',
                                                          SORT:           'DESC',
                                                          LIMIT:          1000,
                                                          SEARCH:         'ALL',
                                                        });

    const [rawFETCHUSERS,  setrawFETCHUSERS] = useState({
                                                          FOR:            "ALL",
                                                          STATUS:         'ALL',
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

    const [rawFETCHACCS,  setrawFETCHACCS] = useState({
                                                          FOR:            "ALL",
                                                          STATUS:         'ACTIVEPENDING',
                                                          SORTBY:         'ALL',
                                                          SORT:           'DESC',
                                                          LIMIT:          1000,
                                                          SEARCH:         'ALL',
                                                          DATE:           'ALL',
                                                          APP:            'ALL',
                                                          ROLE:           'ALL',
                                                        });
                                                        


    const rawUSERS          = RawFetch(rawFETCHUSERS,rawRELOADUSERS,'userz')
    const rawAPPS           = RawFetch(rawFETCHALL,rawRELOADUSERS,'applications')
    //const rawROLES          = RawFetch(rawFETCHUSERS,rawRELOADUSERS,'roles')
    const rawACCOUNTS       = RawAccountz(rawFETCHACCS,rawRELOADACCS);
    const rawROLES          = RawRolez(rawFETCHUSERS,rawRELOADUSERS);



    const [tableACCOUNTS,  settableACCOUNTS]          = useState({heads: [], cells: []})
    const [returnedUSERS,  setreturnedUSERS]          = useState('')
    const [returnedACCS,  setreturnedACCS]            = useState([])

    const [dataLISTUSERS,  setdataLISTUSERS]          = useState({load: false, tally: 0, data: []})
    const [dataLISTROLES,  setdataLISTROLES]          = useState({load: false, tally: 0, data: []})

    const [dataVIEWUSERS,  setdataVIEWUSERS]          = useState('new')

    const [onALERT,  setonALERT]                  = useState({
                                                                show: false,
                                                                time: 1500,
                                                                type: '',
                                                                message: '',
                                                              })

    const [gotACCOUNTS,  setgotACCOUNTS]              = useState('')

 


    const sendRELOADUSERS =()=>{
      setrawRELOADUSERS( rawRELOADUSERS + 1 )
    }

    const sendRELOADACCS =()=>{
      setrawRELOADACCS( rawRELOADACCS + 1 )
    }
    
    const handleSEARCHUSERS =(i)=>{
      setrawFETCHUSERS({...rawFETCHUSERS, SEARCH: Fnc.isNull(i) ? 'ALL' : i})
      sendRELOADUSERS()
      returnUSER('')
    }

    const handleSEARCHACCS =(i)=>{
      const newArr = {...rawFETCHACCS, SEARCH: Fnc.isNull(i) ? 'ALL' : i}
      setrawFETCHACCS(newArr)
      sendRELOADACCS()
    }

    const handleACCOUNTS = async (i) => {

      try {
        if(i == 'add'){

          const registerDATA = await UpsertRegisterAccounts({
                                                          ACTION:       'REGISTER',
                                                          USERID:       returnedUSERS,
                                                          ACCOUNTIDS:   returnedACCS,
                                                        })

          showAlert({
                      show: true,
                      time: 2000,
                      type: 'success',
                      message: registerDATA.registered+' Registered!',
                    })

          returnUSER(returnedUSERS)

        } else if(i == 'remove'){
  
          const removeDATA = await UpsertRegisterAccounts({
                                                          ACTION:       'REMOVE',
                                                          USERID:       returnedUSERS,
                                                          ACCOUNTIDS:   returnedACCS,
                                                        })

          showAlert({
                      show: true,
                      time: 2000,
                      type: 'success',
                      message: removeDATA.unregistered+' Removed!',
                    })

          returnUSER(returnedUSERS)

        }
      } catch (error){
          showAlert({
                      show: true,
                      time: 2000,
                      type: 'error',
                      message: 'Please try again!',
                    })
      }


    }

    const pageVIEW =(i,ii)=> {

        setdataVIEWUSERS(i)


        if(i == 'new'){
          sendRELOADUSERS()
        }

    }

    const showAlert = (i) => {
        setonALERT(i)
      const T = setTimeout(() => {
        setonALERT({
                      show: false,
                      time: 1500,
                      type: '',
                      message: '',
                    })
      }, i.time);
      return () => clearTimeout(T);
  
    };

    // =================== ++ FILTER ++ ===============================
    // ==================================================
    // =================== ++ UPSERT ++ ===============================


    const returnUSER=(i)=>{

      if( !Fnc.isNull(i) ){
        const newArr = {...rawFETCHACCS, FOR: 'FILTER', FILTER: i}
        setrawFETCHACCS(newArr)
        setreturnedUSERS(i)
        setgotACCOUNTS('REMOVE')
      } else {
        const newArr = {...rawFETCHACCS, FOR: 'ALL', FILTER: ''}
        setrawFETCHACCS(newArr)
        setreturnedUSERS('')
        setgotACCOUNTS('')
      }
      setreturnedACCS([])
      sendRELOADACCS()

    }

    const [openUSERS,  seteditUSERS]          = useState({modal: false, roles: [], value: []})
    const [openACCTS,  seteditACCTS]          = useState({modal: false, roles: [], type:'', value: []})

    const returnEDITUSER=(i)=>{
      const dataUSERS = rawUSERS.data.find((e)=> e.id == i)
      seteditUSERS({modal: true, roles: dataLISTROLES.data, value: dataUSERS, what: 'edit'})
    }

    const returnNEWUSER=()=>{
      seteditUSERS({modal: true, roles: dataLISTROLES.data, value: [], what: 'add'})
    }

    const returnNEWACCOUNT=(i,ii,e)=>{

      seteditACCTS({modal: ii, users: rawUSERS, type: 'new', value: i ? i : []})
      if(e != 'close'){
        setrawRELOADACCS(i)
      } else {
        setrawRELOADACCS( Fnc.numRandom() )
      }

    }

    const returnedEDITUSER=(i)=>{
      seteditUSERS({modal: false, roles: [], value: []})
      if(i.changed){
        sendRELOADUSERS()
        returnUSER()
      }
    }


    const getACCOUNTS=(i)=>{

      if(i == 'NOUSER'){

        const newArr = {...rawFETCHACCS, FOR: 'NOUSER'}
        setrawFETCHACCS(newArr)
        setgotACCOUNTS('ADD')

      } else {

        const newArr = {...rawFETCHACCS, FOR: 'FILTER', FILTER: returnedUSERS}
        setrawFETCHACCS(newArr)
        setgotACCOUNTS('REMOVE')

      }
      setreturnedACCS([])
      sendRELOADACCS()
    }

    
    const returnACCOUNTS=(i,e,x)=>{
      setreturnedACCS(i)

      if(e == 'one'){
        seteditACCTS({modal: true, users: rawUSERS, type: x, value: i ? i : []})
      }
    }

    useEffect(() => {

      setdataLISTROLES({
                        load:   rawROLES.load,
                        tally:  rawROLES.tally,
                        data:   rawROLES.data,
                      })

  }, [rawROLES.load == true]);

    useEffect(() => {

      setdataLISTUSERS({
                        load:   rawUSERS.load,
                        tally:  rawUSERS.tally,
                        data:   rawUSERS.data,
                      })

  }, [rawUSERS.load == true]);

    useEffect(() => {

      const headAccounts = [
                            { id: '#', label: '', sortable: false },
                            { id: 'accountID', label: 'ID', sortable: true },
                            { id: 'accountNickname', label: 'Nickname', sortable: true },
                            { id: 'appName', label: 'Game', sortable: true },
                            { id: 'user', label: 'User', sortable: true },
                          ];

      const cellAccounts = rawACCOUNTS.data.map(i => ({ 
                                                          id:               i.id, 
                                                          accountID:        i.accountID, 
                                                          accountNickname:  i.accountNickname, 
                                                          appID:            i.appID,
                                                          appName:          i.appName,  
                                                          status:           i.status,
                                                          statusLabel:      i.statusLabel,
                                                          userID:           i.userID,
                                                          userName:         i.userFirstname ? i.userFirstname + ' ' + i.userLastname : i.userNickname,
                                                          userRole:         i.userRole,
                                                          userRolename:     i.userRolename,
                                                          user:             !Fnc.isNull(i.userFirstname) ? i.userFirstname+' '+i.userLastname : !Fnc.isNull(i.userNickname) ? i.userNickname : '* NO USER', 
                                                        }))

      settableACCOUNTS({
                            heads:  headAccounts,
                            cells:  cellAccounts,
                        })

  }, [rawACCOUNTS.load == true]);

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
      
        <Typography variant="h4">
          {TheTitle} 
        </Typography>

      </Stack>


      <Fade in={dataVIEWUSERS == 'new' ? true : false} timeout={500}>
                
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} sx={{marginTop:'-22px'}}>

          <Grid xs={12} sm={4} md={4}>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={6} sm={6} md={6}>
                  <Box sx={{display: 'flex',justifyContent: 'flex-start', marginTop:'5px'}}>
                    <span style={{marginTop:'0px'}}>LIST OF USERS</span> 
                  </Box>
                </Grid>

                <Grid xs={6} sm={6} md={6}>
                  <Box sx={{display: 'flex',justifyContent: 'flex-end'}}>
                    <Button variant="outlined" 
                            disabled={!rawUSERS.load}
                            onClick={()=>returnNEWUSER()}
                            sx={{...Cls.buttonClass('outlined','violet'), width:'9rem',borderRadius:'0',}} >
                      ADD USER
                    </Button>
                  </Box>
                </Grid>

            </Grid>

            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'15px', maxHeight:'551px', }}>

              <Stack>
                <MenuOnSearch onSearching={handleSEARCHUSERS} onText={rawFETCHUSERS['SEARCH'] != 'ALL' ? rawFETCHUSERS['SEARCH'] : ''} />
              </Stack>
              
              <Divider style={{marginTop:'5px',marginBottom:'5px'}}/>

              <Box sx={{ maxHeight:'450px',overflow: 'auto', '&::-webkit-scrollbar': {  width: '0px', }, }}>
                {
                  rawUSERS.load == true 
                  ?
                  <ViaListButton DATA={dataLISTUSERS.data} TYPE='USERS' RETURN={returnUSER} EDIT={returnEDITUSER}/>
                  : 
                  <Loading_Skeletons type={'table3'} />
                }
              </Box>

            </Box>
          </Grid>

          <Grid xs={12} sm={8} md={8}>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={6} sm={6} md={6}>
                  <Box sx={{display: 'flex',justifyContent: 'flex-start', marginTop:'5px'}}>
                    <span style={{marginTop:'0px'}}>LIST OF ACCOUNTS</span> 
                  </Box>
                </Grid>

                <Grid xs={6} sm={6} md={6}>
                  <Box sx={{display: 'flex',justifyContent: 'flex-end'}} >
                    <Button variant="outlined" 
                            disabled={!rawUSERS.load}
                            onClick={()=>returnNEWACCOUNT([],true,'close')}
                            sx={{...Cls.buttonClass('outlined','violet'), borderRadius:'0',}} >
                      ADD ACCOUNTS
                    </Button>
                  </Box>
                </Grid>

            </Grid>
              
            <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'15px' }}>


              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={7} sm={7} md={7}>
                  <MenuOnSearch onSearching={handleSEARCHACCS} onText={rawFETCHACCS['SEARCH'] != 'ALL' ? rawFETCHACCS['SEARCH'] : ''} />
                </Grid>

                <Grid xs={5} sm={5} md={5}>
                    <Box sx={{display: 'flex',justifyContent: 'flex-end', marginTop:'5px'}}>

                      {
                        gotACCOUNTS == 'ADD'
                        ?
                          <Button variant={returnedACCS.length > 0 ? "contained" : "outlined"}
                                  disabled={returnedACCS.length > 0 ? false : true}
                                  style={{borderRadius:0}}
                                  color='success'
                                  onClick={()=>( handleACCOUNTS(returnedACCS.length > 0 ? 'add' : '') )}
                                  startIcon={<Icon icon="line-md:plus"  />} >
                            Register to user
                          </Button>
                        : 
                        gotACCOUNTS == 'REMOVE'
                        ?
                          <Button variant={returnedACCS.length > 0 ? "contained" : "outlined"}
                                  disabled={returnedACCS.length > 0 ? false : true}
                                  style={{borderRadius:0}}
                                  color='error'
                                  onClick={()=>( handleACCOUNTS(returnedACCS.length > 0 ? 'remove' : '') )}
                                  startIcon={<Icon icon="line-md:minus"  />} >
                            Remove from user
                          </Button>
                        :
                        null
                      }

                    </Box>
                </Grid>

              </Grid>

              <Divider style={{marginTop:'5px',marginBottom:'5px'}}/>
              
             <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid xs={6} sm={6} md={6}>
                  {
                    !Fnc.isNull(returnedUSERS,'Num')
                    ?
                    <Button variant='outlined' 
                            size='small' 
                            sx={{...gotACCOUNTS =='REMOVE' ? Cls.buttonClass('contained','violet') : Cls.buttonClass('outlined','violet'),borderRadius:0}}
                            onClick={ () => getACCOUNTS('USER') }
                            fullWidth>
                      List of Registered Accounts
                    </Button>
                    :
                    null
                  }
                </Grid>

                <Grid xs={6} sm={6} md={6}>
                {
                    !Fnc.isNull(returnedUSERS,'Num')
                    ?
                  <Button variant='outlined' 
                          size='small' 
                          sx={{...gotACCOUNTS =='ADD' ? Cls.buttonClass('contained','violet') : Cls.buttonClass('outlined','violet'),borderRadius:0}}
                          onClick={ () => getACCOUNTS('NOUSER') }
                          fullWidth>
                    List of Unregistered Accounts
                  </Button>
                    :
                    null
                  }
                </Grid>

              </Grid>

                {
                  rawACCOUNTS.load == true 
                  ?
                    <>
                    {
                      rawACCOUNTS.tally > 0 
                      ?
                    <ViaTableAccounts DATA={tableACCOUNTS} TYPE='ACCOUNTS' RETURN={returnACCOUNTS} CHECK={!Fnc.isNull(returnedUSERS,'Num')}/>
                      :
                    <Alert variant="outlined" severity="warning" width="100%" style={{marginTop:'30px', height:'100px', alignItems:'center'}}>
                        No accounts registered..
                    </Alert>
                    }
                    </>

                  : 
                  <OnLoading type={'table'} />
                }
            </Box>
          </Grid>

        </Grid>

        </Fade>
        {onALERT.show ? AlertSnack(onALERT.type,onALERT.message) : null}
                
    {
    <pre>{JSON.stringify(rawAPPS,null,2)}</pre>
    }
    <ModalUpsertUsers DATA={openUSERS} RETURN={returnedEDITUSER}  />
    <ModalUpsertAccounts DATA={openACCTS} RETURN={returnNEWACCOUNT} ITEMS={{APPS: rawAPPS, USERS: rawUSERS}} />
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
