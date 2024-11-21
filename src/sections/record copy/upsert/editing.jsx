import { useState, useEffect } from 'react';
import axios from 'axios';
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
  Badge,
  Divider,
  InputAdornment,
  Fade,
  Button,
  Tooltip,
  Chip,
  TextField,
  Stack
} from '@mui/material';


import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { TheDialog } from '../modal-xlxs'
import { Patch } from '../'
import { Icon } from '@iconify/react';

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

import { Alerting, Informing } from 'src/items/alert_snack/'

import { Calculate } from 'src/hooks/formula-calculations'

const HEADS = [
                { id: 'ROW',  label: '', check:'', minWidth: 30, sortable: false, filterable: false },
                { id: 'DATECLOSED',  label: 'DATE', check:'DATESUB',minWidth: 130, sortable: true, filterable: true },
                { id: 'RAKEBACK',   label: 'DEAL',check:'RAKEBACK',  minWidth: 170, sortable: true, filterable: true },
                { id: 'CLUBNAME',   label: 'CLUB', check:'CLUBSUB', minWidth: 170, sortable: true, filterable: true },
                { id: 'PLAYERID',   label: 'PLAYER',check:'PLAYER',  minWidth: 170, sortable: true, filterable: true },
                { id: 'UPLINEID',   label: 'UPLINE', check:'UPLINE', minWidth: 170, sortable: true, filterable: true },
                { id: 'AGENCYID',   label: 'AGENCY', check:'AGENCY', minWidth: 170, sortable: true, filterable: true },
                { id: 'DOWNLINEID', label: 'DOWNLINE', check:'DOWNLINE', minWidth: 170, sortable: true, filterable: true },
                { id: 'FXUSD',      label: 'FX USD', check:'', minWidth: 170, sortable: true, filterable: true },
                { id: 'WINLOSS_TOTAL', label: 'POINTS', check:'POINTS', minWidth: 170, sortable: true, filterable: true },
                { id: 'BONUS_TOTAL',   label: 'BONUS', check:'BONUS', minWidth: 170, sortable: true, filterable: true },
                { id: 'RESULT_BONUSPERCENT', label: 'BONUS PERCENT', check:'', minWidth: 170, sortable: false, filterable: false },
                { id: 'RESULT_RESULT',     label: 'RESULT', check:'', minWidth: 170, sortable: false, filterable: false },
                { id: 'RESULT_AGENCYACTION',     label: 'AGENCY ACTION', check:'', minWidth: 170, sortable: false, filterable: false },
                { id: 'RESULT_AGENCYBONUS',     label: 'AGENCY BONUS', check:'', minWidth: 170,sortable: false, filterable: false },
                { id: 'RESULT_PLAYERRESULT',     label: 'PLAYER RESULT', check:'', minWidth: 170, sortable: false, filterable: false },
                { id: 'REMARKS',     label: 'REMARKS', check:'', minWidth: 250, sortable: true, filterable: true },
              ];

