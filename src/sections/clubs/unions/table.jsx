import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputBase,
  IconButton,
  TablePagination,
  TextField,
  Divider,
  InputAdornment,
  Avatar,
  Chip,
  Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText,
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { OnNothing, OnLoading, OnEdit } from 'src/items/menu/'

import {Alerting} from 'src/items/alert_snack/'

import { Icon } from '@iconify/react';

const HEADS = [
                { id: 'id', label: '', minWidth: 30, sortable: false, filterable: false },
                //{ id: 'unionImageFull', label: 'IMAGE', minWidth: 110, sortable: true, filterable: true },
                { id: 'unionName', label: 'NAME', minWidth: 190, sortable: true, filterable: true },
                { id: 'unionType', label: 'TYPE', minWidth: 120, sortable: true, filterable: true },
                { id: 'appName', label: 'APPLICATION', minWidth: 190, sortable: true, filterable: true },
                { id: 'count_clubs', label: 'CLUBS', minWidth: 190, sortable: true, filterable: true },
                { id: 'unionStatusLabel', label: 'STATUS', minWidth: 190, sortable: true, filterable: true },
                { id: 'total_win', label: 'POINTS (WIN)', minWidth: 190, sortable: true, filterable: true },
                { id: 'total_loss', label: 'POINTS (LOSS)', minWidth: 190, sortable: true, filterable: true },
                { id: 'total_points', label: 'TOTAL POINTS', minWidth: 250, sortable: true, filterable: true },
                { id: 'total_bonus', label: 'TOTAL BONUS', minWidth: 250, sortable: true, filterable: true },
                { id: 'total_agencyaction', label: 'AGENCY ACTIONS', minWidth: 190, sortable: true, filterable: true },
                { id: 'total_agencybonus', label: 'AGENCY BONUS', minWidth: 190, sortable: true, filterable: true },
                { id: 'total_playerresult', label: 'PLAYER RESULTS', minWidth: 190, sortable: true, filterable: true },
                { id: 'recorded_first', label: 'EARLIEST RECORD', minWidth: 190, sortable: true, filterable: true },
                { id: 'recorded_last', label: 'LATEST RECORD', minWidth: 190, sortable: true, filterable: true },
              ];

