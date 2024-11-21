import React, { useState, useEffect } from 'react';
import {    Card, 
            CardContent, 
            CardMedia, 
            IconButton, 
            Button,
            Typography, 
            Grid, 
            Pagination, 
            Box, 
            TextField,
            Tooltip
        } from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

export default function ViaCards({DATA, SEARCH, RETURN, SORT}) {

    const itemx = DATA.data ? DATA.data : []

    const [onData, setonData] = useState(itemx);

    const [page, setPage] = useState(1);
    const [sortedData, setsortedData] = useState(onData);
  
    useEffect(() => {

        const searching = String(SEARCH).toLowerCase()
        
        const filtereds = itemx.filter(i =>   
                                        Object.values(i).some(e =>
                                          String(e).toLowerCase().includes(searching)
                                        )
                                      );


        setonData(filtereds);

    }, [SEARCH,DATA]);
  
    useEffect(() => {

        const sorted = [...onData].sort((a, b) => {
            if (SORT === 'asc') {
            return String(a.clubName).localeCompare(String(b.clubName));
            } else {
            return String(b.clubName).localeCompare(String(a.clubName));
            }
        });

        setsortedData(sorted);

    }, [onData, SORT]);
  
    const handlePageChange = (event, value) => {
        setPage(value);
    };
  
    const handleSort = () => {
        setSortOrder(SORT === 'asc' ? 'desc' : 'asc');
    };
  

    const cardsPerPage = 6;
    const totalPages = Math.ceil(sortedData.length / cardsPerPage);
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = sortedData.slice(startIndex, endIndex);
  
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            </Box>
          </Grid>
          {paginatedCards.map((i) => (
            <Grid item xs={12} sm={6} md={6} key={i.id}>

                <Card sx={{ display: 'flex', padding:'5px', borderRadius:'0px', height: '130px', width:'100%', '&:hover': { boxShadow: '.4px .4px .4px 2px rgba(148,0,211,.4)', backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))', transform: 'scale(1)', cursor:'pointer' } }} 
                      onClick={()=>RETURN({...i,modal:'Open'})}>
                    <Box sx={{ display: 'flex', flexDirection: 'column',width: '65%'  }} >

                        <CardContent sx={{ flex: '1 0 auto' }}>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary', fontSize: '12px' }} >
                                {i.appName}
                            </Typography>

                            <Typography component="div" variant="body1" sx={{fontSize: '15px'}}>

                              <Tooltip title={i.clubStatusLabel} variant="soft" color={Fnc.Statuses(i.clubStatusLabel).alert}>
                                <Iconify  icon={Fnc.Statuses(i.clubStatusLabel).icon} 
                                          color={Fnc.Statuses(i.clubStatusLabel).color } 
                                          width={22} 
                                          sx={{ mr: 0.3,marginBottom:'-6px',  }}  />
                              </Tooltip>
                              &nbsp;
                              {i.clubName}

                            </Typography>

                            <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary', fontSize: '12px' }} >
                              ID: {i.clubID}                             
                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '12px' }} >
                              {i.recorded_last ? 'Latest Record: '+i.recorded_last : 'No records found'}

                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', marginTop:'-5px', fontSize: '12px' }} >
                              {i.count_accounts == 0 ? 'No accounts with records' : i.count_accounts == 1 ? '1 account with records' : i.count_accounts+' accounts with records' }
                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', marginTop:'-5px', fontSize: '12px' }} >
                              {i.count_accounts_active == 0 ? 'No active accounts' : i.count_accounts_active == 1 ? '1 active account' : i.count_accounts_active+' active accounts' }
                            </Typography>

                        </CardContent>

                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ width:'35%', height: '100%', }}
                        image={Fnc.ifImage(i.clubImageFull,'/images/clubs/defaults.png')}
                        onError={(e) => {
                          e.target.src = '/images/clubs/defaults.png';
                        }}
                        alt={i.clubName}
                    />
               </Card>

            </Grid>
          ))}
        </Grid>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
                {
                //Fnc.JSONS(onData,true)
                }
      </div>
    );
  }