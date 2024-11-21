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
  Fade,
  Chip
} from '@mui/material';

import * as Fn from '../functions/dialogs'
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { OnNothing, OnLoading, OnEdit } from 'src/items/menu/'

import { DialogUpsert } from '../modal'

import {Alerting} from 'src/items/alert_snack/'

import { Icon } from '@iconify/react';

const HEADS = [
                { id: 'status', label: '', minWidth: 50, sortable: false, filterable: false },
                { id: 'type', label: 'TYPE', minWidth: 160, sortable: true, filterable: true },
                { id: 'name', label: 'NAME', minWidth: 160, sortable: true, filterable: true },
                { id: 'formula', label: 'FORMULA', minWidth: 300, sortable: true, filterable: true },
                { id: 'note', label: 'NOTE', minWidth: 200, sortable: true, filterable: true },
                { id: 'stated', label: 'STATED', minWidth: 150, sortable: true, filterable: true },
              ];

export default function TableFormula({DATA, BYFILTER, CLUBS, REFRESH, EDIT, LISTS, SEARCH, UPSERT}) {

  const itemx = DATA.data ? DATA.data : []

  const [onData, setonData]     = useState(itemx);
  const [onCount, setonCount]     = useState(0);

  const [onAlert, setonAlert]   = useState({onOpen: 0, severity: '', message: ''});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('stated');

  const [diaOpen, setOpenDialog] = useState(false);
  const [diaData, setdiaData] = useState({});

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

  const handleDialogOpen = (i,ii,iii,what) => {

    setOpenDialog(true)
    setdiaData({
                  index: iii,
                  name: ii,
                  data: i,
                  what: what
                })

  };

  const handleDialogClose = () => {
    setOpenDialog(false)
    setdiaData({})
  };

  const handleDialogSubmitted = (i) => {

    const isSuccess = i.status == 'Added' || i.status == 'Replaced' || i.status == 'Removed' ? true : false

    if(isSuccess){
        setonAlert({onOpen: Fnc.numRandom(), severity: 'success', message: i.status})
        REFRESH( Fnc.numRandom() )
    } else {
        setonAlert({onOpen: Fnc.numRandom(), severity: 'error', message: i.status})
    }

  };

  const sortedRows = [...onData].sort((a, b) => {
    const compare = order === 'asc' ? 1 : -1;
    const parsedValue = parseFloat(a[orderBy]);
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


          <TableContainer component={Paper}>

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
                    <TableRow key={i.id} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>
                      {HEADS.map((h) => {
                        const value = i[h.id];
                        
                        if(h.id == 'stated'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',color:'gray'}}>{i.stated} </p> 
                              </TableCell>
                            );

                      } else if(h.id == 'status'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                {
                                    i.name != 'STANDARD'
                                    ?
                                    <OnEdit RETURN={(e)=> e == 'edit' ? EDIT(i,'edit') : e == 'remove' ? handleDialogOpen(i,'FORMULA',i.id,'REMOVE') : ''}/>
                                    :
                                    null
                                }
                              </TableCell>
                            );

                      } else {
                          const ifStandard = i.name == 'STANDARD' ? 'lightgold' : ''
                          return (
                            <TableCell key={h.id} align={h.align}>
                              <p style={{fontSize:'11px', color: ifStandard}}>{value ? value : ''} </p> 
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


          <DialogUpsert onOpen={diaOpen} 
                        onClose={handleDialogClose} 
                        onData={diaData}
                        onSubmitted={handleDialogSubmitted}
                       />

                       {
                       // <pre>{JSON.stringify(onData,null,2)}</pre>
                       }

          <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />

          </>
        );

    } else if( onCount == 0 && DATA.load ){
    
        return  <>
                  <OnNothing LABEL='No players deals found...' /> 
                </>;
    
    } else {
        
        return  <>
                  <OnLoading TYPE='table' />
                </>;
    
    }
}