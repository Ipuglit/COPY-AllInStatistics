// DialogComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Calculate } from 'src/hooks/formula-calculations'

import {Dialog,DialogTitle,DialogContent,Alert,DialogActions,DialogContentText,Button,Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, Paper, Checkbox, Chip} from '@mui/material';

import {LinePercent} from '../index'

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'



export default function ModalViewTop({ onData, returnData }) {

const arr         = onData?.data?.sort((a, b) => b?.total_playerresult - a?.total_playerresult)
const onOpen      = onData?.open   
const onMobile    = Fnc.OnMobile()

const [onItems, setonItems]       = useState([])
const [onNumber, setonNumber]     = useState(false);
const [sortBy, setsortBy]         = useState('desc');
const [orderBy, setOrderBy]       = useState('total_points_usd');

const tableHeader = [
                        {title: '#', value: 'increment'},
                        {title: onData?.title == 'ACCOUNT' ? 'Account ID' : onData?.title == 'CLUB' ? 'Club ID' : 'Name' , value: onData?.title == 'ACCOUNT' ? 'accountID' : onData?.data == 'CLUB' ? 'clubID' : 'appName'},
                        {title: 'Bonus', value: 'total_bonus_usd'},
                        {title: 'Points', value: 'total_points_usd'},
                        {title: 'Player Result', value: 'total_playerresult'},
                        {title: 'Earliest Record', value: 'recorded_first'},
                        {title: 'Latest Record', value: 'recorded_last'},
                      ]

const onClose =(i)=>{
  returnData({open: false, data: []})
}

const onSort =(i)=>{
  const isAsc = orderBy === i && sortBy === 'asc';
  setsortBy(isAsc ? 'desc' : 'asc');
  setOrderBy(i);
}

const sumPercent = (a,i)=>{
 
  const N     = onItems?.reduce((acc, item) => item[i] < 0 ? acc + item[i] : acc, 0);
  const P     = onItems?.reduce((acc, item) => item[i] > 0 ? acc + item[i] : acc, 0);
  const S     =  a == 0 ? 0 : a > 0 ? P : N
  const C     = (a < 0 ? '-' : '')
  const R     = eval( (a / S ) * 100).toFixed(2)

  return !isNaN(R) ? C+R : 0

}

const sumValue    = onItems?.map(e => ({
                                      ...e,
                                      percent_bonus:          sumPercent(e?.total_bonus_usd,'total_bonus_usd'),
                                      percent_points:         sumPercent(e?.total_points_usd,'total_points_usd'),
                                      percent_points_win:     sumPercent(e?.total_win_usd,'total_win_usd'), 
                                      percent_points_loss:    sumPercent(e?.total_loss_usd,'total_loss_usd'), 
                                      percent_playerresult:   sumPercent(e?.total_playerresult,'total_playerresult'), 
                                    }));

const onSorted = [...sumValue]?.sort((a, b) => {
  const compare = sortBy == 'asc' ? 1 : -1;
  const parsedValue = parseFloat(a[orderBy]);
  if (!isNaN(parsedValue) && orderBy != 'accountID' && orderBy != 'increment' && orderBy != 'recorded_first' && orderBy != 'recorded_last') {
    if(sortBy == 'asc'){
      return parseFloat(a[orderBy]) - parseFloat(b[orderBy]) ;
    } else {
      return parseFloat(b[orderBy]) - parseFloat(a[orderBy]) ;
    }
  } else {
    return String(a[orderBy]).localeCompare(String(b[orderBy])) * compare;
  }
});

 useEffect(()=>{
  setonItems(arr)
 },[arr])

  return (
    <Dialog open={onOpen} onClose={()=>onClose()} fullWidth maxWidth='md'>

      <DialogTitle style={{marginTop:'5px'}}>
         <p style={{fontSize:'14px', color:'lightgray', marginBottom:'-3px'}}>
         {onData?.title} LIST
         </p>
         <span style={{fontSize:'20px'}}>{arr?.accountID}</span>

         <div style={{float:'right', marginTop:'-24px'}}>
          <Chip label='Percent' size='small' sx={{fontSize:'10px', padding:'5px', backgroundColor: onNumber ? '' : '#9370db'}} onClick={()=>setonNumber(false)} />
            &nbsp;
          <Chip label='Values' size='small' sx={{fontSize:'10px', padding:'5px', backgroundColor: onNumber ? '#9370db' : ''}} onClick={()=>setonNumber(true)} />
         </div>

      </DialogTitle>

      <DialogContent>

              <Table size='small' >

                <TableHead>
                  
                  <TableRow>
                    {
                      tableHeader?.map((i,index)=>{
                        return <TableCell sx={{fontSize:'10px', fontWeight:'900', cursor:'pointer'}} 
                                          align='center'
                                          key={index}
                                          onClick={()=>i?.value != 'increment' && onSort(i?.value)}> 
                                  {i?.title?.toUpperCase()} 
                                </TableCell>
                      })
                    }
                  </TableRow>

                </TableHead>

                <TableBody>
                {onSorted?.map((i,index)=>{

                  const theID = onData?.title == 'ACCOUNT' ? 'ID: '+i?.accountID : onData?.title == 'CLUB' ? 'ID: '+i?.clubID : i?.appName

                  return  <TableRow key={index} >

                            <TableCell align='right' sx={{fontSize:'10px'}}>
                                {index + 1}
                            </TableCell>

                            <TableCell sx={{fontSize:'10px',minWidth:'130px'}}>
                              <Tooltip title={i?.accountStatusLabel}>
                                  {
                                    onData?.title == 'ACCOUNT'
                                    ?
                                    <div>
                                      <p>{theID}</p>
                                      <p style={{fontSize:'10px', marginTop:'-14px', color:i?.accountStatusLabel == 'Inactive' ? 'red' : 'gray'}}>
                                        {i?.accountNick}
                                      </p>
                                    </div>
                                    :
                                    onData?.title == 'CLUB'
                                    ?
                                    <div>
                                      <p>{i?.clubName}</p>
                                      <p style={{fontSize:'10px', marginTop:'-14px', color:i?.accountStatusLabel == 'Inactive' ? 'red' : 'gray'}}>
                                        {theID}
                                      </p>
                                    </div>
                                    :
                                    <div>
                                      <p>{theID}</p>
                                    </div>
                                  }

                              </Tooltip>
                            </TableCell>

                            <TableCell align='right' sx={{fontSize:'10px', color:'lightgray',minWidth:'130px'}}>
                            <p style={{fontWeight:'700', color: i?.total_bonus_usd < 0 ? '#ff4554' : i?.total_bonus_usd == 0 ? 'gray' : ''}}>
                              {
                                onNumber 
                                ?
                                i?.total_bonus_usd + ' USD'
                                :
                                i?.percent_bonus + '%'
                              }
                            </p>
                            </TableCell>

                            <TableCell align='right' sx={{fontSize:'10px', color:'lightgray',minWidth:'130px'}}>
                                <p style={{fontWeight:'700', color: i?.total_points_usd < 0 ? '#ff4554' : i?.total_points_usd == 0 ? 'gray' : ''}}>
                                  {
                                    onNumber 
                                    ?
                                    i?.total_points_usd + ' USD'
                                    :
                                    i?.percent_points + '%'
                                  }
                                </p>

                                <p style={{color:'gray', marginTop:'-9px'}}>
                                  {
                                    onNumber 
                                    ?
                                    i?.total_win_usd + ' USD Win'
                                    :
                                    i?.percent_points_win + '% Win'
                                  }
                                </p>


                                <p style={{color:'gray', marginTop:'-14px'}}>
                                  {
                                    onNumber 
                                    ?
                                    i?.total_loss_usd + ' USD Loss'
                                    :
                                    i?.percent_points_loss + '% Loss'
                                  }
                                </p>

                            </TableCell>

                            <TableCell align='right' sx={{fontSize:'10px', color:'lightgray',minWidth:'130px'}}>
                              <p style={{fontWeight:'700', color: i?.total_playerresult < 0 ? '#ff4554' : i?.total_playerresult == 0 ? 'gray' : ''}}>
                                    {
                                      onNumber 
                                      ?
                                      i?.total_playerresult + ' USD'
                                      :
                                      i?.percent_playerresult + '%'
                                    }
                              </p>
                            </TableCell>

                            <TableCell align='center' sx={{fontSize:'10px', color:'lightgray', width:'130px'}}>
                                  {
                                    i?.recorded_first
                                    ?
                                    Fnc.dateText(i?.recorded_first)
                                    :
                                    'No record'
                                  }
                            </TableCell>

                            <TableCell align='center' sx={{fontSize:'10px', color:'lightgray', width:'130px'}}>
                                  {
                                    i?.recorded_last
                                    ?
                                    Fnc.dateText(i?.recorded_last)
                                    :
                                    'No record'
                                  }
                            </TableCell>

                          </TableRow>
                })}

                </TableBody>
            </Table>

          {Fnc.JSONS(arr,false)}


      </DialogContent>
    <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center'}}>

            <Button variant='standard' 
                    onClick={()=>onClose()} 
                    sx={{borderRadius:'0',width:'50%', marginTop:'-20px'}}
                    size='small'>
              CLOSE
            </Button>

    </DialogActions>
    </Dialog>
  );
}