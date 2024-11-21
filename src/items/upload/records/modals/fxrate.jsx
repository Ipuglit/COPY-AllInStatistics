
import { useState, useEffect } from 'react';
import axios from 'axios';

import useMediaQuery from '@mui/material/useMediaQuery';

import {
  Select,
  Autocomplete,
  Chip,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Typography,
} from '@mui/material';


import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Dta from 'src/hooks/data'


import {AlertSnack} from 'src/items/alert_snack'
import { nullFormat } from 'numeral';



export default function UpdateFXRate({dataReceived,dataSubmitted}) {
    
  const bit                                     = dataReceived.ITEMS;

  const [items, setItems]                     = useState([]);
  
  const [listofFXRates, setlistofFXRates]         = useState([]);
  const [listofProvider, setlistofProvider]       = useState([]);
  const [listofDates, setlistofDates]             = useState([]);
  const [listofRates, setlistofRates]             = useState([]);

  const [onOpen, setonOpen]                     = useState(false);
  const [onEdit, setonEdit]                     = useState(true);
  const [onReady, setonReady]                   = useState(false);
  const [onSubmit, setonSubmit]                 = useState(false);
  const [onAlert, setonAlert]                   = useState(false);

  const onPC = useMediaQuery('(min-width: 700px)');

  const ondialogClose = () => {
    setonOpen(false);
    setonEdit(true)
    dataReceived = null
    setonAlert(false)
  };

  const onchangeValue =(i,ii)=>{

        if(ii == 'fxCurrency'){

          setItems({
            ...items,
            [ii]: i.value,
            fxUSD: i.usd,
            fxCurrencySub: null
          })

        } else {

          setItems({
            ...items,
            [ii]: i.value,
          })

        }

        if(ii == 'fxProvider' && i.value == 'xe.com'){
          setonEdit(false)
        } else if(ii == 'fxProvider') {
          setonEdit(true)
        }

  }


  const onchangeInput =(i,ii)=>{

    setItems({
      ...items,
      [ii]: i,
    })

}


  const onsubmitItem = (i) => {

    dataSubmitted({
                    index: dataReceived.INDEX,
                    values: i,
                    })
    const T = setTimeout(() => {
      ondialogClose()
    }, 500);
    return () => clearTimeout(T);
  };

  const isNullSome=(i)=>{
    const o = i.some(e => !e);
    return o
  }


  const stateProviderDate =()=>{
    if( (items.fxProvider == '' || items.fxProvider == null) || (items.fxDate == '' || items.fxDate == null) ){
      return true
    } else {
      return false
    }
  }

 const filloutProviders = () => {

    if(dataReceived.DIALOG == true){

        setonOpen(dataReceived.DIALOG)

        setItems({
                    ...items,
                    dateClosed:     bit.dateClosed, 
                    appID:          bit.appID, 
                    clubIDD:        bit.clubIDD, 
                    appName:        bit.appName, 
                    playerID:       bit.playerID,
                    fxUSD:          Fnc.isNull(bit.fxUSD)         ? 1        : bit.fxUSD,
                    fxCurrency:     Fnc.isNull(bit.fxCurrency)    ? ''       : bit.fxCurrency,
                    fxCurrencySub:  Fnc.isNull(bit.fxCurrency)    ? 'NONE'   : null,
                    fxDate:         Fnc.isNull(bit.fxDate)        ? ''       : Fnc.dateText(bit.fxDate),
                    fxProvider:     Fnc.isNull(bit.fxProvider)    ? ''       : bit.fxProvider,
                    fxApplyTo:      'This',
                })

        const uniqProvider  = new Set( dataReceived.FXRATES.map(item => item['provider']) );

        const dataProvider  = Array.from(uniqProvider).map((i,index) => {
            return {
                    id:            index,
                    label:         i,
                    value:         i,
                    };
        })

        const uniqDate = new Set(dataReceived.FXRATES.map(item => item['datestamped']));

        const dataDate = Array.from(uniqDate).map((i,index) => {
            return {
                    id:            index,
                    label:         i,
                    value:         i,
                    };
        })

        setlistofProvider(dataProvider)
        setlistofDates(dataDate)

       dataReceived.DIALOG = false

    }
 }


  const onfillRates=(x,e)=>{

    const z = JSON.parse(x.rates);
    const arrKey = Object.keys(z);
    const arrVal = Object.values(z);

    const mixRates = arrKey.map((value, index) => ({
                                                      currency:     value,
                                                      usd:          arrVal[index] || null,
                                                    }));

    const dataRates = mixRates.map((i,index) => {
      return {
              id:            index,
              label:         i.currency,
              value:         i.currency,
              usd:           i.usd
              };
    })

    setlistofRates(dataRates)

    const y = dataRates.find( (e) => e.value == items.fxCurrency );
    
    if(y){

      setItems({
                  ...items,
                  fxUSD: y.usd,
                  fxCurrencySub: null,
                })

    } else {
      if(e == ''){
        setItems({
                    ...items,
                    fxCurrencySub:    'NONE',
                    fxUSD:            1,
                  })
      }

    }
  }

  const filloutRates=()=>{

      if( !Fnc.isNull(items.fxProvider) || !Fnc.isNull(items.fxDate) ){

          const x = dataReceived.FXRATES.find( (e) => e.provider == items.fxProvider && e.datestamped == items.fxDate );
          const z = dataReceived.FXRATES.find( (e) => e.provider == 'xe.com' );

          if(x){
            onfillRates(x,'')
          } else {
            if(z){
              onfillRates(z,'xe')
            }

          }
      }

  }

  useEffect(() => {
      filloutProviders()
      if(items.fxProvider == 'xe.com'){
        setonEdit(false)
      }
  }, [dataReceived]);


  useEffect(() => {
      filloutRates()

  }, [items.fxProvider,items.fxDate]);

  
  useEffect(() => {

      if( isNullSome([items.fxDate,items.fxProvider,items.fxCurrency,items.fxDate]) || items.fxCurrencySub == 'NONE' ){
          setonReady(false)
      } else {
          setonReady(true)
      }

}, [items]);



  return (

      <Dialog open={onOpen} >

        <DialogTitle style={{marginTop: '10px'}}>

            <Typography variant="h4" component="div" >
              USD EXCHANGE RATES
            </Typography>

            <Typography variant="subtitle1" component="div" style={{marginTop: '-2px',marginBottom: '12px'}}>
                {bit ? 
                     items.appName == '' || items.appName == null ? 
                        <Chip label={'Please select a club!'} size='small' color="error"  />
                    : bit.appName == items.appName ? 
                        <Chip label={'Poker App: '+bit.appName} size='small' />
                    :   <> 
                            {
                                bit.appID == 0 ? null :
                                <Chip label={bit.appName} size='small' />
                            }
                            <Chip label={'New: '+items.appName} size='small' color="success" />
                        </>
                : null }
                
            </Typography>

            {
                bit ?
                <Typography variant="caption" component="div">
                {bit.player}
                </Typography>
                : null
            }
            {
                bit ?
                <Typography variant="caption" component="div">
                  Club: {Fnc.isNull(bit.clubIDD) ? 'NO CLUB' : bit.clubName}
                </Typography>
                : null
            }
            {
                bit ?
                <Typography variant="caption" component="div">
                  Closed: {Fnc.dateWord(bit.dateClosed)}
                </Typography>
                : null
            }

        </DialogTitle>

        <DialogContent>

        <Divider />

      <Grid container spacing={1.2} sx={ !onPC  ? { padding:  '0rem' , marginTop:'20px', paddingRight:'',paddingLeft:''}
                                                                        : { marginTop:'20px', paddingRight:'60px',paddingLeft:'50px'} }>

          <Grid item xs={12} md={12} xl={12}>
                    <Autocomplete 
                        size='small'
                        clearOnBlur
                        sx={Cls.inputFormat('18','18',Fnc.isNull(items.fxProvider) ? '#ff2f1c' : '')}
                        options={Fnc.sortArrayDate(listofProvider,'value')} 
                        onChange={ (e,newValue) => { onchangeValue(newValue,'fxProvider') } }
                        isOptionEqualToValue={(option, value) => Fnc.equalAutoComplete(option, value)}
                        value={ Fnc.isNull(items.fxProvider) ? null : items.fxProvider}
                        renderInput={(params) => (
                        <TextField  {...params} 
                                    InputProps={{ ...params.InputProps, endAdornment: undefined }}
                                    label={Fnc.isNull(items.fxProvider) ? 'Choose a provider' : 'Provider'}/>
                        )}
                         /> 
          </Grid>
          <Grid item xs={12} md={12} xl={12}  sx={{marginTop: 2}}>
                    <Autocomplete 
                        size='small'
                        clearOnBlur
                        sx={Cls.inputFormat('18','18',Fnc.isNull(items.fxDate) ? '#ff2f1c' : '')}
                        options={Fnc.sortArrayDate(listofDates,'value')} 
                        onChange={ (e,newValue) => { onchangeValue(newValue,'fxDate') } }
                        isOptionEqualToValue={(option, value) => Fnc.equalAutoComplete(option, value)}
                        value={ Fnc.isNull(items.fxDate) ? null : items.fxDate}
                        renderInput={(params) => (
                        <TextField  {...params} 
                                    InputProps={{ ...params.InputProps, endAdornment: undefined }}
                                    label={Fnc.isNull(items.fxDate) ? 'Choose a date' : 'Date'}/>
                        )}
                         /> 
          </Grid>

          <Grid item xs={6} md={6} xl={6}  sx={{marginTop: 2}}>
                    <Autocomplete 
                        size='small'
                        clearOnBlur
                        disabled={stateProviderDate()}
                        sx={Cls.inputFormat('18','18',Fnc.isNull(items.fxCurrency) || !Fnc.isNull(items.fxCurrencySub) ? '#ff2f1c' : '')}
                        options={Fnc.sortArrayDate(listofRates,'value')} 
                        onChange={ (e,newValue) => { onchangeValue(newValue,'fxCurrency') } }
                        isOptionEqualToValue={(option, value) => Fnc.equalAutoComplete(option, value)}
                        value={ Fnc.isNull(items.fxCurrencySub) ? items.fxCurrency : null}
                        renderInput={(params) => (
                        <TextField  {...params} 
                                    InputProps={{ ...params.InputProps, endAdornment: undefined }}
                                    label={Fnc.isNull(items.fxCurrencySub) ? 'Currency' : items.fxCurrency+' is not found' }/>
                        )}
                         /> 
          </Grid>

          <Grid item xs={6} md={6} xl={6}  sx={{marginTop: 2}}>
                    <TextField
                                required 
                                disabled={onEdit}
                                label='USD rate'
                                sx={Cls.inputFormat('18','18','','center')}
                                size='small'
                                autoComplete="off"
                                value={items.fxUSD}
                                onChange={(e) => onchangeInput(Fnc.numDecPositive(e.currentTarget.value),'fxUSD')}
                                fullWidth />
          </Grid>

      </Grid>

        </DialogContent>
<Divider />
        <DialogActions sx={{marginBottom:'15px', marginRight:'40px',display: 'flex', justifyContent: 'center'}}>
        {
          onAlert ? 
          <>
          <Button color="secondary" >SAVING...</Button>
          </>
          :
          <>
          {
            onReady ? 
              <>
            <Autocomplete 
                size='small'
                clearOnBlur
                sx={Cls.inputFormat('13','13')}
                style={{minWidth:'200px'}}
                options={Dta.BY_FXAPPLY} 
                onChange={ (e,newValue) => { onchangeValue(newValue,'fxApplyTo') } }
                isOptionEqualToValue={(option, value) => Fnc.equalAutoComplete(option, value)}
                value={items.fxApplyTo ? items.fxApplyTo : 'This'}
                renderInput={(params) => (
                <TextField  {...params} 
                            InputProps={{ ...params.InputProps, endAdornment: undefined }}
                            label={
                                    items.fxApplyTo == 'This' || items.fxApplyTo == 'All' ? 'Apply to ' 
                                    :
                                    'Apply to'
                                  }/>
                )}
                /> 
            <Button onClick={()=>{setonAlert(true),onsubmitItem(items)}} color="secondary">SAVE CHANGES</Button>
              </>
            : null
          }
          <Button onClick={ondialogClose} sx={{ color: 'gray'}} >{onSubmit ? "CANCEL" : "CLOSE" }</Button>
          </>
        }


        </DialogActions>
        {
         // <pre style={{fontSize:'9px'}}>{JSON.stringify(items,null,2)}</pre>
        }


      </Dialog>

  );
}