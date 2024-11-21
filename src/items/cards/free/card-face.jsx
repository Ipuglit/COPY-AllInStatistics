import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import './css/card-face.css';


export default function Card_Face({}) {
    const [isHovered, setIsHovered] = useState(false);

    const fullFace = {
        background: `url('https://i.pinimg.com/736x/8f/a0/51/8fa051251f5ac2d0b756027089fbffde--terry-o-neill-al-pacino.jpg') left center no-repeat`,
        backgroundSize: isHovered ? '600px' : '300px',
        width: '300px',
        height: '300px',
        transition: 'background-size 0.5s ease-in-out', // Smooth transition
        cursor: 'pointer',
    };

   
    return (
        <Box className="card" 
                style={fullFace}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
            <Box >
                <Typography hidden={!isHovered}>
                    Hello
                </Typography>
            </Box>
        </Box>

  );
}