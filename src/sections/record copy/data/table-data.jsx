import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  InputBase,
  IconButton,
  TablePagination,
  TextField,
  Divider,
  InputAdornment,
  Fade,
  Chip,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText,
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Fn from '../functions/'

import { Alerting } from 'src/items/alert_snack/'

import { Icon } from '@iconify/react';

import { OnNothing, OnLoading, OnEdit } from 'src/items/menu/'

import { Patch } from '../'

import { Calculate } from 'src/hooks/formula-calculations'

const HEADS = [
                { id: 'status', label: '', minWidth: 50, sortable: false, filterable: false },
                { id: 'dateOpen', label: 'DATE', minWidth: 150, sortable: true, filterable: true  },
                { id: 'clubName', label: 'CLUB', minWidth: 160, sortable: true, filterable: true },
                { id: 'playerID', label: 'PLAYER', minWidth: 150, sortable: true, filterable: true },
                { id: 'uplineID', label: 'UPLINES', minWidth: 150, sortable: true, filterable: true },
                { id: 'agencyID', label: 'AGENCY', minWidth: 150, sortable: true, filterable: true },
                { id: 'downlineID', label: 'DOWNLINE', minWidth: 150, sortable: true, filterable: true },
                { id: 'rakeback', label: 'DEALS', minWidth: 150, sortable: true, filterable: true },
                { id: 'fxUSD', label: 'USD', minWidth: 150, sortable: true, filterable: true },
                { id: 'sumWinLoss', label: 'POINTS', minWidth: 270, sortable: true, filterable: true },
                { id: 'sumBonus', label: 'BONUS', minWidth: 270, sortable: true, filterable: true },
                { id: 'total_bonuspercent', label: 'BONUS %', minWidth: 180, sortable: true, filterable: true },
                { id: 'total_result', label: 'RESULT', minWidth: 180, sortable: true, filterable: true },
                { id: 'total_agencyaction', label: 'AGENCY ACTION', minWidth: 180, sortable: true, filterable: true },
                { id: 'total_agencybonus', label: 'AGENCY BONUS', minWidth: 180, sortable: true, filterable: true },
                { id: 'total_playerresult', label: 'PLAYER RESULT', minWidth: 180, sortable: true, filterable: true },
                { id: 'remarks', label: 'REMARKS', minWidth: 180, sortable: true, filterable: true },
                { id: 'stated', label: 'STATED', minWidth: 130, sortable: true, filterable: true },
              ];

