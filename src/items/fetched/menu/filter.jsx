import { useState,useEffect } from 'react';

import React from 'react';

import {Box,
        TextField,
        Autocomplete,
        IconButton,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Typography,
        Button,
        Chip,
        Grid
        } from '@mui/material/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function MenuOnFilter({ byFiltering, onFiltering }) {
    
    const fil = byFiltering

    const [filterValue, setfilterValue]     = useState({
                                                        status: fil.status ? fil.status : 'ACTIVE',
                                                        sortby: fil.sortby ? fil.sortby : 'ALL',
                                                        limit: fil.limit ? fil.limit : 1000,
                                                        });
    const [openModal, setopenModal]         = useState(false);

   // const listSORTBY = filterValue.map((i) => i.label);

    const onFilter = (event) => {
        const sanitizedValue = Fnc.textSanitize(event.currentTarget.value);
        setfilterValue(sanitizedValue);
    };
    
    const onsubmitFilter = () => {
        onFiltering(filterValue)
    }
    
    const onfilterChange =(i,ii)=>{

        setfilterValue({...filterValue, [ii]: i})

    }

    const onopenModal =()=>{
        setopenModal(true)
    }

    const oncloseModal =()=>{
        setopenModal(false)
    }
  
    const options = {
                        sortBY: [
                                    'Date Closed',
                                    'Application',
                                    'Club',
                                    'Player ID',
                                    'User',                              
                                ],
                        };

    const listsFilterBy = [
                        'Apple',
                        'Banana',
                    ];

    const listsLimitBy = [
                        'Apple',
                        'Banana',
                    ]; 
  return (
    <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
            <IconButton onClick={()=>onopenModal()}>
                <Icon icon="mage:filter-fill"/>
            </IconButton>
        </Box>


        <Dialog open={openModal} sx={{ m: 0, p: 2, }} >

            <DialogTitle style={{marginTop: '10px'}}>

                <Typography variant="h5" component="div" >
                    FILTER RECORDS
                </Typography>
                
            </DialogTitle>

            <DialogContent style={{minWidth: '350px'}}>
                
                <Box sx={{ margin:'10px',marginBottom:'20px' }}>
                    <Chip label="Active" variant="contained" color='success' />
                </Box>
                
                <Box sx={{ margin:'10px' }}>

                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs:10, sm: 10, md: 10 }} style={{marginTop:'-20px'}}>

                        <Grid item xs={10} sm={10} md={10}>

                            <Autocomplete   value={filterValue.sortby} 
                                            size='small'
                                            onChange={(e, newValue) => { onfilterChange(newValue,'sortby')}}
                                            options={['ALL', ...fil.dataSortBy]} 
                                            getOptionLabel={(option) => option ? option : ""}
                                            renderInput={(params) => (
                                                <TextField {...params} label={"SORT BY "}/>
                                            )}
                                            /> 

                        </Grid>

                        <Grid item xs={10} sm={10} md={10}>

                            <Autocomplete   value={filterValue.limit} 
                                            size='small'
                                            onChange={(e, newValue) => { onfilterChange(newValue,'limit')}}
                                            options={listsLimitBy} 
                                            getOptionLabel={(option) => option ? option : ""}
                                            renderInput={(params) => (
                                                <TextField {...params} label={"LIMIT BY "}/>
                                            )}
                                            /> 

                        </Grid>

                    </Grid>

                </Box>

            </DialogContent>

            <DialogActions>

                <Button variant='contained'  
                                sx={Cls.buttonClass('contained','violet')}
                                style={{margin:'20px',marginRight:'-10px'}}
                                onClick={() => onsubmitFilter()}
                                startIcon={<Icon icon="icon-park-outline:check-one" />} >
                            Submit
                </Button>

                <Button variant='outlined'  
                                sx={Cls.buttonClass('outlined','')}
                                style={{margin:'20px'}}
                                onClick={() => oncloseModal()}
                                startIcon={<Icon icon="icon-park-outline:close-one" />} >
                            Close
                </Button>

            </DialogActions>
        </Dialog>

    </>
  );
}