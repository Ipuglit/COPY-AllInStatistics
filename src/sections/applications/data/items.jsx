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
            TextField 
        } from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

// Sample data
const cardsData = [
  { id: 1, title: 'Card 1', description: 'Description for Card 1' },
  { id: 2, title: 'Card 2', description: 'Description for Card 2' },
  { id: 3, title: 'Card 1', description: 'Description for Card 1' },
  { id: 4, title: 'Card 2', description: 'Description for Card 2' },
  { id: 5, title: 'Card 1', description: 'Description for Card 1' },
  { id: 6, title: 'Card 2', description: 'Description for Cardx 2' },
  { id: 7, title: 'Card 1', description: 'Description for Cards 1' },
  { id: 8, title: 'Card 2', description: 'Description for Cardx 2' },
  { id: 9, title: 'Card 1', description: 'Description for Card 1' },
  { id: 21, title: 'Card 2', description: 'Description for Cardz 2' },
  { id: 31, title: 'Card 1', description: 'Description for Cardc 1' },
  { id: 14, title: 'Card 1', description: 'Description for Card 1' },
  { id: 25, title: 'Card 2', description: 'Description for Card 2' },
  { id: 16, title: 'Card 1', description: 'Description for Card 1' },
  { id: 27, title: 'Card 2', description: 'Description for Card 2' },
  { id: 18, title: 'Card 1', description: 'Description for Card 1' },
  { id: 29, title: 'Card 2', description: 'Description for Card 2' },
  // Add more cards as needed
];


export default function ViaItems({DATA, SEARCH, RETURN, REFRESH}) {

    const itemx = DATA.data ? DATA.data : []

    const [onData, setonData] = useState(itemx);

    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedData, setsortedData] = useState(cardsData);
  
    useEffect(() => {

        const searching = String(SEARCH).toLowerCase()
        
        const filtereds = itemx.filter(i =>   
            Object.values(i).some(e =>
            String(e).toLowerCase().includes(searching.toLowerCase())
            )
        );

        setonData(filtereds);

    }, [SEARCH,DATA]);
  
    useEffect(() => {

        const sorted = [...onData].sort((a, b) => {
            if (sortOrder === 'asc') {
            return String(a.title).localeCompare(String(b.title));
            } else {
            return String(b.title).localeCompare(String(a.title));
            }
        });

        setsortedData(sorted);

    }, [onData, sortOrder]);
  
    const handlePageChange = (event, value) => {

        setPage(value);

    };
  
    const handleSort = () => {
        
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

    };
  

    const cardsPerPage = 5;
    const totalPages = Math.ceil(sortedData.length / cardsPerPage);
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = sortedData.slice(startIndex, endIndex);
  
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <button onClick={handleSort}>Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}</button>
            </Box>
          </Grid>
          {paginatedCards.map((i) => (
            <Grid item xs={12} sm={6} key={i.id}>

                <Card sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column',minWidth: 251  }}>

                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {i.appName}
                            </Typography>
                            <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary' }} >
                                {i.description}
                            </Typography>
                        </CardContent>

                        <Box sx={{ display: 'flex',  alignItems: 'center', pl: 1, pb: 1 }} justifyContent="flex-end">
                            <Button aria-label="previous">
                                edit <Iconify icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0.3 }}  />
                            </Button>
                        </Box>

                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ }}
                        image="/static/images/cards/live-from-space.jpg"
                        alt="Live from space album cover"
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
                {Fnc.JSONS(onData,true)}
      </div>
    );
  }