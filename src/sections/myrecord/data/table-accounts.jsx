import React, { useEffect, useState } from 'react';

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TablePagination, TextField, Paper,
  Alert
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Table_Accounts({DATA,FILTER}) {

  const onMobile  = Fnc.OnMobile()

  const itemx     = DATA?.data
  const fil       = FILTER

  const [onData, setonData]     = useState([]);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const filterbyDATE = filterbyPLAYER?.filter(i => {
        const openDate = new Date(i?.dateOpen);
        const closeDate = new Date(i?.dateClose);
        return (openDate <= dateEnds && closeDate >= dateStart && closeDate <= dateEnds);
  });

  const filterMultiple = (dateStatus ? filterbyDATE : filterbyPLAYER)?.filter(i => {
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

  useEffect(()=>{
    const searching = String(fil?.SEARCH)?.toLowerCase()
    const filteredFinal = filterMultiple?.filter(i =>   
                                        Object?.values(i)?.some(e =>
                                          String(e)?.toLowerCase()?.includes(searching)
                                        )
                                      );
    setonData(filteredFinal)
  },[DATA])

  return (
    <Paper sx={{ width: '100%', p: 1 }}>
      <TableContainer >
        <Table aria-labelledby="tableTitle" size="small" >
          <TableHead>
            <TableRow>

              <TableCell>
                <MyTableSort value='dateClose'> 
                  DATE
                </MyTableSort>
              </TableCell>

              <TableCell>
                <MyTableSort value='clubName'> 
                  CLUB
                </MyTableSort>
              </TableCell>

              <TableCell>
                <MyTableSort value='playerID'> 
                  ACCOUNT
                </MyTableSort>
              </TableCell>

              <TableCell align='center'>
                <MyTableSort value='total_points_usd'> 
                  POINTS
                </MyTableSort>
              </TableCell>

              <TableCell align='center'>
                <MyTableSort value='total_bonus_usd'> 
                  BONUS
                </MyTableSort>
              </TableCell>

              <TableCell align='center'>
                <MyTableSort value='total_bonuspercent'> 
                  BONUS PERCENT
                </MyTableSort>
              </TableCell>

              <TableCell align='center'>
                <MyTableSort value='total_playerresult'> 
                  PLAYER RESULT
                </MyTableSort>
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {
            sortedRows?.length > 0
            ?
            sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((i, index) => (
                <TableRow key={index} hover tabIndex={-1} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>

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
                                      <p>ID: {i?.playerID}</p>
                                      <p style={{fontSize:'10px', marginTop:'-13px', color:i?.accountStatusLabel == 'Inactive' ? '#ff4554' : 'gray'}}>
                                        {i?.playerNick}
                                      </p>
                  </TableCell>

                  <TableCell style={{fontSize:'11px', minWidth:'145px'}} align='right'>
                                <p style={{fontWeight:'700', color: i?.total_points_usd < 0 ? '#ff4554' : i?.total_points_usd == 0 ? 'gray' : ''}}>
                                  {i?.total_points_usd} USD
                                </p>
                                <p style={{color:'gray', marginTop:'-9px'}}>
                                  {i?.total_win_usd + ' USD WIN'}
                                </p>
                                <p style={{color:'gray', marginTop:'-14px'}}>
                                  {i?.total_loss_usd + ' USD LOSS'}
                                </p>
                  </TableCell>

                  <TableCell style={{fontSize:'11px', minWidth:'145px'}} align='right'>
                              <p style={{fontWeight:'700', color: i?.total_bonus_usd < 0 ? '#ff4554' : i?.total_bonus_usd == 0 ? 'gray' : ''}}>
                                {i?.total_bonus_usd} USD
                              </p>
                  </TableCell>

                  <TableCell style={{fontSize:'11px', minWidth:'145px'}} align='right'>
                              <p style={{fontWeight:'700', color: i?.total_bonuspercent < 0 ? '#ff4554' : i?.total_bonuspercent == 0 ? 'gray' : ''}}>
                                {i?.total_bonuspercent_usd} USD
                              </p>
                  </TableCell>

                  <TableCell style={{fontSize:'11px', minWidth:'145px'}} align='right'>
                              <p style={{fontWeight:'700', color: i?.total_playerresult < 0 ? '#ff4554' : i?.total_playerresult == 0 ? 'gray' : ''}}>
                                {i?.total_playerresult} USD
                              </p>
                  </TableCell>


                </TableRow>
              ))
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
      {Fnc.JSONS(itemx,false)}
    </Paper>
  );
}
