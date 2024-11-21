import React, { useEffect, useState } from 'react';

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TablePagination, TextField, Paper,
  Alert,
  Tooltip,
  Typography,
  Accordion, AccordionSummary, AccordionDetails,
  Checkbox
} from '@mui/material';

import {DialogGames} from '../index'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import { Calculate } from 'src/hooks/formula-calculations';

const TableHeader = [
                        { name: '',                value: 'increment',             align: 'center'},
                        { name: 'DATE',             value: 'dateClose',             align: 'left'},
                        { name: 'CLUB',             value: 'clubName',              align: 'left'},
                        { name: 'PLAYER',           value: 'playerID',              align: 'left'},
                        { name: 'UPLINE',           value: 'uplineID',              align: 'left'},
                        { name: 'AGENCY',           value: 'agencyID',              align: 'left'},
                        { name: 'DOWNLINE',         value: 'downlineID',            align: 'left'},
                        { name: 'DEAL',             value: 'rakeback',              align: 'left'},
                        { name: 'FX RATE',          value: 'fxUSD',                 align: 'left'},
                        { name: 'TOTAL POINTS',     value: 'total_points_usd',      align: 'right'},
                        { name: 'TOTAL BONUS',      value: 'total_bonus_usd',       align: 'right'},
                        { name: 'RESULT',           value: 'total_result',          align: 'right'},
                        { name: 'BONUS PERCENT',    value: 'total_bonuspercent',    align: 'right'},
                        { name: 'AGENCY ACTION',    value: 'total_agencyaction',    align: 'right'},
                        { name: 'AGENCY BONUS',     value: 'total_agencybonus',     align: 'right'},
                        { name: 'PLAYER RESULT',    value: 'total_playerresult',    align: 'right'},
                        { name: 'REMARKS',          value: 'remarks',               align: 'left'},
                        { name: 'STATED',           value: 'stated',                align: 'left'},
                    ]

