import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import React from 'react';
import Slider from 'react-slick';

import Iconify from 'src/components/iconify';

import { Box, Typography } from '@mui/material';

export default function Carousel_News() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable auto sliding
    autoplaySpeed: 5000, // Duration between slides in milliseconds
    centerMode: true, // Enable centered mode
    centerPadding: '40px', // Space around the centered slide
    //nextArrow: <Iconify icon="ic:twotone-navigate-next" color={"#EE82EE"} />,
    //prevArrow: <Iconify icon="ic:twotone-navigate-next" color={"#EE82EE"} />,
  };

  return (
    <Box sx={{ width: '80%', margin: 'auto', height: '100%',alignItems:'center' }}>
      <Slider {...settings} style={{height: '65px'}}>
        <div>
          <Typography variant="h5" align="center">Info 1</Typography>
        </div>
        <div>
          <Typography variant="h5" align="center">Info 2</Typography>
        </div>
        <div>
          <Typography variant="h5" align="center">Info 3</Typography>
        </div>
      </Slider>
    </Box>
  );
};