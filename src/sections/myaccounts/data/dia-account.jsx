// DialogComponent.js
import React, { useState, useEffect } from 'react';

import { Calculate } from 'src/hooks/formula-calculations'

import {
        Dialog,
        
        DialogTitle,
        DialogContent,
        Alert,
        DialogActions,
        DialogContentText,
        Button,
        Box, 
        Table, 
        TableHead, 
        TableRow, 
        TableCell, 
        TableBody,
        Accordion,
        AccordionSummary,
        Typography,
        AccordionDetails
      } from '@mui/material';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function ModalViewAccount({ onOpen, onClose, onData }) {

const i           = onData
const onMobile    = Fnc.OnMobile()

const defaultRAW = {
                      FOR:            "ALL",
                      STATUS:         'ACTIVE',
                      SORTBY:         'ALL',
                      SORT:           'DESC',
                      LIMIT:          100000,
                      SEARCH:         'ALL',
                      DATE:           'ALL',
                      APP:            'ALL',
                      CLUB:           'ALL',
                      ACCOUNT:        [i?.accountID],
                      PLAYER:         'ALL',
                      UPLINE:         'ALL',
                    }
const [rawREFRESH,  setrawREFRESH]        = useState(0)
const [rawFETCH,  setrawFETCH_ACC]        = useState([]);

const fetchACCOUNT    = RawFetch(rawFETCH,rawREFRESH,'recordsnew')

const sortACCOUNT = fetchACCOUNT?.data?.sort((a, b) => a?.dateClose - b?.dateClose);


 useEffect(()=>{
    setrawFETCH_ACC(defaultRAW)
    setrawREFRESH(Fnc.numRandom())
 },[i])

  return (
    <Dialog open={onOpen} fullWidth maxWidth='sm'>

      <DialogTitle style={{marginTop:'5px'}}>
         <p style={{fontSize:'11px', color:'lightgray', marginBottom:'-3px'}}>
         ACCOUNT ID: 
         </p>
         <span style={{fontSize:'20px'}}>{i?.accountID}</span>



          <Box component="section" sx={{ p: 1, border: '1px dashed #97599A', fontSize: onMobile ? '11px' : '12px'}}>

                <p >
                  <span style={{color:'lightgray'}}>
                  Nickname: 
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px',color:'whitesmoke'}}>
                    {i?.accountNick}
                  </span>
                </p>

                <p style={{marginTop:'-5px'}}>
                  <span style={{color:'lightgray'}}>
                  Application: 
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px', color:'whitesmoke'}}>
                    {i?.appName}
                  </span>
                </p>

                <p style={{marginTop:'-5px'}}>
                  <span style={{color:'lightgray'}}>
                  Clubs: 
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px', color:'whitesmoke'}}>
                    {
                      i?.list_clubNames?.length > 0
                      ?
                      i?.list_clubNames?.replace(',',', ')
                      :
                      'No club found'
                    }
                  </span>
                </p>

                <p style={{marginTop:'-5px'}}>
                  <span style={{color:'lightgray'}}>
                  Recorded: 
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px', color:'whitesmoke'}}>
                    {
                      i?.recorded_first != i?.recorded_last ?
                      Fnc.dateText(i?.recorded_first) + ' - ' +Fnc.dateText(i?.recorded_last)
                      :
                      !Fnc.isNull(i?.recorded_last)
                      ?
                      Fnc.dateText(i?.recorded_last)
                      :
                      'No record found'
                    }
                  </span>
                </p>

                <p style={{marginTop:'-5px'}}>
                  <span style={{color:'lightgray'}}>
                  Status: 
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px', color:'whitesmoke'}}>
                    {i?.accountStatusLabel}
                  </span>
                </p>

          </Box>

      </DialogTitle>

      <DialogContent>
        <DialogContentText component="section">


          <Accordion size='small' disabled={!fetchACCOUNT?.load || sortACCOUNT?.length == 0}>
            <AccordionSummary sx={{fontSize:'12px', height:'10px', minHeight: 35,}} >
              {
                !fetchACCOUNT?.load
                ?
                'Loading...'
                :
                sortACCOUNT?.length > 0
                ?
                'Records'
                :
                'No records found'
              }
            </AccordionSummary>
            <AccordionDetails>
              <Table size='small'  sx={{marginTop:'-30px'}}>

                  <TableHead>
                    
                    <TableRow >
                      <TableCell style={{fontSize:'10px'}}>
                        Date
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}}>
                        Club
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Points
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Bonus
                      </TableCell>
                      <TableCell style={{fontSize:'10px'}} align='center'>
                        Player Result 
                      </TableCell>
                    </TableRow>

                  </TableHead>

                  <TableBody>
                    {
                      sortACCOUNT?.map((e,index)=>{
                        return <TableRow key={index}>

                                  <TableCell style={{fontSize:'9.5px'}}>
                                    <p style={{color:'darkgray'}}>{e?.dateOpen} to</p>
                                    <p style={{marginTop:'-14px'}}>{e?.dateClose}</p>
                                  </TableCell>
                                  <TableCell style={{fontSize:'9.5px'}}>
                                    <p style={{color:'darkgray',fontSize:'8px'}}>{e?.appName}</p>
                                    <p style={{marginTop:'-12px'}}>{e?.clubName}</p>
                                  </TableCell>
                                  <TableCell style={{fontSize:'9.5px'}} align='right'>
                                    {e?.total_points_usd} USD
                                  </TableCell>
                                  <TableCell style={{fontSize:'9.5px'}} align='right'>
                                    {e?.total_bonus_usd} USD
                                  </TableCell>
                                  <TableCell style={{fontSize:'9.5px'}} align='right'>
                                    {e?.total_playerresult} USD
                                  </TableCell>
                              </TableRow>
                      })
                    }
                  </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>

              <Table size='small' >

                <TableHead>
                  
                  <TableRow>
                    <TableCell>

                    </TableCell>
                    <TableCell>

                    </TableCell>
                  </TableRow>

                </TableHead>

                <TableBody>
                 
                  <TableRow >
                    <TableCell sx={{fontSize:'12px'}}>
                        Total Points
                    </TableCell>
                    <TableCell align='right' sx={{fontSize:'12px'}}>
                        {i?.total_points_usd} USD
                    </TableCell>
                  </TableRow>

                  {
                    i?.total_win_usd != 0 && i?.total_win_usd != i?.total_points_usd &&
                  <TableRow>
                  <TableCell sx={{fontSize:'11px', color:'darkgray'}}>
                     &nbsp; &nbsp; &nbsp; Winnings :
                  </TableCell>
                  <TableCell align='right' sx={{fontSize:'11px', color:'darkgray'}}>
                      {i?.total_win_usd} USD
                  </TableCell>
                </TableRow>
                  }

                  {
                    i?.total_loss_usd != 0 && i?.total_loss_usd != i?.total_points_usd &&
                  <TableRow>
                  <TableCell sx={{fontSize:'11px', color:'darkgray'}}>
                  &nbsp; &nbsp; &nbsp; Losses:
                  </TableCell>
                  <TableCell align='right' sx={{fontSize:'11px', color:'darkgray'}}>
                      {i?.total_loss_usd} USD
                  </TableCell>
                </TableRow>
                  }

                  <TableRow >
                    <TableCell sx={{fontSize:'12px'}}>
                        Total Bonus
                    </TableCell>
                    <TableCell align='right' sx={{fontSize:'12px'}}>
                        {i?.total_bonus_usd} USD
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{fontSize:'12px'}}>
                        Bonus Percent
                    </TableCell>
                    <TableCell align='right' sx={{fontSize:'12px'}}>
                        {i?.total_bonuspercent} USD
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{fontSize:'12px'}}>
                        Player Results
                    </TableCell>
                    <TableCell align='right' sx={{fontSize:'12px'}}>
                        {i?.total_playerresult} USD
                    </TableCell>
                  </TableRow>


                </TableBody>
            </Table>

          {Fnc.JSONS(fetchACCOUNT,false)}
        </DialogContentText>

      </DialogContent>
    <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            <Button variant='standard' 
                    onClick={()=>onClose(false)} 
                    sx={{borderRadius:'0',width:'50%'}}
                    size='small'>
              CLOSE
            </Button>

    </DialogActions>
    </Dialog>
  );
}