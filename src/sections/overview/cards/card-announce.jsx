import React from 'react';
import { Card, Link, CardMedia, CardContent,CardActions, Typography, Box, Button } from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Card_Announce({onData,onReturning}) {

    const i = onData

    const onMobile = Fnc.OnMobile()

    const letFontSize=(i)=>{
        if(onMobile){
            return i =='sm' ? '9px' : i =='md' ? '11px' : i =='lg' ? '13px' : '13px'
        } else {
            return i =='sm' ? '10px' : i =='md' ? '12px' : i =='lg' ? '14px' : '14px'
        }
    }

    const letFontSize2=(i)=>{
        if(onMobile){
            return i =='sm' ? '9px' : i =='md' ? '11px' : i =='lg' ? '13px' : '11px'
        } else {
            return i =='sm' ? '10px' : i =='md' ? '12px' : i =='lg' ? '14px' : '12px'
        }
    }

    const letPosition=(i)=>{
        return !Fnc.isNull(i) ? i : 'center'
    }

    const letColor=(i)=>{
        return !Fnc.isNull(i) ? i : ''
    }

    const gotoLink =(i)=>{
        window.open(i, '_blank', 'noopener,noreferrer');
    }

  return (

        <Card sx={{ margin: '2px' }}>
            <CardMedia
                component="img"
                sx={{height: '255px'}}
                key={Math.random()}
                src={Fnc.ifImage(`${i.imageBackground}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+i.imageBackground}?${new Date().getTime()}`)}
                alt="image"
                onError={e => {
                    e.target.src = 'https://www.all-in-statistics.pro'+i?.imageBackground || 'https://www.all-in-statistics.pro/images/announcements/default_bg.jpg';
                  }}
                  onClick={()=>onReturning(i)}
            />

            <CardContent component={'div'} sx={{height: '165px',  background: 'linear-gradient(179.1deg, rgb(5,5,0) 10.3%, '+letColor(i?.bgColor)+' 220.3%)'}}>



                    <Typography sx={{   fontSize:letFontSize(i?.title_FontSize), 
                                        textAlign: letPosition(i?.title_Position),
                                        color:letColor(i?.title_Color), 
                                        fontWeight: '700', marginTop:'-5px',  }}>
                        {i.title.toUpperCase()}
                    </Typography>

                    {
                        i.subtitle &&
                        <Typography sx={{   fontSize:letFontSize2(i?.subtitle_FontSize),
                                            textAlign: letPosition(i?.subtitle_Position),
                                            color:'lightgray', lineHeight: '12px',
                                            }}>
                        {i.subtitle}
                    </Typography>
                    }

                    {
                        i.details &&
                    <Typography sx={{   fontSize:letFontSize2(i?.details_FontSize),
                                                        textAlign: letPosition(i?.details_Position),
                                                        color:'lightgray', lineHeight: '12.5px',
                                                        marginTop:'5px' }}>
                        {i.details}
                    </Typography>
                    }

                    {
                        i.link &&
                    <CardActions sx={{ display: 'flex', justifyContent: letPosition(i?.link_Position) }}>
                        <Button variant="contained"
                                onClick={()=>gotoLink(i.link)}
                                size='small'
                                sx={{ fontSize:letFontSize2(i?.link_FontSize), borderRadius: '0px', minWidth:'110px', zIndex: 10000 }}  >
                            {i.linkLabel ? i.linkLabel : 'Go to link'}

                        </Button>
                    </CardActions>
                    }


            <span style={{position:'absolute', bottom: 2, fontSize:'8px', color:'lightgray', right:15,}}>Until {Fnc.dateWord(i.datestop)}</span>

            </CardContent>
        </Card>

  );
}