export default function ViaTable_Unions({DATA, SEARCH, RETURN, ITEMS}) {

  const itemx = DATA.data ? DATA.data : []
  const games = ITEMS.GAMES

  const [onData, setonData]     = useState(itemx);
  const [onCount, setonCount]     = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('unionName');

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

  const sortedRows = [...onData].sort((a, b) => {
    const compare = order === 'asc' ? 1 : -1;
    const parsedValue = parseFloat(a[orderBy]);
    if (!isNaN(parsedValue) && orderBy != 'recorded_first' && orderBy != 'recorded_last') {
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

    const searching = String(SEARCH).toLowerCase()
    const filteredFinal = itemx.filter(i =>   
                                        Object.values(i).some(e =>
                                          String(e).toLowerCase().includes(searching)
                                        )
                                      );
    setonData(filteredFinal)
    setonCount(filteredFinal.length)

  }, [SEARCH,DATA]);

    if( DATA.load && DATA.tally > 0){
        return (
          <>


          <TableContainer component={Paper} >

            <Table stickyHeader  size='small'>
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

                        if(h.id == 'unionImageFull'){

                          return (
                            <TableCell key={h.id} align={h.align} >
                              <Avatar alt="image" 
                                      key={Math.random()}
                                      src={Fnc.ifImage(`${i.unionImageFull}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+i.unionImageFull}?${new Date().getTime()}`)}
                                      onError={(e) => { e.target.src = '/images/union/default.png'; }} />
                            </TableCell>
                          );
                          
                        } else if(h.id == 'unionStatusLabel'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <Chip icon={<Icon icon={i.unionStatusLabel == 'Active' ? "mdi:check-circle" : i.unionStatusLabel == 'Pending' ? "mdi:clock-outline" : "mdi:close-circle"}/>} 
                                    label={i.unionStatusLabel}
                                    variant={'outlined'} 
                                    size='small'
                                    sx={{ fontSize:'12px',}}
                                    color={i.unionStatusLabel == 'Active' ? "success" : i.unionStatusLabel == 'Pending' ? "warning" : "error" } />
                              </TableCell>
                            );

                          } else if(h.id == 'total_win' || h.id == 'total_loss' ){
                            
                            const onUSD = h.id == 'total_win' ? i.total_win_usd : i.total_loss_usd
                            const noUSD = h.id == 'total_win' ? i.total_win     : i.total_loss
                            const check = h.id == 'total_win' && i.total_win == 0 && i.total_win_usd == 0 
                                                  ? false   
                                                  : 'total_loss' && i.total_loss == 0 && i.total_loss_usd == 0
                                                  ? false : true

                            return (
                              <TableCell key={h.id} align={h.align}>
                                {
                                  check
                                  ?
                                  <>
                                  <Chip label={onUSD+' USD'} variant={'outlined'} size='small' sx={{border:'0px', fontSize:'12px', justifyContent:'flex-end', color: Fnc.isNull(value,0) ? 'gray' : 'white', width:'100%'}} />
                                  <Chip label={noUSD+' Base'} variant={'outlined'} size='small' sx={{border:'0px', fontSize:'12px', justifyContent:'flex-end', color: 'gray', width:'100%'}} />
                                  </>
                                  :
                                  null
                                }
                              </TableCell>
                            );


                          } else if(h.id == 'total_bonus' || h.id == 'total_points'){

                            const onUSD = h.id == 'total_bonus' ? i.total_bonus_usd : i.total_points_usd
                            const noUSD = h.id == 'total_bonus' ? i.total_bonus     : i.total_points
                            const check = h.id == 'total_bonus' && i.total_bonus == 0 && i.total_bonus_usd == 0 
                                                  ? false   
                                                  : 'total_loss' && i.total_points == 0 && i.total_points_usd == 0
                                                  ? false : true

                            const onTitle = String(h.id).replace('total_', '');
                            
                            const arrayTotals = games?.map((e,index)=>{
                              const arrValue = i[onTitle+'_'+(e.gameAcro)]
                              return {
                                        title: e.gameName,
                                        acro:  e.gameAcro,
                                        value: arrValue
                                      }
                            })

                            return (
                              <TableCell key={h.id} align={h.align} sx={{verticalAlign: 'top','&:hover': {backgroundImage: 'linear-gradient(to bottom, rgba(148,0,211,.2), rgba(0,0,0,0))'}}}>

                                {
                                  check
                                  ?
                                  <Accordion sx={{backgroundColor:'transparent'}} >
                                  <AccordionSummary 
                                    //expandIcon={<Icon icon={"oui:arrow-up"} style={{marginLeft:'15px'}}/>}
                                    >
                                    <div>
                                    <Chip label={onUSD+' USD'} variant={'outlined'} size='small' sx={{borderRadius:'0px', fontSize:'12px', minWidth: '200px', justifyContent:'flex-end', color: Fnc.isNull(value,0) ? 'gray' : 'white'}} />
                                    <Chip label={noUSD+' Base'} variant={'outlined'} size='small' sx={{border:'0px', fontSize:'12px', minWidth: '200px', justifyContent:'flex-end', color: 'gray',}} />
                                    </div>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                      <List sx={{ width: '100%',}}>
                                      {
                                          arrayTotals.map((x,index)=>{
                                            if(!Fnc.isNull(x.value,0)){
                                              return <ListItem  key={index} 
                                                                sx={{p: -5, border: '1px dashed grey', height: '50px'}}>
                                                        <ListItemText >
                                                          <span style={{fontSize:'11px', color:'lightgray'}}>
                                                            {x.value} USD
                                                          </span>
                                                          <div style={{marginTop:'-8px'}}>
                                                            <span style={{fontSize:'11px', color:'gray',}}>
                                                            {x.title}
                                                            </span>
                                                          </div>
                                                        </ListItemText>
                                                    </ListItem>
                                            }
                                          })
                                        }
                                        </List>
                                  </AccordionDetails>
                                </Accordion>
                                  :
                                 null
                                }
                              </TableCell>
                            );

                          } else if(h.id == 'total_agencyaction' || h.id == 'total_agencybonus' || h.id == 'total_playerresult'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <Chip label={value+' USD'} variant={'outlined'} size='small' sx={{borderRadius:'0px', fontSize:'12px', justifyContent:'flex-end', color: Fnc.isNull(value,0) ? 'gray' : 'gold', width:'100%'}} />
                              </TableCell>
                            );

                          } else if(h.id == 'unionStated'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',color:'gray'}}>{value}</p>
                              </TableCell>
                            );

                        } else if(h.id == 'count_clubs'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'12px'}}>{i.count_clubs_active} Active</p> 
                                <p style={{fontSize:'11px',color:'gray',marginTop:'-15px'}}>{i.count_clubs_inactive} Inactive</p>
                              </TableCell>
                            );

                        } else if(h.id == 'count_clubs'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'12px'}}>{i.count_clubs_active} Active</p> 
                                <p style={{fontSize:'11px',color:'gray',marginTop:'-15px'}}>{i.count_clubs_inactive} Inactive</p>
                              </TableCell>
                            );

                        } else if(h.id == 'recorded_first' || h.id=='recorded_last'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'12px'}}>{!Fnc.isNull(value) ? Fnc.dateText(value) : ''}</p> 
                                <p style={{fontSize:'11px',color:'gray',marginTop:'-15px'}}>{Fnc.dateGetDay(value)}</p>
                              </TableCell>
                            );

                        } else if(h.id == 'unionName'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'12px'}}>{i.unionName}</p>
                              </TableCell>
                            );

                        } else if(h.id == 'id'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <IconButton onClick={()=>RETURN({...i,modal:'Open'})}>
                                  <Icon icon={"clarity:edit-solid"} style={{color:'violet'}}/>
                                </IconButton>
                              </TableCell>
                            );

                        } else {

                          return (
                            <TableCell key={h.id} align={h.align}>
                              <p style={{fontSize:'11px'}}>{value ? value : ''} </p> 
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
          {Fnc.JSONS(onData,false)}
          </>
        );

    } else if( onCount == 0 && DATA.load ){
    
        return  <>
                  <OnNothing LABEL='No data found...' /> 
                </>;
    
    } else {
        
        return  <>
                  <OnLoading TYPE='table' />
                </>;
    
    }
}