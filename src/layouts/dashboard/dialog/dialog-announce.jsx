import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Divider,
  Card, CardContent , CardMedia , CardActionArea , CardActions  
 } from '@mui/material';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import Slider from 'react-slick';
import { Close } from '@mui/icons-material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import {DialogFullImage} from './dialog-image'

export function DialogFullAnnounce({OPEN,CLOSE,DATA}) {

  const itemx                 = DATA?.data
  const onMobile              = Fnc.OnMobile()

  const [onData, setonData]   = useState([]);
  const [open, setOpen]       = useState(false);
  const [viewImg, setviewImg] = useState({open: false, image: ''});
  const [loaded, setloaded]   = useState(false);
  const [onHello, setonHello] = useState(false);

  const [lastActivity, setLastActivity] = useState(Date.now());

  const uName       = JSON.parse( localStorage.getItem('slk-user') );
  const uAnno       = sessionStorage.getItem('slk-announce');


  const handleClose = () => {
    setOpen(false)
    CLOSE(false)
  };

  // Slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 2,
    centerPadding: "60px",
    autoplay: true,
    autoplaySpeed: 5500,
    //pauseOnHover: true,
    adaptiveHeight: true
  };

  const helloUser = () =>{
    setonHello(false)
    const T = setTimeout(() => {
      if(open == false){
        setonHello(true)
      }
    }, 2500); 
    return () => {
      clearTimeout(T);
    };
  }


  useEffect(()=>{
    if(OPEN == true){
        setOpen(true)
    } else {
        setOpen(false)  
    }
  },[OPEN])

  useEffect(()=>{
    if(DATA?.load && DATA?.tally > 0){
      setonData(DATA?.data)
      setloaded(true)
    } else {
      setonData([])
      setloaded(false)
    }
    helloUser()
  },[DATA?.load])

  useEffect(()=>{

    const handleUserActivity = () => {
      setLastActivity(Date.now()); 
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    const T = setTimeout(() => {
      if(open == false){
        setOpen(true)
      }
    }, 70000); 

    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      clearTimeout(T);
    };

  },[lastActivity])

  return (
    <div>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        sx={{
            '& .MuiDialog-paper': {
              backgroundColor: 'transparent', // Transparent dialog background
              boxShadow: 'none', // Remove default shadow
              borderRadius: '10px',
            },
          }}
      >
        <DialogTitle sx={{ position: 'absolute', top: 1, right: 1 }}>

          <Button onClick={handleClose} sx={{ color: 'white', zIndex:9999, display: onHello ? '' : 'none'}}>
            <Close fontSize="large" />
          </Button>

        </DialogTitle>

        <DialogContent sx={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor:'transparent', marginTop:'15px' }}>
          
          {
            loaded && onHello
            ?
          <Slider {...settings} style={{ width: onMobile ? '100%' : '60%', maxHeight: '100%' }}>
            {onData?.map((i, index) => {

              return <Card  key={index} sx={{   position: 'relative', 
                                                display: 'flex',    
                                                justifyContent: 'center', 
                                                maxHeight:'80vh',
                                                alignItems: 'center',   
                                                overflow: 'hidden', }} >

                          <CardActionArea style={{maxHeight:'80vh',minHeight:'300px'}}>

                                <CardMedia
                                  component="img"
                                  maxwidth='90vw' 
                                  minheight='100px'
                                  image={`${'https://www.all-in-statistics.pro'+i?.imageBackground}?${Math.random()}`}
                                  alt={i?.title}
                                  onClick={()=>setviewImg({open: true, image: `${'https://www.all-in-statistics.pro'+i?.imageBackground}?${Math.random()}`})}
                                />

                                <CardContent sx={{
                                        position: 'absolute',
                                        bottom: 20,
                                        left: 20,
                                        color: 'white',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        padding: '10px',
                                        borderRadius: '0px',
                                        minWidth: onMobile ? '90%' : '70%',
                                      }} >

                                    <Typography gutterBottom variant={onMobile ? "h6" : "h4"} component="div">
                                      {i?.title}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {i?.details}
                                    </Typography>
                                    {
                                      !Fnc.isNull(i?.link,0) &&
                                      <Button component="a"
                                              href={i?.link} 
                                              target="_blank"  
                                              rel="noopener noreferrer"  
                                              variant="contained"
                                              size="small"
                                              sx={{marginTop:'20px', marginBottom:'10px'}}  >
                                      {Fnc.isNull(i?.linkLabel,0) ? 'Go to link' : i?.linkLabel }
                                    </Button>
                                    }

                                </CardContent>

                          </CardActionArea>
                       
                    </Card >
            })}
          </Slider>
          :
          <div style={{textAlign:'center'}}>HI <br/>{!Fnc.isNull(uName?.lastname,0) ? (uName?.firstname+' '+uName?.lastname)?.toUpperCase() : uName?.nickname}</div>
          }

          {Fnc.JSONS(uName,false)}

        </DialogContent>

        <DialogActions >

        </DialogActions>

      </Dialog>
      <DialogFullImage DATA={viewImg} CLOSE={setviewImg} />
    </div>
  );
}

