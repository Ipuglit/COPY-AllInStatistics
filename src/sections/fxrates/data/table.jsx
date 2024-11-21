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
  Accordion,
  AccordionSummary ,
  AccordionDetails ,

} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { OnNothing, OnLoading, OnEdit } from 'src/items/menu/'

import {Alerting} from 'src/items/alert_snack/'

import { Icon } from '@iconify/react';

const HEADS = [
                { id: 'id', label: '', minWidth: 30, sortable: false, filterable: false },
                { id: 'fxProvider', label: 'PROVIDER', minWidth: 200, sortable: true, filterable: true },
                { id: 'fxDate', label: 'DATE', minWidth: 150, sortable: true, filterable: true },
               // { id: 'fxStatusLabel', label: 'NICKNAME', minWidth: 150, sortable: true, filterable: true },
                { id: 'fxRates', label: 'RATES', minWidth: 350, sortable: true, filterable: true },
              ];

export default function ViaTable({DATA, SEARCH, RETURN, REFRESH}) {

  const itemx = DATA.data ? DATA.data : []

  const [onData, setonData]     = useState(itemx);
  const [onCount, setonCount]     = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('fxDate');

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (i) => {
    const isAsc = orderBy === i && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(i);
  };

  const sortedRows = [...onData].sort((a, b) => {
    const compare       = order === 'asc' ? 1 : -1;
    const parsedValue   = parseFloat(a[orderBy]);

    if (!isNaN(parsedValue)) {
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

            <Table size='small'>
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
                    <TableRow key={i.id} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.5), rgba(0,0,0,0))' } }}>
                      {HEADS.map((h) => {
                        const value = i[h.id];

                        if(h.id == 'accountUserAvatar'){

                          return (
                            <TableCell key={h.id} align={h.align} >
                              <Avatar alt="image" src={Fnc.ifImage(i.accountUserAvatar,'/images/accounts/default.jpg')} />
                            </TableCell>
                          );
                          
                        } else if(h.id == 'appStatusLabel'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <Chip icon={<Icon icon={i.appStatusLabel == 'Active' ? "mdi:check-circle" : i.appStatusLabel == 'Pending' ? "mdi:clock-outline" : "mdi:close-circle"}/>} 
                                    label={i.appStatusLabel}
                                    variant={'outlined'} 
                                    size='small'
                                    color={i.appStatusLabel == 'Active' ? "success" : i.appStatusLabel == 'Pending' ? "warning" : "error" } />
                              </TableCell>
                            );
                          } else if(h.id == 'id'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <IconButton onClick={()=>RETURN({...i,modal:'Open'})}>
                                  <Icon icon={"fluent:open-48-regular"} style={{color:'violet'}}/>
                                </IconButton>
                              </TableCell>
                            );

                          } else if(h.id == 'fxDate'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',color:'gray',}}>{i.fxDateFormat ? i.fxDateFormat : ''} </p> 
                              </TableCell>
                            );

                        } else if(h.id == 'fxRates'){
                          const rates = JSON.parse(i.fxRates)
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <Accordion sx={{backgroundColor:'transparent'}}>
                                  <AccordionSummary expandIcon={<Icon icon={"oui:arrow-up"} />}>
                                    <div style={{fontSize:'12px'}}>View rates...</div>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                  {Object.entries(rates).map(([currency, rate]) => (
                                    <Chip sx={{margin:'1px', fontSize:'11px'}} variant='outlined' size='small' key={currency} label={currency+': '+rate} />
                                  ))}
                                  </AccordionDetails>
                                </Accordion>
                              </TableCell>
                            );


                        } else {

                          return (
                            <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',}}>{value ? value : ''} </p> 
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
                  <OnNothing LABEL='No rates found...' /> 
                </>;
    
    } else {
        
        return  <>
                  <OnLoading TYPE='table' />
                </>;
    
    }
}