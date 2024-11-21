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
  Tooltip
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { OnNothing, OnLoading, OnEdit } from 'src/items/menu/'

import {Alerting} from 'src/items/alert_snack/'

import { Icon } from '@iconify/react';



export default function ViaTable({DATA, SEARCH, RETURN, REFRESH, FOR}) {


  const HEADERS = [
    { id: 'id', label: '#', minWidth: 70, sortable: true, filterable: true },
    { id: 'historyTime', label: 'DATE & TIME', minWidth: 150, sortable: true, filterable: true },
    FOR=='ALL'&&{ id: 'userAvatar', label: 'AVATAR', minWidth: 110, sortable: true, filterable: true },
    FOR=='ALL'&&{ id: 'userNickname', label: 'NICKNAME', minWidth: 140, sortable: true, filterable: true },
    FOR=='ALL'&&{ id: 'userName', label: 'USER', minWidth: 140, sortable: true, filterable: true },
    FOR=='ALL'&&{ id: 'userRole', label: 'ROLE', minWidth: 140, sortable: true, filterable: true },
    //FOR=='ALL'&&{ id: 'userStatusLabel', label: 'STATUS', minWidth: 140, sortable: true, filterable: true },
    { id: 'historyAction', label: 'ACTION', minWidth: 120, sortable: true, filterable: true },
    { id: 'historyActivity', label: 'ACTIVITY', minWidth: 150, sortable: true, filterable: true },
    { id: 'historyDetails', label: 'DETAILS', minWidth: 190, sortable: true, filterable: true },
    { id: 'historyGadget', label: 'GADGET', minWidth: 190, sortable: true, filterable: true },
   // { id: 'historyTimezone', label: 'TIMEZONE', minWidth: 190, sortable: true, filterable: true },

  ];

  const HEADS = HEADERS.filter(Boolean);

  const itemx = DATA.data ? DATA.data : []

  const [onData, setonData]     = useState(itemx);
  const [onCount, setonCount]     = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');

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

                        if(h.id == 'userAvatar'){

                          return (
                            <TableCell key={h.id} align={h.align} >
                              <Avatar alt="avatar" 
                                      src={Fnc.ifImage(`${i.userAvatar}?${new Date().getTime()}`,`${'https://www.all-in-statistics.pro/'+i.userAvatar}?${new Date().getTime()}`)}
                                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/avatars/default.jpg'; }}
                                      />
                            </TableCell>
                          );
                          
                        } else if(h.id == 'userStatusLabel'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>

                              </TableCell>
                            );
                        } else if(h.id == 'id'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',color:'gray',}}>{i.increment} </p> 
                              </TableCell>
                            );

                        } else if(h.id == 'userName'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <Chip icon={
                                  <Tooltip title={i.userStatusLabel}>
                                    <Icon icon={i.userStatusLabel == 'Active' ? "mdi:check-circle" : i.userStatusLabel == 'Pending' ? "mdi:clock-outline" : "mdi:close-circle"} height={15}/>
                                  </Tooltip>
                                           
                                          } 
                                    label={<span style={{fontSize:'11px',color:'gray',}}>{i.userName} </span> }
                                    sx={{border:'none', fontSize:'11px',}}
                                    variant={'outlined'} 
                                    size='small'
                                    color={i.userStatusLabel == 'Active' ? "success" : i.userStatusLabel == 'Pending' ? "warning" : "error" } />
                                
                              </TableCell>
                            );

                        } else {

                          return (
                            <TableCell key={h.id} align={h.align}>
                              <p style={{fontSize:'11px',color:'gray',}}>{value ? value : ''} </p> 
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
              rowsPerPageOptions={[10, 50, 100]}
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
                  <OnNothing LABEL='No history found...' /> 
                </>;
    
    } else {
        
        return  <>
                  <OnLoading TYPE='table' />
                </>;
    
    }
}