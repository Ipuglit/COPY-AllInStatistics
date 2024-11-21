import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
            Button, 
            TextField,
            Dialog,
            DialogTitle,
            DialogContent,
            DialogActions,
            Grid,
            Typography,
            Box,
            Alert,
            Table,
            TableHead,
            TableCell,
            TableBody,
            TableRow,
            TablePagination,
            TableContainer,
            Collapse,
            Chip,
            Tooltip,
            Autocomplete,
            Badge
        } from '@mui/material';

import * as Def from '../functions/values'

import { ExcelDialog } from '../modal-excel'
import { Calculate } from 'src/hooks/formula-calculations'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'
import { TableBar } from '@mui/icons-material';

const expectedKeys = ['DATEOPENNED', 'DATECLOSED', 'CLUB','PLAYERID','UPLINEID','AGENCYID','DOWNLINEID','RAKEBACK','REBATE','CHIPRATE','PLAYERRAKEBACK','FXCURRENCY','FXUSD','POINTS_NLH','POINTS_FLH','POINTS_6','POINTS_PLOHI','POINTS_PLOHILO','POINTS_FLOHI','POINTS_FLOHILO','POINTS_MIXED','POINTS_OFC','POINTS_MTT','POINTS_SNG','POINTS_SPIN','POINTS_OTHERS','BONUS_NLH','BONUS_FLH','BONUS_6','BONUS_PLOHI','BONUS_PLOHILO','BONUS_FLOHI','BONUS_FLOHILO','BONUS_MIXED','BONUS_OFC','BONUS_MTT','BONUS_SNG','BONUS_SPIN','BONUS_OTHERS','REMARKS'];

const expectedHeaders = ['DATE','CLUB','PLAYER','UPLINE','AGENCY','DOWNLINE','DEALS','FX RATES','POINTS','BONUS', 'BONUS PERCENTAGE', 'RESULT', 'AGENCY ACTION', 'AGENCY BONUS', 'PLAYER RESULT','REMARKS']

