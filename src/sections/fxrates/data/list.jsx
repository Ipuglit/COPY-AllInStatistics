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
            Tooltip,
            Divider,
            Link,
            CardHeader,
            List,
            ListItem,
            ListItemAvatar,
            Avatar,
            ListItemText
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
          return String(a.fxDate).localeCompare(String(b.fxDate));
          } else {
          return String(b.fxDate).localeCompare(String(a.fxDate));
          }
      });

      setsortedData(sorted);

  }, [onData, SORT]);
  
    const handlePageChange = (event, value) => {
        setPage(value);
    };
  
    const handleSort = () => {
        setSortOrder(SORT === 'desc' ? 'asc' : 'desc');
    };
  

    const cardsPerPage = 12;
    const totalPages = Math.ceil(sortedData.length / cardsPerPage);
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = sortedData.slice(startIndex, endIndex);
  
    return (
      <div>
        <Grid container spacing={2}>
          {paginatedCards.map((i,index) => (
            <Grid item xs={6} sm={4} md={4} key={index}>
            <Box component="section" sx={{ p: 0, border: '1px dashed grey',  }} onClick={() => RETURN({ modal: "Open", ...i, })}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper','&:hover': { boxShadow: '.4px .4px .4px 2px rgba(148,0,211,.4)', backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))', transform: 'scale(1)', cursor:'pointer' } }}>

                    <ListItem>
                        
                        <ListItemAvatar>
                          <Avatar alt={i.fxProvider} sx={{ bgcolor: 'transparent' }} > 
                                <Icon icon="formkit:usdc"color='violet' width={'60px'} />
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText>

                            <Typography variant="caption" component="div" sx={{color: 'text.disabled',}} >
                                        {i.fxDateFormat}
                            </Typography>
                            <Divider variant="li" style={{marginBottom:'6px', marginTop:'3px', maxWidth:'130px'}}/>
                                <div style={{ display: 'flex', alignItems: 'center' }}>          
                                    <Typography variant="body2" component="div" >
                                        {i.fxProvider}
                                    </Typography>

                                </div>

                        </ListItemText>   
                    </ListItem>

            </List>
            </Box>
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