import { useState,useEffect } from 'react';

import React from 'react';
import axios from 'axios';

import {Button,
        Chip,
        Avatar,
        Box,
        Divider,
        Typography,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Grid,
        FormControl,
        InputLabel,
        Select,
        TextField,
        Autocomplete,

        TableRow,} from '@mui/material/';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Eq from 'src/hooks/calculations'


import { imagetoRESIZE, imageUPLOADS } from 'src/hooks/imageupload'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import {AlertSnack} from 'src/items/alert_snack'
import { Icon } from '@iconify/react';

const options = [
    { id: 1, label: 'Option 1', value: 'option1' },
    { id: 2, label: 'Option 2', value: 'option2' },
    { id: 3, label: 'Option 3', value: 'option3' },
    // Add more options as needed
  ];
export default function DialogAnnouncement({ DATA, ITEMS, RETURN }) {

    const [isSuccess, setisSuccess]                 = useState(false);

    const [selectedAPPS, setselectedAPPS]           = useState([]);
    const [selectedCLUBS, setselectedCLUBS]         = useState([]);
    const [selectedACCOUNTS, setselectedACCOUNTS]   = useState([]);
    const [selectedUSERS, setselectedUSERS]         = useState([]);

    const [selectedDATEFROM, setselectedDATEFROM]     = useState(null);
    const [selectedDATEUNTIL, setselectedDATEUNTIL]       = useState(null);

    const today = new Date();

    const dataAPPS = ITEMS.APPS.data.map((i)=>{
                                    return {    
                                                id:         i.increment,
                                                label:      i.appName,
                                                value:      i.appID,
                                            }
                                        })

    const dataCLUBS = ITEMS.CLUBS.data.map((i)=>{
                                    return {    
                                                id:         i.increment,
                                                label:      i.clubName,
                                                value:      i.clubID,
                                            }
                                        })

    const dataACCTS = ITEMS.ACCOUNTS.data.map((i)=>{
                                    return {    
                                                id:         i.increment,
                                                label:      i.accountID,
                                                value:      i.accountID,
                                            }
                                        })

    const dataUSERS = ITEMS.USERS.data.map((i)=>{
                                    return {    
                                                id:         i.increment,
                                                label:      i.firstname ? i.firstname + ' ' + i.lastname : i.nickname,
                                                value:      i.id,
                                            }
                                        })

    const onClear =(i)=>{
        setselectedAPPS([])
        setselectedCLUBS([])
        setselectedACCOUNTS([])
        setselectedUSERS([])
        setselectedDATEFROM(null)
        setselectedDATEUNTIL(null)
        RETURN({arrays:{},values:{},refresh:''})
    }

    const renderTags = (value,getTagProps,arr,setArr) => {
        return value.map((i, index) => (
          <Chip
            key={i.id}
            size='small'
            style={{backgroundColor:'#9370db'}}
            label={i.label}
            {...getTagProps({ index })}
            onDelete={() => {
              const newValues = arr.filter(
                (e) => e.value !== i.value
              );
              setArr(newValues);
            }}
          />
        ));
      };

      const handleClearDate = (i) => {
        setselectedDATEFROM(null)
        setselectedDATEUNTIL(null)
      };

    const handleChange = (i,e) => {
      e(i);
    };

    const getArrays = (i) => {
        return i.map(e => e.value)
    }

    const onSubmit =(i,e)=>{


        const byThis =    {
                            arrays: {
                                        APPS:               selectedAPPS,
                                        CLUBS:              selectedCLUBS,
                                        ACCTS:              selectedACCOUNTS,
                                        USERS:              selectedUSERS,
                                        DATEFROM:           selectedDATEFROM,
                                        DATEUNTIL:          selectedDATEUNTIL,
                                    },
                            values: {
                                        APPS:       getArrays(selectedAPPS).length != 0 ? getArrays(selectedAPPS) : 'ALL',
                                        CLUBS:      getArrays(selectedCLUBS).length != 0 ? getArrays(selectedCLUBS) : 'ALL',
                                        ACCTS:      getArrays(selectedACCOUNTS).length != 0 ? getArrays(selectedACCOUNTS) : 'ALL',
                                        USERS:      getArrays(selectedUSERS).length != 0 ? getArrays(selectedUSERS) : 'ALL',
                                        DATEFROM:   selectedDATEUNTIL && selectedDATEFROM ? Fnc.dateDash(selectedDATEFROM) : 'ALL',
                                        DATEUNTIL:  selectedDATEUNTIL && selectedDATEFROM ? Fnc.dateDash(selectedDATEUNTIL) : 'ALL',
                                    },
                            refresh: Fnc.numRandom()
                        }
        RETURN(byThis)
    }

    useEffect(() => {

      }, [DATA.modal == true]);

  return (

    <Dialog open={DATA.modal} fullWidth>

        <DialogTitle style={{marginTop: '10px',}}>

            <Typography variant="h5" component="div" >
                FILTER SETTING
            </Typography>
            
        </DialogTitle>

        <DialogContent >
            <br/>
          <Grid container spacing={{ xs: 1, md: 1.5 }} columns={{ xs: 12, sm: 12, md: 12 }}>


            <Grid item xs={12} sm={12} md={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker label="Date from"
                                    value={selectedDATEFROM}
                                    renderInput={(params) => (
                                        <TextField {...params}>
                                          <button type="button">Select Date</button>
                                        </TextField>
                                      )}
                                    maxDate={selectedDATEUNTIL ? dayjs(selectedDATEUNTIL) : dayjs(today)}
                                    onChange={(newValue) => {setselectedDATEFROM(newValue), selectedDATEUNTIL == null && setselectedDATEUNTIL(dayjs(today)) }} />

                        <DatePicker label="Date until"
                                    value={selectedDATEUNTIL}
                                    maxDate={dayjs(today)}
                                    minDate={dayjs(selectedDATEFROM)}
                                    clearable showTodayButton
                                    onChange={(newValue) => setselectedDATEUNTIL(newValue)} />
                        <Button variant='contained' 
                                onClick={() => handleClearDate()}>
                                CLEAR
                        </Button>
                    </DemoContainer>
                </LocalizationProvider>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>

            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                    multiple
                    options={dataAPPS}
                    value={selectedAPPS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value)=>{return option.id === value.id}}
                    onChange={(event, newValues)=>handleChange(newValues,setselectedAPPS)}
                    renderTags={(value, getTagProps)=>renderTags(value, getTagProps,selectedAPPS,setselectedAPPS)}
                    renderInput={(params) => <TextField {...params} label="Select application" />}
                    />
            </Grid>

            <Grid item xs={12} sm={12} md={12}  >
                <Autocomplete
                    multiple
                    options={dataCLUBS}
                    value={selectedCLUBS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value)=>{return option.id === value.id}}
                    onChange={(event, newValues)=>handleChange(newValues,setselectedCLUBS)}
                    renderTags={(value, getTagProps)=>renderTags(value, getTagProps,selectedCLUBS,setselectedCLUBS)}
                    renderInput={(params) => <TextField {...params} label="Select clubs" />}
                    />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                    multiple
                    options={dataUSERS}
                    value={selectedUSERS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value)=>{return option.id === value.id}}
                    onChange={(event, newValues)=>handleChange(newValues,setselectedUSERS)}
                    renderTags={(value, getTagProps)=>renderTags(value, getTagProps,selectedUSERS,setselectedUSERS)}
                    renderInput={(params) => <TextField {...params} label="Select users" />}
                    />

            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                    multiple
                    options={dataACCTS}
                    value={selectedACCOUNTS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value)=>{return option.id === value.id}}
                    onChange={(event, newValues)=>handleChange(newValues,setselectedACCOUNTS)}
                    renderTags={(value, getTagProps)=>renderTags(value, getTagProps,selectedACCOUNTS,setselectedACCOUNTS)}
                    renderInput={(params) => <TextField {...params} label="Select accounts" />}
                    />
            </Grid>


          </Grid>
        </DialogContent>

        <DialogActions style={{padding:'20px'}}>

            <Button variant='outlined' 
                    onClick={() => onClear()}
                    sx={{borderRadius:'0',width:'50%'}}>
                    Clear All
            </Button>

            <Button sx={{...Cls.buttonClass('contained','violet'), width:'50%',borderRadius:'0',}} 
                    variant='contained' 
                    disabled={isSuccess}
                    onClick={() => onSubmit()}>
                    FILTER
            </Button>

        </DialogActions>

    </Dialog>
  );
}