export default function UploadingExcelFunction({DATA,ITEMS,ALERT,REFRESH}) {
    const fileInputRef                              = useRef(null);
    const onMobile                                  = Fnc.OnMobile()
    const today                                     = new Date().toISOString().split('T')[0];;
    const [open,setOpen]                            = useState(false)
    const [onUploading,setonUploading]              = useState(false)
    const [onSubmitLoad,setonSubmitLoad]            = useState(false)
    const [onAlert,setonAlert]                      = useState(false)

    const [diaSetting, setdiaSetting]               = useState({open: false, name: '', data: []});

    const [jsonData, setJsonData]                   = useState(null);
    const [error, setError]                         = useState(null);
    const [headers, setHeaders]                     = useState(null);
    const [keyError, setKeyError]                   = useState(null);
    const [fieldError, setfieldError]               = useState(null);
  
    const [page, setPage]                           = useState(0);
    const [rowsPerPage, setRowsPerPage]             = useState(5);

    const resetUpload =()=>{
        setJsonData(null)
        setError(null)
        setKeyError(null)
        setfieldError(null)
        setOpen(false)
        setonSubmitLoad(false)
        setonUploading(false)
        setPage(0)
        setRowsPerPage(5)
    }

    const reUpload =()=>{
        setJsonData(null)
        setError(null)
        setKeyError(null)
        setfieldError(null)
        setonSubmitLoad(false)
        setonUploading(false)
        setPage(0)
        setRowsPerPage(5)
    }

    const resetInput = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

    const hideAlert =(i)=>{
        setonUploading(false)
        setonAlert(true)
        const T = setTimeout(() => {
            setonAlert(false)
        }, 2500);
        return () => clearTimeout(T);
    }


    const handleRemove = (index) => {
        const newTableData = [...jsonData];
        newTableData.splice(index, 1);
        setJsonData(newTableData);
      };

      const handleEdit = (i,what) => {
        if(!onSubmitLoad){
            setdiaSetting({open: true, name: what, data: i})
        }
      };

      const handleDialogClose = (i) => {
        setdiaSetting({open: false, name: '', data: []})
      };

      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      const CheckAcct = (appA,appB,ID)=>{
        return Fnc.isNull(ID,0) ? 'NONE' : !Fnc.isNull(ID,0) && Fnc.isNull(appA,0) ? 'NEW' : !Fnc.isNull(appA,0) && appA != appB ? 'WRONG' :  '';
    }

      const handleSubmitted = (i) => {

        const setDATA = jsonData?.map(e => {

            if( i.WHAT == 'DATE' && (   !i?.APPLYDATE && !i?.APPLYCLUB && !i?.APPLYPLAYER
                                        ? 
                                            e.ROW == i.ROW
                                        :
                                        (
                                            i?.APPLYDATE && !i?.APPLYCLUB && !i?.APPLYPLAYER  
                                            ?
                                                e.DATEOPENNED == i?.MATCH?.dateOpen && e.DATECLOSED == i?.MATCH?.dateClose
                                            :
                                            i?.APPLYDATE && i?.APPLYCLUB && !i?.APPLYPLAYER 
                                            ?
                                                e.DATEOPENNED == i?.MATCH?.dateOpen && e.DATECLOSED == i?.MATCH?.dateClose && e.CLUBID == i?.MATCH?.club
                                            :
                                            i?.APPLYDATE && !i?.APPLYCLUB && i?.APPLYPLAYER  
                                            ?
                                                e.DATEOPENNED == i?.MATCH?.dateOpen && e.DATECLOSED == i?.MATCH?.dateClose && e.PLAYERID == i?.MATCH?.player
                                            :
                                            !i?.APPLYDATE && !i?.APPLYCLUB && i?.APPLYPLAYER
                                            ?
                                                e.PLAYERID == i?.MATCH?.player
                                            :
                                            !i?.APPLYDATE && i?.APPLYCLUB && !i?.APPLYPLAYER
                                            ?
                                                e.CLUBID == i?.MATCH?.club
                                            :
                                                e.DATEOPENNED == i?.MATCH?.dateOpen && e.DATECLOSED == i?.MATCH?.dateClose && e.CLUBID == i?.MATCH?.club && e.PLAYERID == i?.MATCH?.player
                                        )
             ) ){
      
                return {
                        ...e,
                        ...i?.DATA,
                        }

            } else if( i.WHAT == 'CLUB' &&  ( !i?.APPLYCLUB ? e.ROW == i.ROW : e.CLUBID == i?.MATCH?.club ) ){
                return {
                        ...e,
                        ...i?.DATA,
                        PLAYERSUB:            CheckAcct(e.PLAYERAPPID, i?.DATA?.APPID, e?.PLAYERID),
                        UPLINESUB:            CheckAcct(e.UPLINEAPPID, i?.DATA?.APPID, e?.UPLINEID),
                        AGENCYSUB:            CheckAcct(e.AGENCYAPPID, i?.DATA?.APPID, e?.AGENCYID),
                        DOWNLINESUB:          CheckAcct(e.DOWNLINEAPPID, i?.DATA?.APPID, e?.DOWNLINEID),
                        }

            } else if( ['PLAYER','UPLINE','AGENCY','DOWNLINE']?.includes(i.WHAT) &&  
                                        ( 
                                            i?.APPLYCLUB == false && i?.APPLYPLAYER == false && i?.APPLYACCOUNT == false 
                                            ? 
                                            e.ROW == i.ROW
                                            : 
                                            ( 
                                            i.APPLYCLUB == true && i.APPLYPLAYER == false && i.APPLYACCOUNT == false
                                            ?
                                            e.CLUBID == i?.MATCH?.club
                                            :
                                            i.APPLYCLUB == false && i.APPLYPLAYER == true && i.APPLYACCOUNT == false 
                                            ?
                                            e.PLAYERID == i?.MATCH?.player 
                                            :
                                            i.APPLYCLUB == false && i.APPLYPLAYER == false && i.APPLYACCOUNT == true 
                                            ?
                                            i?.MATCH?.account == e?.[i.WHAT+'ID']
                                            :
                                            i.APPLYCLUB == true && i.APPLYPLAYER == true && i.APPLYACCOUNT == false
                                            ?
                                            e.CLUBID == i?.MATCH?.club && e.PLAYERID == i?.MATCH?.player 
                                            :
                                            i.APPLYCLUB == true && i.APPLYPLAYER == false && i.APPLYACCOUNT == true 
                                            ?
                                            e.CLUBID == i?.MATCH?.club && i?.MATCH?.account == e?.[i.WHAT+'ID']
                                            :
                                            e.CLUBID == i?.MATCH?.club && e.PLAYERID == i?.MATCH?.player
                                            ) 
                                        ) 

                                        
        ){
                return {
                        ...e,
                        ...i?.DATA,
                        [i.WHAT+'SUB']:            i?.DATA?.[i.WHAT+'APPID'] != e?.APPID ? 'WRONG' : ''  
                        }

            } else if( (i.WHAT == 'DEAL' || i.WHAT == 'RATE' || i.WHAT == 'AGENCYACTION' || i.WHAT == 'AGENCYBONUS' || i.WHAT == 'PLAYERRESULT' || i.WHAT == 'REMARKS') && (    
                                                !i?.APPLYCLUB && !i?.APPLYPLAYER
                                                ? 
                                                e.ROW == i.ROW 
                                                :
                                                i?.APPLYCLUB && !i?.APPLYPLAYER
                                                ?
                                                e.CLUBID == i?.MATCH?.club
                                                :
                                                !i?.APPLYCLUB && i?.APPLYPLAYER
                                                ?
                                                e.PLAYERID == i?.MATCH?.player
                                                : 
                                                e.CLUBID == i?.MATCH?.club && e.PLAYERID == i?.MATCH?.player
                                            ) ){
                if(i?.REFRESH == true){
                    REFRESH(Fnc.numRandom())
                }
                return {
                        ...e,
                        ...i?.DATA,
                        }

            } else if( (i.WHAT == 'POINTS' || i.WHAT == 'BONUS' ) && e.ROW == i.ROW  ){

                return {
                        ...e,
                        ...i?.DATA,
                        }                     

            } else {
                return e
            }
        })
        setJsonData(setDATA)
      };

      

    const NoSpaceUpCase = (i)=>{
        return String(i)?.replace(/\s+/g, '')?.toUpperCase();
    }

    const getClub =(val)=>{
        const x =  ITEMS?.CLUBS?.find(i => NoSpaceUpCase(i?.clubName) === NoSpaceUpCase(val) || NoSpaceUpCase(i?.clubID) === NoSpaceUpCase(val) );
        return x    ? {
                        id: x?.clubID, 
                        name: x?.clubName, 
                        sub: '', 
                        appID: x?.appID, 
                        appName: x?.appName
                      } 
                    : {id: 0, name: '', sub: val, appID: 0, appName: ''};
    }

    const getAcct =(val)=>{
        const x =  ITEMS?.ACCOUNTS?.find(i => NoSpaceUpCase(i?.accountID) === NoSpaceUpCase(val)  );
        return x    ? {
                        id:         x?.accountID, 
                        nick:       x?.accountNickname, 
                        userID:     x?.userID, 
                        name:       x?.userFirstname ? x?.userFirstname + ' ' + x?.userLastname : x?.userNickname,
                        status:     x?.statusLabel,  
                        sub:        '', 
                        appID:      x?.appID, 
                        appName:    x?.appName
                      } 
                    : {
                        id: !Fnc.isNull(val,0) ? val : '', 
                        nick: '', 
                        userID: 0, 
                        name: '', 
                        status: '', 
                        sub: !Fnc.isNull(val,0) ? '' : 'NONE', 
                        appID: 0, 
                        appName: ''
                    };
    }

    const getGames =(val)=>{
        return ITEMS?.GAMES?.map((i) => { return val+i?.gameAcro } );
    }

    const getFormula =(val,typ)=>{
        const x =  ITEMS?.FORMULA?.find(i => NoSpaceUpCase(i?.id) === NoSpaceUpCase(val)  );
        const z =  ITEMS?.FORMULA?.find(i => NoSpaceUpCase(i?.type) === NoSpaceUpCase(typ) && i?.name == 'STANDARD'  );
        return x ? {
                        id:             x?.id, 
                        type:           x?.type, 
                        name:           x?.name, 
                        note:           x?.note,
                        formula:        x?.formula,  
                        status:         x?.status, 
                } : {
                        id:             z?.id, 
                        type:           z?.type, 
                        name:           z?.name, 
                        note:           z?.note,
                        formula:        z?.formula,  
                        status:         z?.status, 
                }
                
    }

    const getDeals =(club,player,upline)=>{

        const x =  ITEMS?.DEALSPLAYER?.find((i) => NoSpaceUpCase(i?.clubID) === NoSpaceUpCase(club) && NoSpaceUpCase(i?.playerID) === NoSpaceUpCase(player) && NoSpaceUpCase(i?.uplineID) === NoSpaceUpCase(upline) && i?.status == 0  );

        const iAgencyAction     = getFormula(x?.form_agencyActionID,'AGENCY ACTION')
        const iAgencyBonus      = getFormula(x?.form_agencyBonusID,'AGENCY BONUS')
        const iPlayerResult     = getFormula(x?.form_playerResultID,'PLAYER RESULT')
        
        return {
                        rebate:                         !x ? 0 : x?.rebate, 
                        rakeback:                       !x ? 0 : x?.rakeback, 
                        chiprate:                       !x || x?.chiprate == 0 ? 1 : x?.chiprate, 

                        playerRake:                     !x ? 0 : x?.playerRake,
                        uplineRake:                     !x ? 0 : x?.uplineRake,  
                        agencyRake:                     !x ? 0 : x?.agencyRake,
                        downlineRake:                   !x ? 0 : x?.downlineRake, 

                        playerChip:                     !x ? 0 : x?.playerChiprate,
                        uplineChip:                     !x ? 0 : x?.uplineChipcut,  
                        agencyChip:                     !x ? 0 : x?.agencyChipcut,
                        downlineChip:                   !x ? 0 : x?.downlineChipcut,  
                        agencyID:                       !x ? 0 : x?.agencyID,
                        downlineID:                     !x ? 0 : x?.downlineID,  
                        
                        form_agencyActionID:            !x ? 2 : x?.form_agencyActionID, 
                        form_agencyBonusID:             !x ? 1 : x?.form_agencyBonusID, 
                        form_playerResultID:            !x ? 3 : x?.form_playerResultID, 

                        form_agencyAction:              iAgencyAction?.formula, 
                        form_agencyBonus:               iAgencyBonus?.formula, 
                        form_playerResult:              iPlayerResult?.formula,  
                        form_result:                    getFormula(5)?.formula, 
                        form_bonuspercent:              getFormula(4)?.formula,  

                        form_agencyActionName:          iAgencyAction?.name, 
                        form_agencyBonusName:           iAgencyBonus?.name, 
                        form_playerResultName:          iPlayerResult?.name, 
                        form_resultName:                getFormula(5)?.name, 
                        form_bonuspercentName:          getFormula(4)?.name, 
                        
                        form_agencyActionOper:          iAgencyAction?.operation, 
                        form_agencyBonusOper:           iAgencyBonus?.operation, 
                        form_playerResultOper:          iPlayerResult?.operation, 
                        form_resultOper:                getFormula(5)?.operation, 
                        form_bonuspercentOper:          getFormula(4)?.operation, 

                      };
    }

    const handleFileChange = (event) => {

      setonUploading(true)

      const file = event.target.files[0];

        if (!file) {
            setError('No file selected');
            return;
        }

      if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
        const reader = new FileReader();
        reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, blankrows: false });
        const keys = json[1]?.map(i => i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());

        const transKeys = keys?.map(i =>  i?.trim()?.toUpperCase()?.replace(/\s+/g, '') );

        for (let i = 13; i <= 25; i++) {
            transKeys[i] = 'POINTS_'+transKeys[i];
        }
  
        for (let i = 26; i < 39; i++) {
            transKeys[i] = 'BONUS_'+transKeys[i];
        }

        setHeaders(transKeys)

        const result = json.slice(2).map((rw) => {
            const e = {...Def.Default_Values};
            for (let i = 0; i < rw.length; i++) {
              e[transKeys[i]]      = rw[i];
              e['POINTS_SIX']      = e['POINTS_6']
              e['BONUS_SIX']       = e['BONUS_6']
              e['PLAYERRAKE']      = e['PLAYERRAKEBACK']
            }
            return e;
        });

        const resultTrim = result?.map(item => {
            const { POINTS_6, BONUS_6, PLAYERRAKEBACK, ...rest } = item;
            return rest;
          });

        const isValidKeys = transKeys.every(key => expectedKeys.includes(key));
        const filteredResult = resultTrim.filter(item => item['DATECLOSED'] && item['CLUB'] && item['PLAYERID'] && item['UPLINEID']);
                  
        const reFillA = filteredResult?.map((i)=>{

            const nullRakeChip  = Fnc.isNull(i.RAKEBACK,0) && Fnc.isNull(i.REBATE,0) && Fnc.isNull(i.PLAYERRAKE,0) ? true : false

            const iClub       = getClub(i.CLUB)
            const iPlayer     = getAcct(i.PLAYERID)
            const iUpline     = getAcct(i.UPLINEID)
            const iAgency     = getAcct(i.AGENCYID)
            const iDown       = getAcct(i.DOWNLINEID)
            const iDeals      = getDeals(iClub?.id,i.PLAYERID,i.UPLINEID,i.AGENCYID)

            return {
                        ...i,

                        DATEOPENNED:        Fnc.dateGoBack( i.DATECLOSED, Fnc.isDayNumber(i.DATEOPENNED), i.DATEOPENNED),

                        CLUBID:             iClub?.id,
                        CLUBNAME:           iClub?.name,
                        CLUBSUB:            iClub?.sub,

                        APPID:              iClub?.appID,
                        APPNAME:            iClub?.appName,

                        PLAYERID:           iPlayer?.id,
                        PLAYERNICK:         iPlayer?.nick,
                        PLAYERNAME:         iPlayer?.name,
                        PLAYERUSERID:       iPlayer?.userID,
                        PLAYERAPPID:        iPlayer?.appID,
                        PLAYERSUB:          CheckAcct(iPlayer?.appID, iClub?.appID, i.PLAYERID),

                        UPLINEID:           iUpline?.id,
                        UPLINENICK:         iUpline?.nick,
                        UPLINENAME:         iUpline?.name,
                        UPLINEUSERID:       iUpline?.userID,
                        UPLINEAPPID:        iUpline?.appID,
                        UPLINESUB:          CheckAcct(iUpline?.appID, iClub?.appID, i.UPLINEID),

                        AGENCYID:           iAgency?.id,
                        AGENCYNICK:         iAgency?.nick,
                        AGENCYNAME:         iAgency?.name,
                        AGENCYUSERID:       iAgency?.userID,
                        AGENCYAPPID:        iAgency?.appID,
                        AGENCYSUB:          CheckAcct(iAgency?.appID, iClub?.appID, i.AGENCYID),

                        DOWNLINEID:         iDown?.id,
                        DOWNLINENICK:       iDown?.nick,
                        DOWNLINENAME:       iDown?.name,
                        DOWNLINEUSERID:     iDown?.userID,
                        DOWNLINEAPPID:      iDown?.appID,
                        DOWNLINESUB:        CheckAcct(iDown?.appID, iClub?.appID, i.DOWNLINEID),

                        RAKEBACK:           nullRakeChip ? iDeals?.rakeback : Fnc.NumForce(i.RAKEBACK),
                        REBATE:             nullRakeChip ? iDeals?.rebate : Fnc.NumForce(i.REBATE),
                        CHIPRATE:           nullRakeChip ? iDeals?.chiprate : (Fnc.NumForce(i.CHIPRATE) == 0 ? 1 : Fnc.NumForce(i.CHIPRATE)),

                        PLAYERRAKE:         nullRakeChip ? iDeals?.playerRake : Fnc.NumForce(i.PLAYERRAKE),
                        UPLINERAKE:         nullRakeChip ? iDeals?.uplineRake : (100 - Fnc.NumForce(i.RAKEBACK)),
                        AGENCYRAKE:         nullRakeChip ? iDeals?.agencyRake : (Fnc.NumForce(i.RAKEBACK) - Fnc.NumForce(i.PLAYERRAKE)),
                        DOWNLINERAKE:       nullRakeChip ? iDeals?.downlineRake : 0,

                        FXUSD:              Fnc.NumForce(i.FXUSD) == 0 ? 1 : i.FXUSD,
                        FXCURRENCY:         Fnc.isNull(i.FXCURRENCY) ? 'USD' : i.FXCURRENCY,
                        FXDATE:             today,
                        FXPROVIDER:         'xe.com',

                        POINTS_TOTAL:                   Fnc.arrayAdding( getGames('POINTS_')?.map( (o=> {return i[o]}) )),
                        POINTS_WIN:                     Fnc.arrayAddingPositives( getGames('POINTS_')?.map((o=> {return i[o]}) )),
                        POINTS_LOSS:                    Fnc.arrayAddingNegatives( getGames('POINTS_')?.map((o=> {return i[o]}) )),
                        BONUS_TOTAL:                    Fnc.arrayAdding( getGames('BONUS_')?.map((o=> {return i[o]}) )),

                        FORMULA_AGENCYACTIONID:         iDeals?.form_agencyActionID,
                        FORMULA_AGENCYBONUSID:          iDeals?.form_agencyBonusID,
                        FORMULA_PLAYERRESULTID:         iDeals?.form_playerResultID,

                        FORMULA_AGENCYACTION:           iDeals?.form_agencyAction,
                        FORMULA_AGENCYBONUS:            iDeals?.form_agencyBonus,
                        FORMULA_PLAYERRESULT:           iDeals?.form_playerResult,
                        FORMULA_BONUSPERCENT:           iDeals?.form_bonuspercent,
                        FORMULA_RESULT:                 iDeals?.form_result,
                        
                        FORMULA_AGENCYACTIONNAME:       iDeals?.form_agencyActionName,
                        FORMULA_AGENCYBONUSNAME:        iDeals?.form_agencyBonusName,
                        FORMULA_PLAYERRESULTNAME:       iDeals?.form_playerResultName,
                        FORMULA_BONUSPERCENTNAME:       iDeals?.form_resultName,
                        FORMULA_RESULTNAME:             iDeals?.form_bonuspercentName,

                        FORMULA_AGENCYACTIONOPERATION:  iDeals?.form_agencyActionOper,
                        FORMULA_AGENCYBONUSOPERATION:   iDeals?.form_agencyBonusOper,
                        FORMULA_PLAYERRESULTOPERATION:  iDeals?.form_playerResultOper,
                        FORMULA_BONUSPERCENTOPERATION:  iDeals?.form_resultOper,
                        FORMULA_RESULTOPERATION:        iDeals?.form_bonuspercentOper,

                   }
            })

        const reFill = reFillA?.map((i,index)=>{

            return {
                        ...i,

                        FORMULA_AGENCYACTIONOPERATION:              Calculate(Def.CalculateValues(i),i?.FORMULA_AGENCYACTION)?.operation,          
                        FORMULA_AGENCYBONUSOPERATION:               Calculate(Def.CalculateValues(i),i?.FORMULA_AGENCYBONUS)?.operation,
                        FORMULA_PLAYERRESULTOPERATION:              Calculate(Def.CalculateValues(i),i?.FORMULA_PLAYERRESULT)?.operation,
                        FORMULA_BONUSPERCENTOPERATION:              Calculate(Def.CalculateValues(i),i?.FORMULA_BONUSPERCENT)?.operation,
                        FORMULA_RESULTOPERATION:                    Calculate(Def.CalculateValues(i),i?.FORMULA_RESULT)?.operation,

                        POINTS_TOTAL_USD:                           parseFloat(i?.POINTS_TOTAL * i.FXUSD),
                        POINTS_WIN_USD:                             parseFloat(i?.POINTS_WIN * i.FXUSD),
                        POINTS_LOSS_USD:                            parseFloat(i?.POINTS_LOSS * i.FXUSD),
                        BONUS_TOTAL_USD:                            parseFloat(i?.BONUS_TOTAL * i.FXUSD),

                        RECORD:                                     'NEW',
                        ROW:                                        'M'+index+'J',
                        ID:                                         '0',

                    }
        })


          if (!isValidKeys) {
            setKeyError(`Invalid template.`);
            setJsonData(null)
            hideAlert()
            const T = setTimeout(() => {
                setJsonData(null)
                setError(null)
                setKeyError(null)
                setfieldError(null)
            }, 3000);
            return () => clearTimeout(T);
        } else if (reFill?.length == 0) {
                setKeyError(`Empty template.`);
                setJsonData(null)
                hideAlert()
                const T = setTimeout(() => {
                    setJsonData(null)
                    setError(null)
                    setKeyError(null)
                    setfieldError(null)
                }, 3000);
                return () => clearTimeout(T);
          } else if (reFill.length < resultTrim.length) {
            setfieldError('Excluded empty "ID", "NAME", "UNION" or "APPLICATION".');
            hideAlert()
          } else {
            setfieldError(null);
            setKeyError(null);
          }
  
          setJsonData(reFill);
          setError(null);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError('Please upload a valid Excel file.');
        hideAlert()
        setJsonData(null);
        setKeyError(null);
        setfieldError(null);
      }
    };


    useEffect(()=>{
        setOpen(DATA?.modal ? DATA?.modal : false)
        if(DATA?.data?.length > 0){
            setJsonData(DATA?.data)
        }
        console.log(DATA)
    },[DATA])

    return (
        <>

                <Box  component="form"
                        sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 4,
                        marginBottom: '-30px',
                        marginTop: '-30px',
                        }} >
                <input
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                id="excel-upload"
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                />
                <label htmlFor="excel-upload">
                <Button variant="contained" 
                        component="span" 
                        onClick={resetInput}
                        sx={{fontSize: onMobile ? '10px' : '12px',height:'120px', width:'120px',borderRadius:'100%',...Cs.buttonClass('contained','violet')}}>
                    <span style={{marginBottom:'-11px'}}>
                        Upload File
                    </span>
                </Button>
                </label>

                <Chip   size='small'
                        label="Template"
                        onDelete={()=>{}}
                        onClick={()=>Fnc.downloadFile('/csv/','Club-Template.xlsx')}
                        sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet', marginTop:'9.5px', marginBottom:'-12px'}}
                        deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
                        variant="outlined"
                        />

                </Box>
                    
        </>
    );
};

