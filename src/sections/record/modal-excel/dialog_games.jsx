import React, { useEffect, useState } from 'react';
import { 
        Button, 
        Dialog, 
        DialogActions, 
        DialogContent, 
        DialogTitle, 
        Grid, 
        IconButton, 
        Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
        TextField, 
        Box,
        Divider, 
        Autocomplete, 
        InputAdornment,
        Chip,
        Tooltip,
    } from '@mui/material';

import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function DialogGames({DATA,GAMES}){

    const i                             = DATA ? DATA : []

    const onMobile                      = Fnc.OnMobile()

    const [onOpen,setonOpen]            = useState(false) 

    const closeDialog = () => {
        setonOpen(false);
    };

    const whatGame = i?.title == 'POINTS' ? 'points_' : 'bonus_'

    const listGames =  GAMES?.map((x)=>{
                                        return {
                                                    [x?.gameAcro]:        i?.[whatGame+x?.gameAcro],
                                                }
                                        })

    useEffect(()=>{
        setonOpen(i?.open)
    },[i])

  return (
    <>
      <Dialog open={onOpen} fullWidth maxWidth='sm'>
        <DialogTitle>

            <span style={{fontWeight:'900', fontSize: onMobile ? '15px' : '20px'}}>
                {i?.title}
            </span>
            
            <IconButton style={{float:'right', marginTop:'-5px', marginRight:'-10px', display:'none'}} onClick={closeDialog} >
                <Icon icon="mingcute:close-fill"/>
            </IconButton>

        </DialogTitle>

        <Divider sx={{marginTop:'-10px', marginBottom:'-5px'}}/>

        <DialogContent>

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize: onMobile ? '11px' : '12px' }}>

                <Table size='small' sx={{width:'100%'}}>
                    <TableHead>
                    <TableRow>
                        <TableCell align="left" style={{color: 'darkgray'}}>GAME</TableCell>
                        <TableCell align="right" style={{color: 'darkgray'}}>VALUE</TableCell>
                        {
                        i?.fxCurrency != 'USD' &&
                        <TableCell align="right" style={{color: 'darkgray'}}>USD</TableCell>
                        }
                        
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {GAMES?.map((e,index) => {
                        const acr = e?.gameAcro == 'OTHERS' ? i?.[whatGame+'OTHER'] : i?.[whatGame+e?.gameAcro]
                        const game = e?.gameAcro == 'OTHERS' ? 'OTHER POKER GAMES' : <>{e?.gameName} ({e?.gameAcro})</> 
                        const inUSD = (acr * i?.fxUSD)?.toFixed(2)
                        return acr != 0 && <TableRow key={index}>
                                    <TableCell align="left" style={{border: 'none', fontSize: onMobile ? '10px' : '12px', color: acr != 0 ? '' : 'gray'}}>
                                        {game}
                                    </TableCell>
                                    <TableCell align="right" style={{border: 'none', minWidth: '170px',fontSize: onMobile ? '10px' : '12px', fontWeight: '900', color: acr < 0 ? '#ff4554' : acr == 0 ? 'gray' : ''}}>
                                        {acr} {i?.fxCurrency}
                                    </TableCell>
                                    {
                                    i?.fxCurrency != 'USD' &&
                                    <TableCell align="right" style={{border: 'none', minWidth: '170px',fontSize: onMobile ? '10px' : '12px', fontWeight: '900', color: inUSD < 0 ? '#ff4554' : acr == 0 ? 'gray' : 'lightgray'}}>
                                        {inUSD} USD
                                    </TableCell>
                                    }
                                </TableRow>
                    })}
                    </TableBody>
                </Table>

            </Box>
            {Fnc.JSONS(GAMES,false)}


        </DialogContent>

        <DialogActions sx={{padding:'15px', display: 'flex', justifyContent: 'center'}}>
                    <Button onClick={()=>closeDialog()} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}} variant='standard' loading='true' >
                        CLOSE
                    </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
