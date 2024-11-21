import React, { useState, useEffect } from 'react';

import {    
            Card, 
            CardContent, 
            CardMedia, 
            IconButton, 
            Button,
            Typography, 
            Grid, 
            Pagination, 
            Box, 
            TextField,
            Tooltip,
            Table, TableBody, TableCell, TableRow, Paper, TableContainer,
            Divider
        } from '@mui/material';

import {LinePercent,ModalViewAccount} from '../index'

import Iconify from 'src/components/iconify';
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function ViaList({DATA, SEARCH, RETURN, SORT, FILTER}) {

    const onMobile = Fnc.OnMobile()

    const itemx = DATA?.data ? DATA?.data : []

    const [onData, setonData]               = useState(itemx);

    const [onDialog, setonDialog]               = useState(false);
    const [onDialogData, setonDialogData]       = useState([]);

    const [page, setPage] = useState(1);
    const [sortedData, setsortedData] = useState(onData);
  

  const chartsACCOUNTS    = itemx?.reduce((a, i) => {
                              a.accountID.push(i.accountID);
                              a.accountNick.push(i.accountNick);
                              a.accountStated.push(i.accountStated);
                              a.accountStatusLabel.push(i.accountStatusLabel);
                              a.appName.push(i.appName);

                              a.total_bonus_usd.push(i.total_bonus_usd);
                              a.total_points_usd.push(i.total_points_usd);
                              a.total_win_usd.push(i.total_win_usd);
                              a.total_loss_usd.push(i.total_loss_usd);

                              a.total_agencyaction.push(i.total_agencyaction);
                              a.total_agencybonus.push(i.total_agencybonus);
                              a.total_playerresult.push(i.total_playerresult);
                              a.total_result.push(i.total_result);
                              a.total_bonuspercent.push(i.total_bonuspercent);

                              a.points_FLH.push(i.points_FLH);
                              a.points_MTT.push(i.points_MTT);
                              a.points_NLH.push(i.points_NLH);
                              a.points_OFC.push(i.points_OFC);
                              a.points_SIX.push(i.points_SIX);
                              a.points_SNG.push(i.points_SNG);
                              a.points_SPIN.push(i.points_SPIN);
                              a.points_FLOHI.push(i.points_FLOHI);
                              a.points_MIXED.push(i.points_MIXED);
                              a.points_PLOHI.push(i.points_PLOHI);
                              a.points_FLOHILO.push(i.points_FLOHILO);
                              a.points_PLOHILO.push(i.points_PLOHILO);
                              a.points_OTHER.push(i.points_OTHER);

                              a.bonus_FLH.push(i.bonus_FLH);
                              a.bonus_MTT.push(i.bonus_MTT);
                              a.bonus_NLH.push(i.bonus_NLH);
                              a.bonus_OFC.push(i.bonus_OFC);
                              a.bonus_SIX.push(i.bonus_SIX);
                              a.bonus_SNG.push(i.bonus_SNG);
                              a.bonus_SPIN.push(i.bonus_SPIN);
                              a.bonus_FLOHI.push(i.bonus_FLOHI);
                              a.bonus_MIXED.push(i.bonus_MIXED);
                              a.bonus_PLOHI.push(i.bonus_PLOHI);
                              a.bonus_FLOHILO.push(i.bonus_FLOHILO);
                              a.bonus_PLOHILO.push(i.bonus_PLOHILO);
                              a.bonus_OTHER.push(i.bonus_OTHER);
                              return a;
                            }, { accountID:           [], 
                                accountNick:          [], 
                                accountStated:        [], 
                                accountStatusLabel:   [], 
                                appName:              [], 

                                 total_bonus_usd:     [], 
                                 total_points_usd:    [], 
                                 total_win_usd:       [], 
                                 total_loss_usd:      [], 

                                 total_agencyaction:  [], 
                                 total_agencybonus:   [], 
                                 total_playerresult:  [], 
                                 total_result:        [], 
                                 total_bonuspercent:  [],

                                 points_FLH:  [],
                                 points_MTT:  [],
                                 points_NLH:  [],
                                 points_OFC:  [],
                                 points_SIX:  [],
                                 points_SNG:  [],
                                 points_SPIN:  [],
                                 points_FLOHI:  [],
                                 points_MIXED:  [],
                                 points_PLOHI:  [],
                                 points_FLOHILO:  [],
                                 points_PLOHILO:  [],
                                 points_OTHER:  [],
                                
                                 bonus_FLH:  [],
                                 bonus_MTT:  [],
                                 bonus_NLH:  [],
                                 bonus_OFC:  [],
                                 bonus_SIX:  [],
                                 bonus_SNG:  [],
                                 bonus_SPIN:  [],
                                 bonus_FLOHI:  [],
                                 bonus_MIXED:  [],
                                 bonus_PLOHI:  [],
                                 bonus_FLOHILO:  [],
                                 bonus_PLOHILO:  [],
                                 bonus_OTHER:  [],});
     


                                 
    useEffect(() => {

        const searching = String(SEARCH).toLowerCase()
        
        const theApps     = FILTER?.APPS?.map(i => i.value)
        const theClubs    = FILTER?.CLUBS?.map(i => i.value)
        const theAccts    = FILTER?.ACCTS?.map(i => i.value)

        const byApps      = theApps.length > 0? itemx?.filter((e)=> theApps.includes(e.appID)) : itemx
        const byClubs     = theClubs.length > 0 ? byApps.filter(i =>  theClubs.some(e => i?.list_clubIDs?.includes(e)) ) : byApps
        const byAccts     = theAccts.length > 0? byClubs?.filter((e)=> theAccts.includes(e.accountID)) : byClubs

        const filtereds   = byAccts.filter(i =>   
                                        Object.values(i).some(e =>
                                          String(e).toLowerCase().includes(searching)
                                        )
                                      );

        setonData(filtereds);

    }, [SEARCH,DATA]);


    useEffect(() => {

        const sorted = [...onData].sort((a, b) => {
            if (SORT === 'asc') {
            return String(a.total_points_usd).localeCompare(String(b.total_points_usd));
            } else {
            return String(b.total_points_usd).localeCompare(String(a.total_points_usd));
            }
        });
        
        setsortedData(sorted);

    }, [onData, SORT]);
  
    const handlePageChange = (event, value) => {
        setPage(value);
    };
  
    const cardsPerPage = 5;
    const sortDate = sortedData?.sort((a, b) => {
      if (a?.recorded_last && b?.recorded_last) {
        return new Date(b?.recorded_last) - new Date(a?.recorded_last);
      }
      else if (a?.recorded_last) {
        return -1;
      } else if (b?.recorded_last) {
        return 1;
      }
      else {
        return 0;
      }
    });
    const totalPages = Math.ceil(sortDate.length / cardsPerPage);
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = sortDate.slice(startIndex, endIndex);
  
    const tCell = { display: onMobile ? 'block' : 'table-cell', border:'none', marginTop: onMobile ? '-20px' :'0'  }

    const gainHIGHEST = (arr,key) => {

      const ndX = arr?.[key]?.reduce((mx, currentValue, index, array) => {
        return currentValue > array[mx] ? index : mx;
      }, 0);
  
      const toT = arr?.[key]?.reduce((s, v) => s + v, 0)
  
      const PN = arr?.[key]?.reduce((A, value) => {
            if (value > 0) {
              A.poS += value;
            } else {
              A.neG += value; 
            }
            return A;
      }, { poS: 0, neG: 0 });
  
      const suM = arr?.[key]?.[ndX] < 0 ? PN?.neG : PN?.poS
  
      const perC = eval( ( arr?.[key]?.[ndX] / suM) * 100 ).toFixed(1)
  
      return {  
              name: arr?.name?.[ndX], 
              value: arr?.[key]?.[ndX], 
              total: toT < 0 ? PN?.neG : PN?.poS, 
              exact: toT,
              positives: PN?.poS,
              negatives: PN?.neG,
              percent: parseFloat(perC) 
            };
    };




    const sumWin            = gainHIGHEST(chartsACCOUNTS,'total_win_usd')
    const sumLoss           = gainHIGHEST(chartsACCOUNTS,'total_loss_usd')
    const sumPoints         = gainHIGHEST(chartsACCOUNTS,'total_points_usd')
    const sumBonus          = gainHIGHEST(chartsACCOUNTS,'total_bonus_usd')
    const sumAgencyAction   = gainHIGHEST(chartsACCOUNTS,'total_agencyaction')
    const sumAgencyBonus    = gainHIGHEST(chartsACCOUNTS,'total_agencybonus')
    const sumPlayerResult   = gainHIGHEST(chartsACCOUNTS,'total_playerresult')

    const getValue = (solo,total)=>{

      const A = Fnc.isNull(solo) ? 0 : parseFloat(solo)
      const B = Fnc.isNull(total) ? 0 : parseFloat(total)

      const C = eval( (A / B) * 100 ).toFixed(2)

      return {total: B, value: A, percent: C == 0.00 ? 0 : A < 0 ? eval(C*-1) : C}

    }


    return (
      <div>

    <Table sx={{ width: '100%' }} size='small' >
        <TableBody>

          {paginatedCards.map((i,index) =>{



            return <TableRow key={index} sx={{ display: onMobile ? 'block' : '', p: 2, border: '1px dashed grey' }}>

                      <TableCell sx={{...tCell,minWidth:'150px', cursor:'pointer', '&:hover': { color: '#a88ce2' },}}
                                  onClick={()=>{setonDialogData(i),setonDialog(true)}}>
                        
                          <div style={{cursor:'pointer',}}>
                              <p style={{fontSize:onMobile ? '14px':'12px', fontWeight:'700', }}>
                                <span style={{color:'gray', }}>ID: </span>
                                &nbsp;
                                {i.accountID}
                              </p>

                              <p style={{marginTop:'-15px',color:'lightgrey',fontSize:'11px'}}>
                                {i.accountNick}
                              </p>

                              <p style={{marginTop:'-10px',color:'grey',fontSize:'10px'}}>
                                 {Fnc.dateText(i.recorded_last) != 'Invalid Date' ? 'Last record: '+Fnc.dateText(i.recorded_last) : 'No records'}
                              </p>

                          </div>

                          <Divider style={{ display: !onMobile ? 'none' : '', marginTop:'-5px', marginBottom:'25px', fontSize: '11.5px' }}>{i.appName} Clubs</Divider>
                      
                      </TableCell>

                      <TableCell sx={{...tCell,minWidth:'160px'}}>

                        <p style={{display: onMobile ? 'none' : '',}}>
                          <span style={{color:'lightgray', fontSize:'12px'}}>{i.appName}</span>
                        </p>
                        <div>

                          {
                            Fnc.isNull(i.list_clubNames) 
                            ?
                            <p style={{color:'gray', fontSize:'11px', marginTop:"-15px"}}>
                              No clubs 
                            </p>
                            :
                            Fnc.arrayfromComma(i.list_clubNames)?.map((e,index)=>{
                              return <p key={index} style={{color:'gray', fontSize:'11px', marginTop:"-15px"}}>
                                          {index+1}. {e.value}
                                      </p>
                            })
                          }

                        </div>
                        <Divider style={{ display: !onMobile ? 'none' : '', marginTop:'-10px', marginBottom:'15px', fontSize: '11.5px' }}>Values</Divider>
                          {}
                      </TableCell>

                      <TableCell  sx={{...tCell,minWidth:'250px'}}>

                          <LinePercent onData={{title: '', name: 'Points', value: getValue(i.total_points_usd,sumPoints.total)?.value, percent: getValue(i.total_points_usd,sumPoints.total)?.percent}} />
                          <LinePercent onData={{title: '', name: 'Winnings', value: getValue(i.total_win_usd,sumWin.total)?.value, percent: getValue(i.total_win_usd,sumWin.total)?.percent}} />
                          <LinePercent onData={{title: '', name: 'Losses', value: getValue(i.total_loss_usd,sumLoss.total)?.value, percent: getValue(i.total_loss_usd,sumLoss.total)?.percent}} />

                      </TableCell>
                  </TableRow>
          })}
        </TableBody>
      </Table>


        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />

          <ModalViewAccount onOpen={onDialog} onClose={(e)=>{setonDialog(e),setonDialogData([])}} onData={onDialogData} />

{Fnc.JSONS(sortedData,false)}
      </div>
    );
  }