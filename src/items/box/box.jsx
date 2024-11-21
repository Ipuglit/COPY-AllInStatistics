import { useState, useEffect } from 'react';
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import Iconify from 'src/components/iconify';

import './box.css';


export function Item_Box({}) {
    const [isHovered, setIsHovered] = useState(false);

   
    return (
            <div className="cube-container" style={{position:"fixed",bottom: 70, right: 70, zIndex: -999, height: 10, width: 10}}>
                <div className="cube">

                    <div className="face front">
                        <Iconify  icon="ph:club-bold"/>
                    </div>
                    <div className="face back">
                        <Iconify  icon="ph:iconoir:spades"/>
                    </div>
                    <div className="face right">
                        <Iconify  icon="ph:diamond-duotone"/>
                    </div>
                    <div className="face left">
                        <Iconify  icon="mdi:suit-hearts"/>
                    </div>
                    <div className="face top">
                        <Iconify  icon="hugeicons:joker"/>
                    </div>
                    <div className="face bottom">
                        <Iconify  icon="mdi:cat"/>
                    </div>

                </div>
            </div>
  );
}