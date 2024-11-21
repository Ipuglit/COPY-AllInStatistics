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

export default function ViaCards({DATA, SEARCH, RETURN, VIEW, SORT}) {

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
  
    const handleLink = (i) => {
      window.open('https://'+i, '_blank');
    };

    const cardsPerPage = 9;
    const totalPages = Math.ceil(sortedData.length / cardsPerPage);
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = sortedData.slice(startIndex, endIndex);
  
    return (
      <div>
        <Grid container spacing={2}>

          {paginatedCards.map((i) => (
            <Grid item xs={12} sm={6} md={6} key={i.id}>

                <Card sx={{ display: 'flex', padding:'1px', borderRadius:'0px', height: '115px', width:'100%', '&:hover': { boxShadow: '.4px .4px .4px 2px rgba(148,0,211,.4)', backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))', transform: 'scale(1)', cursor:'pointer' } }} 
                      >
                    <Box sx={{ display: 'flex', flexDirection: 'column',width: '60%' ,marginBottom:'-20px',  }} >

                        <CardContent sx={{ flex: '1 0 auto' }}>

                            <Typography component="div" sx={{fontSize: '12px', marginTop:'-5px', textOverflow: 'ellipsis', overflow:'hidden',whiteSpace:'nowrap'}}>

                              <Tooltip title={i.statusLabel} variant="soft" color={Fnc.Statuses(i.statusLabel).alert}>
                                <Iconify  icon={Fnc.Statuses(i.statusLabel).icon} 
                                          color={Fnc.Statuses(i.statusLabel).color } 
                                          width={15} 
                                          sx={{ mr: 0.5,marginBottom:'-4px',  }}  />
                              </Tooltip>

                                {i.title}

                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '12px', marginTop:'-4px', textOverflow: 'ellipsis', overflow:'hidden',whiteSpace:'nowrap' }} >
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {i.subtitle} 
                            </Typography>

                            <div style={{ color: 'gray', fontSize: '12px',fontWeight:'0'}} >

                              <span>Details: </span>

                              <Tooltip title={i.details} variant="soft" placement='top-start'>
                                <p style={{color:'lightgray', marginTop:'-4px', textOverflow: 'ellipsis', overflow:'hidden',whiteSpace:'nowrap'}}>
                                   {i.details}
                                </p> 
                              </Tooltip>
                          
                            </div>

                            {
                              i.link &&
                              <Tooltip title={'Link: '+i.link} placement='bottom-start'>
                                <Typography variant="subtitle2" 
                                            component="div" 
                                            sx={{ fontSize: '11px', marginTop:'-3px', textAlign:'right'}} 
                                            onClick={(e)=>window.open('https://'+i.link, '_blank')}>
                                        View Link
                                </Typography>
                              </Tooltip>
                            }
                                <Typography variant="subtitle2" 
                                            component="div" 
                                            sx={{ fontSize: '11px', marginTop:'-16px', textAlign:'left'}}
                                            onClick={()=>RETURN({...i,modal:'Open'})}>
                                        Edit
                                </Typography>

                        </CardContent>
   
                    </Box>

                    <Tooltip title={'View'} placement='top'>
                        <CardMedia
                            component="img"
                            sx={{ width:'40%', height: '100%'}}
                            key={Math.random()}
                            image={`${'https://www.all-in-statistics.pro'+i?.imageBackground}?${new Date().getTime()}`}
                            onError={(e) => {
                              e.target.src = 'https://www.all-in-statistics.pro'+i?.imageBackground || 'https://www.all-in-statistics.pro/images/announcements/default_bg.jpg';
                            }}
                            onClick={()=>VIEW({...i,change:Fnc.numRandom()})}
                            alt={i.accountNick}
                        />
                        
                    </Tooltip>

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