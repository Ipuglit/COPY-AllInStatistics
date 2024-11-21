import { useState,useEffect } from 'react';

import React from 'react';
import axios from 'axios';

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
import * as Eq from 'src/hooks/calculations'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'
import {AlertSnack} from 'src/items/alert_snack'
import { Icon } from '@iconify/react';



export default function ModalRecordDelete({ openDelete, setopenDelete, dataDelete, isDeleted }) {

    const [onAlert, setonAlert]                   = useState({open:false,type:'',message:''});
    const [onDeleted, setonDeleted]               = useState(true);
    const [isSuccess, setisSuccess]               = useState(false);
    const i = dataDelete.length > 0 ?  dataDelete : []

    const OnAlerting =(open,type,message,time)=>{

        setonAlert({open:open,type:type,message:message})
        setonDeleted(false)
        const T = setTimeout(() => {
            setonAlert({open:false,type:'',message:''})
        }, time ? time : 1500);
        return () => clearTimeout(T);
  
    }

    const OnClosing =()=>{

        setopenDelete(false)
        isDeleted(isSuccess)
        setonDeleted(true)

    }

    async function submitDelete(e) {
        setisSuccess(false)
        const csvdatas = {
                            JSONType: 'RECORDS',
                            JSONData: i,
                        }

      try {

        const response = await axios.post(LinkUPLOAD(e),UpsertDATA(csvdatas));

        const feed =  response.data;

        OnAlerting(true,'success',feed.disrecord > 1 ? feed.disrecord+' records deleted!' : 'Record deleted!')
        setisSuccess(true)
      } catch (error) {
        OnAlerting(true,'error','Something went wrong! Error')
        console.log(error)
      }

    }
  
  return (

    <Dialog open={openDelete} fullWidth>

        <DialogTitle style={{marginTop: '10px'}}>

            <Typography variant="h5" component="div" >
                {
                    onDeleted 
                    ? 
                    "DELETE RECORD"
                    :
                    "RECORDS DELETED!"
                }

             
            </Typography>
            
        </DialogTitle>

        <DialogContent >

            <Table size="small" aria-label="a dense table" sx={{border: '1px dashed gray'}}>
                <TableHead>
                    <TableRow>
                        <TableCell>OPENNED</TableCell>
                        <TableCell>CLOSED</TableCell>
                        <TableCell>PLAYER</TableCell>
                        <TableCell>CLUB</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    {i.map((e,index) => (
                        <TableRow key={index} style={{marginBottom:'-20px'}}>

                            <TableCell style={{fontSize:'12.5px',maxWidth:'87px'}}>{Fnc.dateText(e.DATEOPENNED)}</TableCell>
                            <TableCell style={{fontSize:'12.5px',maxWidth:'87px'}}>{Fnc.dateText(e.DATECLOSED)}</TableCell>
                            <TableCell style={{fontSize:'12.5px'}}>
                                {
                                    !Fnc.isNull(e.PLAYERNAME) 
                                    ?
                                    <p style={{color: 'gray',fontSize:'11px',marginBottom:'-15px'}}>
                                        {e.PLAYERNAME}
                                    </p>
                                    :
                                    <p style={{color: 'gray',fontSize:'11px',marginBottom:'-15px'}}>
                                        * No player
                                    </p>
                                }
                                <p>ID: {e.PLAYERID}</p>
                                {
                                    !Fnc.isNull(e.PLAYERUSER) 
                                    ?
                                    <p style={{color: 'gray',fontSize:'11px',marginTop:'-15px'}}>
                                        {e.PLAYERUSER}
                                    </p>
                                    :
                                    <p style={{color: 'orange',fontSize:'11px',marginTop:'-15px'}}>
                                        * No user
                                    </p>
                                }
                            </TableCell>
                            <TableCell style={{fontSize:'12.5px'}}>
                                <p> {e.CLUB}</p>
                                    <p style={{color: 'gray',fontSize:'11px',marginTop:'-15px'}}>
                                    ID: {e.CLUBIDD}
                                    </p>
                            </TableCell>

                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </DialogContent>

        <DialogActions sx={{display: 'flex', justifyContent: 'center'}}>

                {
                onDeleted ? 

                        <Button variant='contained'  
                                sx={Cls.buttonClass('contained','red')}
                                style={{margin:'20px',marginTop:'-10px', marginRight:'-5px'}}
                                onClick={() => submitDelete('records')}
                                startIcon={<Icon icon="tabler:trash-x-filled" />} >
                            Delete
                        </Button>

                : 
                null 
                }

                        <Button variant='outlined'  
                                sx={Cls.buttonClass('outlined','')}
                                style={{margin:'20px', marginTop:'-10px'}}
                                onClick={() => OnClosing()}
                                startIcon={<Icon icon="mdi:close-circle" />} >
                            Close
                        </Button>
        </DialogActions>
    {
      onAlert.open ? 
      AlertSnack(onAlert.type,onAlert.message)
      :
      null
    }
    </Dialog>
  );
}