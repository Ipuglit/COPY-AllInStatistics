import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import './css/card-hero.css';


export default function Card_Hero({}) {
    const [isHovered, setIsHovered] = useState(false);


    return (

        <Box >
            <div className="first hero">
                <img src="https://i.imgur.com/oYiTqum.jpg" alt="" className="image" />
                <div className="text"></div>
                <div className="logo">
                <img src="https://i.imgur.com/7D7I6dI.png" alt="" />
                </div>
                <div className="main-text">
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="date">
                <p>30.11.2022</p>
                </div>
                <div className="hero-btn">
                <a href="#">Learn More</a>
                </div>
            </div>
        </Box>



  );
}