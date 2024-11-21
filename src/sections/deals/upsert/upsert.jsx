import { useState, useEffect } from 'react';
import axios from 'axios';
import { Stack, Button, Container, Grid, Box, Typography, Card, MenuItem, TextField, Divider, Autocomplete  } from '@mui/material/';

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'

import * as Fnc from 'src/hooks/functions'
import * as Imp from 'src/hooks/importants'

import { imagetoRESIZE, imagetoUPLOAD } from 'src/hooks/imageupload'
import { Icon } from '@iconify/react';

import OnMobileScreen from 'src/items/screen/resize';

// ----------------------------------------------------------------------

export default function Upserting({TheFor,TheTitle}) {

    const dataView  = localStorage.getItem('slk-dataview')
    const OnMobile= OnMobileScreen();
    const [data, setData]               = useState({})
    const [submitting, setSubmitting]   = useState(false)


    const handleChange =(i,ii)=>{

        const newData = {...data,[ii]:i, status: 0}
        setData(newData)

    }

    const handleCheck =(i)=>{
        if( Fnc.isNull(data['clubID']) ){
            console.log('no  clubID')
        } else if(Fnc.isNull(data['playerID'])){
            console.log('no  playerID')
        } else if(Fnc.isNull(data['playerRake'])){
            console.log('no  playerRake')
        } else if(Fnc.isNull(data['uplineID'])){
            console.log('no  uplineID')
        } else if(Fnc.isNull(data['agencyID'])){
            console.log('no  agencyID')
        } else if(Fnc.isNull(data['agencyRake'])){
            console.log('no  agencyRake')
        } else {
            handleSubmit([i])
        }
    }

    async function handleSubmit(i) {
        console.log(UpsertDATA({JSONData: i}))
        try {
            
            const response = await axios.post(LinkUPLOAD('deals'),UpsertDATA({JSONData: i}));
            
            const feed =  response.data;
            console.log(feed)
    
          } catch (error) {
            console.log('error '+error)
          }
    }

    const handleUpload = async (i) => {
 
    };

    // ==================================================
    // =================== ++ FILTER ++ ===============================

    const handleUploadImage = async (event) => {

    };
    
    useEffect(() => {

    }, [data]); 



  return (
<>

<Container >

    <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 12, sm: 12, md: 24 }} style={{marginTop:"20px"}}>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>


            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Club"}
                value={data['clubID']}
                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                onChange={(e) => handleChange(e.target.value,'clubID')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Rakeback"}
                value={data['rakeback']}
                onChange={(e) => handleChange(e.target.value,'rakeback')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Rebate"}
                value={data['rebate']}
                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                onChange={(e) => handleChange(e.target.value,'rebate')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Player ID"}
                value={data['playerID']}
                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                onChange={(e) => handleChange(e.target.value,'playerID')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Player Rake"}
                value={data['playerRake']}
                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                onChange={(e) => handleChange(e.target.value,'playerRake')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Upline"}
                value={data['uplineID']}
                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                onChange={(e) => handleChange(e.target.value,'uplineID')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Agency"}
                value={data['agencyID']}
                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                onChange={(e) => handleChange(e.target.value,'agencyID')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
            <TextField 
                size='small' style={{fontSize:'10px'}}
                name="text"
                required
                label={"Agency Rake"}
                value={data['agencyRake']}
                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                onChange={(e) => handleChange(e.target.value,'agencyRake')} />
        </Grid>

        <Grid item xs={4} sm={4} md={3} padding={'10px'}>
                <Button variant='outlined' onClick={()=>handleCheck(data)}>
                    Submit
                </Button>
        </Grid>

        <Grid item xs={4} sm={4} md={15} padding={'10px'}>
            {
                <pre style={{fontSize:'9px'}}>{JSON.stringify(data,null,2)}</pre>
            }
        </Grid>

    </Grid>
</Container>
</>

  );
}

