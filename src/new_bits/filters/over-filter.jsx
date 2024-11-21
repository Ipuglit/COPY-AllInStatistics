import React, { useState, useEffect } from 'react';
import { 
            Button, 
            Typography, 
            Box,
            Divider, 
            Autocomplete, 
            TextField, 
            InputAdornment,
            Chip,
            Tooltip,
            IconButton,
            Grid,
            SwipeableDrawer 

        } from "@mui/material";

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function FilterBox({Receive, Return, What}) {

    const onMobile                      = Fnc.OnMobile()
    const today                         = new Date().toISOString().split('T')[0];

    const [onDialog,setonDialog]        = useState(false) 

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
    
    const optApps       = dropItems(Receive?.APPS?.data,'appName','appID')       
    const optClubs      = dropItems(Receive?.CLUBS?.data,'clubName','clubID')      
    const optAccts      = dropItems(Receive?.ACCTS?.data,'accountID','accountID')   
    const optUnions     = dropItems(Receive?.UNIONS?.data,'unionName','id')       

    const loading   =       (Receive?.APPS?.data?.length > 0 ? Receive?.APPS?.load : true) 
                        &&  (Receive?.CLUBS?.data?.length > 0 ? Receive?.CLUBS?.load : true) 
                        &&  (Receive?.ACCTS?.data?.length > 0 ? Receive?.ACCTS?.load : true) 
                        &&  (Receive?.UNIONS?.data?.length > 0 ? Receive?.UNIONS?.load : true) 
                        ? false : true

    const available = onDateFrom.length > 0 || onDateUntil.length > 0 || onApps.length > 0 || onClubs.length > 0 || onAccts.length > 0 || onPlayer.length > 0 || onUplines.length > 0 || onStatus?.id != 1 ? true : false

    const renderTAGS = (getThis,tagThis,arrThis,setThis) => {
        return getThis.map((i, index) => (
            <Tooltip key={index} title={i?.label}>
                <Chip
                    size='small'
                    style={{backgroundColor:'transparent',height:'13px', fontSize: onMobile ? '10px' : '11.5px'}}
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
        Return({
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
        Return({
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
    return (



<Grid container columns={{ xs: 12, sm: 12, md: 12 }} spacing={1.7} sx={{marginTop:'-25px'}}>
{
    What?.includes('status') &&
    <Grid item xs={12} sm={6} md={4}>
        <Autocomplete   options={optStatus}
                        value={onStatus ? onStatus : optStatus?.find(x => x?.id == 1)}
                        disabled={loading}
                        fullWidth
                        getOptionLabel={(option) => option?.label || ''}
                        isOptionEqualToValue={isOptEqualTo}
                        onChange={(event, newValues)=>setonStatus(newValues)}
                        renderTags={(value, getTagProps)=>renderTAGS(value, getTagProps,onStatus,setonStatus)}
                        renderOption={renderOpt}
                        renderInput={(params) => 
                        <TextField {...params} 
                            size='small'
                            sx={textSX}
                            autoComplete='off'
                            label="Select status" />
                        }
                        />
    </Grid>
}
    <Grid item xs={12} sm={12} md={12}>

    </Grid>
    {
    What?.includes('apps') &&
    <Grid item xs={12} sm={6} md={4}>
        <Autocomplete   multiple={true}
                        options={optApps}
                        value={onApps}
                        disabled={loading}
                        limitTags={1}
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
    }

    {
    What?.includes('clubs') &&
    <Grid item xs={12} sm={6} md={4}>
        <Autocomplete   multiple={true}
                        options={optClubs}
                        value={onClubs}
                        disabled={loading}
                        limitTags={1}
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
    }

    {
    What?.includes('accounts') &&
    <Grid item xs={12} sm={6} md={4}>
        <Autocomplete   multiple={true}
                        options={optAccts}
                        value={onAccts}
                        disabled={loading}
                        limitTags={1}
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
    }

{
    What?.includes('unions') &&
    <Grid item xs={12} sm={6} md={4}>
        <Autocomplete   multiple={true}
                        options={optUnions}
                        value={onUnions}
                        disabled={loading}
                        limitTags={1}
                        fullWidth
                        getOptionLabel={(option) => option?.label || ''}
                        isOptionEqualToValue={isOptEqualTo}
                        onChange={(event, newValues)=>setonUnions(newValues)}
                        renderTags={(value, getTagProps)=>renderTAGS(value, getTagProps,onUnions,setonUnions)}
                        renderOption={renderOpt}
                        renderInput={(params) => 
                        <TextField {...params} 
                            size='small'
                            sx={textSX}
                            autoComplete='off'
                            label="Select unions" />
                        }
                        />
    </Grid>
}
    {
    What?.includes('date') &&
    <>
    <Grid item xs={12} sm={6} md={4}>

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

    <Grid item xs={12} sm={6} md={4}>
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
    </>
    }
    

    <Grid item xs={12} sm={12} md={12}>
        <Button variant='contained' 
                onClick={()=>onSubmitting()} 
                disabled={loading || !available}
                sx={{minWidth:'125px',fontSize: onMobile ? '12px' : '',borderRadius:'0px',backgroundColor:'#9370db'}} size='small'>
            {
                loading 
                ? 
                'LOADING' 
                : 
                <><Icon icon="mage:filter-fill"/> &nbsp; FILTER</>
            }
        </Button>
        &nbsp;
        <Button variant='outlined' 
                onClick={()=>onClear()} 
                disabled={loading}
                sx={{fontSize: onMobile ? '12px' : '', borderRadius:'0px'}} size='small'>
            {
                !available 
                ? 
                'REFRESH' 
                : 
                'RESET'
            }
        </Button>
    </Grid>

</Grid>





  );
}