import React, { useEffect, useState } from 'react';
import { 
        Button, 
        Dialog, 
        DialogActions, 
        DialogContent, 
        DialogTitle, 
        Grid, 
        IconButton, 
        Typography,
        TextField, 
        Box,
        Divider, 
        Autocomplete, 
        InputAdornment,
        Chip,
        Tooltip,
    } from '@mui/material';

import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function FilterThis({LOAD,RECEIVE,RETURN}){

    const onMobile                      = Fnc.OnMobile()
    const today                         = new Date().toISOString().split('T')[0];

    const [onSubmitLoad,setonSubmitLoad]        = useState(false) 

    const [onOpen,setonOpen]            = useState(false) 

    const [onSearch,setonSearch]        = useState('')
    const [onDateFrom,setonDateFrom]    = useState('')
    const [onDateUntil,setonDateUntil]  = useState('')
    const [onApps,setonApps]            = useState([])
    const [onClubs,setonClubs]          = useState([])
    const [onAccts,setonAccts]          = useState([])
    const [onUnions,setonUnions]        = useState([])
    const [onPlayer,setonPlayer]        = useState([])
    const [onUplines,setonUplines]      = useState([])
    const [onStatus,setonStatus]        = useState([])
    const [onData,setonData]            = useState({
                                                    SEARCH: '',
                                                    APPS: [], 
                                                    CLUBS: [], 
                                                    ACCTS: [], 
                                                    PLAYER: [],
                                                    UPLINE: [],
                                                    DATEFROM: '', 
                                                    DATEUNTIL:'',
                                                    FILTER: '',
                                                    SORT: 'desc',
                                                })

    const dropItems =(arr,lab,val)=>{
        if(arr?.length > 0){
            return arr?.map((i)=>{
                return {    
                            id:         i?.increment,
                            label:      i?.[lab],
                            value:      i?.[val],
                        }
            })
        } else {
            return []
        }
    }

    const optStatus =  [
                            {id: 1, value: '9', label: 'All'},
                            {id: 2, value: '0', label: 'Active'},
                            {id: 3, value: '1', label: 'Pending'},
                            {id: 4, value: '2', label: 'Inactive'}
                        ]
    
    const optApps       = dropItems(RECEIVE?.APPS?.data,'appName','appID')       
    const optClubs      = dropItems(RECEIVE?.CLUBS?.data,'clubName','clubID')      
    const optAccts      = dropItems(RECEIVE?.ACCTS?.data,'accountID','accountID')   
    const optUnions     = dropItems(RECEIVE?.UNIONS?.data,'unionName','id')       

    const loading   =       (RECEIVE?.APPS?.data?.length > 0 ? RECEIVE?.APPS?.load : true) 
                        &&  (RECEIVE?.CLUBS?.data?.length > 0 ? RECEIVE?.CLUBS?.load : true) 
                        &&  (RECEIVE?.ACCTS?.data?.length > 0 ? RECEIVE?.ACCTS?.load : true) 
                        &&  (RECEIVE?.UNIONS?.data?.length > 0 ? RECEIVE?.UNIONS?.load : true) 
                        ? false : true

    const available = onDateFrom.length > 0 || onDateUntil.length > 0 || onApps.length > 0 || onClubs.length > 0 || onAccts.length > 0 || onPlayer.length > 0 || onUplines.length > 0 || onStatus?.id != 1 ? true : false

    const renderTAGS = (getThis,tagThis,arrThis,setThis) => {
        return getThis.map((i, index) => (
            <Tooltip key={index} title={i?.label}>
                <Chip
                    size='small'
                    style={{backgroundColor:'#9370db',height:'20px', fontSize: onMobile ? '10px' : '11.5px'}}
                    label={i?.label}
                    {...tagThis({ index })}
                    onDelete={() => {
                    const newValues = arrThis.filter(
                        (e) => e.value !== i.value
                    );
                    setThis(newValues);
                    }}
                />
          </Tooltip>
        ));
      };

    const getValue =(i)=>{
        return i?.length > 0 ? i?.map(e=>e.value) : []
    }

    const onSubmitting=()=>{
        setonOpen(false)
        RETURN({
                    SEARCH:         '',
                    APPS:           getValue(onApps),  
                    CLUBS:          getValue(onClubs),
                    ACCTS:          getValue(onAccts),
                    UNIONS:         getValue(onUnions), 
                    STATUS:         getValue(onStatus),
                    PLAYER:         [],
                    UPLINE:         [],
                    DATEFROM:       onDateFrom.length > 0 ? onDateFrom : '', 
                    DATEUNTIL:      onDateUntil.length > 0 ? onDateUntil : '', 
                    FILTER:         '',
                    SORT:           'desc',
                })
    }

    const onClear=()=>{
        setonOpen(false)
        setonSearch('')
        setonDateFrom('')
        setonDateUntil('')
        setonApps([])
        setonClubs([])
        setonAccts([])
        setonUnions([])
        setonPlayer([])
        setonUplines([])
        setonStatus(optStatus?.find(i => i?.id == 1))
        RETURN({
                    SEARCH:     '',
                    APPS:       [], 
                    CLUBS:      [], 
                    ACCTS:      [], 
                    PLAYER:     [],
                    UPLINE:     [],
                    DATEFROM:   '', 
                    DATEUNTIL:  '',
                    FILTER:     '',
                    SORT:       'desc',
                })
    }
    
    useEffect(()=>{
        setonSearch('')
        setonDateFrom('')
        setonDateUntil('')
        setonApps([])
        setonClubs([])
        setonAccts([])
        setonUnions([])
        setonPlayer([])
        setonUplines([])
        setonStatus(optStatus?.find(i => i?.id == 1))
    },[])

    const renderOpt =(props, option) => (
        <React.Fragment key={option.id}>
            <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
        </React.Fragment>
        )

    const isOptEqualTo =(option, value)=>{if(!value || !value?.value){return false}else{return option.value === value.value}}
    const textSX = { 
                    '& .MuiInputBase-input': { fontSize: onMobile  ? '10px' : '', }, 
                    '& .MuiInputLabel-root': { fontSize: onMobile  ? '11px' : '',   }, 
                   // '& .MuiOutlinedInput-notchedOutline': { border: 'none', },
                    }


  const closeDialog = () => {
    setonOpen(false);
  };

  useEffect(()=>{

  },[RECEIVE])

  return (
    <>

        <Button variant={available ? 'contained' : 'outlined'} 
                  disabled={!LOAD}
                  onClick={()=>setonOpen(true)}
                  sx={{...Cls.buttonClass(available ? 'contained' : 'outlined','violet'), minWidth:onMobile ? '' : '125px',fontSize: onMobile ? '12px' : '',borderRadius:'0px',}} size='small'>
                    {
                      onMobile
                      ?
                      <Icon icon="mage:filter-fill" width={20}/>
                      :
                      <><Icon icon="mage:filter-fill"/> &nbsp; {available ? 'FILTERED' : 'FILTER'}</>
                    }
              
        </Button>

      <Dialog open={onOpen} fullWidth maxWidth='sm'>
        <DialogTitle>

            <span style={{fontWeight:'900', fontSize: onMobile ? '15px' : '20px'}}>
                FILTER
            </span>
            
            <IconButton style={{float:'right', marginTop:'-5px', marginRight:'-10px', display:'none'}} onClick={closeDialog} >
                <Icon icon="mingcute:close-fill"/>
            </IconButton>

        </DialogTitle>

        <Divider sx={{marginTop:'-10px', marginBottom:'-5px'}}/>

        <DialogContent>
            <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>

                <Grid item xs={12} sm={6} md={6} padding={1}>
                    <TextField  label={('Date From' )}
                        fullWidth
                        maxLength={10}
                        type={'date'}
                        disabled={loading}
                        inputProps={{  
                                    sx: { fontSize: onMobile ? '12px' : '', '& input[type="date"]::-ms-clear': { display: 'none', }, }, 
                                    max: onDateUntil.length > 0 ? onDateUntil : today,
                                    }}
                        InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  },shrink: true, }}
                        value={onDateFrom}
                        onChange={(e)=>{setonDateFrom(e.target.value),setonDateUntil(onDateUntil.length > 0 ? onDateUntil : today)}}
                        variant='outlined'
                        autoComplete='off'
                        required size='small'
                        />
                </Grid>

                <Grid item xs={12} sm={6} md={6} padding={1}>
                    <TextField  label={('Date Until' )}
                                fullWidth
                                maxLength={10}
                                type={'date'}
                                disabled={loading}
                                inputProps={{  
                                            sx: { fontSize: onMobile ? '12px' : '', '& input[type="date"]::-ms-clear': { display: 'none', }, }, 
                                            min: onDateFrom,
                                            max: today,
                                            }}
                                InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  },shrink: true, }}
                                value={onDateUntil}
                                onChange={(e)=>setonDateUntil(e.target.value)}
                                variant='outlined'
                                autoComplete='off'
                                required size='small'
                                />
                </Grid>
                
                <Grid item xs={12} sm={12} md={12} padding={1}>
                    <Autocomplete   multiple={true}
                                    options={optApps}
                                    value={onApps}
                                    disabled={loading}
                                    fullWidth
                                    getOptionLabel={(option) => option?.label || ''}
                                    isOptionEqualToValue={isOptEqualTo}
                                    onChange={(event, newValues)=>setonApps(newValues)}
                                    renderTags={(value, getTagProps)=>renderTAGS(value, getTagProps,onApps,setonApps)}
                                    renderOption={renderOpt}
                                    renderInput={(params) => 
                                    <TextField {...params} 
                                        size='small'
                                        sx={textSX}
                                        autoComplete='off'
                                        label="Select applications" />
                                    }
                                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12} padding={1}>
                    <Autocomplete   multiple={true}
                                    options={optClubs}
                                    value={onClubs}
                                    disabled={loading}
                                    fullWidth
                                    getOptionLabel={(option) => option?.label || ''}
                                    isOptionEqualToValue={isOptEqualTo}
                                    onChange={(event, newValues)=>setonClubs(newValues)}
                                    renderTags={(value, getTagProps)=>renderTAGS(value, getTagProps,onClubs,setonClubs)}
                                    renderOption={renderOpt}
                                    renderInput={(params) => 
                                    <TextField {...params} 
                                        size='small'
                                        sx={textSX}
                                        autoComplete='off'
                                        label="Select clubs" />
                                    }
                                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12} padding={1}>
                    <Autocomplete   multiple={true}
                                    options={optAccts}
                                    value={onAccts}
                                    disabled={loading}
                                    fullWidth
                                    getOptionLabel={(option) => option?.label || ''}
                                    isOptionEqualToValue={isOptEqualTo}
                                    onChange={(event, newValues)=>setonAccts(newValues)}
                                    renderTags={(value, getTagProps)=>renderTAGS(value, getTagProps,onAccts,setonAccts)}
                                    renderOption={renderOpt}
                                    renderInput={(params) => 
                                    <TextField {...params} 
                                        size='small'
                                        sx={textSX}
                                        autoComplete='off'
                                        label="Select account ID/s" />
                                    }
                                    />
                </Grid>

            </Grid>
        </DialogContent>

        <DialogActions sx={{padding:'15px'}}>
              { 
                !onSubmitLoad ? 

                  <>
                    <Button onClick={()=>onSubmitting()} 
                            disabled={onSubmitLoad}
                            sx={{...Cls.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                            startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                            variant='contained'>
                            SUBMIT
                    </Button>
                    <Button onClick={()=>onClear()} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}} variant='outlined' loading='true' >
                        RESET
                    </Button>
                  </>
                :
                  <Button sx={{...Cls.buttonClass('outlined','violet'), width:'100%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='outlined'>
                            SUBMITTING
                  </Button>
              }
        </DialogActions>
      </Dialog>
    </>
  );
};
