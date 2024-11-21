import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import './css/card-image-item.css';


export default function Card_Image_Item({}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box className="carousel" >
            <Box className="carousel__container">
                <Box className="carousel-item">
                    <img
                        className="carousel-item__img"
                        src="https://images.pexels.com/photos/708392/pexels-photo-708392.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                        alt="people"
                    />
                    <div className="carousel-item__details">
                        <div className="controls">
                        <h5 className="carousel-item__details--title">Descriptive Title</h5>
                        <h6 className="carousel-item__details--subtitle">Date and Duration</h6>
                        </div>
                    </div>
                </Box>
            </Box>
        </Box>


  );
}