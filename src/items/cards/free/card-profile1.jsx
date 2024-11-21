import * as React from "react";
import { Paper, Button, Grid, Typography, Box, Stack } from "@mui/material";

import './css/card-profile1.css';

export default function Card_Profile1({}) {

    return (
      <Box style={{color: "black"}}>
            <Stack className="card">
                <img src="https://i.imgur.com/oYiTqum.jpg" className="card__image" alt=""/>
                    <div className="card__overlay">
                        <div className="card__header">                   
                        <img className="card__thumb" src="https://i.imgur.com/7D7I6dI.png" alt="" />
                        <div className="card__header-text">
                            <h3 className="card__title">Jessica Parker</h3>            
                            <Typography sx={{marginTop:'-10px'}}>1 hour ago</Typography>
                        </div>
                        </div>
                        <p className="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?</p>
                    </div>
            </Stack>      
      </Box>
  );
}