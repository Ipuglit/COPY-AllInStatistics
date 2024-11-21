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
        setPage(1)
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
        <Grid container columns={{ xs: 12, sm: 12, md: 12 }} spacing={0.8} padding={0.5} >

          {paginatedCards.map((i) => (
            <Grid item xs={12} sm={6} md={6} key={i.id}>

                <Card sx={{ display: 'flex', padding:'5px', borderRadius:'0px', height: '135px', width:'100%', '&:hover': { boxShadow: '.4px .4px .4px 2px rgba(148,0,211,.4)', backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))', transform: 'scale(1)', cursor:'pointer' } }} 
                      onClick={()=>RETURN({...i,modal:'Open'})}>
                    <Box sx={{ display: 'flex', flexDirection: 'column',width: '65%'  }} >

                        <CardContent sx={{ flex: '1 0 auto' }}>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary', fontSize: '11px' }} >
                                {i.appName}
                            </Typography>

                            <Typography component="div" variant="body1" sx={{fontSize: '13px'}}>

                              <Tooltip title={i.clubStatusLabel} variant="soft" color={Fnc.Statuses(i.clubStatusLabel).alert}>
                                <Iconify  icon={Fnc.Statuses(i.clubStatusLabel).icon} 
                                          color={Fnc.Statuses(i.clubStatusLabel).color } 
                                          width={22} 
                                          sx={{ mr: 0.3,marginBottom:'-6px',  }}  />
                              </Tooltip>
                              &nbsp;
                              {i.clubName}

                            </Typography>

                            <Typography variant="subtitle1" component="div" sx={{ color: 'gray', fontSize: '11px' }} >
                              ID: 
                              <span style={{float:'right', color:'lightgray'}}>
                                {i.clubID}  
                              </span>                             
                            </Typography>


                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '11px' }} >
                              Union:
                              <span style={{float:'right', color:'lightgray'}}>
                              {i.unionName ? i.unionName : 'Private'} 
                              </span>  
                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '11px' }} >
                              Accounts: 
                              <span style={{float:'right', color:'lightgray'}}>
                                {
                                  i.countAccounts > 0 && i.countAccounts_active == i.countAccounts
                                  ?
                                  <>{i.countAccounts} Active</>
                                  :
                                  i.countAccounts > 0 && i.countAccounts_active == 0
                                  ?
                                  <>{i.countAccounts} Inactive</>
                                  :
                                  i.countAccounts > 0 && i.countAccounts_active > 0
                                  ?
                                  <>{i.countAccounts} with {i.countAccounts_active} active</>
                                  :
                                  'None'
                                }
                              </span> 
                            </Typography>

                            <Typography variant="subtitle2" component="div" sx={{ color: 'gray', fontSize: '11px' }} >
                              Latest Record: 
                              <span style={{float:'right', color:'lightgray'}}>
                                {i.recorded_last ? Fnc.dateText(i.recorded_last) : 'None'} 
                              </span>  
                            </Typography>

                        </CardContent>

                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ width:'35%', height: '100%', }}
                        key={Math.random()}
                        image={Fnc.ifImage(`${i.clubImageFull}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+i.clubImageFull}?${new Date().getTime()}`)}
                        onError={(e) => { e.target.src = '/images/clubs/default.png'; }}
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
                Fnc.JSONS(onData,false)
                }
      </div>
    );
  }