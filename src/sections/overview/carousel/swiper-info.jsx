import { useState, useEffect } from 'react';

import { RawFetch } from 'src/hooks/raw/';

import Slider from 'react-slick';
import { 
        Button, 
        Paper, 
        Typography,
        Box,
        Card,
        CardContent,
        CardMedia,
        IconButton,

    } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
    Card_Product,
    Card_Profile1,
    Card_Face,
    Card_Hero,
    Card_Image_Item,
    Card_Image_Title,
    Card_Descriptive
  } from 'src/items/cards'

  import Card_Announce from '../cards/card-announce'

  import * as Fnc from 'src/hooks/functions'
  import * as Cls from 'src/hooks/classes'
import { size } from 'lodash';

export default function Swiper_Info({onReturned}) {
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 5000, // Set autoplay speed (in milliseconds)
    };

    const rawDEFAULTS                       = { FOR: "ALL", STATUS: 'ACTIVE', }

    const [rawRELOAD, setrawRELOAD]         = useState(1)  
    const [rawFETCHES,  setrawFETCHES]      = useState(rawDEFAULTS);

    const defaultANNOUNCE                   = RawFetch(rawFETCHES,rawRELOAD,'announcementlist')

    const seeANNOUNCE       = defaultANNOUNCE?.data?.filter((e)=> e.status == 0)
    const doubleANNOUNCE    = seeANNOUNCE.length == 1 ? seeANNOUNCE.concat(seeANNOUNCE) : seeANNOUNCE

    return (
        <Slider {...settings} style={{margin:'5px'}}>
            
            {doubleANNOUNCE?.map((i, index) => (
                <div key={index} >
                    <Card_Announce  onData={i} onReturning={onReturned}  />
                </div>
            ))}

        </Slider>
    );
};

