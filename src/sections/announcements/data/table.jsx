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
                { id: 'statusLabel', label: 'STATUS', minWidth: 100, sortable: true, filterable: true },
                //{ id: 'position', label: 'RANK', minWidth: 50, sortable: true, filterable: true },
                { id: 'datestart', label: 'START', minWidth: 120, sortable: true, filterable: true },
                { id: 'datestop', label: 'STOP', minWidth: 120, sortable: true, filterable: true },
                { id: 'title', label: 'TITLE', minWidth: 140, sortable: true, filterable: true },
                { id: 'subtitle', label: 'SUBTITLE', minWidth: 140, sortable: true, filterable: true },
                { id: 'link', label: 'LINK', minWidth: 150, sortable: true, filterable: true },
                { id: 'details', label: 'DETAILS', minWidth: 220, sortable: true, filterable: true },
                { id: 'imageBackground', label: 'BACKGROUND', minWidth: 130, sortable: true, filterable: true },
                //{ id: 'imageAvatar', label: 'AVATAR', minWidth: 130, sortable: true, filterable: true },
                { id: 'statedBy', label: 'STATED BY', minWidth: 190, sortable: true, filterable: true },
                { id: 'stated', label: 'STATED', minWidth: 150, sortable: true, filterable: true },
              ];

export default function ViaTable({DATA, SEARCH, RETURN, ITEMS}) {

  const itemx = DATA.data ? DATA.data : []
  const games = ITEMS.GAMES

  const [onData, setonData]     = useState(itemx);
  const [onCount, setonCount]     = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('accountID');

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
    if (!isNaN(parsedValue) && orderBy != 'datestart' && orderBy != 'datestop') {
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

                        if(h.id == 'imageBackground'){

                            return (
                              <TableCell key={h.id} align={h.align} >
                                        <img src={i.imageBackground || 'https://www.all-in-statistics.pro'+i.imageBackground} 
                                              onError={(e) => {
                                                e.target.src = 'https://www.all-in-statistics.pro'+i.imageBackground;
                                              }}
                                              alt="image" style={{height:'60px'}} />
                              </TableCell>
                            );

                        } else if(h.id == 'statusLabel'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <Chip icon={<Icon icon={i.statusLabel == 'Active' ? "mdi:check-circle" : i.statusLabel == 'Pending' ? "mdi:clock-outline" : "mdi:close-circle"}/>} 
                                    label={i.statusLabel}
                                    variant={'outlined'} 
                                    sx={{fontSize:'12px',}}
                                    size='small'
                                    color={i.statusLabel == 'Active' ? "success" : i.statusLabel == 'Pending' ? "warning" : "error" } />
                              </TableCell>
                            );

                          } else if(h.id == 'datestart' || h.id == 'datestop'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px'}}>{!Fnc.isNull(value) ? Fnc.datetimeText(value) : ''}</p> 
                                <p style={{fontSize:'11px',color:'gray',marginTop:'-15px'}}>{Fnc.dateGetDay(value)}</p>
                              </TableCell>
                            );

                          } else if(h.id == 'statedBy'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',color:'gray'}}>{i.statedByUserName ? i.statedByUserName : i.statedByUserNick}</p>
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
    {Fnc.JSONS(games,false)}
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