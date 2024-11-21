import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack,Container } from "@mui/material";

import './css/card-descriptive.css';


export default function Card_Descriptive({}) {
    const [isHovered, setIsHovered] = useState(false);


    return (
        <Container className="card" >
            <Box className="card-image" >
                <img src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </Box>

            <Box class="card-text">

                    <Typography class="card-meal-type">
                        Délicieux Bénédicte
                    </Typography>

                    <Typography class="card-title" sx={{fontSize:'18px', fontWeight:'700'}}>
                        Délicieux Bénédicte
                    </Typography>
                    <p class="card-body">Eggs Benedict with hollandaise sauce, crispy bacon and an assortment of garden herbs.</p>
            </Box>

            <Box class="card-price">
                available!
            </Box>

        </Container>

  );
}