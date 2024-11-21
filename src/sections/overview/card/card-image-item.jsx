import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import './css/card-image-item.css';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export function Card_Image({onReceived}) {
    const [isHovered, setIsHovered] = useState(false);
    const i = onReceived.data
    return (
        <>
        <Box className="carousel" sx={{overflow:'hidden'}}>
            <Box className="carousel__container">
                <Box className="carousel-item">
                    <img
                        className="carousel-item__img"
                        src={'https://www.all-in-statistics.pro'+i.imageBackground}
                        alt="people"
                    />
                    <div className="carousel-item__details" style={{display: 'flex', flexDirection: 'column', justifyContent:'flex-end',}}>
                        <div style={{marginBottom:'20px'}}>
                            <h2>
                                {i.title}
                            </h2>
                            <h4  style={{marginTop:'-25px'}}>
                                {i.subtitle}
                            </h4>
                            <p style={{marginTop:'5px',color:'whitesmoke'}}>
                                {i.details}
                            </p>
                        </div>
                    </div>
                    <span style={{bottom:5, right:17, position:'absolute', fontSize:'11px'}}>Open on{Fnc.dateText(i.datestart)} until {Fnc.dateText(i.datestop)}</span>
                </Box>
            </Box>
            
        </Box>  
        </>


  );
}