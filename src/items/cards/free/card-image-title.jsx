import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import './css/card-image-title.css';


export default function Card_Image_Title({}) {
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
        <Box className="carousel" >
            <figure className="image-block">
                <h1>The Beach</h1>
                <img src="https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="" />
                <figcaption>
                    <h3>
                        More Info
                    </h3>
                    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
                    <button>
                        More Info
                    </button>
                </figcaption>
            </figure>
        </Box>


  );
}