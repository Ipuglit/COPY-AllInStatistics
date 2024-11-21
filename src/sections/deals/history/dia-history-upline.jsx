// DialogComponent.js
import React, { useState, useEffect } from 'react';

import {
        Table, 
        TableHead, 
        TableRow, 
        TableCell, 
        TableBody,
      } from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export function DiaHistoryUpline({ onData }) {

const i           = onData

const onMobile    = Fnc.OnMobile()

 useEffect(()=>{

 },[i])

  return (
              <Table size='small'  sx={{marginTop:'5px'}}>

                  <TableHead>
                    
                    <TableRow >
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Rakeback
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Rebate
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Chiprate
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='left'>
                        Status
                      </TableCell>
                    </TableRow>

                  </TableHead>

                  <TableBody>
                    {
                      onData?.map((e,index)=>{
                        return <TableRow key={index}>

                                  <TableCell style={{fontSize:'9.5px', fontWeight: e?.statusLabel != 'Active' ? '' : '900'}} align='center'>
                                    {e?.rakeback} %
                                  </TableCell>

                                  <TableCell style={{fontSize:'9.5px'}} align='center'>
                                    {e?.rebate} %
                                  </TableCell>

                                  <TableCell style={{fontSize:'9.5px'}} align='center'>
                                    {e?.chiprate}
                                  </TableCell>

                                  <TableCell style={{fontSize:'10px', color: e?.statusLabel != 'Active' ? '#ff4554' : '#56fc72', fontWeight:'700'}} align='left'>
                                    <p>{e?.statusLabel != 'Active' ? 'Inactive' : 'Active'}</p>
                                    <p style={{fontSize:'9px',marginTop:'-14px',color:'gray', fontWeight:'0'}}>{Fnc.dateText(e?.stated)}</p>
                                  </TableCell>

                              </TableRow>
                      })
                    }
                  </TableBody>
              </Table>
  );
}