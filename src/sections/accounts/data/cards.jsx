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
            return String(a.accountNick).localeCompare(String(b.accountNick));
            } else {
            return String(b.accountNick).localeCompare(String(a.accountNick));
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
  

    const cardsPerPage = 9;
    const totalPages = Math.ceil(sortedData.length / cardsPerPage);
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = sortedData.slice(startIndex, endIndex);
  
    return (
      <div>
        <Grid container columns={{ xs: 12, sm: 12, md: 12 }} spacing={0.8} padding={0.5} >

          {paginatedCards.map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i.id} >

                <Card sx={{ display: 'flex', padding:'5px', borderRadius:'0px', minHeight: '120px', width:'100%', '&:hover': { boxShadow: '.4px .4px .4px 2px rgba(148,0,211,.4)', backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))', transform: 'scale(1)', cursor:'pointer' } }} 
                      onClick={()=>RETURN({...i,modal:'Open'})}>
                    <Box sx={{ display: 'flex', flexDirection: 'column',width: '100%' ,marginBottom:'-20px',  }} >

                        <CardContent sx={{ flex: '1 0 auto' }}>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary', fontSize: '11px' }} >
                                {i.appName}
                            </Typography>

                            <Typography component="div"  sx={{fontSize: '13px'}}>

                              <Tooltip title={i.accountStatusLabel} variant="soft" color={Fnc.Statuses(i.accountStatusLabel).alert}>
                                <Iconify  icon={Fnc.Statuses(i.accountStatusLabel).icon} 
                                          color={Fnc.Statuses(i.accountStatusLabel).color } 
                                          width={22} 
                                          sx={{ mr: 0.3,marginBottom:'-6px',  }}  />
                              </Tooltip>
                              &nbsp;
                              ID No. 
                              <span style={{float:'right'}}>{i.accountID}</span>

                            </Typography>

                            <Typography component="div" sx={{ color: 'gray', fontSize: '11px',fontWeight:'0' }} >
                              Nickname: 
                              <span style={{color:'lightgray',float:'right'}}>{i.accountNick}</span>                           
                            </Typography>

                            <Typography component="div" sx={{ color: 'gray', fontSize: '11px',fontWeight:'0' }} >
                              User: 
                              <span style={{color:'lightgray',float:'right'}}>
                              {i.accountUserFirstName ? i.accountUserName : i.accountUserNick ? i.accountUserNick : 'No user'}
                              </span>                           
                            </Typography>

                            <Typography component="div" sx={{ color: 'gray', fontSize: '11px',fontWeight:'0' }} >
                              Clubs: 
                              <span style={{color:'lightgray',float:'right'}}>
                                {i.list_clubNames ? i.list_clubNames: 'No clubs' }
                              </span>                           
                            </Typography>

                            <Typography component="div" sx={{ color: 'gray', fontSize: '11px',fontWeight:'0' }} >
                              Latest Record: 
                              <span style={{color:'lightgray',float:'right'}}>
                              {i.recorded_last ? Fnc.dateText(i.recorded_last) : 'None'}
                              </span>                           
                            </Typography>

                        </CardContent>

                    </Box>
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