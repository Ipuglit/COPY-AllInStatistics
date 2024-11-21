import React, { useState,useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Tooltip,
  Chip,
  Fade,
  Checkbox,
  TablePagination,
  IconButton,
} from '@mui/material';

// Sample data
import { Icon } from '@iconify/react';


export default function ViaTableAccounts({DATA, TYPE, RETURN, CHECK}) {

const heads = DATA.heads
const cells = DATA.cells

  const [tableLOAD, settableLOAD]       = useState(false);
  const [order, setOrder]                   = useState('asc');
  const [orderBy, setOrderBy]               = useState('name');
  const [page, setPage]                     = useState(0);
  const [rowsPerPage, setRowsPerPage]       = useState(5);

  const [itemCHECKED, setitemCHECKED]       = useState([]);

  const handlePAGINATION = (event, newPage) => {
    setPage(newPage);
  };

  const handlePAGEROWS = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const sortedRows = cells.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  const handleCHECK = (i) => {

    const currentIndex = itemCHECKED.indexOf(i);
    const newCHECKED = [...itemCHECKED];
    if (currentIndex === -1) {
      newCHECKED.push(i);
    } else {
      newCHECKED.splice(currentIndex, 1);
    }

    setitemCHECKED(newCHECKED);
    RETURN(newCHECKED,'multi')

  };

  const handleEDIT =(i)=>{
    RETURN(i,'one','edit')
    console.log(i)
  }

  // -------------- -------------- -------------- --------------
  const iCHECK =(i) => {
    return <TableCell style={{maxWidth:'40px',}}>
              {
                CHECK 
                ? 
                  <Checkbox
                              checked={itemCHECKED.indexOf(i) !== -1}
                              onChange={() => handleCHECK(i)}
                            /> 
                :
                null
              }
          </TableCell>
  }

  const iTEXT =(i) => {
    return <TableCell>{i}</TableCell>
  }

  const iTEXTIFTHEN2 =(i,ii,e,ee,a) => {
    return <TableCell>
                      {
                          i == ii
                          ?
                          <span style={{color: 'orange'}}>{ii}</span>
                          :
                            ee.includes(e)
                          ?
                          <Tooltip title={a}>
                            <Chip label={i} variant="outlined" color='warning' size='small' style={{borderRadius: '5px'}} />
                          </Tooltip>
                            
                          :
                          <Tooltip title={a}>
                            <Chip label={i} variant="outlined" color='default' size='small' style={{borderRadius: '5px'}} />
                          </Tooltip>

                      }
           </TableCell>
  }

  const iSTATUS =(i,ii) => {
        return <TableCell>
                  {
                    i == 'Active' 
                    ? 
                    <Tooltip title="Active account">
                      <Chip icon={<Icon icon="mdi:check-circle"/>} label={ii} variant="outlined" color='success' size='small' />
                    </Tooltip>
                    :
                    i == 'Pending' 
                    ?
                    <Tooltip title="Pending account">
                      <Chip icon={<Icon icon="mdi:clock-outline"/>} label={ii} variant="outlined" color='warning' size='small' />
                    </Tooltip>
                    :
                    <Tooltip title="Disabled account">
                      <Chip icon={<Icon icon="mdi:close-circle"/>} label={ii} variant="outlined" color='error' size='small' />
                    </Tooltip>
                  }
              </TableCell>
  }

    const iACTION =(i) => {
      return <TableCell>
              <IconButton onClick={()=>{handleEDIT(i)}}>
                <Icon icon="fluent:edit-28-filled" color='mediumpurple'/> 
              </IconButton>
            </TableCell>
    }

    useEffect(() => {
      settableLOAD(true)
    }, [DATA]);




  return (
    <TableContainer component={Paper}>
      <Table aria-label="enhanced table">
        <TableHead>

          <TableRow>

            {heads.map((i) => (

              <TableCell key={i.id}>
                {i.sortable ? (
                  <TableSortLabel
                    active={orderBy === i.id}
                    direction={orderBy === i.id ? order : 'asc'}
                    onClick={(e) => handleRequestSort(e, i.id)}
                  >
                    {i.label}
                  </TableSortLabel>
                ) : (
                  i.label
                )}
              </TableCell>

            ))}

          </TableRow>

        </TableHead>

        <TableBody>

          {
            TYPE == 'ACCOUNTS' ?

            paginatedRows.map((i, index) => (
                <TableRow key={index} 
                          sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>
                  { iCHECK(i.accountID)}
                  { iACTION(i) }
                  { iTEXT(i.accountID) }
                  { iSTATUS(i.statusLabel,i.accountNickname) }
                  { iTEXT(i.appName) }
                  { iTEXTIFTHEN2(i.user,'* NO USER',i.userrole,[5,6,7,8,9],i.userRolename) }
                </TableRow>
            ))

          :
          null
          }

        </TableBody>

      </Table>

        <TablePagination  rowsPerPageOptions={[5, 15, 30]}
                          component="div"
                          count={cells.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handlePAGINATION}
                          onRowsPerPageChange={handlePAGEROWS} />

    </TableContainer>
  );
}