export default function Table_Records({DATA,FILTER,CHECKED,ITEMS}) {

  const onMobile  = Fnc.OnMobile()

  const itemx     = DATA?.data
  const fil       = FILTER

  const [onData, setonData]             = useState([]);
  const [onCheck, setonCheck]           = useState([]);

  const [onViewPoints, setonViewPoints] = useState({open: false});

  const [order, setOrder]               = useState('asc');
  const [orderBy, setOrderBy]           = useState('name');
  const [page, setPage]                 = useState(0);
  const [rowsPerPage, setRowsPerPage]   = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChecked = (id) => {
    setonCheck((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) {
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  const MyTableSort = ({ value, children }) => {
    return (
            <TableSortLabel active={orderBy === value} 
                            direction={orderBy === value ? order : 'asc'}
                            style={{fontSize:'11px'}}
                            onClick={(event) => handleRequestSort(event, value)} >
            {children}
          </TableSortLabel>
          );
  };


  const dateStart       = new Date(fil?.DATEOPEN);
  const dateEnds        = fil?.DATECLOSE ? new Date(fil?.DATECLOSE) : new Date(); 
  const dateStatus      = fil?.DATEOPEN && fil?.DATECLOSE ? true : false

  const filterbyAPP     = fil?.APP?.length > 0 ? itemx?.filter(i => fil?.APP?.includes(i?.appID)) : itemx;

  const filterbyCLUB    = fil?.CLUB?.length > 0 ? filterbyAPP?.filter(i => fil?.CLUB?.includes(i?.clubID)) : filterbyAPP;

  const filterbyPLAYER  = fil?.PLAYER?.length > 0 ? filterbyCLUB?.filter(i => fil?.PLAYER?.includes(i?.playerID)) : filterbyCLUB;

  const filterbyLINES   = fil?.LINE?.length > 0 ? filterbyPLAYER?.filter(i => fil?.LINE?.includes(i?.uplineID) || fil?.LINE?.includes(i?.agencyID) || fil?.LINE?.includes(i?.downlineID) ) : filterbyPLAYER;

  const filterbyDATE = filterbyLINES?.filter(i => {
        const openDate = new Date(i?.dateOpen);
        const closeDate = new Date(i?.dateClose);
        return (openDate <= dateEnds && closeDate >= dateStart && closeDate <= dateEnds);
  });

  const filterMultiple = (dateStatus ? filterbyDATE : filterbyLINES)?.filter(i => {
      let matches = true;
      return matches;
  });

  const sortedRows = [...onData]?.sort((a, b) => {
    const compare = order === 'asc' ? 1 : -1;
    const parsedValue = parseFloat(a[orderBy]);
    if (!isNaN(parsedValue) && orderBy != 'dateOpen') {
      if(order === 'asc'){
        return parseFloat(a[orderBy]) - parseFloat(b[orderBy]) ;
      } else {
        return parseFloat(b[orderBy]) - parseFloat(a[orderBy]) ;
      }
    } else {
      return String(a[orderBy]).localeCompare(String(b[orderBy])) * compare;
    }
  });

  const toCalculate =(i)=>{
    return {
            bonus:          i?.total_bonus,
            points:         i?.total_points,
            pointsWin:      i?.total_win,
            pointsLoss:     i?.total_loss,

            rakeback:       i?.rakeback,
            rebate:         i?.rebate,
            chiprate:       i?.chiprate,
            fxCurrency:     /^[A-Za-z]+$/.test(i?.fxCurrency) ? i?.fxCurrency : 'USD',
            fxUSD:          Fnc.numCheck(i?.fxCurrency == 'USD' ? 1 : (i?.fxUSD > 0 ? i?.fxUSD : 1)),

            playerRake:     i?.playerRake,
            uplineRake:     i?.uplineRake,
            agencyRake:     i?.agencyRake,
            downlineRake:   i?.downlineRake,

            playerRebate:   i?.playerRebate,
            uplineRebate:   i?.uplineRebate,
            agencyRebate:   i?.agencyRebate,
            downlineRebate: i?.downlineRebate,

            playerChip:     i?.playerChiprate,
            uplineChip:     i?.agencyChipcut,
            agencyChip:     i?.agencyChipcut,
            downlineChip:   i?.downlineChipcut,
          }
    }

const renderFormula =(i,form)=>{
    const checkOverride = form == 'agencyactionFormula' && i?.override_agencyaction == 'true' ? true : form == 'agencybonusFormula' && i?.override_agencybonus == 'true' ? true : false
    return !checkOverride ? <>     
            
                <span style={{color:'gray'}}>
                    Formula: {String(checkOverride)}
                </span>
                <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                    {Calculate(toCalculate(i),i?.[form])?.formula}
                </p>
                <span style={{color:'gray'}}>
                    Operation:
                </span>
                <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                {Calculate(toCalculate(i),i?.[form])?.operation}
                </p>
            </> : 'Overriden'
}

  useEffect(()=>{
    const searching = String(fil?.SEARCH)?.toLowerCase()
    const filteredFinal = filterMultiple?.filter(i =>   
                                        Object?.values(i)?.some(e =>
                                          String(e)?.toLowerCase()?.includes(searching)
                                        )
                                      );
    setonData(filteredFinal)



  },[DATA])

  const checkedArray = onData?.filter((x) => onCheck?.includes(x?.id?.toString()));

  useEffect(() => {
    if(DATA?.load){
        CHECKED([])
        setonCheck([])
    }
  }, [DATA?.load == true]);

  useEffect(() => {
    CHECKED(checkedArray)
  }, [onCheck]);

  return (
    <Paper sx={{ width: '100%', p: 1 }}>
      <TableContainer >
        <Table aria-labelledby="tableTitle" size="small" >
          <TableHead>
            <TableRow>

            {
                TableHeader?.map((i,index)=>{
                    return  <TableCell key={index} align={i?.align}>
                                <MyTableSort value={i?.value} > 
                                {i?.name}
                                </MyTableSort>
                            </TableCell>
                })
            }

            </TableRow>
          </TableHead>
          <TableBody>
            {
            sortedRows?.length > 0
            ?
            sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((i, index) => {

                return <TableRow key={index} hover tabIndex={-1} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>

                <TableCell style={{fontSize:'11px', minWidth:'50px'}}>
                <Checkbox checked={onCheck?.includes(i?.id)}
                          onChange={() => handleChecked(i?.id)}
                        />
                </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'140px'}}>

                                  <p style={{color:'gray'}}>{Fnc.dateText(i?.dateOpen)} to</p>
                                  <p style={{marginTop:'-13px'}}>
                                    {Fnc.dateText(i?.dateClose)}
                                  </p>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'140px'}}>
                                  <p style={{fontSize:'10px', marginBottom:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                    {i?.appName}
                                  </p>
                                  <p>{i?.clubName}</p>
                                  <p style={{fontSize:'10px', marginTop:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                    ID: {i?.clubID}
                                  </p>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'140px'}}>
                    {
                        !Fnc.isNull(i?.playerID,0)
                        ?
                        <>
                                  <p style={{fontSize:'10px', marginBottom:'-13px', color: Fnc.isNull(i?.playerUserID,0) ? '#f57c00' : 'gray'}}>
                                    {!Fnc.isNull(i?.playerUserID,0) ? (!Fnc.isNull(i?.playerUserName) ? i?.playerUserName : i?.playerUserNick) : 'No User'}
                                  </p>
                                  <p>ID: {i?.playerID}</p>
                                  <p style={{fontSize:'10px', marginTop:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                    {i?.playerNick}
                                  </p>
                        </>
                        :
                        <p style={{fontSize:'10px', color: 'gray'}}>No player</p>
                    }
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'140px'}}>
                    {
                        !Fnc.isNull(i?.uplineID,0)
                        ?
                        <>
                                  <p style={{fontSize:'10px', marginBottom:'-13px', color: Fnc.isNull(i?.uplineUserID,0) ? '#f57c00' : 'gray'}}>
                                    {!Fnc.isNull(i?.uplineUserID,0) ? (!Fnc.isNull(i?.uplineUserName) ? i?.uplineUserName : i?.uplineUserNick) : 'No User'}
                                  </p>
                                  <p>ID: {i?.uplineID}</p>
                                  <p style={{fontSize:'10px', marginTop:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                    {i?.uplineNick}
                                  </p>
                        </>
                        :
                        <p style={{fontSize:'10px', color: 'gray'}}>No upline</p>
                    }
              </TableCell>


              <TableCell style={{fontSize:'11px', minWidth:'140px'}}>
                    {
                        !Fnc.isNull(i?.agencyID,0)
                        ?
                        <>
                                  <p style={{fontSize:'10px', marginBottom:'-13px', color: Fnc.isNull(i?.agencyUserID,0) ? '#f57c00' : 'gray'}}>
                                    {!Fnc.isNull(i?.agencyUserID,0) ? (!Fnc.isNull(i?.agencyUserName) ? i?.agencyUserName : i?.agencyUserNick) : 'No User'}
                                  </p>
                                  <p>ID: {i?.agencyID}</p>
                                  <p style={{fontSize:'10px', marginTop:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                    {i?.agencyNick}
                                  </p>
                        </>
                        :
                        <p style={{fontSize:'10px', color: 'gray'}}>No agency</p>
                    }
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}}>
                    {
                        !Fnc.isNull(i?.downlineID,0)
                        ?
                        <>
                                  <p style={{fontSize:'10px', marginBottom:'-13px', color: Fnc.isNull(i?.downlineUserID,0) ? '#f57c00' : 'gray'}}>
                                    {!Fnc.isNull(i?.downlineUserID,0) ? (!Fnc.isNull(i?.downlineUserName) ? i?.downlineUserName : i?.downlineUserNick) : 'No User'}
                                  </p>
                                  <p>ID: {i?.downlineID}</p>
                                  <p style={{fontSize:'10px', marginTop:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                    {i?.downlineNick}
                                  </p>
                        </>
                        :
                        <p style={{fontSize:'10px', color: 'gray'}}>No downline</p>
                    }
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}}>
                    <Tooltip title={<>
                                    <p style={{fontSize:'10px',color:'darkgray'}}>
                                        Player: 
                                        &nbsp;&nbsp;
                                        <span style={{float: 'right',color:'#f3e5f5'}}>{i?.playerID}</span>
                                    </p>
                                    <p style={{fontSize:'10px',marginTop:'-10px',color:'darkgray'}}>
                                        Club: 
                                        &nbsp;&nbsp;
                                        <span style={{float: 'right',color:'#f3e5f5'}}>{i?.clubName}</span>
                                    </p>
                                    <p style={{fontSize:'10px',marginTop:'-10px',color:'darkgray'}}>
                                        Upline: 
                                        &nbsp;&nbsp;
                                        <span style={{float: 'right',color:'#f3e5f5'}}>{i?.uplineID}</span>
                                    </p>
                                    <p style={{fontSize:'10px', marginTop:'10px',color:'darkgray'}}>
                                        Rakeback: 
                                        &nbsp;&nbsp;
                                        <span style={{float: 'right',color:'#f3e5f5'}}>{i?.rakeback}%</span>
                                    </p>
                                    <p style={{fontSize:'10px',marginTop:'-10px',color:'darkgray'}}>
                                        Rebate: 
                                        &nbsp;&nbsp;
                                        <span style={{float: 'right',color:'#f3e5f5'}}>{i?.rebate}%</span>
                                    </p>
                                    <p style={{fontSize:'10px',marginTop:'-10px',color:'darkgray'}}>
                                        Chiprate:
                                        &nbsp;&nbsp;
                                        <span style={{float: 'right',color:'#f3e5f5'}}>{i?.chiprate}</span>
                                    </p>
                                    </>}>
                        <div>
                            <p style={{fontSize: onMobile ? '12px' : '14px',fontWeight:'700'}}>
                                {i?.rakeback} / {i?.rebate}
                            </p>
                            <p style={{fontSize:'10px',marginTop:'-15px',color:'lightgray'}}>{i?.chiprate} Chiprate</p>
                        </div>
                    </Tooltip>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}}>
                    <Tooltip title={i?.fxProvider}>
                            <div>
                                    <p style={{fontSize:'10px', marginBottom:'-13px', color: 'gray'}}>
                                        {Fnc.dateText(i?.fxDate)}
                                    </p>
                                    <p style={{fontSize:onMobile? '11px' : '12px'}}>{i?.fxUSD} USD</p>
                                    {
                                        i?.fxCurrency != 'USD' &&
                                        <p style={{fontSize:'10px', marginTop:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                            per {i?.fxCurrency}
                                        </p>
                                    } 
                            </div>
                    </Tooltip>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'165px'}} align='right'>
                <div style={{cursor:'pointer'}} onClick={()=>setonViewPoints({...i, open: true, title: 'POINTS'})}>
                                    <p style={{fontSize:onMobile? '11px' : '12px', color:i?.total_points_usd < 0 ? '#ff4554' : ''}}>
                                        {i?.total_points_usd}  USD
                                    </p>
                                    {
                                        i?.fxCurrency != 'USD' &&
                                        <p style={{fontSize:'10px', marginTop:'-15px', color: 'darkgray'}}>
                                            {i?.total_points} {i?.fxCurrency}
                                        </p>
                                    }

                                    <p style={{fontSize:'10px', marginTop:'-10px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                        {i?.total_win} {i?.fxCurrency} WIN
                                    </p>
                                    <p style={{fontSize:'10px', marginTop:'-14px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                        {i?.total_loss} {i?.fxCurrency} LOSS
                                    </p>
                </div>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}} align='right'>
                <div style={{cursor:'pointer'}} onClick={()=>setonViewPoints({...i, open: true, title: 'BONUS'})}>
                                    <p style={{fontSize:onMobile? '11px' : '12px', color:i?.total_bonus_usd < 0 ? '#ff4554' : ''}}>
                                        {i?.total_bonus_usd}  USD
                                    </p>
                                    {
                                        i?.fxCurrency != 'USD' &&
                                        <p style={{fontSize:'10px', marginTop:'-15px', color: 'darkgray'}}>
                                            {i?.total_bonus} {i?.fxCurrency}
                                        </p>
                                    }
                </div>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}} align='right'>
                <Tooltip placement="top" title={renderFormula(i,'resultFormula')}>
                        <div style={{}}>
                                    <p style={{fontSize:onMobile? '11px' : '12px', color:i?.total_result < 0 ? '#ff4554' : ''}}>
                                        {i?.total_result}  USD
                                    </p>
                                    {
                                        i?.fxCurrency != 'USD' &&
                                        <p style={{fontSize:'10px', marginTop:'-15px', color: 'darkgray'}}>
                                            {(i?.total_result / i?.fxUSD).toFixed(2)} {i?.fxCurrency}
                                        </p>
                                    }
                        </div>
                </Tooltip>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}} align='right'>
                    <Tooltip placement="top" title={renderFormula(i,'bonuspercentFormula')}>
                        <div style={{}}>
                                            <p style={{fontSize:onMobile? '11px' : '12px', color:i?.total_bonuspercent < 0 ? '#ff4554' : ''}}>
                                                {(i?.total_bonuspercent*i?.fxUSD)?.toFixed(2)}  USD
                                            </p>
                                            {
                                                i?.fxCurrency != 'USD' &&
                                                <p style={{fontSize:'10px', marginTop:'-15px', color: 'darkgray'}}>
                                                    {i?.total_bonuspercent} {i?.fxCurrency}
                                                </p>
                                            }
                        </div>
                    </Tooltip>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}} align='right'>
                    <Tooltip placement="top" title={renderFormula(i,'agencyactionFormula')}>
                        <div style={{}}>
                                            <p style={{fontSize:onMobile? '11px' : '12px', color:i?.total_agencyaction < 0 ? '#ff4554' : ''}}>
                                                {i?.total_agencyaction}  USD
                                            </p>
                                            {
                                                i?.fxCurrency != 'USD' &&
                                                <p style={{fontSize:'10px', marginTop:'-15px', color: 'darkgray'}}>
                                                    {(i?.total_agencyaction * i?.fxUSD).toFixed(2)} {i?.fxCurrency}
                                                </p>
                                            }
                                                <p style={{fontSize:'9px', marginTop:'-10px', color: i?.override_agencyaction == 'true' ? '#f57c00' : 'darkgray'}}>
                                                    {i?.override_agencyaction == 'true' ? 'OVERRIDEN' : i?.agencybonusName}
                                                </p>
                        </div>
                    </Tooltip>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}} align='right'>
                    <Tooltip placement="top" title={renderFormula(i,'agencybonusFormula')}>
                        <div style={{}}>
                                            <p style={{fontSize:onMobile? '11px' : '12px', color:i?.total_agencybonus < 0 ? '#ff4554' : ''}}>
                                                {i?.total_agencybonus}  USD
                                            </p>
                                            {
                                                i?.fxCurrency != 'USD' &&
                                                <p style={{fontSize:'10px', marginTop:'-15px', color: 'darkgray'}}>
                                                    {(i?.total_agencybonus * i?.fxUSD).toFixed(2)} {i?.fxCurrency}
                                                </p>
                                            }
                                                <p style={{fontSize:'9px', marginTop:'-10px', color: i?.override_agencybonus == 'true' ? '#f57c00' : 'darkgray'}}>
                                                    {i?.override_agencybonus == 'true' ? 'OVERRIDEN' : i?.agencybonusName}
                                                </p>
                        </div>
                    </Tooltip>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}} align='right'>
                    <Tooltip placement="top" title={renderFormula(i,'playerresultFormula')}>
                        <div style={{}}>
                                            <p style={{fontSize:onMobile? '11px' : '12px', color:i?.total_playerresult < 0 ? '#ff4554' : ''}}>
                                                {i?.total_playerresult}  USD
                                            </p>
                                            {
                                                i?.fxCurrency != 'USD' &&
                                                <p style={{fontSize:'10px', marginTop:'-15px', color: 'darkgray'}}>
                                                    {(i?.total_playerresult * i?.fxUSD).toFixed(2)} {i?.fxCurrency}
                                                </p>
                                            }
                                                <p style={{fontSize:'9px', marginTop:'-10px', color:'darkgray'}}>
                                                    {i?.playerresultName}
                                                </p>
                        </div>
                    </Tooltip>
              </TableCell>

              <TableCell style={{fontSize:'11px', minWidth:'150px'}} align='left'>
                    <p style={{fontSize:onMobile? '10px' : '11px', color:i?.remarks?.length == 0 ? 'gray' : ''}}>
                        {i?.remarks?.length == 0 ? 'None' : i?.remarks} 
                    </p>
              </TableCell>

              <TableCell style={{minWidth:'140px'}} align='left'>
                    <p style={{fontSize: '10px', color:  'darkgray'}}>
                        {i?.stated} 
                    </p>
              </TableCell>

            </TableRow>
              })
            :
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Alert severity="warning" icon={false}>
                  No record found
                </Alert>
              </TableCell>
            </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedRows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    <DialogGames DATA={onViewPoints} RETURN={setonViewPoints} GAMES={ITEMS?.GAMES} />

    </Paper>
  );
}
