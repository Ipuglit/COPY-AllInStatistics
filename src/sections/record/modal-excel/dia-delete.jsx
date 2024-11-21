import { useState, useEffect } from 'react';
import axios from 'axios';

import {TableContainer,Table,TableHead,TableRow,TableBody,TableCell,DialogContent,DialogContentText,DialogActions,Button,Box, Typography, Stack} from '@mui/material';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

import { Alerting, Informing } from 'src/items/alert_snack/'

import dayjs from 'dayjs';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'



export default function DataDelete({ onClose, onData, onItems, onReturn }) {
    
  const onMobile    = Fnc.OnMobile()

    const itemx = onData.data

    const [rowings, setRowings]                 = useState(null);
    const [onAlert, setonAlert]                 = useState({onOpen: 0, severity: '', message: ''});
    const [onSubmitting, setonSubmitting]       = useState(false);
    
    const checkCONVERT =(i)=>{
        return itemx.map((e,index)=>{
            return {    
                        RECORD:         'DELETE',
                        ROW:            '0',
                        ID:             e.id,
                        APPID:          e.appID,
                        CLUBID:         e.clubID,
                        PLAYERID:       e.playerID,
                        UPLINEID:       e.uplineID,
                        AGENCYID:       e.agencyID,
                        DOWNLINEID:     e.downlineID,
                        DATEOPENNED:    e.dateOpen,
                        DATECLOSED:     e.dateClose,
                        ID_PLAYERDEAL:  e.playerDeal
                    }
        })
    }


      async function onSubmit(i) {
        setonSubmitting(true)
        try {
            
          const response = await axios.post(UpsertLINK('records','upload'),UpsertDATA({JSONData: checkCONVERT(i)}));
          const feed =  response.data;

          if(feed.delRecord > 0){
            setonAlert({onOpen: Fnc.numRandom(), severity:'success', message: feed.delRecord +' Deleted!'})

            const T = setTimeout(() => {

                setonSubmitting(false)
                onReturn({row: itemx.ROW, what: onData.name})
                onClose(false)

            }, 2000);
            return () => clearTimeout(T);

          } else {

            setonAlert({onOpen: Fnc.numRandom(), severity:'error', message:'Please try again!'})
            setonSubmitting(false)

          }



        } catch (error) {
          setonAlert({onOpen: Fnc.numRandom(), severity:'error', message:'Please try again'})
          setonSubmitting(false)
        }

      }


  return (
    <>

    <Box sx={{alignItems:'center', fontSize: '11px', color:'gray', marginTop:'-20px' }}>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Note: Deleted records can be restored within 15 days...
    </Box>

    <DialogContent>

    <DialogContentText component="section">

      <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px',}}>
        <TableContainer component={'div'}>
            <Table aria-label="simple table">
                <TableHead >
                    <TableRow>
                        <TableCell sx={{ fontSize: onMobile ? '10px' : '11px' }}>DATE</TableCell>
                        <TableCell sx={{ fontSize: onMobile ? '10px' : '11px' }}>DETAILS</TableCell>
                        <TableCell sx={{ fontSize: onMobile ? '10px' : '11px' }}>RESULTS</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                {
                    itemx.map((e,index)=>{
                        return  <TableRow key={index}>
                                    <TableCell sx={{ fontSize: onMobile ? '10px' : '11px'  }}>
                                        {e.dateOpen} to<br/> {e.dateClose}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: onMobile ? '10px' : '11px' }}>
                                        <span style={{color:'lightgray'}}>Club: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span> {e.clubName}
                                        <br/>
                                        <span style={{color:'lightgray'}}>Player ID: &nbsp;</span> {e.playerID} <br/>
                                        <span style={{color:'gray'}}>
                                        {e.playerUserName ? e.playerUserName : e.playerUserNick ? e.playerUserNick : e.playerNick}
                                        </span>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: onMobile ? '10px' : '11px' }}>
                                        <span style={{color:'gray'}}>Agency Action: &nbsp;&nbsp;</span> {e.total_agencyaction} USD
                                        <br/>
                                        <span style={{color:'gray'}}>Agency Bonus: &nbsp;&nbsp;</span> {e.total_agencybonus} USD
                                        <br/>
                                        <span style={{color:'gray'}}>Player Result: &nbsp;&nbsp;&nbsp;&nbsp;</span> {e.total_playerresult} USD
                                    </TableCell>
                                </TableRow>
                    })
                }
                </TableBody>


                </Table>
        </TableContainer>

        {Fnc.JSONS(itemx,false)}
      </Box>

    </DialogContentText>
    </DialogContent>
    
    <DialogActions style={{paddingBottom:'30px',padding:'30px', marginTop:'-20px',display: 'flex', justifyContent: 'center'}}>

        {
            onSubmitting 
            ?
            <Button sx={{...Cs.buttonClass('contained','red'), width:'100%',borderRadius:'0', fontSize: onMobile ? '11px' : ''}} variant='contained'>
                DELETING RECORD...  
            </Button>
            :
            <>
            <Button sx={{...Cs.buttonClass('contained','red'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()} disabled={onSubmitting}>
                DELETE {itemx.length == 1 ? '1 ITEM' : itemx.length+' ITEMS'}
            </Button>

            <Button variant='standard' onClick={(e)=>onClose({open: false, data: [], name: ''})} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>
                CANCEL
            </Button>
            </>
        }

    </DialogActions>
    <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />
    </>
  );
}