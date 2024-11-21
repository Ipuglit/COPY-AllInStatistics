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

export function DiaHistoryPlayer({ onData }) {

const i           = onData

const onMobile    = Fnc.OnMobile()

 useEffect(()=>{

 },[i])

  return (
              <Table size='small'  sx={{marginTop:'5px'}}>

                  <TableHead>
                    
                    <TableRow >
                      <TableCell style={{fontSize:'10px'}}>
                        Upline
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}}>
                        Agency
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Downline
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Deal
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

                                  <TableCell style={{fontSize:'9.5px'}}>
                                      {
                                        Fnc.isNull(e?.uplineID,0) && e?.uplineRake == 0
                                        ?
                                        <p style={{color:'gray'}}>None</p>
                                        :
                                        Fnc.isNull(e?.uplineID,0) && e?.uplineRake > 0
                                        ?
                                        <>
                                          <p style={{color:'gray'}}>None</p>
                                          <p style={{marginTop:'-14px',color:'gray'}}>{e?.uplineRake}% Rakeback</p>
                                        </>
                                        :
                                        <>
                                          <p>ID: {e?.uplineID}</p>
                                          <p style={{marginTop:'-14px',color:'darkgray'}}>{e?.uplineRake}% Rakeback</p>
                                        </>
                                      }
                                  </TableCell>
                                  <TableCell style={{fontSize:'9.5px'}}>
                                      {
                                        Fnc.isNull(e?.agencyID,0) && e?.agencyRake == 0
                                        ?
                                        <p style={{color:'gray'}}>None</p>
                                        :
                                        Fnc.isNull(e?.agencyID,0) && e?.agencyRake > 0
                                        ?
                                        <>
                                          <p style={{color:'gray'}}>None</p>
                                          <p style={{marginTop:'-14px',color:'gray'}}>{e?.agencyRake}% Rakeback</p>
                                        </>
                                        :
                                        <>
                                          <p>ID: {e?.agencyID}</p>
                                          <p style={{marginTop:'-14px',color:'darkgray'}}>{e?.agencyRake}% Rakeback</p>
                                        </>
                                      }
                                  </TableCell>
                                  <TableCell style={{fontSize:'9.5px'}}>
                                      {
                                        Fnc.isNull(e?.downlineID,0) && e?.downlineRake == 0
                                        ?
                                        <p style={{color:'gray'}}>None</p>
                                        :
                                        Fnc.isNull(e?.downlineID,0) && e?.downlineRake > 0
                                        ?
                                        <>
                                          <p style={{color:'gray'}}>None</p>
                                          <p style={{marginTop:'-14px',color:'gray'}}>{e?.downlineRake}% Rakeback</p>
                                        </>
                                        :
                                        <>
                                          <p>ID: {e?.downlineID}</p>
                                          <p style={{marginTop:'-14px',color:'darkgray'}}>{e?.downlineRake}% Rakeback</p>
                                        </>
                                      }
                                  </TableCell>
                                  <TableCell style={{fontSize:'9.5px', fontWeight: e?.statusLabel != 'Active' ? '' : '900'}} align='center'>
                                    {e?.rakeback} /  {e?.rebate}
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