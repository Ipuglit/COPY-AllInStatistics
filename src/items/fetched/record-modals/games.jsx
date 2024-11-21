import { useState,useEffect } from 'react';

import React from 'react';
import {Button,
        Chip,
        Divider,
        Typography,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogContentText,
        DialogActions,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,} from '@mui/material/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { Icon } from '@iconify/react';


const letChip =(usd,val,fx,curr)=>{
    if( usd || Fnc.isNull(val,'Num') ){
        return <Chip variant='outlined' color={val == 0 ? "default" : "success"} style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={val+' USD'} size='small' />
    } else {
        return <>
                <Chip variant='outlined' color="success" style={{fontSize:'11px',marginBottom:'2px',borderRadius:'10%',height:'18px'}} label={Fnc.numUSD(val,fx)+' USD'} size='small' />
                <br/>
                <Chip variant='outlined' style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={val+' '+curr} size='small' /> 
               </>
    }
}

export default function ModalRecordGames({ openGames, setopenGames, dataGames }) {
    const i         = dataGames
    const isWinLoss = i.title == 'WIN/LOSS' ? true : false
    const isUSD     = i.fxCurrency == 'USD' ? true : false

  return (
    <Dialog open={openGames} onClose={() => setopenGames(false)} fullWidth>

        <DialogTitle style={{marginTop: '10px'}}>
            <Typography variant="h5" component="div" >
                {i.title} DATA
            </Typography>
            <Chip label={isWinLoss ? 'Total: '+Fnc.numUSD(i.sumWinLoss,i.fxUSD)+' USD' : 'USD: '+i.sumBonus} size='small' color="success" /> 
              {
                isWinLoss && !Fnc.isNull(i.sumWin,'Num') ? 
                  <Chip variant='outlined' style={{fontSize:'11px'}} label={'Win: '+Fnc.numUSD(i.sumWin,i.fxUSD)+' USD'} size='small' />
                : null
              }
              &nbsp;
              {
                isWinLoss && !Fnc.isNull(i.sumLoss,'Num') ? 
                    <Chip variant='outlined' style={{fontSize:'11px'}} label={'Loss: '+Fnc.numUSD(i.sumLoss,i.fxUSD)+' USD'} size='small' />
                : null
              }

              <Typography variant="caption" component="div" style={{marginTop:'10px'}}>
                {i.dateOpen} until  {i.dateClose}
              </Typography>

              <Typography variant="caption" component="div" style={{marginTop:'20px'}}>
                {i.appName}
              </Typography>

              <Typography variant="caption" component="div">
                Club: {i.clubName}
              </Typography>

              <Typography variant="caption" component="div" style={{marginTop:'10px'}}>
                Player ID: {i.playerID}
              </Typography>

              <Typography variant="caption" component="div">
                {Fnc.isNull(i.playerUser) ? <b style={{fontSize:'13px',color:'orange'}}>* No user</b> : i.playerUser }
              </Typography>

        </DialogTitle>

        <DialogContent >
            <Table size="small" aria-label="a dense table" sx={{border: '1px dashed gray'}}>
                <TableHead>
                    <TableRow>
                        <TableCell>GAME</TableCell>
                        <TableCell align="right">VALUE</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    <TableRow style={{marginBottom:'-20px'}}>
                        <TableCell style={{fontSize:'12.5px'}}>Others</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossOTHERWINLOSS : i.bonusOTHERBONUS,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>NLH (No-Limit Hold'em)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossNLH : i.bonusNLH,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>FLH (Fixed Limit Hold'em)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossFLH : i.bonusFLH,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>6+ (Six-Plus Poker)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossSIX : i.bonusSIX,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>PLO Hi (Pot Limit Omaha Hi)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossPLOHI : i.bonusPLOHI,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>PLO Hi/Lo (Pot Limit Omaha Hi-Lo)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossPLOHILO : i.bonusPLOHILO,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>FLO Hi (Fixed Limit Omaha Hi)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossFLOHI : i.bonusFLOHI,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>FLO Hi-Lo (Fixed Limit Omaha Hi-Lo)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossFLOHILO : i.bonusFLOHILO,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>Mixed (Mix Poker)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossMIXED : i.bonusMIXED,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>OFC (Open-face Chinese Poker)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossOFC : i.bonusOFC,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>MTT (Multi-Table Tournaments)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossMTT : i.bonusMTT,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>SNG (Sit'n Gos)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossSNG : i.bonusSNG,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                    <TableRow >
                        <TableCell style={{fontSize:'12.5px'}}>SPIN (Spin-and-Go)</TableCell>
                        <TableCell align="right">
                            {letChip(isUSD,isWinLoss ? i.winlossSPIN : i.bonusSPIN,i.fxUSD,i.fxCurrency)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'center'}}>
                <Button variant='outlined'  
                        sx={Cls.buttonClass('outlined','')}
                        style={{margin:'20px'}}
                        onClick={() => setopenGames(false)}
                        startIcon={<Icon icon="mdi:close-circle" />} >
                    Close
                </Button>
        </DialogActions>
    </Dialog>
  );
}