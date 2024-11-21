import { useState,useEffect } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import Typography from '@mui/material/Typography';

import { Icon } from '@iconify/react';


export default function ViaCardLabel({ DATA_EN, DATA_TO, DATA_RE }) {

    const EN = DATA_EN[0]

    function viewDetails(i){
        DATA_RE(i)
      };

  return (
    <>
<Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 18 }}>
  {              
      DATA_TO.map((i, index) => (

        <Grid item xs={4} sm={4} md={6} key={index}>
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader 
                    avatar={
                        <Avatar sx={{ bgcolor: 'transparent' }}>
                                <Icon icon="bitcoin-icons:exchange-outline" color='purple' width='60px' />
                        </Avatar>
                    }
                    action={
                                <Button sx={{ mt: 0, color: 'text.disabled', }}  size="small"
                                        endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' />}
                                        onClick={() => viewDetails({ modal: "Open", ...i, })}  >
                                    <span style={{color: "violet"}}> View </span>
                                </Button>
                    }
                    title={i[EN.title]}
                    subheader={i[EN.header]} />

                { EN.description = 0 ?
                <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Labels
                </Typography>
                </CardContent>
                : null
                }

                <CardActions disableSpacing>

                </CardActions>

            </Card>
    </Grid>

))

}
</Grid>
</>

  );
}