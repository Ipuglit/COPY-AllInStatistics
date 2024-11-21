import React, {useEffect, useState} from 'react';
import {InputAdornment,Grid,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fn from '../functions/dialogs'

import { Icon } from '@iconify/react';

export default function Deals({ onClose, onData, onReturn }) {
    const itemx = onData

    const [value, setValue]   = useState(null);

    const handleRake = (i,ii) => {
     
        const isNumber = Fn.isNull(i,0) ? 0 : Fn.numHundred(i)

        if(ii == 'rakeback'){

            const convert =  100 - parseFloat(isNumber)

            setValue({
                        ...value, 
                        [ii]: Fn.numHundred(i), 
                        uplineRake: convert,
                        agencyRake: 0,
                        playerRake: 0,
                    });

        } else if(ii == 'playerRake'){

            const adde      =  parseFloat(value.uplineRake) + parseFloat(isNumber)
            const deduct    = 100 - adde

            setValue({
                        ...value, 
                        [ii]: Fn.numHundred(i), 
                        agencyRake: deduct,
                        playerRake: isNumber,
                    });

        } else {

            setValue({
                        ...value, 
                        [ii]: Fn.numHundred(i), 
                    });

        }

    };

    const isNegative =(i)=>{
      
        if(value){
            if(value.agencyRake < 0){
                return true
            } else if (Fn.isNull(value.rakeback,0) || Fn.isNull(value.playerRake,0)){
                return true
            } else {
                return false
            }
        } else {
            return false
        }


    }

    const onSubmit =(i)=>{
      onClose(false)
      onReturn({...value, what: 'deals'})
    }

    useEffect(() => {
        setValue({
                    rakeback:   itemx.rakeback ? itemx.rakeback : 0,
                    rebate:     itemx.rebate ? itemx.rebate : 0,
                    uplineRake: itemx.uplineRake ? itemx.uplineRake : 0,
                    agencyRake: itemx.agencyRake ? itemx.agencyRake : 0,
                    playerRake: itemx.playerRake ? itemx.playerRake : 0,
                    idd:        itemx.id,
                })
      }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px' }}>

              <p style={{marginTop:'-2px',color:'gray'}} >{itemx.appName}</p>
              <p style={{marginTop:'-15px'}}>{itemx.clubName}</p>

              {
                !Fn.isNull(itemx.playerID,0) 
                ?
                <p style={{marginTop:'-5px'}}>
                    Player ID: {itemx.playerID} &nbsp;
                    [{itemx.playerUserName ? itemx.playerUserName : itemx.playerUserName ? itemx.playerUserName : 'No user'}]
                </p>
                :
                <p style={{marginTop:'-5px', color:'orange'}}>Select a player </p>
              }

              {
                !Fn.isNull(itemx.uplineID,0) 
                ?
                <p style={{marginTop:'-15px'}}>
                    Upline ID: {itemx.uplineID} &nbsp;
                    [{itemx.uplineUserName ? itemx.uplineUserName : itemx.uplineUserNick ? itemx.uplineUserNick : 'No user'}]
                </p>
                :
                <p style={{marginTop:'-15px', color:'orange'}}>Select an upline</p>
              }

              {
                !Fn.isNull(itemx.agencyID,0) 
                ?
                <p style={{marginTop:'-15px',marginBottom:'-2px'}}>
                    Agency ID: {itemx.agencyID} &nbsp;
                    [{itemx.agencyUserName ? itemx.agencyUserName : itemx.agencyUserNick ? itemx.agencyUserNick : 'No user'}]
                </p>
                :
                <p style={{marginTop:'-15px', color:'orange',marginBottom:'-2px'}}>Select an agency</p>
              }


            </Box>

            <br/>

        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>

            <Grid item xs={4} sm={4} md={4}>
            <TextField  required
                        label={"Rakeback Deal"}
                        error={value && value.rakeback ? false : true}
                        value={value ? value.rakeback : 0}
                        fullWidth
                        onChange={(e)=>handleRake(e.currentTarget.value,'rakeback')}
                        InputProps={{
                          style: { textAlign: 'center',  },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon icon="fa6-solid:percent" />
                            </InputAdornment>
                          ),
                        }}
                        />
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
            <TextField  required
                        label={"Rebate Deal"}
                        value={value ? value.rebate : 0}
                        fullWidth
                        onChange={(e)=>handleRake(e.currentTarget.value,'rebate')}
                        InputProps={{
                          style: { textAlign: 'center',  },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon icon="fa6-solid:percent" />
                            </InputAdornment>
                          ),
                        }}
                        />
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
            <TextField  required
                        label={"Chip Rate"}
                        value={value ? value.chiprate : 0}
                        fullWidth
                        onChange={(e)=>handleRake(e.currentTarget.value,'chiprate')}
                        InputProps={{
                          style: { textAlign: 'center',  },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon icon="fa6-solid:percent" />
                            </InputAdornment>
                          ),
                        }}
                        />
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
            <TextField  required
                        label={"Player Rakeback"}
                        error={value && value.playerRake ? false : true}
                        value={value ? value.playerRake : ''}
                        fullWidth
                        onChange={(e)=>handleRake( e.currentTarget.value,'playerRake')}
                        InputProps={{
                          style: { textAlign: 'center',  },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon icon="fa6-solid:percent" />
                            </InputAdornment>
                          ),
                        }}
                        />
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
            <TextField  required
                        label={"Upline Rakeback"}
                        disabled
                        error={value && value.uplineRake ? false : true}
                        value={value ? value.uplineRake : 0}
                        fullWidth
                        onChange={(e)=>handleRake(e.currentTarget.value,'uplineRake')}
                        InputProps={{
                          style: { textAlign: 'center',  },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon icon="fa6-solid:percent" />
                            </InputAdornment>
                          ),
                        }}
                        />
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
            <TextField  required
                        label={"Agency Rakeback"}
                        disabled
                        error={ !value && isNegative()  ? true : false}
                        value={value ? value.agencyRake : 0}
                        fullWidth
                        onChange={(e)=>handleRake(e.currentTarget.value,'agencyRake')}
                        InputProps={{
                          style: { textAlign: 'center',  },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon icon="fa6-solid:percent" />
                            </InputAdornment>
                          ),
                        }}
                        />
            </Grid>

        </Grid>


            {
              //<pre>{JSON.stringify(value,null,2)}</pre>
            }
            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

            {
              value == undefined || isNegative()
              ?
              null
              :
              <Button variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined'  onClick={onClose}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}