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
  Chip,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Fn from '../functions/dialogs'

import {ModalDealHistory} from '../index'

import {DialogPlayer} from '../modal-players'

import {Alerting} from 'src/items/alert_snack/'

import { Icon } from '@iconify/react';

import { OnNothing, OnLoading, OnEdit } from 'src/items/menu/'

const HEADS = [
                { id: 'status', label: '', minWidth: 50, sortable: false, filterable: false },
                { id: 'rakeback', label: 'DEALS', minWidth: 135, sortable: true, filterable: true },
                { id: 'clubName', label: 'CLUB', minWidth: 165, sortable: true, filterable: true },
                { id: 'uplineID', label: 'UPLINES', minWidth: 165, sortable: true, filterable: true },

                { id: 'stated', label: 'STATED', minWidth: 100, sortable: true, filterable: true },
              ];

export default function ViaTable_Uplines({DATA, VIEW, BYAPP, BYCLUB, BYUPLINE, SEARCH, ADD, REFRESH, CLUBS, ACCOUNTS, UPLINES}) {

  const itemx = DATA.data ? DATA.data : []

  const [onData, setonData]     = useState(itemx);
  const [onCount, setonCount]     = useState(0);

  const [onAlert, setonAlert]   = useState({onOpen: 0, severity: '', message: ''});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('stated');
  const [filters, setFilters] = useState({}); // Store filter values for each column

  const [tableData, settableData] = useState([]);

  const [diaOpen, setOpenDialog] = useState(false);
  const [diaData, setdiaData] = useState({});

  const [diaHistory, setdiaHistory] = useState({open: false, data: [], what: 'Players'});

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (i) => {
    setSearch(i);
    setSearching(false);
  };

  const handleSearchClick = (i) => {

    if(searching){
      setSearching(false);
    } else {
      setSearching(true);
    }

  };

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleDialogOpen = (i,ii,iii,e) => {

    setOpenDialog(true)
    setdiaData({
                  index: iii,
                  name: ii,
                  data: i,
                  what: e ? e : 'UPDATE',
                })

  };

  
  const handleDialogClose = () => {
    setOpenDialog(false)
    setdiaData({})
  };


  const handleDialogSubmitted = (i) => {

    const isSuccess = i?.status == 'added' || i?.status == 'replaced' || i?.status == 'removed' ? true : false
    
    if( isSuccess ){

      if(i?.status == 'added'){
        setonAlert({onOpen: Fn.numRandom(), severity:'success', message:'Added'})
      } else if(i?.status == 'replaced'){ 
        setonAlert({onOpen: Fn.numRandom(), severity:'success', message:'Updated'})
      } else if(i?.status == 'removed'){ 
        setonAlert({onOpen: Fn.numRandom(), severity:'success', message:'Removed'})
      }

      REFRESH(Fnc.numRandom())

    } else {

      if(i?.status == 'duplicate'){
        setonAlert({onOpen: Fn.numRandom(), severity:'error', message:'Duplicate'})
      } else {
        setonAlert({onOpen: Fn.numRandom(), severity:'error', message:'Please try again'})
      }

    }

  };

  const filterMultiple = itemx.filter(i => {

    let matches = true;
    if (BYAPP.appID && i?.appID != BYAPP.appID) {
      matches = false;
    }
    if (BYCLUB.clubID && i?.clubID != BYCLUB.clubID ) {
      matches = false;
    }
    if (BYUPLINE.uplineID && i?.uplineID != BYUPLINE.uplineID ) {
      matches = false;
    }
    return matches;

});

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
      const filteredFinal = filterMultiple.filter(i =>   
                                          Object.values(i).some(e =>
                                            String(e).toLowerCase().includes(searching)
                                          )
                                        );
      setonData(filteredFinal)
      setonCount(filteredFinal.length)

    }, [BYAPP,BYCLUB,BYUPLINE,SEARCH,DATA]);

    useEffect(() => {

      if( ADD != 0 ){
        handleDialogOpen(0,'UPLINES',0,'NEW')
      }

    }, [ADD]);

    if( DATA.load && DATA.tally > 0 && onCount > 0){
        return (
          <>


          <TableContainer component={'section'}>

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
                    <TableRow key={i?.id} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>
                      {HEADS.map((h) => {
                        const value = i[h.id];
                        
                        if(h.id == 'clubName'){

                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11.5',marginBottom:'-14px'}}>{i?.clubName}</p>
                                <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>ID: {i?.clubID} </p> 
                                <p style={{fontSize:'11px',color:'gray'}}>{i?.appName} </p> 
                              </TableCell>
                            );
                            
                        } else if(h.id == 'uplineID'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                {
                                  !Fnc.isNull(i?.uplineID,'Num')
                                  ?
                                  <>
                                    <p style={{fontSize:'11.5',marginBottom:'-14px'}}>ID: {i?.uplineID}</p>
                                    {
                                      !Fnc.isNull(i?.uplineUserName) 
                                      ?
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i?.uplineUserName} </p> 
                                      :
                                      !Fnc.isNull(i?.uplineUserNickname) 
                                      ?
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i?.uplineUserNickname} </p>
                                      :
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'orange'}}>* No User </p> 
                                    }
                                    <p style={{fontSize:'11px',color:'gray'}}>{100 - i?.rakeback}% Rakeback </p> 
                                  </>
                                  :
                                  <span style={{color:"orange"}}>* No Upline</span>
                                }
                              </TableCell>
                            );

                          } else if(h.id == 'rakeback'){

                            const rback = i?.rakeback ? String(i?.rakeback) : "0"
                            const rbate = i?.rebate ? String(i?.rebate) : "0"

                            return (
                              <TableCell key={h.id} align={h.align} >
                                  <Chip variant='outlined' 
                                            color="info" 
                                            style={{fontSize:'14px',borderRadius:'0%',height:'30px', fontWeight: '900', width:'100px'}}
                                            label={rback + " / " + rbate}  />
                                            <br/>
                                    <span style={{fontSize:'11px', marginTop:'1px', color:'lightgray'}}>
                                      {i?.chiprate} Chiprate
                                    </span>
                              </TableCell>
                            );

                        } else if(h.id == 'stated'){
                          
                            return (
                              <TableCell key={h.id} align={h.align} style={{width:'140px'}}>
                                <p style={{fontSize:'11px',color:'gray'}}>{i?.stated} </p> 
                              </TableCell>
                            );

                        } else if(h.id == 'status'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                 
                                 <OnEdit WHAT={'history'} RETURN={(e)=> e == 'edit' 
                                                                        ? 
                                                                        handleDialogOpen(i,'UPLINES',i?.id) 
                                                                        : 
                                                                        e == 'remove' 
                                                                        ? 
                                                                        handleDialogOpen(i,'REMOVEU',i?.id,'REMOVEU') 
                                                                        : 
                                                                        e == 'history' 
                                                                        ? 
                                                                        setdiaHistory({open: true, data: i, what: 'UPLINE'})
                                                                        :
                                                                        ''
                                                                        }/>
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

          <DialogPlayer onOpen={diaOpen} 
                      onClose={handleDialogClose} 
                      onData={diaData}
                      onClubs={CLUBS.data}
                      onUpDeals={UPLINES.data}
                      onAccounts={ACCOUNTS.data}
                      onSubmitted={handleDialogSubmitted}
                       />
                       {
                        //<pre>{JSON.stringify(BYCLUB,null,2)}</pre>
                       }

          <ModalDealHistory onData={diaHistory} onReturn={setdiaHistory} />

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