export default function Editing({DATA,SWITCH,WHAT,ITEM,REFRESH}) {
  const DataCheck = DATA.length > 0 ? DATA : ITEM?.EDIT.length > 0 ? ITEM?.EDIT : []
  const [onItems, setonItems]   = useState(DataCheck);
  const [onData, setonData]     = useState(DataCheck);
  const [onAlert, setonAlert]   = useState({onOpen: 0, severity: '', message: ''});
  const [onExit, setonExit] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('DATECLOSED');
  const [filters, setFilters] = useState({}); // Store filter values for each column


  const [diaOpen, setOpenDialog] = useState(false);
  const [diaName, setdiaName] = useState('');
  const [diaData, setdiaData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const handleSearchChange = (i) => {
    setSearch(i);

  };

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleRemove = (i) => {
    const removing = onItems.filter((e) => e['ROW'] !== i);
    setonItems(removing)
    setonData(removing)
    if(onItems.length <= 1){
      SWITCH('new')
    }
  };

const onchangeRows =()=>{

  const filteredRows = onItems.filter((i) => {
    return Object.keys(filters).every((id) => {
      const filterValue = filters[id].toLowerCase();
      return i[id].toString().toLowerCase().includes(filterValue);
    }) && Object.keys(i).some((e) =>
          String(i[e]).toLowerCase().includes(search.toLowerCase())
          )
  });

  setonData(filteredRows)

}

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
  // ====================== * ___ * ======================
  
  const handleDialogClose = () => {
    setOpenDialog(false)
    setdiaName('')
    setdiaData([])
  };

  const handleonReturned =(i)=>{
    setdiaData(i.data)
    setdiaName(i.what.toUpperCase())
    setOpenDialog(true)
  }

  const resultFormula=(i,form,what)=>{

    const formName   = Fnc.isNull(i?.chiprate,0) ? 'STANDARD' : 'WITH CHIPRATE'
    const formSet    = ITEM?.FORMULA?.data?.find((e)=>e.type == what && e.name == formName && e.status == 0)

    return Calculate(i, !Fnc.isNull(form) ? form : formSet?.formula)

  }
  
  const checkDEFECT =(i)=>{

    const byDate      = onItems.filter( (e)=> e.DATESUB == 'FUTURE' || e.DATESUB == 'WRONG' ).length
    const byRake      = onItems.filter( (e)=> Fnc.isNull(e.RAKEBACK,0) ).length
    const byClub      = onItems.filter( (e)=> !Fnc.isNull(e.CLUBSUB) ).length
    const byPlayer    = onItems.filter( (e)=> e.PLAYERSUB == 'WRONG' || Fnc.isNull(e.PLAYERID,0) || e.PLAYERRAKE < 0 ).length
    const byUpline    = onItems.filter( (e)=> e.UPLINESUB == 'WRONG' || Fnc.isNull(e.UPLINEID,0) || e.UPLINERAKE < 0 ).length
    const byAgency    = onItems.filter( (e)=> e.AGENCYSUB == 'WRONG'  ).length
    const byDownline  = onItems.filter( (e)=> e.DOWNLINESUB == 'WRONG' || Fnc.isNull(e.DOWNLINEID,0) ).length

    if(i == 'DATESUB'){
      return byDate
    } else if(i == 'RAKEBACK'){
      return byRake
    } else if(i == 'CLUBSUB'){
      return byClub
    } else if(i == 'PLAYER'){
      return byPlayer
    } else if(i == 'UPLINE'){
      return byUpline
    } else if(i == 'AGENCY'){
      return byAgency
    } else if(i == 'DOWNLINE'){
      return byDownline
    } else if(i == 'TOTAL'){
      return eval(byDate+byRake+byClub+byPlayer+byUpline)
    }

  }

  const checkCalculation =(i)=>{
    return i?.map((e)=>{
                                  const toCalculate = {
                                                  bonus:        e.BONUS_TOTAL,
                                                  points:       e.WINLOSS_TOTAL,
                                                  pointsWin:    e.WINLOSS_WIN,
                                                  pointsLoss:   e.WINLOSS_LOSS,

                                                  rakeback:     e.RAKEBACK,
                                                  rebate:       e.REBATE,
                                                  chiprate:     e.CHIPRATE,
                                                  fxCurrency:   /^[A-Za-z]+$/.test(e.FXCURRENCY) ? e.FXCURRENCY : 'USD',
                                                  fxUSD:        Fnc.numCheck(e.FXCURRENCY == 'USD' ? 1 : (e.FXUSD > 0 ? e.FXUSD : 1)),

                                                  playerRake:   e.PLAYERRAKE,
                                                  uplineRake:   e.UPLINERAKE,
                                                  agencyRake:   e.AGENCYRAKE,
                                                  downlineRake: e.DOWNLINERAKE,

                                                  playerRebate: e.PLAYERREBATE,
                                                  uplineRebate: e.UPLINEREBATE,
                                                  agencyRebate: e.AGENCYREBATE,
                                                  downlineRebate: e.DOWNLINEREBATE,

                                                  playerChip:   e.PLAYERCHIP,
                                                  uplineChip:   e.UPLINECHIP,
                                                  agencyChip:   e.AGENCYCHIP,
                                                  downlineChip: e.DOWNLINECHIP,
                                                }
    
                                  return {
                                            ...e,
                                            RESULT_AGENCYACTION:    Calculate(toCalculate,e.FORMULA_AGENCYACTION).result,
                                            RESULT_AGENCYBONUS:     Calculate(toCalculate,e.FORMULA_AGENCYBONUS).result,
                                            RESULT_PLAYERRESULT:    Calculate(toCalculate,e.FORMULA_PLAYERRESULT).result,
                                            RESULT_BONUSPERCENT:    Calculate(toCalculate,e.FORMULA_BONUSPERCENT).result,
                                            RESULT_RESULT:          Calculate(toCalculate,e.FORMULA_RESULT).result,

                                            BONUS_TOTAL_USD:        Calculate(toCalculate,'FXUSD * BONUS').result,
                                            WINLOSS_TOTAL_USD:      Calculate(toCalculate,'FXUSD * WINLOSS').result,
                                            WINLOSS_WIN_USD:        Calculate(toCalculate,'FXUSD * WINNINGS').result,
                                            WINLOSS_LOSS_USD:       Calculate(toCalculate,'FXUSD * LOSSES').result,

                                            FXUSD:                  !Fnc.isNull(e.FXUSD) ? e.FXUSD : 1, 
                                            FXCURRENCY:             !Fnc.isNull(e.FXCURRENCY) ? e.FXCURRENCY : 'USD', 
                                            FXPROVIDER:             !Fnc.isNull(e.FXPROVIDER) ? e.FXPROVIDER : 'xe.com',

                                            AGENCYID:               !Fnc.isNull(e.AGENCYID) ? e.AGENCYID : null, 
                                            UPLINEID:               !Fnc.isNull(e.UPLINEID) ? e.UPLINEID : null, 
                                            DOWNLINEID:             !Fnc.isNull(e.DOWNLINEID) ? e.DOWNLINEID : null, 

                                            RECORD:                 WHAT == 'DELETE' ? 'RESTORE' : WHAT == 'NEW' ? 'NEW' : 'OLD',
                                          }

                                })
  }

  async function checkSUBMIT(i) {
    setonExit(true)
    try {
      console.log(checkCalculation(i))
      const response = await axios.post(UpsertLINK('records','upload'),UpsertDATA({JSONData: checkCalculation(i)}));
      const feed =  response.data;

      const msgDUPLI = feed.duplicates == 0 ? '' : feed.duplicates == 1 ? '1 duplicate found' : feed.duplicates+' duplicates found'

      if(feed.failRecord > 0){

        const msgADDED = feed.newRecord == 0 ? '' : feed.newRecord + ' Added! '

        setonAlert({onOpen: Fnc.numRandom(), severity:'warning', message: feed.failRecord > 1 ? msgADDED+' '+feed.failRecord +' Accounts wrong application! '+msgDUPLI : msgADDED+' Account wrong application! '+msgDUPLI})

      } else if(feed.newRecord > 0){

        setonAlert({onOpen: Fnc.numRandom(), severity:'success', message:feed.newRecord > 1 ? feed.newRecord +' Added! '+msgDUPLI : 'Added! '+msgDUPLI})

      } else if(feed.upRecord > 0){

        setonAlert({onOpen: Fnc.numRandom(), severity:'success', message:feed.upRecord > 1 ? feed.upRecord +' Updated! '+msgDUPLI : 'Updated! '+msgDUPLI})
  
      } else if(feed.resRecord > 0){
        
        setonAlert({onOpen: Fnc.numRandom(), severity:'success', message: feed.resRecord > 1 ? feed.resRecord +' Restored! '+msgDUPLI : 'Restored! '+msgDUPLI})
      
      } else if(feed.delRecord > 0){
        
        setonAlert({onOpen: Fnc.numRandom(), severity:'success', message: feed.delRecord > 1 ? feed.delRecord +' Deleted! '+msgDUPLI : 'Deleted! '+msgDUPLI})
      
      } else if(feed.duplicates > 0){

        setonAlert({onOpen: Fnc.numRandom(), severity:'error', message:'Please check duplicates!'})

      } else {

        setonAlert({onOpen: Fnc.numRandom(), severity:'error', message:'Something went wrong!'})

      }

      if(feed.duplicates > 0 || feed.failRecord > 0){

        setonExit(false)
        const arrData = onItems.filter((e)=> feed.rowsID.includes(e.ROW) )
        setonItems(arrData)

      } else {

            setonExit(true)
            const T = setTimeout(() => {
              SWITCH('new')
            }, 2100);
            return () => clearTimeout(T);
      }

    } catch (error) {

      setonExit(false)
      setonAlert({onOpen: Fnc.numRandom(), severity:'error', message:'Please try again'})
    }

  }

  const handleSubmitted=(i)=>{

    const upDATA = onItems.map(e => {

      if( i.WHAT == 'CLUB' && ( i.APPLY == true ?  (!Fnc.isNull(i.CLUBSUB) ? i.CLUBSUB == e.CLUBSUB : i.CLUB == e.CLUBNAME) : e.ROW == i.ROW ) ){

        return {
                ...e,
                CLUBID:               i.CLUBID,
                CLUBNAME:             i.CLUBNAME,
                CLUB:                 i.CLUBNAME,
                CLUBSUB:              '',
                APPID:                i.APPID,
                APPNAME:              i.APPNAME,
                PLAYERSUB:            (e.PLAYERAPPID != 0 || e.PLAYERAPPID!= '') && e.PLAYERAPPID != i.APPID ?  'WRONG' : e.PLAYERAPPID == i.APPID ? '' :'NEW',
                UPLINESUB:            (e.UPLINEAPPID != 0 || e.UPLINEAPPID!= '') && e.UPLINEAPPID != i.APPID ?  'WRONG' : e.UPLINEAPPID == i.APPID ? '' :'NEW',
                AGENCYSUB:            (e.AGENCYAPPID != 0 || e.AGENCYAPPID!= '') && e.AGENCYAPPID != i.APPID ?  'WRONG' : e.AGENCYAPPID == i.APPID ? '' :'NEW',
                DOWNLINESUB:          (e.DOWNLINEAPPID != 0 || e.DOWNLINEAPPID!= '') && e.DOWNLINEAPPID != i.APPID ?  'WRONG' : e.DOWNLINEAPPID == i.APPID ? '' :'NEW',
                }

    } else if(( i.WHAT == 'PLAYER' || i.WHAT == 'UPLINE' || i.WHAT == 'AGENCY' || i.WHAT == 'DOWNLINE' ) && 
              ( 
                i?.APPLYCLUB == false && i?.APPLYPLAYER == false && i?.APPLYACCOUNT == false 
                ? 
                e.ROW == i.ROW
                : 
                ( 
                  i.APPLYCLUB == true && i.APPLYPLAYER == false && i.APPLYACCOUNT == false
                  ?
                  i.SUBCLUB == e.CLUBID
                  :
                  i.APPLYCLUB == false && i.APPLYPLAYER == true && i.APPLYACCOUNT == false 
                  ?
                  i.SUBPLAYER == e.PLAYERID 
                  :
                  i.APPLYCLUB == false && i.APPLYPLAYER == false && i.APPLYACCOUNT == true 
                  ?
                  i?.SUBACCOUNT == e?.[i.WHAT+'ID']
                  :
                  i.APPLYCLUB == true && i.APPLYPLAYER == true && i.APPLYACCOUNT == false
                  ?
                  i.SUBCLUB == e.CLUBID && i.SUBPLAYER == e.PLAYERID 
                  :
                  i.APPLYCLUB == true && i.APPLYPLAYER == false && i.APPLYACCOUNT == true 
                  ?
                  i.SUBCLUB == e.CLUBID && i?.SUBACCOUNT == e?.[i.WHAT+'ID']
                  :
                  i.SUBCLUB == e.CLUBID && i.SUBPLAYER == e.PLAYERID
                ) 
              )  ){

          return {
                  ...e,
                  [i.WHAT+'ID']:        i[i.WHAT+'ID'],
                  [i.WHAT+'NICK']:      i[i.WHAT+'NICK'],
                  [i.WHAT+'USERID']:    i[i.WHAT+'USERID'],
                  [i.WHAT+'USERNAME']:  i[i.WHAT+'USERNAME'],
                  [i.WHAT+'USERNICK']:  i[i.WHAT+'USERNICK'],
                  [i.WHAT+'APPID']:     i[i.WHAT+'APPID'],
                  [i.WHAT+'SUB']:       i[i.WHAT+'SUB']
                  }
      } else if(i.WHAT == 'DATE' && 
              ( 
                i?.APPLYCLUB == false && i?.APPLYPLAYER == false && i?.APPLYDATE == false 
                ? 
                e.ROW == i.ROW
                : 
                ( 
                  i.APPLYCLUB == true && i.APPLYPLAYER == false && i.APPLYDATE == false
                  ?
                  i.SUBCLUB == e.CLUBID
                  :
                  i.APPLYCLUB == false && i.APPLYPLAYER == true && i.APPLYDATE == false 
                  ?
                  i.SUBPLAYER == e.PLAYERID 
                  :
                  i.APPLYCLUB == false && i.APPLYPLAYER == false && i.APPLYDATE == true 
                  ?
                  i?.SUBDATE == e?.DATEOPENNED
                  :
                  i.APPLYCLUB == true && i.APPLYPLAYER == true && i.APPLYDATE == false
                  ?
                  i.SUBCLUB == e.CLUBID && i.SUBPLAYER == e.PLAYERID 
                  :
                  i.APPLYCLUB == true && i.APPLYPLAYER == false && i.APPLYDATE == true 
                  ?
                  i.SUBCLUB == e.CLUBID && i?.SUBDATE == e?.DATEOPENNED
                  :
                  i.SUBCLUB == e.CLUBID && i.SUBPLAYER == e.PLAYERID
                ) 
              )  ){

          return {
                  ...e,
                  DATEOPENNED:         i.DATEOPENNED,
                  DATECLOSED:          i.DATECLOSED,
                  DATESUB:             i.DATESUB,
                  }

      } else if( i.WHAT == 'DEAL' && 
              (  i.APPLYCLUB == false && i.APPLYPLAYER == false 
                ? 
                e.ROW == i.ROW 
                : 
                ( 
                  i.APPLYCLUB == true && i.APPLYPLAYER == false 
                  ?
                  i.SUBCLUB == e.CLUBID
                  :
                  i.APPLYCLUB == false && i.APPLYPLAYER == true 
                  ?
                  i.SUBPLAYER == e.PLAYERID 
                  :
                  i.SUBCLUB == e.CLUBID && i.SUBPLAYER == e.PLAYERID
                ) 
              ) ){

          return {
                  ...e,
                  RAKEBACK:           i.RAKEBACK,
                  REBATE:             i.REBATE,
                  CHIPRATE:           i.CHIPRATE,
                  PLAYERRAKE:         i.PLAYERRAKE,
                  UPLINERAKE:         i.UPLINERAKE,
                  AGENCYRAKE:         i.AGENCYRAKE,
                  DOWNLINERAKE:       i.DOWNLINERAKE,
                  AGENCYCHIP:         i.AGENCYCHIP,
                  PLAYERCHIP:         i.PLAYERCHIP,
                  UPLINECHIP:         i.UPLINECHIP,
                  DOWNLINECHIP:       i.DOWNLINECHIP,
                  }

      } else if(e.ROW == i.ROW && (i.WHAT == 'BONUS' || i.WHAT == 'POINTS' ) && ( i.APPLY == true ? i.SUB == e.APPID : e.ROW == i.ROW  )  ){

          return {
                  ...e,
                  BONUS_TOTAL:              i?.BONUS_TOTAL,
                  BONUS_SIX:                i?.BONUS_SIX,
                  BONUS_FLH:                i?.BONUS_FLH,
                  BONUS_FLOHI:              i?.BONUS_FLOHI,
                  BONUS_FLOHILO:            i?.BONUS_FLOHILO,
                  BONUS_MIXED:              i?.BONUS_MIXED,
                  BONUS_MTT:                i?.BONUS_MTT,
                  BONUS_NLH:                i?.BONUS_NLH,
                  BONUS_OFC:                i?.BONUS_OFC,
                  BONUS_PLOHI:              i?.BONUS_PLOHI,
                  BONUS_PLOHILO:            i?.BONUS_PLOHILO,
                  BONUS_SNG:                i?.BONUS_SNG,
                  BONUS_SPIN:               i?.BONUS_SPIN,
                  BONUS_OTHERS:             i?.BONUS_OTHERS,

                  WINLOSS_TOTAL:            i?.WINLOSS_TOTAL,
                  WINLOSS_WIN:              i?.WINLOSS_WIN,
                  WINLOSS_LOSS:             i?.WINLOSS_LOSS,
                  WINLOSS_SIX:              i?.WINLOSS_SIX,
                  WINLOSS_FLH:              i?.WINLOSS_FLH,
                  WINLOSS_FLOHI:            i?.WINLOSS_FLOHI,
                  WINLOSS_FLOHILO:          i?.WINLOSS_FLOHILO,
                  WINLOSS_MIXED:            i?.WINLOSS_MIXED,
                  WINLOSS_MTT:              i?.WINLOSS_MTT,
                  WINLOSS_NLH:              i?.WINLOSS_NLH,
                  WINLOSS_OFC:              i?.WINLOSS_OFC,
                  WINLOSS_PLOHI:            i?.WINLOSS_PLOHI,
                  WINLOSS_PLOHILO:          i?.WINLOSS_PLOHILO,
                  WINLOSS_SNG:              i?.WINLOSS_SNG,
                  WINLOSS_SPIN:             i?.WINLOSS_SPIN,
                  WINLOSS_OTHERS:           i?.WINLOSS_OTHERS,
                  }

      } else if( (i.WHAT == 'AGENCYBONUS' || i.WHAT == 'AGENCYACTION' || i.WHAT == 'PLAYERRESULT' ) 
                  && (  i.APPLYCLUB == false && i.APPLYPLAYER == false 
                        ? 
                        e.ROW == i.ROW 
                        : 
                        ( 
                          i.APPLYCLUB == true && i.APPLYPLAYER == false 
                          ?
                          i.SUBCLUB == e.CLUBID
                          :
                          i.APPLYCLUB == false && i.APPLYPLAYER == true 
                          ?
                          i.SUBPLAYER == e.PLAYERID 
                          :
                          i.SUBCLUB == e.CLUBID && i.SUBPLAYER == e.PLAYERID
                        ) 
                       ) ){
          if(i?.REFRESH == true){
            REFRESH(Fnc.numRandom())
          }
          return {
                  ...e,
                  FORMULA_AGENCYACTIONID:   i.FORMULA_AGENCYACTIONID,
                  FORMULA_AGENCYACTION:     i.FORMULA_AGENCYACTION,
                  FORMNAME_AGENCYACTION:    i.FORMNAME_AGENCYACTION,

                  FORMULA_AGENCYBONUSID:    i.FORMULA_AGENCYBONUSID,
                  FORMULA_AGENCYBONUS:      i.FORMULA_AGENCYBONUS,
                  FORMNAME_AGENCYBONUS:     i.FORMNAME_AGENCYBONUS,

                  FORMULA_PLAYERRESULTID:   i.FORMULA_PLAYERRESULTID,
                  FORMULA_PLAYERRESULT:     i.FORMULA_PLAYERRESULT,
                  FORMNAME_PLAYERRESULT:    i.FORMNAME_PLAYERRESULT,
                  }

      } else if(i.WHAT == 'RATE' && 
                      (  i.APPLYCLUB == false && i.APPLYPLAYER == false 
                        ? 
                        e.ROW == i.ROW 
                        : 
                        ( 
                          i.APPLYCLUB == true && i.APPLYPLAYER == false 
                          ?
                          i.SUBCLUB == e.CLUBID
                          :
                          i.APPLYCLUB == false && i.APPLYPLAYER == true 
                          ?
                          i.SUBPLAYER == e.PLAYERID 
                          :
                          i.SUBCLUB == e.CLUBID && i.SUBPLAYER == e.PLAYERID
                        ) 
                      ) ){

          return {
                  ...e,
                  FXCURRENCY:     i?.FXCURRENCY,
                  FXDATE:         i?.FXDATE,
                  FXPROVIDER:     i?.FXPROVIDER,
                  FXSUB:          i?.FXSUB,
                  FXUSD:          i?.FXUSD,
                  }

      } else if(e.ROW == i.ROW && i.WHAT == 'REMARKS' && e.ROW == i.ROW ){

          return {
                  ...e,
                  REMARKS:          i?.REMARKS,
                  }

      }

      return e;
    })
    
    setonItems(upDATA)
  }

    useEffect(() => {
      onchangeRows()
    }, [search,filters,order,onItems]);

    useEffect(() => {
      if(ITEM?.EDIT.length > 0){

        setonItems(ITEM?.EDIT)
      }
    }, [ITEM]);

        return (
          <>

<TableContainer component={Paper}>
            
            <TextField
                variant="filled"
                label={"Search..."}
                size="small"
                value={search}
                onChange={(e)=>handleSearchChange(e.target.value)}
                sx={{maxWidth:'300px',margin:'10px'}}
                autoComplete='off'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" >
                      <IconButton>
                          <Icon icon={"eva:search-fill"} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

            <Divider style={{marginBottom:'10px'}} />
    
            <Table size='small' stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {HEADS.map((i) => (
                    <TableCell
                      key={i.id}
                      align={i.align}
                      sx={{ minWidth: i.minWidth, fontSize:'13px', '&:hover': {cursor: 'pointer',} }}
                      sortDirection={orderBy === i.id ? order : false}
                      onClick={() => handleSort(i.id)}
                    >
                      {i.sortable ? (
                        <>
                        
                        {i.label}
                        {
                          i.check != ''
                          ?
                          <Badge color="error" badgeContent={checkDEFECT(i.check)} max={999} >
                            <IconButton aria-label="sort" size="small" >
                              {orderBy === i.id ? (
                                order === 'asc' ? <Icon icon="iconamoon:arrow-down-2-fill" /> : <Icon icon="iconamoon:arrow-up-2-fill" />
                              ) : (
                                <Icon icon="iconamoon:arrow-up-2-fill" />
                              )}
                            </IconButton>
                          </Badge>
                          :
                            <IconButton aria-label="sort" size="small" >
                              {orderBy === i.id ? (
                                order === 'asc' ? <Icon icon="iconamoon:arrow-down-2-fill" /> : <Icon icon="iconamoon:arrow-up-2-fill" />
                              ) : (
                                <Icon icon="iconamoon:arrow-up-2-fill" />
                              )}
                            </IconButton>
                        }
                       </>
                      ) : (
                        i.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((i,index) => {
                  return (
                    <TableRow key={index} >
                      {HEADS.map((h) => {
                        
                        const value = i[h.id];
                        
                        const iPlayerNAME   = i.PLAYERUSERNAME ? i.PLAYERUSERNAME : i.PLAYERUSERNICK ? i.PLAYERUSERNICK : null
                        const iUplineNAME   = i.UPLINEUSERNAME ? i.UPLINEUSERNAME : i.UPLINEUSERNICK ? i.UPLINEUSERNICK : null
                        const iAgencyNAME   = i.AGENCYUSERNAME ? i.AGENCYUSERNAME : i.AGENCYUSERNICK ? i.AGENCYUSERNICK : null
                        const iDownlineNAME = i.DOWNLINEUSERNAME ? i.DOWNLINEUSERNAME : i.DOWNLINEUSERNICK ? i.DOWNLINEUSERNICK : null

                        const iForms = {  
                                          bonus:            i.BONUS_TOTAL, 
                                          points:           i.WINLOSS_TOTAL, 
                                          pointsWin:        i.WINLOSS_WIN,
                                          pointsLoss:       i.WINLOSS_LOSS,
                                          rakeback:         i.RAKEBACK, 
                                          rebate:           i.REBATE, 
                                          chiprate:         i.CHIPRATE,
                                          playerRake:       i.PLAYERRAKE, 
                                          uplineRake:       i.UPLINERAKE,
                                          agencyRake:       i.AGENCYRAKE, 
                                          downlineRake:     i.DOWNLINERAKE,
                                          playerChip:       i.PLAYERCHIP,
                                          uplineChip:       i.UPLINECHIP,
                                          agencyChip:       i.AGENCYCHIP,
                                          downlineChip:     i.DOWNLINECHIP,
                                          playerRebate:     i.PLAYERREBATE,
                                          uplineRebate:     i.UPLINEREBATE,
                                          agencyRebate:     i.AGENCYREBATE,
                                          downlineRebate:   i.DOWNLINEREBATE,
                                          fxUSD:            Fnc.NumForce(i.FXUSD) ? i.FXUSD : 1,
                                          fxCurrency:       i.FXCURRENCY,
                                          formulaID:        i.FORMULAID,
                                          playerDeal:       i.playerDeal,
                                        }

                        if(h.id == 'DATECLOSED'){

                            return <Patch key={h.id} DATA={{data:       i, 
                                                            what:       'date',
                                                            for:        'edit', 
                                                            status:      '',  
                                                            dateOpen:    i.DATEOPENNED,   
                                                            dateClose:   i.DATECLOSED,
                                                            dateStatus:   i.DATESUB  }}
                                                            RETURN={handleonReturned}  />
                         } else if(h.id == 'CLUBNAME'){

                            return <Patch key={h.id} DATA={{data:       i, 
                                                            what:       'club',
                                                            for:        'edit',
                                                            sub:        i.CLUB,   
                                                            clubID:     i.CLUBID,   
                                                            clubName:   i.CLUBNAME,    
                                                            appName:    i.APPNAME }}
                                                            RETURN={handleonReturned}  />

                        } else if(h.id == 'PLAYERID'){

                          return <Patch key={h.id} DATA={{  data:   i, 
                                                            what:   'player',
                                                            for:    'edit',   
                                                            id:     i.PLAYERID,
                                                            sub:    i.PLAYERSUB,   
                                                            name:   iPlayerNAME,    
                                                            rake:   i.PLAYERRAKE,
                                                            chip:   i.PLAYERCHIP }}
                                                            RETURN={handleonReturned}  />

                        } else if(h.id == 'UPLINEID'){

                            return <Patch key={h.id} DATA={{data:   i, 
                                                            what:   'upline',
                                                            for:    'edit',   
                                                            id:     i.UPLINEID,
                                                            sub:    i.UPLINESUB,  
                                                            name:   iUplineNAME,    
                                                            rake:   i.UPLINERAKE,
                                                            chip:   i.UPLINECHIP }}
                                                            RETURN={handleonReturned}  />

                        } else if(h.id == 'AGENCYID'){

                            return <Patch key={h.id} DATA={{data:   i, 
                                                            what:   'agency', 
                                                            for:    'edit',  
                                                            id:     i.AGENCYID, 
                                                            sub:    i.AGENCYSUB,  
                                                            name:   iAgencyNAME,    
                                                            rake:   i.AGENCYRAKE,
                                                            chip:   i.AGENCYCHIP }}
                                                            RETURN={handleonReturned}  />

                        } else if(h.id == 'DOWNLINEID'){

                            return <Patch key={h.id} DATA={{data:   i, 
                                                            what:   'downline', 
                                                            for:    'edit',  
                                                            id:     i.DOWNLINEID,
                                                            sub:    i.DOWNLINESUB,   
                                                            name:   iDownlineNAME,    
                                                            rake:   i.DOWNLINERAKE,
                                                            chip:   i.DOWNLINECHIP }}
                                                            RETURN={handleonReturned}  />

                        } else if(h.id == 'RAKEBACK'){

                            return <Patch key={h.id} DATA={{     data:       i,     
                                                                  what:       'deal',
                                                                  for:        'edit',    
                                                                  rakeback:   i.RAKEBACK,    
                                                                  rebate:     i.REBATE, 
                                                                  chip:       i.CHIPRATE }}
                                                                  RETURN={handleonReturned}  />

                        } else if(h.id == 'FXUSD'){

                            return <Patch key={h.id} DATA={{data:        i, 
                                                            what:       'rate',
                                                            for:        'edit',   
                                                            currency:   i.FXCURRENCY ? i.FXCURRENCY : 'USD',  
                                                            usd:        i.FXUSD ? i.FXUSD : 1, 
                                                            provider:   i.FXPROVIDER, 
                                                            date:       i.FXDATE }}
                                                            RETURN={handleonReturned}  />

                        } else if(h.id == 'WINLOSS_TOTAL'){

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'points',
                                                                  for:        'edit',
                                                                  currency:   i.FXCURRENCY,
                                                                  usd:        i.FXUSD,  
                                                                  value:      i.WINLOSS_TOTAL, 
                                                                  positive:   i.WINLOSS_WIN, 
                                                                  negative:   i.WINLOSS_LOSS  }}
                                                                  RETURN={handleonReturned}  />

                        } else if(h.id == 'BONUS_TOTAL'){

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'bonus', 
                                                                  for:        'edit',
                                                                  currency:   i.FXCURRENCY,
                                                                  usd:        i.FXUSD,  
                                                                  value:      i.BONUS_TOTAL,   
                                                                  positive:   null, 
                                                                  negative:   null  }}
                                                                  RETURN={handleonReturned}  />

                        } else if(h.id == 'RESULT_BONUSPERCENT'){
                            
                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'bonuspercent', 
                                                                  for:        'view',
                                                                  currency:   i.FXCURRENCY,
                                                                  usd:        i.FXUSD,  
                                                                  value:      resultFormula(iForms,i.FORMULA_BONUSPERCENT,'BONUS PERCENT').result,
                                                                  formula:    resultFormula(iForms,i.FORMULA_BONUSPERCENT,'BONUS PERCENT').operation,
                                                                  formulaName:    i.FORMNAME_BONUSPERCENT, 
                                                                  positive:   null, 
                                                                  negative:   null  }}
                                                                  RETURN={handleonReturned}  />
                                                                  
                        } else if(h.id == 'RESULT_RESULT'){

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'result', 
                                                                  for:        'view',
                                                                  currency:   i.FXCURRENCY,
                                                                  usd:        i.FXUSD,  
                                                                  value:      resultFormula(iForms,i.FORMULA_RESULT,'RESULT').result, 
                                                                  formula:    resultFormula(iForms,i.FORMULA_RESULT,'RESULT').operation,
                                                                  formulaName:    i.resultName,     
                                                                  positive:   null, 
                                                                  negative:   null  }}
                                                                  RETURN={handleonReturned}  />

                        } else if(h.id == 'RESULT_AGENCYACTION'){

                            const letFORM = resultFormula(iForms,i.FORMULA_AGENCYACTION,'AGENCY ACTION')

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'agencyaction', 
                                                                  for:        'edit',
                                                                  currency:   i.FXCURRENCY,
                                                                  usd:        i.FXUSD,  
                                                                  value:      letFORM?.result,
                                                                  operation:  letFORM?.operation, 
                                                                  formula:    letFORM?.formula, 
                                                                  formulaName:    i.FORMNAME_AGENCYACTION, 
                                                                  positive:   null, 
                                                                  iForms:  iForms,
                                                                  negative:   null  }}
                                                                  RETURN={handleonReturned}  />

                        } else if(h.id == 'RESULT_AGENCYBONUS'){

                            const letFORM = resultFormula(iForms,i.FORMULA_AGENCYBONUS,'AGENCY BONUS')

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'agencybonus', 
                                                                  for:        'edit',
                                                                  currency:   i.FXCURRENCY,
                                                                  usd:        i.FXUSD,   
                                                                  value:      letFORM?.result,
                                                                  operation:  letFORM?.operation, 
                                                                  formula:    letFORM?.formula, 
                                                                  formulaName:    i.FORMNAME_AGENCYBONUS,
                                                                  positive:   null, 
                                                                  negative:   null  }} 
                                                                  RETURN={handleonReturned} />

                        } else if(h.id == 'RESULT_PLAYERRESULT'){

                            const letFORM = resultFormula(iForms,i.FORMULA_PLAYERRESULT,'PLAYER RESULT')

                            return <Patch key={h.id} DATA={{      data:       i, 
                                                                  what:       'playerresult', 
                                                                  for:        'edit',
                                                                  currency:   i.FXCURRENCY,
                                                                  usd:        i.FXUSD,  
                                                                  value:      letFORM?.result,
                                                                  operation:  letFORM?.operation, 
                                                                  formula:    letFORM?.formula, 
                                                                  formulaName:    i.FORMNAME_PLAYERRESULT, 
                                                                  positive:   null, 
                                                                  negative:   null  }}
                                                                  RETURN={handleonReturned}  />
                        } else if(h.id == 'REMARKS'){

                            return <Patch key={h.id} DATA={{data:        i, 
                                                            what:       'remarks',
                                                            for:        'edit',   
                                                            value:      i.REMARKS }}
                                                            RETURN={handleonReturned}  />

                        } else if(h.id == 'ROW'){

                            return (
                              <TableCell key={h.id} align={h.align}>
                                <IconButton variant='contained' onClick={()=>handleRemove(i.ROW)}>
                                  <Icon icon="tabler:trash-x-filled" color='red' />
                                </IconButton> 
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
              rowsPerPageOptions={[5, 50, 100, 300]}
              component="div"
              count={onData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          <br/>

          <Stack justifyContent="center" alignItems="center">
              <Button variant='contained' 
                      disabled={onExit ? true : checkDEFECT('TOTAL') == 0 ? false : true}
                      onClick={()=>checkSUBMIT(onItems)}
                      style={{...Cls.buttonClass('contained',checkDEFECT('TOTAL') == 0 ? 'violet' : 'red'),minWidth:'300px',borderRadius:'0', marginBottom:'15px'}}>
                        {onExit ? 'SUBMITTING...' : checkDEFECT('TOTAL') == 0 ? 'SUBMIT' : checkDEFECT('TOTAL')+' INCOMPLETE DETAILS'}
              </Button>
          </Stack>

          <TheDialog  onOpen={diaOpen} 
                      onClose={handleDialogClose} 
                      onSubmitted={handleSubmitted}
                      onName={diaName} onData={diaData} onItems={{ACCOUNTS:ITEM.ACCOUNTS, CLUBS:ITEM.CLUBS,DEALPLAYERS:'',DEALFORMULA:'',FORMULA:ITEM.FORMULA,RATES:ITEM.RATES}} />

          <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />
                {Fnc.JSONS(onData,true)}
          </>
        );


}