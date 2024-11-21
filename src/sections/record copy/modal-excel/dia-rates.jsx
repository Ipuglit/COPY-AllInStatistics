import React, { useEffect, useState } from 'react';
import {FormControlLabel,Checkbox,Autocomplete,TextField,Grid,DialogContent,DialogContentText,DialogActions,Button,Box,Table,TableHead,TableRow,TableCell,TableBody} from '@mui/material';

import { Icon } from '@iconify/react';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'
import * as Dt from 'src/hooks/data'
import { Description } from '@mui/icons-material';

export default function Rates({ onClose, onData, onItems, onReturn }) {

  const onMobile    = Fnc.OnMobile()

    const today = new Date();
    const itemx = onData?.data
    const listDDown = onItems?.RATES

    const [rateUSD, setrateUSD]               = useState(1);
    const [rateDate, setrateDate]             = useState(null);
    const [rateProvider, setrateProvider]     = useState(null);
    const [rateCurrency, setrateCurrency]     = useState(null);
    const [checked, setChecked]               = useState(false);
    const [checkClub, setcheckClub]          = useState(false);
    const [checkPlayer, setcheckPlayer]     = useState(false);

    const listDate = listDDown?.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.datestamped, 
                                                                    label:                e.datestamped, 
                                                                    date:                 e.datestamped,
                                                                  } 
                                                      } 
                                        )

    const listProvider = listDDown?.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.provider, 
                                                                    label:                e.provider, 
                                                                    provider:             e.provider,
                                                                  } 
                                                      } 
                                        )

    const listCurrency = Dt?.CURRENCIES?.map( (e, index)=> { 
                                                          return {  id:                   index+1,   
                                                                    value:                e.code, 
                                                                    label:                e.code, 
                                                                    description:          e.country,
                                                                    country:              e.country,
                                                                  } 
                                                      } 
                                        )


    const listDates     = Fnc.antiArrayDuplicate(listDate,'value','value')
    const listProviders = Fnc.antiArrayDuplicate(listProvider,'value','value')
             
    const Ndx_DATE      = listDates?.find((e)=> Fnc.dateSlash(e.value) == Fnc.dateSlash(itemx?.FXDATE ? itemx?.FXDATE : itemx?.DATECLOSED) )
    const Ndx_PROVIDER  = listProviders?.find((e)=> e.value == (itemx?.FXPROVIDER ? itemx?.FXPROVIDER : 'xe.com') )
    const Ndx_CURRENCY  = listCurrency?.find((e)=> e.value == (itemx?.FXCURRENCY ? String(itemx?.FXCURRENCY).toUpperCase() : 'USD') )

    const handleChanged = (i, x) => {

        x(i);

        const iDate     = x == setrateDate      ? i?.value :    rateDate?.value        
        const iProvider = x == setrateProvider  ? i?.value :    rateProvider?.value   
        const iCurrency = x == setrateCurrency  ? i?.value :    rateCurrency?.value 

        const listSelect    = listDDown?.find((e)=> e.provider == iProvider && e.datestamped == iDate )
        const listRate      = Fnc.safeJSONParse(listSelect?.rates)
        const rateValue     = listRate ? listRate[iCurrency] : '0'

        setrateUSD(rateValue ? rateValue : '0')

      };

      
    const onSubmit =(i)=>{
        onReturn({
                    row:            itemx.ROW, 
                    what:           onData.name,
                    applyClub:      checkClub, 
                    applyPlayer:    checkPlayer,
                    subClub:        itemx.CLUBID,
                    subPlayer:      itemx.PLAYERID,
                    FXUSD:          rateUSD,
                    FXDATE:         rateDate?.value,
                    FXCURRENCY:     rateCurrency?.value,
                    FXPROVIDER:     rateProvider?.value,
                    FXSUB:          '',
                })
      }

    const checkSubmit =()=>{
        if( rateDate?.value         == itemx?.FXCURRENCY 
            && rateUSD              == itemx?.FXUSD
            && rateCurrency?.value  == itemx?.FXDATE
            && rateProvider?.value  == itemx?.FXPROVIDER
            || rateUSD              == '0'
            || rateUSD              == ''
            || rateDate             == null
            || rateCurrency         == null 
            || rateProvider         == null
            
        ){
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setrateUSD(itemx?.FXUSD ? itemx?.FXUSD : '0')
        setrateDate(Ndx_DATE ? Ndx_DATE : null)
        setrateProvider(Ndx_PROVIDER ? Ndx_PROVIDER : null)
        setrateCurrency(Ndx_CURRENCY ? Ndx_CURRENCY : null)
        setChecked(false)
      }, [onData]);

  return (
    <>

    <DialogContent>
        <DialogContentText component="section">

        <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize: onMobile ? '11px' : '12px' }}>
            {
            !Fnc.isNull(itemx.APPID,0)
            ?
            <>
            <p style={{marginTop:'-2px',color:'gray'}} >{itemx.APPNAME}</p>
            <p style={{marginTop:'-15px', marginBottom:'-2px'}}>{itemx.CLUBNAME}</p>
            </>
            :
            <p style={{marginTop:'-2px',color:'orange', marginBottom:'-2px'}} >Please select a club!</p>
            }
            {
          // JSON.stringify(rateDate,2)
            }
        </Box>

        <Grid container spacing={{ xs: 3, sm: 3, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'15px'}}>

            <Grid item xs={12} sm={5} md={5} style={{marginTop:'-10px'}}>

            <Autocomplete
                value={rateDate}
                disableClearable
                onChange={(event, newValue)=> handleChanged(newValue,setrateDate)}
                options={listDates}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === rateDate?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={rateDate ? 'Date' : "Select a date"}
                    variant="outlined"
                    size='small'
                    fullWidth
                    error={rateDate ? false : true}
                    sx={{ 
                      '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                      '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                    }}
                  />
                )}
              />

            </Grid>

            <Grid item xs={12} sm={7} md={7} style={{marginTop:'-10px'}}>

            <Autocomplete
                value={rateProvider}
                disableClearable
                onChange={(event, newValue)=> handleChanged(newValue,setrateProvider)}
                options={listProviders}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === rateProvider?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={rateProvider ? 'Provider' : "Select a provider"}
                    variant="outlined"
                    fullWidth size='small'
                    error={rateProvider ? false : true}
                    sx={{ 
                      '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                      '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                    }}
                  />
                )}
              />

            </Grid>

            <Grid item xs={12} sm={5} md={5} style={{marginTop:'-10px'}}>

                <Autocomplete
                    value={rateCurrency}
                    disableClearable
                    onChange={(event, newValue)=> handleChanged(newValue,setrateCurrency)}
                    options={listCurrency}
                    getOptionLabel={(option) => option.label ? option.label : ''}
                    isOptionEqualToValue={(option, value) => option.id === rateCurrency?.id}
                    filterOptions={Fnc.filterOptions}
                    renderOption={(props, option) => (
                    <React.Fragment key={option.id}>
                        <span {...props} style={{ fontSize: '12px'}}>
                          {option.label}
                          &nbsp;
                          <span style={{ fontSize: '11px', color: 'gray'}}>({option.country})</span>
                        </span>
                    </React.Fragment>
                    )}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label={rateCurrency ? 'Currency for '+rateCurrency?.country : "Select a currency"}
                        variant="outlined"
                        fullWidth size='small'
                        error={rateCurrency ? false : true}
                        sx={{ 
                          '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                          '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                        }}
                    />
                    )}
                />

            </Grid>
            <Grid item xs={12} sm={7} md={7} style={{marginTop:'-10px'}}>

                <TextField  fullWidth
                            error={!rateUSD ? true : false}
                            label={'USD Value'} 
                            value={rateUSD}
                            variant="outlined" size='small'
                            disabled={rateProvider?.value == 'xe.com' ? false : true}
                            onChange={(e)=>setrateUSD( Fnc.numberDecimals(e.currentTarget.value) )}
                            InputProps={Cs.IconDollar}
                            sx={{...Cs.TextCenter,width:"100%",
                                  '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                                  '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                              }}
                            />

                                <span style={{color:'orange', fontSize:'14px'}}> 
                                {
                                rateUSD == '0'
                                ?
                                    "Currency has no value"
                                    :
                                null
                                } &nbsp;
                                </span>
                                

                            

            </Grid>
        </Grid>

        {
            !Fnc.isNull(itemx?.PLAYERID,0) && onData?.name != 'PLAYER' &&
            <>
            <FormControlLabel
            sx={{marginTop:'-10px'}}
              control={
                <Checkbox
                  size='small'
                  checked={checkPlayer}
                  onChange={(e)=>setcheckPlayer(e.target.checked)}
                  name="acceptTerms"
                  sx={{ '&.Mui-checked': { color: checkPlayer ? 'violet' : '' } }}
                />
              }
              label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkPlayer ? 'violet' : ''}}>Apply to all player ID: '{itemx?.PLAYERID}'</span>}
            />
            </>

          }
          {
            !Fnc.isNull(itemx?.CLUBID,0) &&
            <>
          <br/>
          <FormControlLabel
          sx={{marginTop:'-10px'}}
            control={
              <Checkbox
                size='small'
                checked={checkClub}
                onChange={(e)=>setcheckClub(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkClub ? 'violet' : '' } }}
              />
            }
            label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkClub ? 'violet' : ''}}>Apply to all club '{itemx?.CLUBNAME}'</span>}
          />
            </>
          }
    {Fnc.JSONS(itemx,false)}

        </DialogContentText>
    </DialogContent>

    <DialogActions style={{paddingBottom:'30px',padding:'30px', marginTop:'-15px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            {
              checkSubmit() || rateUSD == '0'
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                      variant='contained' 
                      onClick={()=>onSubmit()}>
                SUBMIT
              </Button>
            }

            <Button variant='outlined' 
                    onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>
              CANCEL
            </Button>

    </DialogActions>
    </>
  );
}