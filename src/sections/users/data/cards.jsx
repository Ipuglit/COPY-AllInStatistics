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

          {paginatedCards.map((i,index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>

                <Card sx={{ display: 'flex', padding:'5px', borderRadius:'0px', minHeight: '100px', width:'100%', '&:hover': { boxShadow: '.4px .4px .4px 2px rgba(148,0,211,.4)', backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))', transform: 'scale(1)', cursor:'pointer' } }} 
                      onClick={()=>RETURN({...i,modal:'Open'})}>
                    <Box sx={{ display: 'flex', flexDirection: 'column',width: '65%' ,marginBottom:'-20px',  }} >

                        <CardContent sx={{ flex: '1 0 auto' }}>

                            <Typography component="div" variant="body1" sx={{fontSize: '14px'}}>

                              <Tooltip title={i.userStatusLabel} variant="soft" color={Fnc.Statuses(i.userStatusLabel).alert}>
                                <Iconify  icon={Fnc.Statuses(i.userStatusLabel).icon} 
                                          color={Fnc.Statuses(i.userStatusLabel).color } 
                                          width={22} 
                                          sx={{ mr: 0.3,marginBottom:'-6px',  }}  />
                              </Tooltip>
                              &nbsp;
                              {i.userFirstName ? i.userName : 'User'} 

                            </Typography>

                            <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary', fontSize: '11px' }} >

                                Nickname: 

                                <span style={{float:'right'}}>
                                  {i.userNick}
                                </span>          

                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '10px' }} >

                                Accounts: 

                                <span style={{float:'right'}}>
                                  {i.countAccounts == 1 ? '1 Account' : i.countAccounts > 1 ? i.countAccounts+' Accounts': 'None' }
                                </span> 

                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '10px' }} >

                                Latest Record:

                                <span style={{float:'right'}}>
                                  {i.recorded_last ? Fnc.dateText(i.recorded_last) : 'None'}
                                </span> 

                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '10px' }} >

                                Player Result:

                                <span style={{float:'right'}}>
                                  {i.total_playerresult != 0 ? '$'+i.total_playerresult : 'None' }
                                </span> 

                            </Typography>

                        </CardContent>

                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ width:'35%', height: '100%'}}
                        image={Fnc.ifImage(`${i.accountUserAvatar}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+i.accountUserAvatar}?${new Date().getTime()}`)}
                        onError={(e) => {
                          e.target.src = '/images/avatars/default.jpg';
                        }}
                        alt={i.accountNick}
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