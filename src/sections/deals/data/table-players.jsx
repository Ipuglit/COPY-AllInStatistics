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
  Button,
  Chip,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Tooltip
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
                { id: 'clubName', label: 'CLUB', minWidth: 155, sortable: true, filterable: true },
                { id: 'playerID', label: 'PLAYER', minWidth: 155, sortable: true, filterable: true },
                { id: 'uplineID', label: 'UPLINE', minWidth: 155, sortable: true, filterable: true },
                { id: 'agencyID', label: 'AGENCY', minWidth: 155, sortable: true, filterable: true },
                { id: 'downlineID', label: 'DOWNLINE', minWidth: 155, sortable: true, filterable: true },
                { id: 'chiprate', label: 'CHIP RATE', minWidth: 135, sortable: true, filterable: true },
                { id: 'currency', label: 'CURRENCY', minWidth: 135, sortable: true, filterable: true },
                { id: 'remarks', label: 'REMARKS', minWidth: 135, sortable: true, filterable: true },
                { id: 'formulaID', label: 'CALCULATION', minWidth: 200, sortable: true, filterable: true },
                { id: 'stated', label: 'STATED', minWidth: 135, sortable: true, filterable: true },
              ];

export default function ViaTable_Players({DATA, VIEW, BYAPP, BYCLUB, BYUPLINE, BYPLAYER, ADD, SEARCH, REFRESH, CLUBS, UPLINES, ACCOUNTS, FORMULA, FORMULADEAL}) {

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

  const [diaHistory, setdiaHistory] = useState({open: false, data: [], what: 'Players'});

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

    const isSuccess = i.status == 'added' || i.status == 'replaced' || i.status == 'removed' ? true : false
    
    if( isSuccess ){

      if(i.status == 'added'){
        setonAlert({onOpen: Fn.numRandom(), severity:'success', message:'Added'})
      } else if(i.status == 'replaced'){ 
        setonAlert({onOpen: Fn.numRandom(), severity:'success', message:'Updated'})
      } else if(i.status == 'removed'){ 
        setonAlert({onOpen: Fn.numRandom(), severity:'success', message:'Removed'})
      }

      REFRESH(Fnc.numRandom())

    } else {

      if(i.status == 'duplicate'){
        setonAlert({onOpen: Fn.numRandom(), severity:'error', message:'Duplicate'})
      } else {
        setonAlert({onOpen: Fn.numRandom(), severity:'error', message:'Please try again'})
      }

    }

  };
  

  const handleMatchNew = (c,u,rk,rb) => {

    const unfilt = UPLINES.data.filter(i => i.clubID == c && i.uplineID == u && i.status == 0 );

    if(unfilt.length > 0){

      if(unfilt[0].rakeback == rk && unfilt[0].rebate == rb){
        return ''
      } else {
        return <Chip variant='outlined' 
                      color="warning" 
                      style={{fontSize:'11px',borderRadius:'0%', fontWeight: '900', height:'20px', width:'100px'}} 
                      label={"New! "+unfilt[0].rakeback + " / " + unfilt[0].rebate}  />
      }

    }

  };

  const filterMultiple = itemx.filter(i => {

    let matches = true;
    if (!Fn.isNull(BYAPP.appID,0) && i.appID != BYAPP.appID) {
      matches = false;
    }
    if (!Fn.isNull(BYCLUB.clubID,0) && i.clubID != BYCLUB.clubID ) {
      matches = false;
    }
    if (!Fn.isNull(BYPLAYER.playerID,0) && i.playerID != BYPLAYER.playerID ) {
      matches = false;
    }
    if (!Fn.isNull(BYUPLINE.uplineID,0) && i.uplineID != BYUPLINE.uplineID ) {
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

    }, [BYAPP,BYCLUB,BYPLAYER,BYUPLINE,SEARCH,DATA]);

    useEffect(() => {

      if( ADD != 0 ){
        handleDialogOpen(0,'PLAYERS',0,'NEW')
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
                    <TableRow key={i.id+'-'+index} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>
                      {HEADS.map((h) => {
                        const value = i[h.id];
                        
                        if(h.id == 'playerID'){

                          return (
                            <TableCell key={h.id} align={h.align} >
                              <p style={{fontSize:'11px',marginBottom:'-14px', fontWeight:'700'}}>ID: {i.playerID}</p>
  
                                {
                                  !Fnc.isNull(i.playerUserName) 
                                  ?
                                    <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i.playerUserName} </p> 
                                  :
                                  !Fnc.isNull(i.playerUserNickname) 
                                  ?
                                    <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i.playerUserNickname} </p>
                                  :
                                    <p style={{fontSize:'11px',marginBottom:'-14px',color:'orange'}}>* No User </p> 
                                }
                                
                                <p style={{fontSize:'11px',color:'gray'}}>{i.playerRake ? i.playerRake : 0}% Rakeback</p>
                              
                            </TableCell>
                          );

                        } else if(h.id == 'clubName'){

                            return (
                              <TableCell key={h.id} align={h.align}  >
                                <p style={{fontSize:'11px',marginBottom:'-14px', fontWeight:'700'}}>{i.clubName}</p>
                                <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>ID: {i.clubID} </p> 
                                <p style={{fontSize:'11px',color:'gray'}}>{i.appName} </p> 
                              </TableCell>
                            );
                            
                        } else if(h.id == 'uplineID'){
                          
                            return (
                              <TableCell key={h.id} align={h.align} >
                                {
                                  !Fnc.isNull(i.uplineID,'Num')
                                  ?
                                  <>
                                    <p style={{fontSize:'11px',marginBottom:'-14px', fontWeight:'700'}}>ID: {i.uplineID}</p>
                                    {
                                      !Fnc.isNull(i.uplineUserName) 
                                      ?
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i.uplineUserName} </p> 
                                      :
                                      !Fnc.isNull(i.uplineUserNickname) 
                                      ?
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i.uplineUserNickname} </p>
                                      :
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'orange'}}>* No User </p> 
                                    }
                                    <p style={{fontSize:'11px',color:'gray'}}>{i.uplineRake ? i.uplineRake : 0}% Rakeback </p> 
                                  </>
                                  :
                                  <span style={{color:"orange"}}>* No Upline</span>
                                }
                              </TableCell>
                            );

                          } else if(h.id == 'agencyID'){
                          
                            return (
                              <TableCell key={h.id} align={h.align} >
                                {
                                  !Fnc.isNull(i.agencyID,'Num')
                                  ?
                                  <>
                                    <p style={{fontSize:'11px',marginBottom:'-14px', fontWeight:'700'}}>ID: {i.agencyID}</p>
                                    {
                                      !Fnc.isNull(i.agencyUserName) 
                                      ?
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i.agencyUserName} </p> 
                                      :
                                      !Fnc.isNull(i.agencyUserNickname) 
                                      ?
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>{i.agencyUserNickname} </p>
                                      :
                                        <p style={{fontSize:'11px',marginBottom:'-14px',color:'orange'}}>* No User </p> 
                                    }
                                    <p style={{fontSize:'11px',color:'gray'}}>{i.agencyRake ? i.agencyRake : 0}% Rakeback </p> 
                                  </>
                                  :
                                  <span style={{color:"orange"}}>* No Agency</span>
                                }
                              </TableCell>
                            );

                          } else if(h.id == 'downlineID'){
                          
                            return (
                              <TableCell key={h.id} align={h.align} >
                                {
                                  !Fnc.isNull(i.downlineID,'Num')
                                  ?
                                  <>
                                    <p style={{fontSize:'11px',marginBottom:'-14px', fontWeight:'700'}}>ID: {i.downlineID}</p>
                                    {
                                      !Fnc.isNull(i.downlineUserName) 
                                      ?
                                        <p style={{fontSize:'11px',color:'gray'}}>{i.downlineUserName} </p> 
                                      :
                                      !Fnc.isNull(i.downlineUserNickname) 
                                      ?
                                        <p style={{fontSize:'11px',color:'gray'}}>{i.downlineUserNickname} </p>
                                      :
                                        <p style={{fontSize:'11px',color:'orange'}}>* No User </p> 
                                    }
                                    {
                                      !Fn.isNull(i.downlineRake,0)
                                      ?
                                      <p style={{fontSize:'11px',color:'gray'}}>{i.downlineRake ? i.downlineRake : 0}% Rakeback </p> 
                                      :
                                      null
                                    }
                                    
                                  </>
                                  :
                                  <span style={{color:"orange"}}>* No Downline</span>
                                }
                              </TableCell>
                            );
                          } else if(h.id == 'rakeback'){

                            const rback = i.rakeback ? String(i.rakeback) : "0"
                            const rbate = i.rebate ? String(i.rebate) : "0"

                            return (
                              <TableCell key={h.id} align={h.align} >
                                
                                  <Chip variant='outlined' 
                                        color="info" 
                                        sx={{fontSize:'14px',borderRadius:'0%',height:'30px', fontWeight: '900', width:'100px'}} 
                                        label={rback + " / " + rbate}  />

                                  {
                                  //handleMatchNew(i.clubID,i.uplineID,rback,rbate)
                                  }
                                    <span style={{fontSize:'11px', color:'lightgray'}}>
                                      {i?.chiprate} Chiprate
                                    </span>
                              </TableCell>
                            );

                          } else if(h.id == 'chiprate'){

                            return (
                              <TableCell key={h.id} align={h.align} >
                                {
                                  !Fnc.isNull(i.chiprate,'Num')
                                  ?
                                  <>
                                  <Chip variant='outlined' 
                                        color="default" 
                                        style={{fontSize:'11px',borderRadius:'0%',marginBottom:'-5px', height:'30px'}} 
                                        label={!Fn.isNull(i.currency) ? '1 Chip = '+i.chiprate+' '+i.currency : '1 Chip = '+i.chiprate +' USD'}  />
                                    {
                                      !Fn.isNull(i.playerChiprate,0) 
                                      ?
                                      <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>
                                      {i.playerChiprate +' '+i.currency} Player Rate  
                                      </p> 
                                      :
                                      null
                                    }

                                    {
                                      !Fn.isNull(i.uplineChipcut,0) 
                                      ?
                                      <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>
                                        {i.uplineChipcut +' '+i.currency} Upline Cut 
                                      </p>  
                                      :
                                      null
                                    }
                                    {
                                      !Fn.isNull(i.agencyChipcut,0) 
                                      ?
                                      <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>
                                        {i.agencyChipcut +' '+i.currency} Agency Cut 
                                      </p>  
                                      :
                                      null
                                    }
                                    {
                                      !Fn.isNull(i.downlineChipcut,0) 
                                      ?
                                      <p style={{fontSize:'11px',marginBottom:'-14px',color:'gray'}}>
                                        {i.downlineChipcut +' '+i.currency} Downline Cut 
                                      </p>  
                                      :
                                      null
                                    }
                                  </>
                                  :
                                  <span style={{color:"gray"}}>* No Chiprate</span>
                                }
                              </TableCell>
                            );

                          } else if(h.id == 'formulaID'){

                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',marginBottom:'-10px',color:'gray'}}>
                                  Agency Action: {i.form_agencyActionName ? i.form_agencyActionName : 'STANDARD'}
                                </p>
                                <p style={{fontSize:'11px',marginBottom:'-10px',color:'gray'}}>
                                  Agency Bonus: {i.form_agencyBonusName ? i.form_agencyBonusName : 'STANDARD'}
                                </p>
                                <p style={{fontSize:'11px',color:'gray'}}>
                                  Player Result: {i.form_playerResultName ? i.form_playerResultName : 'STANDARD'} 
                                </p>
                              </TableCell>
                            );

                        } else if(h.id == 'stated'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',color:'gray'}}>{i.stated} </p> 
                              </TableCell>
                            );

                        } else if(h.id == 'status'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <OnEdit WHAT={'history'} RETURN={(e)=> e == 'edit' 
                                                                        ? 
                                                                        handleDialogOpen(i,'PLAYERS',i.id) 
                                                                        : 
                                                                        e == 'remove' 
                                                                        ? 
                                                                        handleDialogOpen(i,'REMOVEP',i.id,'REMOVEP') 
                                                                        : 
                                                                        e == 'history' 
                                                                        ? 
                                                                        setdiaHistory({open: true, data: i, what: 'PLAYER'})
                                                                        :
                                                                        ''
                                                                        }/>
                              </TableCell>
                            );
                        } else if(h.id == 'remarks'){
                          
                            return (
                              <TableCell key={h.id} align={h.align}>
                                <p style={{fontSize:'11px',color:'gray'}}>{i.remarks} </p>
                                {i?.statusLabel}
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
                      onFormula={FORMULA.data}
                      onFormulaDeal={FORMULADEAL.data}
                      onSubmitted={handleDialogSubmitted}
                       />

                       {
                     //  <pre>{JSON.stringify(FORMULA.data,null,2)}</pre>

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