export default function Table_Data({DATA, FILTER, CHECKED, ITEM}) {

  const itemx = DATA.data ? DATA.data : []
  const games = ITEM.GAMES

  const [onData, setonData]     = useState(itemx);
  const [onCount, setonCount]     = useState(0);

  const [checkedIDs, setCheckedIDs] = useState([]);

  const [onAlert, setonAlert]   = useState({onOpen: 0, severity: '', message: ''});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('dateOpen');

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const resultFormula=(i,form,what)=>{

    const defName = Fnc.isNull(i?.chiprate,0) ? 'STANDARD' : 'WITH CHIPRATE'
    const def   = ITEM.DEFAULTFORMULA.filter((e)=>e.type == what && e.name == defName)
    const equa    = def[0]?.formula
    return Calculate(i,form ? form : equa)

  }

  const handleCheckboxChange = (id) => {
    setCheckedIDs((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) {
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  const startDate = new Date(FILTER.DATEOPEN); // Start of date range
  const endDate = FILTER.DATECLOSE ? new Date(FILTER.DATECLOSE) : new Date();   // End of date range

  const filterbyAPP     = FILTER?.APP ? itemx?.filter(i => FILTER?.APP?.map((e,index)=>e.appID).includes(i.appID)) : itemx;

  const filterbyCLUB    = FILTER?.CLUB ? filterbyAPP?.filter(i => FILTER?.CLUB?.map((e,index)=>e.clubID).includes(i.clubID)) : filterbyAPP;

  const filterbyPLAYER  = FILTER?.PLAYER ? filterbyCLUB?.filter(i => FILTER?.PLAYER?.map((e,index)=>e.accountID).includes(i.playerID)) : filterbyCLUB;

  const filterbyUPLINE  = FILTER?.UPLINE ? filterbyPLAYER?.filter(i => FILTER?.UPLINE?.map((e,index)=>e.accountID).includes(i.uplineID)) : filterbyPLAYER;

  const filterbyDATE = filterbyUPLINE.filter(i => {
        const openDate = new Date(i.dateOpen);
        const closeDate = new Date(i.dateClose);
        return (openDate <= endDate && closeDate >= startDate && closeDate <= endDate);
  });

  const filterMultiple = filterbyDATE.filter(i => {
      let matches = true;
      return matches;
  });
  
  const sortedRows = [...onData].sort((a, b) => {
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

  // ====================== * ___ * ======================

    useEffect(() => {

      const searching = String(FILTER?.SEARCH).toLowerCase()
      const filteredFinal = filterMultiple.filter(i =>   
                                          Object.values(i).some(e =>
                                            String(e).toLowerCase().includes(searching)
                                          )
                                        );
      setonData(filteredFinal)
      setonCount(filteredFinal.length)

    }, [DATA,FILTER]);

    const checkedArray = onData.filter((item) => checkedIDs.includes(item.id.toString()));

    useEffect(() => {
      
      CHECKED(checkedArray)

    }, [checkedIDs]);

    useEffect(() => {

      if(DATA.load){
        CHECKED([])
        setCheckedIDs([])
      }

    }, [DATA?.load]);

    
    if( DATA.load && DATA.tally > 0 && onCount > 0){
        return (
          <>


          <TableContainer component={'section'}>

            <Table size='small' stickyHeader>
              <TableHead>
                <TableRow>
                  {HEADS.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontSize:'12px', cursor: column.sortable ? 'pointer' : '' }}
                      sortDirection={orderBy === column.id ? order : false}
                      onClick={() => handleSort(column.id)} >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((i,index) => {
                  return (
                    <TableRow key={i.id} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>
                      {HEADS.map((h) => {

                        const value = i[h.id];

                        const iUplineName   = i.uplineUserName ? i.uplineUserName : i.uplineUserNick ? i.uplineUserNick : null
                        const iPlayerName   = i.playerUserName ? i.playerUserName : i.playerUserNick ? i.playerUserNick : null
                        const iAgencyName   = i.agencyUserName ? i.agencyUserName : i.agencyUserNick ? i.agencyUserNick : null
                        const iDownlineName = i.downlineUserName ? i.downlineUserName : i.downlineUserNick ? i.downlineUserNick : null

                        const iForms = {  
                                          bonus:            i.sumBonus, 
                                          points:           i.sumWinLoss, 
                                          pointsWin:        i.sumWin,
                                          pointsLoss:       i.sumLoss,
                                          rakeback:         i.rakeback, 
                                          rebate:           i.rebate, 
                                          chiprate:         i.chiprate,
                                          playerRake:       i.playerRake, 
                                          uplineRake:       i.uplineRake,
                                          agencyRake:       i.agencyRake, 
                                          downlineRake:     i.downlineRake,
                                          playerChip:       i.playerChiprate,
                                          uplineChip:       i.uplineChipcut,
                                          agencyChip:       i.agencyChipcut,
                                          downlineChip:     i.downlineChipcut,
                                          playerRebate:     i.playerRebate,
                                          uplineRebate:     i.uplineRebate,
                                          agencyRebate:     i.agencyRebate,
                                          downlineRebate:   i.downlineRebate,
                                          fxUSD:            i.fxUSD,
                                          fxCurrency:       i.fxCurrency,
                                          playerDeal:       i.playerDeal,
                                        }

                        if(h.id == 'dateOpen'){

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'date',
                                                                  for:        'view',   
                                                                  dateOpen:    i.dateOpen,   
                                                                  dateClose:   i.dateClose  }}  />
 
                        } else if(h.id == 'clubName'){

                            return <Patch key={h.id} DATA={{     data:       i, 
                                                                  what:       'club',
                                                                  for:        'view',
                                                                  sub:        '',   
                                                                  clubID:     i.clubID,   
                                                                  clubName:   i.clubName,    
                                                                  appName:    i.appName }}  />

                        } else if(h.id == 'uplineID'){

                            return <Patch key={h.id} DATA={{      data:   i, 
                                                                  what:   'upline',
                                                                  for:    'view',   
                                                                  id:     i.uplineID,  
                                                                  name:   iUplineName,    
                                                                  rake:   i.uplineRake,
                                                                  chip:   i.uplineChipcut }}  />

                        } else if(h.id == 'playerID'){

                            return <Patch key={h.id} DATA={{      data:   i, 
                                                                  what:   'player',
                                                                  for:    'view',   
                                                                  id:     i.playerID,   
                                                                  name:   iPlayerName,    
                                                                  rake:   i.playerRake,
                                                                  chip:   i.playerChiprate }}  />

                        } else if(h.id == 'agencyID'){

                            return <Patch key={h.id} DATA={{      data:   i, 
                                                                  what:   'agency', 
                                                                  for:    'view',  
                                                                  id:     i.agencyID,   
                                                                  name:   iAgencyName,    
                                                                  rake:   i.agencyRake,
                                                                  chip:   i.agencyChipcut }}  />

                        } else if(h.id == 'downlineID'){

                            return <Patch key={h.id} DATA={{     data:   i, 
                                                                  what:   'downline',
                                                                  for:    'view', 
                                                                  id:     i.downlineID, 
                                                                  name:   iDownlineName,  
                                                                  rake:   i.downlineRake,
                                                                  chip:   i.downlineChipcut }}  />

                        } else if(h.id == 'rakeback'){

                            return <Patch key={h.id} DATA={{     data:       i,     
                                                                  what:       'deal',
                                                                  for:        'view',    
                                                                  rakeback:   i.rakeback,    
                                                                  rebate:     i.rebate, 
                                                                  chip:       i.chiprate }}  />

                        } else if(h.id == 'fxUSD'){

                            return <Patch key={h.id} DATA={{     data:       i, 
                                                                  what:       'fx',
                                                                  for:        'view',   
                                                                  currency:   i.fxCurrency,  
                                                                  usd:        i.fxUSD, 
                                                                  provider:   i.fxProvider, 
                                                                  date:       i.fxDate }}  />

                        } else if(h.id == 'sumWinLoss'){

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'points',
                                                                  for:        'view',
                                                                  games:      games,
                                                                  currency:   i.fxCurrency,
                                                                  usd:        i.fxUSD,  
                                                                  value:      i.sumWinLoss, 
                                                                  positive:   i.sumWin, 
                                                                  negative:   i.sumLoss}}  />

                        } else if(h.id == 'sumBonus'){

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'bonus', 
                                                                  for:        'view',
                                                                  games:      games,
                                                                  currency:   i.fxCurrency,
                                                                  usd:        i.fxUSD,  
                                                                  value:      i.sumBonus,   
                                                                  positive:   null, 
                                                                  negative:   null  }}  />

                        } else if(h.id == 'total_bonuspercent'){
                            
                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'bonuspercent', 
                                                                  for:        'view',
                                                                  currency:   i.fxCurrency,
                                                                  usd:        i.fxUSD,  
                                                                  value:          resultFormula(iForms,i.bonuspercentFormula,'BONUS PERCENT').result,
                                                                  formula:        resultFormula(iForms,i.bonuspercentFormula,'BONUS PERCENT').formula,
                                                                  formulaName:    i.bonuspercentName, 
                                                                  positive:   null, 
                                                                  negative:   null  }}  />
                                                                  
                        } else if(h.id == 'total_result'){

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'result', 
                                                                  for:        'view',
                                                                  currency:   i.fxCurrency,
                                                                  usd:        i.fxUSD,  
                                                                  value:          resultFormula(iForms,i.resultFormula,'RESULT').result, 
                                                                  formula:        resultFormula(iForms,i.resultFormula,'RESULT').formula,
                                                                  formulaName:    i.resultName,     
                                                                  positive:   null, 
                                                                  negative:   null  }}  />
                                                                  
                        } else if(h.id == 'total_agencyaction'){
                            
                            const letFORM = resultFormula(iForms,i.agencyactionFormula,'AGENCY ACTION')

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'agencyaction', 
                                                                  for:        'view',
                                                                  currency:   i.fxCurrency,
                                                                  usd:        i.fxUSD,  
                                                                  value:      letFORM.result,
                                                                  operation:  letFORM.operation,   
                                                                  formula:    letFORM.formula, 
                                                                  formulaName:    i.agencyactionName, 
                                                                  positive:   null,
                                                                  iForms:  iForms,
                                                                  negative:   null  }}  />

                        } else if(h.id == 'total_agencybonus'){

                            const letFORM = resultFormula(iForms,i.agencybonusFormula,'AGENCY BONUS')

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'agencybonus', 
                                                                  for:        'view',
                                                                  currency:   i.fxCurrency,
                                                                  usd:        i.fxUSD,  
                                                                  value:      letFORM.result,
                                                                  operation:  letFORM.operation,   
                                                                  formula:    letFORM.formula, 
                                                                  formulaName:    i.agencybonusName,
                                                                  positive:   null, 
                                                                  negative:   null  }}  />

                        } else if(h.id == 'total_playerresult'){

                            const letFORM = resultFormula(iForms,i.playerresultFormula,'PLAYER RESULT')

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'playerresult', 
                                                                  for:        'view',
                                                                  currency:   i.fxCurrency,
                                                                  usd:        i.fxUSD,  
                                                                  value:      letFORM.result,
                                                                  operation:  letFORM.operation,   
                                                                  formula:    letFORM.formula, 
                                                                  formulaName:    i.playerresultName, 
                                                                  positive:   null, 
                                                                  negative:   null  }}  />

                        } else if(h.id == 'stated'){
                          
                            return (
                              <TableCell key={h.id} align={h.align} style={{width:'140px'}}>
                                <p style={{fontSize:'12px',color:'gray'}}>{i.stated} </p> 
                              </TableCell>
                            );

                        } else if(h.id == 'status'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                 {
                                  //<OnEdit RETURN={(e)=> e == 'edit' ? handleDialogOpen(i,'UPLINES',i.id) : e == 'remove' ? handleDialogOpen(i,'REMOVEU',i.id,'REMOVEU') : ''}/>
                                 }
                                <Checkbox
                                  checked={checkedIDs.includes(i.id)}
                                  onChange={() => handleCheckboxChange(i.id)}
                                />
                              </TableCell>
                            );

                        } else {

                          return (
                            <TableCell key={h.id} align={h.align}>
                              {value}
                            </TableCell>
                          );

                        }

                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
              
            </Table>

          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[5, 25, 50]}
              component="div"
              count={onData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

          <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />
            {Fnc.JSONS(onData,false)}
          </>
        );

    } else if( onCount == 0 && DATA.load ){
    
        return  <>
                  <OnNothing LABEL='No record found...' />          
                </>;
    
      } else {
        
        return  <>
                  <OnLoading TYPE='table' />
                </>;
    
      }
}