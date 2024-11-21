import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box,Stack,Container,Button,Typography,Alert,Fade,IconButton, Divider,Chip,ButtonGroup  } from '@mui/material';
import { Icon } from '@iconify/react';

import OnMobileScreen from 'src/items/screen/resize';

import { RawFetch } from 'src/hooks/raw/';

import { OnSearching } from 'src/items/menu'

import { UpsertFormula, Testing, TableFormula, TableFormulaDeals } from '../'
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

    const OnMobile    = OnMobileScreen();

    const [onSwitch, setonSwitch]                         = useState('formulas')
    const [onSearch, setonSearch]                         = useState('')
    const [onEdit, setonEdit]                             = useState('')

    const [formula, setFormula]                             = useState('')

    const [onAddPFormula, setonAddPFormula]               = useState('')

    const [rawFETCH_FORMULA,  setrawFETCH_FORMULA] = useState({
                                                            FOR:            "ALL",
                                                            STATUS:         'ACTIVE',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                          });

    const [rawFETCH_DEALFORMULA,  setrawFETCH_DEALFORMULA] = useState({
                                                            FOR:            "ALL",
                                                            STATUS:         'ACTIVE',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                          });

    const [rawFETCH_OTHERS,  setrawFETCH_OTHERS] = useState({
                                                            FOR:            "ALL",
                                                            STATUS:         'ALL',
                                                            SEARCH:         'ALL',
                                                            APP:            'ALL',
                                                            CLUB:           'ALL',
                                                          });
    const [rawRELOAD_FORMULA, setrawRELOAD_FORMULA]             = useState(1)
    const [rawRELOAD_ACCOUNTS, setrawRELOAD_ACCOUNTS]           = useState(1)
    const [rawRELOAD_DEALFORMULA, setrawRELOAD_DEALFORMULA]     = useState(1)

    const fetchFORMULA        = RawFetch(rawFETCH_FORMULA,rawRELOAD_FORMULA,'formula')
    const fetchDEALFORMULA    = RawFetch(rawFETCH_DEALFORMULA,rawRELOAD_DEALFORMULA,'dealformula')
    const fetchACCOUNTS       = RawFetch(rawFETCH_OTHERS,rawRELOAD_ACCOUNTS,'accounts')
    const fetchCLUBS          = RawFetch(rawFETCH_OTHERS,2,'clubz')

    const onAdding =(i)=>{
      console.log(i)
    }

    const onEditting =(i)=>{
      setonSwitch('edit_formula')
      setonEdit(i)
    }

    const onSwitching =(i)=>{
      setonSwitch(i)
      setonAddPFormula('')
      setonEdit('')
      if(i == 'formulas'){
        setrawRELOAD_FORMULA(Fnc.numRandom())
      } else if(i == 'players' ){
        setrawRELOAD_DEALFORMULA(Fnc.numRandom())
      }
    }

    useEffect(() => {

    }, []);

  return (
    
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginTop:'20px'}}>
 
        <Typography variant={OnMobile ? "h5" :"h4"}>
          {TheTitle}
        </Typography>

      </Stack>

        <Grid container spacing={{ sm: 2, md:2 }} columns={{ xs: 12, sm: 12, md: 12 }}>

                      <Grid xs={OnMobile ? 11 : 12} sm={OnMobile ? 10 : 9} md={9}>
                      <Button variant={onSwitch == 'formulas' ?  "contained" : 'text'} 
                              sx={{...Cls.buttonClass(onSwitch == 'formulas' ?  "contained" : 'outlined','violet'), fontSize:OnMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                              onClick={()=>onSwitching('formulas')}
                              size='small' >
                         
                        {OnMobile ? 'FORMULAS' : 'LIST OF FORMULA '}
                      </Button>
                      &nbsp;
                      <Button variant={onSwitch == 'players' ?  "contained" : 'text'} 
                              sx={{...Cls.buttonClass(onSwitch == 'players' ?  "contained" : 'outlined','violet'), fontSize:OnMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                              onClick={()=>onSwitching('players')}
                              size='small' >
                        {OnMobile ? 'PLAYERS' : 'LIST OF PLAYERS FORMULA '}
                      </Button>
                      &nbsp;

                      <Button variant={onSwitch == 'test' ?  "contained" : 'text'} 
                              sx={{...Cls.buttonClass(onSwitch == 'test' || onSwitch == 'edit_formula' || onSwitch == 'add_formula' ?  "contained" : 'outlined','violet'), fontSize:OnMobile ? '11px' : '14px',borderRadius:'0', marginTop:'-12px'}} 
                              onClick={()=>onSwitching('test')}
                              size='small' >
                        {OnMobile ? 'TEST' : 'FORMULA TEST'}
                      </Button>

                  </Grid>

                  <Grid xs={OnMobile ? 1 : 12} sm={3} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                      <Button variant={onSwitch == 'add_formula' ?  "contained" : 'outlined'}  
                              onClick={()=>( onSwitch == 'formulas' || onSwitch == 'test' ? setonSwitch( 'add_formula' ) : setonAddPFormula( Fnc.numRandom()) )}
                              sx={{...Cls.buttonClass(onSwitch == 'add_formula' ?  "contained" : 'outlined','violet'), fontSize:'14px',borderRadius:'0', marginTop:'-12px'}} 
                              disabled={!fetchFORMULA.load || !fetchDEALFORMULA.load}
                              size='small' >
                       {OnMobile ? <Icon icon="line-md:plus" color={!fetchDEALFORMULA.load ? 'gray' : '#9370db'} width={21} /> : 'ADD NEW'}
                      </Button>
                  </Grid>




            <Grid xs={12} sm={12} md={12}>


                <Box component="section" sx={{ p: 2, border: '1px dashed grey', marginTop:'0px' }}>
                {
                  onSwitch != 'test'  && onSwitch != 'add_formula' && onSwitch != 'edit_formula'
                  ?
                  <Stack>
                    <OnSearching byLabel={onSwitch == 'formulas' ? 'Search formula' : 'Search players formula'} bySearching={setonSearch} />
                  </Stack>
                  :
                  null
                }


                  {
                    onSwitch == 'test' || onSwitch == 'add_formula' || onSwitch == 'edit_formula'
                    ?
                    <>
                    <UpsertFormula DATA={fetchFORMULA} EDIT={onEdit} RETURN={setFormula} REFRESH={setrawRELOAD_FORMULA} SWITCH={onSwitch}/>
                    <Testing RECEIVE={formula} />
                    </>
                    
                    :
                    onSwitch == 'formulas' 
                    ?
                    <TableFormula DATA={fetchFORMULA} 
                                  SEARCH={onSearch} 
                                  BYFILTER={{APP: 'aa', CLUB: '', PLAYERL: '', UPLINE: ''}} 
                                  REFRESH={setrawRELOAD_FORMULA} 
                                  ADD={onAdding}
                                  EDIT={onEditting}
                                  ACCOUNTS={fetchACCOUNTS} />
                    :
                    onSwitch == 'players' 
                    ?
                    <TableFormulaDeals  DATA={fetchDEALFORMULA} 
                                        SEARCH={onSearch}
                                        BYFILTER={{APP: 'aa', CLUB: '', PLAYERL: '', UPLINE: ''}}
                                        REFRESH={setrawRELOAD_DEALFORMULA} 
                                        ADD={onAddPFormula} 
                                        LIST={{
                                                CLUBS:    fetchCLUBS.data, 
                                                ACCOUNTS: fetchACCOUNTS.data,
                                                FORMULA: fetchFORMULA.data,
                                              }}  />
                    :
                    null
                  }


                </Box>

            </Grid>




        </Grid>

    {
      
   //<pre>{JSON.stringify(fetchDEALFORMULA,null,2)}</pre>
    }

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
