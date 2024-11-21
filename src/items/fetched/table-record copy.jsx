
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    InputAdornment,
    Paper,
    TextField,
    Button,
    Divider,
    IconButton,
    Chip,
    Grid,
    Box,
    Checkbox,
    Tooltip, 
    Typography
} from '@mui/material';

import { Icon } from '@iconify/react';

import { ModalRecordGames,ModalRecordDelete, MenuOnSearch, MenuOnFilter } from './'

import * as Fnc from 'src/hooks/functions'
import * as Eq from 'src/hooks/calculations'
import * as Cls from 'src/hooks/classes'
// ----------------------------------------------------------------------


export default function ViaTableRecord({ DATA_TO, DATA_RE, DATA_COUNT, DATA_LOAD }) {


    const [page, setPage]                     = useState(0);
    const [rowsPerPage, setRowsPerPage]       = useState(5);
    const [order, setOrder]                   = useState('asc');
    const [orderBy, setOrderBy]               = useState('name');
    const [searchQuery, setSearchQuery]       = useState('');
    const [searchBy, setsearchBy]             = useState('playerID');
    const [checkedID, setCheckedID]           = useState([]);
    const [checkedArr, setcheckedArr]         = useState([]);
    // ==================================== *_* ====================================
    const [reloadDATA, setreloadDATA]         = useState(1);
    const [reloadPage, setreloadPage]         = useState(1000);
    const [openGames, setopenGames]           = useState(false);
    const [openDelete, setopenDelete]         = useState(false);
    const [dataGames, setdataGames]           = useState([]);
    const [dataDelete, setdataDelete]         = useState([]);
    // ==================================== *_* ====================================

    const handlePAGINATION = (event, newPage) => {
      setPage(newPage);
    };
  
    const handlePAGEROWS = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const handleSORT = (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleSEARCH = (event) => {
      setSearchQuery(event.target.value);
    };
  
    const searchTABLE = DATA_TO.filter((row) =>
      row[searchBy].includes(searchQuery)
    );
  
    const sortedData = [...searchTABLE].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const handleChecked = (id,arr) => {
      const currentIndex = checkedID.indexOf(id);
      const newcheckedID = [...checkedID];
      const newcheckedArr = [...checkedArr];
      if (currentIndex === -1) {
        newcheckedID.push(id);
        newcheckedArr.push(arr);
      } else {
        newcheckedID.splice(currentIndex, 1);
        newcheckedArr.splice(currentIndex, 1);
      }

      setCheckedID(newcheckedID);
      setcheckedArr(newcheckedArr);
    };

    const handleEdit = (i) => {
      DATA_RE([])
      const returnedData = Eq.convertDATA(i,'UPDATE')
      DATA_RE(returnedData)
    };

    const handleDelete = (i) => {
      const returnedData = Eq.convertDATA(i,'DELETE')
      setdataDelete(returnedData)
      setopenDelete(true)

    };
    // ==================================== *_* ====================================

    const [menuFILTER, setmenuFILTER] = useState({
                                                    setStatus: '',
                                                    setSortBy:  '',
                                                    setLimit: '',
                                                    dataSortBy: [
                                                                    'DATE','APP', 'CLUB'
                                                                ],
                                                    dataLimit:  [

                                                                ]
                                                 });

    const onMenuFILTER = (i) => {
      console.log(i)
    };

    const onMenuSEARCH = (i) => {
      DATA_LOAD({ SEARCH: i })
      console.log(i)
     // setSearchQuery(i);
    };

    const iHEADER =(i,ii)=>{
        return <TableCell>
                    <TableSortLabel
                    active={orderBy === i}
                    direction={orderBy === i ? order : 'asc'}
                    onClick={() => handleSORT(i)} >
                    {ii}
                    </TableSortLabel>
                </TableCell>
    }

    const iDATE =(i,ii)=>{
        return (<>
                    <p style={{marginBottom:'-8px'}}>{i} </p>  
                    <span>{ii}</span> 
                </>)

    }

    const iCLUB =(i,ii,iii)=>{
        const e = Fnc.isNull(i) ? 'None' : i 
        const ee = Fnc.isNull(ii) ? 'No rake' : ii+'% rake'
        return (<>
                    <p style={{fontSize:'12px',marginBottom:'-18px'}}>{iii}</p>
                    <p style={{marginBottom:'-6px'}}>{e} </p> 
                    <span style={{fontSize:'12px',}}>{ee}</span> 
                </>)
    }

    const iPLAYER =(i,ii,iii)=>{
        return (<>
                    <p style={{marginBottom:'-6px'}}>ID: {i} </p> 
                    { !Fnc.isNull(iii) 
                      ? 
                      <span style={{fontSize:'12px',}}>{iii}</span> 
                      :
                      !Fnc.isNull(ii) 
                      ?
                      <span style={{fontSize:'12px',}}>{ii}</span> 
                      :
                      <b style={{fontSize:'13px',color:'orange'}}>* No user </b> 
                    }
                </>)
    }

    const iUPLINE =(i)=>{ 

        const ee = !Fnc.isNull(i.uplineUserName) 
                   ? 
                    <span style={{fontSize:'12px',}}>{i.uplineUserName}</span>
                   :
                   !Fnc.isNull(i.uplineUser)
                   ?
                    <span style={{fontSize:'12px',}}>{i.uplineUser}</span>
                   : 
                    <b style={{fontSize:'13px',color:'orange'}}>* No user </b>
                    

        const eee = Fnc.isNull(i.agencyRake) ? 'No rake' : i.agencyRake+'% rake'
        return (<>
                  {Fnc.isNull(i.uplineID,'Num') ? 
                    <b style={{fontSize:'13px',color:'#d11919'}}>* No upline</b>
                   :
                    <>
                    <p style={{marginBottom:'-16px'}}>
                      ID: {i.uplineID} 
                    </p> 
                    <p style={{fontSize:'12px',marginBottom:'-29px'}}>{ee}</p>
                    <br/>
                    <span style={{fontSize:'12px',}}>{eee}</span>
                    </>
                  }
                    

                </>)
    }

    const iFXRATE =(usd,curr,date,provider)=>{
        return (<>

                  <p style={{fontSize:'12px',marginBottom:'-3px'}}>{date}</p>
                  <Tooltip  title={provider}>
                    <Chip variant='outlined' color={ Fnc.isNull(usd) ? "default" : "success"} style={{fontSize:'13px',borderRadius:'10%',height:'20px',marginBottom:'-1px'}} label={'USD '+usd} size='small' />
                  </Tooltip >
                  {curr != 'USD' ? <><br/><span style={{fontSize:'12px',marginTop:'-5'}}>per {curr}</span></> : null }
                </>)

    }

    const iWINLOSS = (i,e) => {

      const isWinLoss = Fnc.isNegative(i) ? 'LOSS' : 'WIN'
      const USD       = Fnc.numUSD(e.sumWinLoss,e.fxUSD)
      return (<>
                <p style={{fontSize:'12px',marginBottom:'-25px'}}>{isWinLoss}</p>
                {
                Fnc.isTrue(e.fxCurrency,'USD') || USD == 0 ?
                <><br/><Chip  variant='outlined' 
                              color={"success"} 
                              style={{fontSize:'12px',borderRadius:'10%',height:'20px'}} 
                              label={'USD '+Fnc.NumForce(e.sumWinLoss)} 
                              onClick={() => ( setopenGames(true),setdataGames({...e,title:'WIN/LOSS'}) )}
                              size='small' /></>
                :
                <>
                      <br/>
                      <Chip variant='outlined' 
                            color="success" 
                            style={{fontSize:'12px',borderRadius:'10%',height:'20px',marginBottom:'2px'}} 
                            label={'USD '+USD} 
                            onClick={() => ( setopenGames(true),setdataGames({...e,title:'WIN/LOSS'}) )}
                            size='small' />
                      <br/>
                      <Chip variant='outlined' 
                            style={{fontSize:'12px',borderRadius:'10%',height:'20px'}} 
                            label={e.fxCurrency+' '+Fnc.NumForce(e.sumWinLoss)} 
                            onClick={() => ( setopenGames(true),setdataGames({...e,title:'WIN/LOSS'}) )}
                            size='small' /> 
                </>
                }
              </>);
    }

    const iBONUS = (i,e) => {
      const isUSD = Fnc.isTrue(e.fxCurrency,'USD') && !Fnc.isNull(e.fxCurrency) ? true : false 
      const USD   = Fnc.numUSD(e.sumBonus,e.fxUSD)
      return (<>
                <Chip variant='outlined' 
                      color="success" 
                      style={{ fontSize:'12px',borderRadius:'10%',height:'20px',marginBottom:isUSD ? '0px' : '3px' }} 
                      onClick={() => ( setopenGames(true),setdataGames({...e,title:'BONUS'}) )}
                      label={'USD '+Fnc.NumForce(USD)} 
                      size='small' />
                {
                  isUSD ? null :
                    <>
                    <br/>
                    <Chip variant='outlined' 
                          color="default" 
                          style={{fontSize:'12px',borderRadius:'10%',height:'20px',marginBottom:'2px'}} 
                          onClick={() => ( setopenGames(true),setdataGames({...e,title:'BONUS'}) )}
                          label={e.fxCurrency+' '+Fnc.NumForce(i)} 
                          size='small' />
                    </>
                }
              </>);
    }

    const iRAKECLUB = (rake,bonus,dollars,curr) => {

        const RAKE  = Eq.RakeAgency(Fnc.isNum(rake),Fnc.isNum(bonus),Fnc.isNum(dollars))
        const USD   = RAKE.usd
        const BASE  = RAKE.base

          if( !Fnc.isNull(rake,'Num')  ){
            if( Fnc.isTrue(curr,'USD') ){
              return <><br/><Chip variant='outlined' color={ Fnc.isNull(rake) ? "default" : "success"} style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={'USD '+USD} size='small' /></>
            } else {
                return <>
                        <br/>
                        <Chip variant='outlined' color="success" style={{fontSize:'11px',borderRadius:'10%',height:'18px',marginBottom:'2px'}} label={'USD '+USD} size='small' />
                        <br/>
                        <Chip variant='outlined' style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={curr+' '+BASE} size='small' /> 
                      </>
            }
          } else {
            return <><br/><Chip variant='outlined' color={"error"} style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={'* No Rake '} size='small' /></>
          }
    }

    const iRAKEUP = (i) => {

      const RAKE  = Eq.RakeUpline(Fnc.isNum(i.agencyRake),Fnc.isNum(i.uplineRake),Fnc.isNum(i.sumWinLoss),Fnc.isNum(i.sumBonus),Fnc.isNum(i.fxUSD))
      const USD   = RAKE.usd
      const BASE  = RAKE.base
      const isPercent = Fnc.isNull(i.agencyRake,'Num')
      const isUpline = Fnc.isNull(i.uplineID,'Num')

      if( !isUpline  ){
        if( !isPercent  ){
          if( Fnc.isTrue(i.fxCurrency,'USD') ){
            return <><br/><Chip variant='outlined' color={ isPercent ? "default" : "success"} style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={'USD '+USD} size='small' /></>
          } else {
              return <>
                      <br/>
                      <Chip variant='outlined' color="success" style={{fontSize:'11px',borderRadius:'10%',height:'18px',marginBottom:'2px'}} label={'USD '+USD} size='small' />
                      <br/>
                      <Chip variant='outlined' style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={i.fxCurrency+' '+BASE} size='small' /> 
                    </>
          }
        } else {
          return <><br/><Chip variant='outlined' color={"error"} style={{fontSize:'11px',borderRadius:'10%',height:'18px'}} label={'* No Rake '} size='small' /></>
        }
      }

  }

  const reloadData =(i)=>{

    const summing = reloadDATA + 1 * 2.1
    
    setreloadDATA(summing)
    DATA_LOAD(summing)
    console.log(summing)


  }

  return (



<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'-20px'}}>

  <Grid item xs={1} sm={1} md={1} style={{marginBottom:'-20px'}}>
      <MenuOnFilter onFiltering={onMenuFILTER} byFiltering={menuFILTER}/>
  </Grid>

  <Grid item xs={6} sm={5} md={5} style={{marginBottom:'-20px'}}>
      <MenuOnSearch onSearching={onMenuSEARCH} />
  </Grid>
  <Grid item xs={5} sm={6} md={6} style={{marginBottom:'-20px'}}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', }}>

      <Button variant={checkedID.length > 0 ? 'contained' : 'outlined'} 
              onClick={()=>(checkedID.length > 0 ? handleDelete(checkedArr) : null)}
              startIcon={<Icon icon="tabler:trash-x-filled"/>}
              sx={checkedID.length > 0 ? Cls.buttonClass('contained','red') : Cls.buttonClass('outlined','')}>
        Delete
      </Button>
      &nbsp;&nbsp;
      <Button variant={checkedID.length > 0 ? 'contained' : 'outlined'} 
              onClick={()=>(checkedID.length > 0 ? handleEdit(checkedArr) : null)}
              startIcon={<Icon icon="fluent:edit-28-filled"/>}
              sx={checkedID.length > 0 ? Cls.buttonClass('contained','violet') : Cls.buttonClass('outlined','')}>
        Edit
      </Button>
    </Box>
  </Grid>
  <Grid item xs={12} sm={12} md={12}>

  <TableContainer sx={{border: '1px dashed gray'}}>
      <Table size='small' >

        <TableHead>
          <TableRow>
            {iHEADER('id','#')}
            {iHEADER('dateOpen','Date')}
            {iHEADER('playerID','Player')}
            {iHEADER('clubName','Club')}
            {iHEADER('uplineID','Upline')}
            {iHEADER('fxUSD','USD')}
            {iHEADER('sumWinLoss','Win/Loss')}
            {iHEADER('sumBonus','Bonus')}
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox" style={{minWidth:'80px'}}>
                {row.increment}
                    <Checkbox
                      checked={checkedID.indexOf(row.id) !== -1}
                      onChange={() => handleChecked(row.id,row)}
                    />
                  </TableCell>
                <TableCell style={{minWidth:'120px'}}>{iDATE(row.dateOpen,row.dateClose)}</TableCell>
                <TableCell style={{minWidth:'130px'}}>{iPLAYER(row.playerID,row.playerUser,row.playerUserName)}</TableCell>
                <TableCell style={{minWidth:'130px'}}>
                    {iCLUB(row.clubName,row.uplineRake,row.appName)}
                    {iRAKECLUB(row.uplineRake,row.sumBonus,row.fxUSD,row.fxCurrency)}
                </TableCell>
                <TableCell style={{minWidth:'130px'}}>
                  {iUPLINE(row)}
                  {iRAKEUP(row)}
                </TableCell>
                <TableCell style={{minWidth:'100px'}}>{iFXRATE(row.fxUSD,row.fxCurrency,row.fxDate,row.fxProvider)}</TableCell>
                <TableCell style={{minWidth:'120px'}}>{iWINLOSS(row.sumWinLoss,row)}</TableCell>
                <TableCell style={{minWidth:'120px'}}>{iBONUS(row.sumBonus,row)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

    </TableContainer>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'-20px'}}>
      <Grid item xs={12} sm={5} md={6}>
        { 
          DATA_COUNT < 1000 
          ?
          <>
          {
            reloadPage == 1000 ? null : 
          <Button variant="outlined" 
                  size='small'
                  style={{ marginTop:'10px' }} 
                  color="primary" 
                  sx={Cls.buttonClass('outlined','violet')}
                  startIcon={<Icon icon="material-symbols:arrow-back-ios"/>}
                  onClick={() => reloadData('minus') }>
                Back
          </Button>
          }


          &nbsp;

          <Button variant="outlined" 
                  size='small'
                  style={{ marginTop:'10px' }} 
                  color="primary" 
                  sx={Cls.buttonClass('outlined','violet')}
                  endIcon={<Icon icon="material-symbols:arrow-forward-ios"/>}
                  onClick={() => reloadData('add') }>
            Next
          </Button>

          <Typography>
            <span style={{fontSize:'12px',color:'gray'}}>
              Records: {(reloadPage - 999)+'-'+(DATA_COUNT > reloadPage ? reloadPage : DATA_COUNT)} out of {DATA_COUNT}
            </span>
          </Typography>
          
          </>
          :
          null
        }

      </Grid>
      <Grid item xs={12} sm={7} md={6}>
        <TablePagination  rowsPerPageOptions={[5, 15, 30]}
                          component="div"
                          count={searchTABLE.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handlePAGINATION}
                          onRowsPerPageChange={handlePAGEROWS} />
      </Grid>
    </Grid>


    <Box>

    </Box>
  </Grid>
  <ModalRecordGames openGames={openGames} setopenGames={setopenGames} dataGames={dataGames} dataSuccess={reloadData} />
  <ModalRecordDelete openDelete={openDelete} setopenDelete={setopenDelete} dataDelete={dataDelete} dataSuccess={reloadData} />
  {
    //<pre>{JSON.stringify(checkedArr,null,2)}</pre>
  }
</Grid>

  );
};
