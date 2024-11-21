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

export default function UploadingExcel({DATA,ITEMS,ALERT,REFRESH}) {

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

    const getDeals =(club,player,upline,rake)=>{

        const x =  ITEMS?.DEALSPLAYER?.find((i) => NoSpaceUpCase(i?.clubID) === NoSpaceUpCase(club) && NoSpaceUpCase(i?.playerID) === NoSpaceUpCase(player) && NoSpaceUpCase(i?.uplineID) === NoSpaceUpCase(upline) && NoSpaceUpCase(i?.rakeback) === NoSpaceUpCase(rake) && i?.status == 0  );

        const iAgencyAction     = getFormula(x?.form_agencyActionID,'AGENCY ACTION')
        const iAgencyBonus      = getFormula(x?.form_agencyBonusID,'AGENCY BONUS')
        const iPlayerResult     = getFormula(x?.form_playerResultID,'PLAYER RESULT')
        
        return {
                        id:                             !x ? 0 : x?.id, 
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

    const handleRefillData = (arr)=>{

        const A = arr?.filter(i => i['DATECLOSED'] && i['CLUB'] && i['PLAYERID'] && i['UPLINEID']);

        const B = A?.map((i)=>{

            const nullRakeChip  = Fnc.isNull(i.RAKEBACK,0) && Fnc.isNull(i.REBATE,0) && Fnc.isNull(i.PLAYERRAKE,0) ? true : false

            const iClub       = getClub(i.CLUB)
            const iPlayer     = getAcct(i.PLAYERID)
            const iUpline     = getAcct(i.UPLINEID)
            const iAgency     = getAcct(i.AGENCYID)
            const iDown       = getAcct(i.DOWNLINEID)
            const iDeals      = getDeals(iClub?.id,iPlayer?.id,iUpline?.id,i?.RAKEBACK)

            return {
                        ...i,

                        DATEOPENNED:        i.DATEOPENNED ? i.DATEOPENNED : Fnc.dateGoBack( i.DATECLOSED, Fnc.isDayNumber(i.DATEOPENNED), i.DATEOPENNED),

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

                        ID_PLAYERDEAL:      iDeals?.id,

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

        const C = B?.map((i,index)=>{

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

                        RECORD:                                     Fnc.isNull(i?.ID,0) ? 'NEW' : DATA?.what == 'RESTORE' ? 'RESTORE' : 'OLD',
                        ROW:                                        'M'+index+'J',
                        ID:                                         Fnc.isNull(i?.ID,0) ? '0' : i?.ID,

                    }
        })

        return C
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

        const reFill = handleRefillData(resultTrim)

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

    const checkBlanks   = jsonData?.filter(w =>  String(w?.DATESUB) != '' 
                                                || String(w?.APPID) == '0'
                                                || String(w?.PLAYERSUB) == 'WRONG' 
                                                || String(w?.UPLINESUB) == 'WRONG'
                                                || String(w?.AGENCYSUB) == 'WRONG'
                                                || String(w?.DOWNLINESUB) == 'WRONG'
                                                || Fnc.isNull(w?.RAKEBACK,0)
                                                || Fnc.isNull(w?.POINTS_TOTAL,0)
                                                || Fnc.isNull(w?.BONUS_TOTAL,0)
                                                || Fnc.isNull(w?.FXUSD,0)
                                            )?.length

    const checkDate     = jsonData?.filter((w) => String(w?.DATESUB) != '' )?.length
    const checkClubs    = jsonData?.filter((w) => String(w?.CLUBID) == '0' )?.length
    const checkAccount   = (i) => { return jsonData?.filter((w) => String(w?.[i+'SUB']) != '' )?.length}


    const checkData     = !Fnc.isNull(jsonData,0)

    async function onSubmitting() {
    
        setonSubmitLoad(true)
        
        const newDATA = jsonData?.map((i)=>{
            return {
                        ...i,
                        DATECLOSED:            Fnc.dateDash(i.DATECLOSED),
                        DATEOPENNED:           Fnc.dateDash(i.DATEOPENNED),

                        BONUS_TOTAL_USD:        (i?.BONUS_TOTAL * i?.FXUSD),
                        POINTS_TOTAL_USD:       (i?.POINTS_TOTAL * i?.FXUSD),
                        POINTS_WIN_USD:         (i?.POINTS_WIN * i?.FXUSD),
                        POINTS_LOSS_USD:        (i?.POINTS_LOSS * i?.FXUSD),

                        RESULT_RESULT:              Fnc.numCheck(Calculate(Def.CalculateValues(i),i?.FORMULA_RESULT)?.result),
                        RESULT_BONUSPERCENT_USD:    Fnc.numCheck((Calculate(Def.CalculateValues(i),i?.FORMULA_BONUSPERCENT)?.result * i?.FXUSD)),
                        RESULT_BONUSPERCENT:        Fnc.numCheck(Calculate(Def.CalculateValues(i),i?.FORMULA_BONUSPERCENT)?.result),
                        RESULT_AGENCYACTION:        Fnc.numCheck(Calculate(Def.CalculateValues(i),i?.FORMULA_AGENCYACTION)?.result),
                        RESULT_AGENCYBONUS:         Fnc.numCheck(Calculate(Def.CalculateValues(i),i?.FORMULA_AGENCYBONUS)?.result),
                        RESULT_PLAYERRESULT:        Fnc.numCheck(Calculate(Def.CalculateValues(i),i?.FORMULA_PLAYERRESULT)?.result),

                        FXUSD:                      Fnc.numCheck(i?.FXUSD),

                        RAKEBACK:                   Fnc.numCheck(i?.RAKEBACK),
                        REBATE:                     Fnc.numCheck(i?.REBATE),
                        CHIPRATE:                   Fnc.numCheck(i?.CHIPRATE),
                        PLAYERRAKE:                 Fnc.numCheck(i?.PLAYERRAKE),
                        UPLINERAKE:                 Fnc.numCheck(i?.UPLINERAKE),
                        AGENCYRAKE:                 Fnc.numCheck(i?.AGENCYRAKE),
                        DOWNLINERAKE:               Fnc.numCheck(i?.DOWNLINERAKE),

                        POINTS_FLH:                 Fnc.numCheck(i?.POINTS_FLH),
                        POINTS_FLOHI:               Fnc.numCheck(i?.POINTS_FLOHI),
                        POINTS_FLOHILO:             Fnc.numCheck(i?.POINTS_FLOHILO),
                        POINTS_MIXED:               Fnc.numCheck(i?.POINTS_MIXED),
                        POINTS_MTT:                 Fnc.numCheck(i?.POINTS_MTT),
                        POINTS_NLH:                 Fnc.numCheck(i?.POINTS_NLH),
                        POINTS_OFC:                 Fnc.numCheck(i?.POINTS_OFC),
                        POINTS_PLOHI:               Fnc.numCheck(i?.POINTS_PLOHI),
                        POINTS_PLOHILO:             Fnc.numCheck(i?.POINTS_PLOHILO),
                        POINTS_SIX:                 Fnc.numCheck(i?.POINTS_SIX),
                        POINTS_SNG:                 Fnc.numCheck(i?.POINTS_SNG),
                        POINTS_SPIN:                Fnc.numCheck(i?.POINTS_SPIN),
                        POINTS_OTHERS:              Fnc.numCheck(i?.POINTS_OTHERS),
                        POINTS_LOSS:                Fnc.numCheck(i?.POINTS_LOSS),
                        POINTS_WIN:                 Fnc.numCheck(i?.POINTS_WIN),
                        POINTS_TOTAL:               Fnc.numCheck(i?.POINTS_TOTAL),

                        BONUS_FLH:                 Fnc.numCheck(i?.BONUS_FLH),
                        BONUS_FLOHI:               Fnc.numCheck(i?.BONUS_FLOHI),
                        BONUS_FLOHILO:             Fnc.numCheck(i?.BONUS_FLOHILO),
                        BONUS_MIXED:               Fnc.numCheck(i?.BONUS_MIXED),
                        BONUS_MTT:                 Fnc.numCheck(i?.BONUS_MTT),
                        BONUS_NLH:                 Fnc.numCheck(i?.BONUS_NLH),
                        BONUS_OFC:                 Fnc.numCheck(i?.BONUS_OFC),
                        BONUS_PLOHI:               Fnc.numCheck(i?.BONUS_PLOHI),
                        BONUS_PLOHILO:             Fnc.numCheck(i?.BONUS_PLOHILO),
                        BONUS_SIX:                 Fnc.numCheck(i?.BONUS_SIX),
                        BONUS_SNG:                 Fnc.numCheck(i?.BONUS_SNG),
                        BONUS_SPIN:                Fnc.numCheck(i?.BONUS_SPIN),
                        BONUS_OTHERS:              Fnc.numCheck(i?.BONUS_OTHERS),
                        BONUS_LOSS:                Fnc.numCheck(i?.BONUS_LOSS),
                        BONUS_WIN:                 Fnc.numCheck(i?.BONUS_WIN),
                        BONUS_TOTAL:               Fnc.numCheck(i?.BONUS_TOTAL),

                        RESULT_AGENCYACTION:       i?.OVERRIDE_AGENCYACTION ? i?.OVERRIDE_AGENCYACTIONVALUE : Fnc.numCheck(Calculate(Def.CalculateValues(i),i?.FORMULA_AGENCYACTION)?.result),
                        RESULT_AGENCYBONUS:        i?.OVERRIDE_AGENCYBONUS ? i?.OVERRIDE_AGENCYBONUSVALUE : Fnc.numCheck(Calculate(Def.CalculateValues(i),i?.FORMULA_AGENCYBONUS)?.result),
                        
                        OVERRIDE_AGENCYACTION:      i?.OVERRIDE_AGENCYACTION ? true : false,
                        OVERRIDE_AGENCYBONUS:       i?.OVERRIDE_AGENCYBONUS ? true : false,

                    }
            })

        try {

          const response = await axios.post(LinkUPLOAD('recordsnew'),UpsertDATA({JSONData: newDATA}));
          const feed =  response.data;

          if(feed?.rowsDuplicated?.length > 0 || feed?.rowsDuplicated?.length > 0){
            const dupData = jsonData?.filter(x => feed?.rowsDuplicated?.includes(x.ROW) && feed?.rowsDuplicated?.includes(x.ROW));
            setJsonData(dupData)
            setonSubmitLoad(false)
          }

          if( feed?.rowsAdded?.length > 0 ){
            
            const ifDupli = feed?.rowsDuplicated?.length > 0 ? 'Check duplicates!' : ''

            ALERT( 'success', feed?.rowsAdded?.length+' Added! '+ifDupli, false )
             
            const T = setTimeout(() => {
                if(feed?.rowsDuplicated?.length == 0){
                    resetUpload()
                }
            }, 2500);
            return () => clearTimeout(T);

          } else if( feed?.rowsUpdated?.length > 0 ){
            
                const ifDupli = feed?.rowsDuplicated?.length > 0 ? 'Check duplicates!' : ''
    
                ALERT( 'success', feed?.rowsUpdated?.length+' Updated! '+ifDupli, false )
                 
                const T = setTimeout(() => {
                    if(feed?.rowsDuplicated?.length == 0){
                        resetUpload()
                    }
                }, 2500);
                return () => clearTimeout(T);

          } else if( feed?.rowsAdded?.length == 0 && feed?.rowsDuplicated?.length > 0 ){

            ALERT( 'warning', feed?.rowsDuplicated?.length > 1 ? 'Found Duplicates!' : 'Found Duplicate!', false )
             
          } else {
  
            ALERT( 'error', 'Please try again', true )
            setonSubmitLoad(false)
  
          }
  
        } catch (error) {
  
          ALERT( 'error', 'Please try again', true )
          setonSubmitLoad(false)
  
        }
      }

    useEffect(()=>{
        setOpen(DATA?.modal ? DATA?.modal : false)
        if(DATA?.data?.length > 0){
            const editArray = Def.toModify(DATA?.data)
            setJsonData(handleRefillData(editArray));
            setError(null);
            setfieldError(null);
            setKeyError(null);
        }

    },[DATA])

    return (
        <>

    <Dialog open={open} fullWidth maxWidth='xl'>
        {
            checkData &&
        <DialogTitle sx={{ m: 1, p: 1 }} id="customized-dialog-title">
          <Typography variant="h6" component="div" margin={1}>
             {jsonData[0]?.ID > 0 ? 'RECORD FORM' : 'CONVERTED FILE'}
            <span style={{}}  onClick={()=>reUpload()}>
                <Tooltip title='Re-upload excel'>
                    <Icon icon="entypo:upload" color='violet' width={30} style={{marginBottom:'-3px',float:'right'}}/>
                </Tooltip>
            </span>
          </Typography>
        </DialogTitle>
        }


        <DialogContent>

        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>

            <Grid item xs={12} sm={12} md={12} hidden={!checkData ? false : true}>
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
                        onClick={ resetInput }
                        disabled={onUploading}
                        sx={{fontSize: onMobile ? '10px' : '12px',height:'120px', width:'120px',borderRadius:'100%',...Cs.buttonClass('contained','violet')}}>
                    <span style={{marginBottom:'-11px'}}>
                        {onUploading ? 'Please wait' : 'Upload File'}
                    </span>
                </Button>
                </label>

                <div>
                    <Chip   size='small'
                            label="Template"
                            onDelete={()=>{}}
                            onClick={()=>Fnc.downloadFile('/csv/','Record-Template-Full.xlsx')}
                            sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet', marginTop:'9.5px', marginBottom:'-12px'}}
                            deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
                            variant="outlined"
                            />
                    <Chip   size='small'
                            label="Short Template"
                            onDelete={()=>{}}
                            onClick={()=>Fnc.downloadFile('/csv/','Record-Template-Short.xlsx')}
                            sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet', marginTop:'9.5px', marginBottom:'-12px', display:'none'}}
                            deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
                            variant="outlined"
                            />
                </div>

                </Box>
                    
            </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Collapse in={onAlert} > 
                    {error && 
                        <Alert severity="error" sx={{fontSize: onMobile ? '10px' : '', width:'100%',textAlign: 'center', marginBottom:'30px'}}>
                            {error}
                        </Alert>}
                    {keyError && 
                        <Alert severity="warning" sx={{fontSize: onMobile ? '10px' : '', width:'100%',textAlign: 'center', marginBottom:'30px'}}>
                            {keyError}
                        </Alert>}
                    {fieldError && 
                        <Alert severity="warning" sx={{fontSize: onMobile ? '10px' : '', width:'100%',textAlign: 'center', marginBottom:'30px'}}>
                            {fieldError}
                        </Alert>}
                    </Collapse>
                </Grid>

            { checkData && !keyError && !error &&
            <Grid item xs={12} sm={12} md={12}  sx={{marginTop:'-30px'}}>

            <TableContainer component={'section'}>
                <Table size='small' style={{minHeight:'300px'}}>
                    <TableHead >
                        <TableRow >
                        <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px', width:'9.5px'}}>

                        </TableCell>
                        <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px', width:'12px'}}>
                            {jsonData?.length}
                        </TableCell>
                            {expectedHeaders?.map((e, index)=>{
                                    const badger = e == 'DATE'      && checkDate > 0 ? checkDate 
                                                 : e == 'CLUB'      && checkClubs > 0 ? checkClubs
                                                 : e == 'PLAYER'    && checkAccount('PLAYER') > 0 ? checkAccount('PLAYER') 
                                                 : e == 'UPLINE'    && checkAccount('UPLINE') > 0 ? checkAccount('UPLINE')
                                                 : e == 'AGENCY'    && checkAccount('AGENCY') > 0 ? checkAccount('AGENCY')
                                                 : e == 'DOWNLINE'  && checkAccount('DOWNLINE') > 0 ? checkAccount('DOWNLINE')
                                                 : null
                                    return  <TableCell key={index} sx={{fontSize: onMobile ? '9.5px' : '10px', }} align='center'>
                                                <span>{e}</span>
                                                <Badge badgeContent={badger} color="error" style={{marginLeft:'11px',marginTop:'-20px'}}>
                                                    <span></span>
                                                </Badge>
                                            </TableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (rowsPerPage > 0
                                ? jsonData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : jsonData
                              )?.map((i,index)=>{

                                    const calc_agencyaction     = Calculate(Def.toCalculate(i),i?.FORMULA_AGENCYACTION)
                                    const calc_agencybonus      = Calculate(Def.toCalculate(i),i?.FORMULA_AGENCYBONUS)
                                    const calc_playerresult     = Calculate(Def.toCalculate(i),i?.FORMULA_PLAYERRESULT)
                                    const calc_result           = Calculate(Def.toCalculate(i),i?.FORMULA_RESULT)
                                    const calc_bonuspercent     = Calculate(Def.toCalculate(i),i?.FORMULA_BONUSPERCENT)

                                return  <TableRow key={index} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',maxWidth:'9.5px',}}> 
                                                <Icon   icon={'ep:remove-filled'} 
                                                        width={20} 
                                                        color='#ff4554' 
                                                        style={{cursor:'pointer', marginBottom:'-5px'}}
                                                        onClick={()=>handleRemove(index)}
                                                        /> 
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',maxWidth:'9.5px'}}> 
                                                <span>{index+1}</span>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} onClick={()=>handleEdit(i,'DATE')}> 
                                                <p style={{color:'lightgray'}}>{Fnc.dateText(i.DATEOPENNED)} until</p> 
                                                <p style={{marginTop:'-11px',fontWeight:'700'}}>{Fnc.dateText(i.DATECLOSED)}</p>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'180px',cursor:'pointer'}} onClick={()=>handleEdit(i,'CLUB')}>
                                                {
                                                    !Fnc.isNull(i?.APPID,0) 
                                                    ?
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i.APPNAME}</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>{i.CLUBNAME}</p>
                                                        <p style={{marginTop:'-14px'}}>ID: {i.CLUBID}</p>
                                                    </>
                                                    :
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>NOT FOUND!</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>{i.CLUB}</p>

                                                    </>
                                                } 
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'PLAYER')}>
                                            {
                                                    i?.PLAYERAPPID == 0 && !Fnc.isNull(i?.PLAYERID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.PLAYERID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.PLAYERRAKE}%</p>
                                                    </>
                                                    :
                                                    i?.PLAYERAPPID != i?.APPID && !Fnc.isNull(i?.PLAYERID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.PLAYERID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.PLAYERRAKE}%</p>
                                                    </>
                                                    :  
                                                    !Fnc.isNull(i?.PLAYERID,0)
                                                    ?
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.PLAYERNAME ? i?.PLAYERNAME : i?.PLAYERNICK}</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.PLAYERID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.PLAYERRAKE}%</p>
                                                    </>
                                                    :
                                                    <p style={{color:'lightgray'}}>No player</p>
                                                }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'UPLINE')}>
                                            {
                                                    i?.UPLINEAPPID == 0 && !Fnc.isNull(i?.UPLINEID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.UPLINEID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.UPLINERAKE}%</p>
                                                    </>
                                                    :
                                                    i?.UPLINEAPPID != i?.APPID&& !Fnc.isNull(i?.UPLINEID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.UPLINEID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.UPLINERAKE}%</p>
                                                    </>
                                                    :  
                                                    !Fnc.isNull(i?.UPLINEID,0)
                                                    ?
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.UPLINENAME ? i?.UPLINENAME : i?.UPLINENICK}</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.UPLINEID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.UPLINERAKE}%</p>
                                                    </>
                                                    :
                                                    <p style={{color:'lightgray'}}>No upline</p>
                                                }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'AGENCY')}>
                                                {
                                                    i?.AGENCYAPPID == 0 && !Fnc.isNull(i?.AGENCYID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.AGENCYID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.AGENCYRAKE}%</p>
                                                    </>
                                                    :
                                                    i?.AGENCYAPPID != i?.APPID && !Fnc.isNull(i?.AGENCYID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.AGENCYID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.AGENCYRAKE}%</p>
                                                    </>
                                                    :  
                                                    !Fnc.isNull(i?.AGENCYID,0)
                                                    ?
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.AGENCYNAME ? i?.AGENCYNAME : i?.AGENCYNICK}</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.AGENCYID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Rakeback: {i?.AGENCYRAKE}%</p>
                                                    </>
                                                    :
                                                    <p style={{color:'lightgray'}}>No agency</p>
                                                }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'DOWNLINE')}> 
                                                {
                                                    i?.DOWNLINEAPPID == 0 && !Fnc.isNull(i?.DOWNLINEID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.DOWNLINEID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray',display:'none'}}>Rakeback: {i?.DOWNLINERAKE}%</p>
                                                    </>
                                                    :
                                                    i?.DOWNLINEAPPID != i?.APPID && !Fnc.isNull(i?.DOWNLINEID,0)
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.DOWNLINEID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray',display:'none'}}>Rakeback: {i?.DOWNLINERAKE}%</p>
                                                    </>
                                                    :  
                                                    !Fnc.isNull(i?.DOWNLINEID,0)
                                                    ?
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.DOWNLINENAME ? i?.DOWNLINENAME : i?.DOWNLINENICK}</p>
                                                        <p style={{marginTop:'-11px',fontSize:'11px',fontWeight:'700'}}>ID: {i?.DOWNLINEID}</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray',display:'none'}}>Rakeback: {i?.DOWNLINERAKE}%</p>
                                                    </>
                                                    :
                                                    <p style={{color:'lightgray'}}>No downline</p>
                                                }
                                                
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} onClick={()=>handleEdit(i,'DEAL')}>  
                                               {
                                                i.RAKEBACK == 0
                                                ?
                                                <>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {i?.RAKEBACK} / {i?.REBATE}
                                                        </p>
                                                        <p style={{marginTop:'-11px',fontWeight:'700',color:'#ff4554'}}>CANNOT BE ZERO!</p>
                                                        <p style={{marginTop:'-11px',color:'lightgray'}}>Chiprate: {i?.CHIPRATE}%</p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {i?.RAKEBACK} / {i?.REBATE}
                                                        </p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Chiprate: {i?.CHIPRATE}</p>
                                                </>
                                               }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} onClick={()=>handleEdit(i,'RATE')}>     
                                            {
                                                i.FXUSD == 0
                                                ?
                                                <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>CANNOT BE ZERO!</p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {i?.FXUSD} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                               }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'POINTS')}>
                                            {
                                                i.POINTS_TOTAL == 0
                                                ?
                                                <>
                                                    <p style={{fontWeight:'700',color:'#ff4554'}}>CANNOT BE ZERO!</p>
                                                </>
                                                :
                                                i?.FXCURRENCY == 'USD'
                                                ?
                                                <>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {i?.POINTS_TOTAL} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {(i?.POINTS_TOTAL * i?.FXUSD).toFixed(2)} USD
                                                        </p>
                                                        <p style={{marginTop:'-15px',fontSize:'10px',fontWeight:'500'}}>
                                                            {i?.POINTS_TOTAL} {i?.FXCURRENCY}
                                                        </p>

                                                </>
                                               }
                                                    <div style={{marginTop:'-5px'}}>
                                                        {
                                                            Fnc.NumForce(i?.POINTS_WIN) != 0 && Fnc.NumForce(i?.POINTS_WIN) != Fnc.NumForce(i?.POINTS_TOTAL) && 
                                                        <p style={{color:'#e88f00'}}>
                                                            {i?.POINTS_WIN} {i?.FXCURRENCY} Win
                                                        </p>
                                                        }
                                                        {
                                                            Fnc.NumForce(i?.POINTS_LOSS) != 0&& Fnc.NumForce(i?.POINTS_LOSS) != Fnc.NumForce(i?.POINTS_TOTAL) && 
                                                        <p style={{marginTop:i?.POINTS_WIN != 0 && i?.POINTS_WIN != i?.POINTS_TOTAL ? '-12px' : '0px',color:'#ff4554'}}>
                                                            {i?.POINTS_LOSS} {i?.FXCURRENCY} Loss
                                                        </p>
                                                        }
                                                    </div>

                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'BONUS')}>
                                                
                                                {
                                                i.BONUS_TOTAL == 0
                                                ?
                                                <>
                                                    <p style={{fontWeight:'700',color:'#ff4554'}}>CANNOT BE ZERO!</p>
                                                </>
                                                :
                                                i?.FXCURRENCY == 'USD'
                                                ?
                                                <>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {Fnc.NumForce3(i?.BONUS_TOTAL)} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {(i?.BONUS_TOTAL * i?.FXUSD).toFixed(2)} USD
                                                        </p>
                                                        <p style={{marginTop:'-15px',fontSize:'10px',fontWeight:'500'}}>
                                                            {Fnc.NumForce3(i?.BONUS_TOTAL)} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                               } 

                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',}} align="right"> 
                                            <Tooltip placement="top" title={
                                                                                <>     
                                                                                    <span style={{color:'gray'}}>Formula:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_bonuspercent?.formula}
                                                                                    </p>
                                                                                    <span style={{color:'gray'}}>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_bonuspercent?.operation}
                                                                                    </p>
                                                                                </>
                                                                            }>

                                                <span>
                                                        {
                                                        i?.FXCURRENCY == 'USD'
                                                        ?
                                                        <>
                                                                <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                                {Fnc.NumForce3(calc_bonuspercent?.result)} USD
                                                                </p>
                                                        </>
                                                        :
                                                        <>
                                                                <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                                    {(calc_bonuspercent?.result * i?.FXUSD)?.toFixed(2)} USD
                                                                </p>
                                                                <p style={{marginTop:'-15px',fontSize:'10px',fontWeight:'500'}}>
                                                                    {Fnc.NumForce3(calc_bonuspercent?.result)} {i?.FXCURRENCY}
                                                                </p>
                                                        </>
                                                        }
                                                </span>

                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',}} align="right"> 
                                            <Tooltip placement="top" title={    <>     
                                                                                    <span style={{color:'gray'}}>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_result?.formula}
                                                                                    </p>
                                                                                    <span style={{color:'gray'}}>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_result?.operation}
                                                                                    </p>
                                                                                </>
                                                                            }>
                                                    <span>
                                                            <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {Fnc.NumForce3(calc_result?.result)} USD
                                                            </p>
                                                            {
                                                                i?.FXCURRENCY != 'USD'
                                                                ?
                                                                <p style={{marginTop:'-15px',fontSize:'10px',fontWeight:'500'}}>
                                                                    {Fnc.NumForce3(calc_result?.result / i?.FXUSD)} {i?.FXCURRENCY}
                                                                </p>
                                                                :
                                                                ''
                                                            }
                                                    </span>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'AGENCYACTION')}> 
                                            <Tooltip placement="top" title={    i?.OVERRIDE_AGENCYACTION
                                                                                ?
                                                                                null
                                                                                :
                                                                                <>     
                                                                                    <span style={{color:'gray'}}>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_agencyaction?.formula}
                                                                                    </p>
                                                                                    <span style={{color:'gray'}}>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_agencyaction?.operation}
                                                                                    </p>
                                                                                </>
                                                                            }>
                                                <span>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {Fnc.NumForce3(i?.OVERRIDE_AGENCYACTION ? i?.OVERRIDE_AGENCYACTIONVALUE : calc_agencyaction?.result) } USD
                                                        </p>
                                                        <p style={{marginTop:'-9.5px',fontSize:'9.5px',fontWeight:'500',color:i?.OVERRIDE_AGENCYACTION ? '#e88f00' : 'lightgray'}}>
                                                            {i?.OVERRIDE_AGENCYACTION ? 'OVERRIDEN' : i?.FORMULA_AGENCYACTIONNAME}
                                                        </p>
                                                </span>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'AGENCYBONUS')}>  
                                            <Tooltip placement="top" title={    i?.OVERRIDE_AGENCYBONUS
                                                                                ?
                                                                                null
                                                                                :
                                                                                <>       
                                                                                    <span style={{color:'gray'}}>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_agencybonus?.formula}
                                                                                    </p>
                                                                                    <span style={{color:'gray'}}>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_agencybonus?.operation}
                                                                                    </p>
                                                                                </>}>
                                               <span>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {Fnc.NumForce3(i?.OVERRIDE_AGENCYBONUS ? i?.OVERRIDE_AGENCYBONUSVALUE : calc_agencybonus?.result)} USD
                                                        </p>
                                                        <p style={{marginTop:'-9.5px',fontSize:'9.5px',fontWeight:'500',color:i?.OVERRIDE_AGENCYBONUS ? '#e88f00' : 'lightgray'}}>
                                                            {i?.OVERRIDE_AGENCYBONUS ? 'OVERRIDEN' : i?.FORMULA_AGENCYBONUSNAME}
                                                        </p>
                                                </span>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'PLAYERRESULT')}>  
                                            <Tooltip placement="top" title={ <>     <span style={{color:'gray'}}>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_playerresult?.formula}
                                                                                    </p>
                                                                                    <span style={{color:'gray'}}>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '9.5px' : '10px'}}>
                                                                                        {calc_playerresult?.operation}
                                                                                    </p>
                                                                                </>}>
                                               <span>
                                                        <p style={{fontSize: onMobile ? '10px' : '12px',fontWeight:'700'}}>
                                                            {calc_playerresult?.result} USD
                                                        </p>
                                                        <p style={{marginTop:'-9.5px',fontSize:'9.5px',fontWeight:'500',color:'lightgray'}}>
                                                            {i?.FORMULA_PLAYERRESULTNAME}
                                                        </p>
                                                </span>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '9.5px' : '10px',minWidth:'200px',cursor:'pointer'}} align="center" onClick={()=>handleEdit(i,'REMARKS')}>  
                                                <p style={{fontSize: onMobile ? '10px' : '12px'}}>
                                                    {i?.REMARKS}
                                                </p>
                                            </TableCell>

                                        </TableRow>
                            })
                        }

                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 25, 50]}
                    component="section"
                    count={jsonData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
            }

        </Grid>

        <div>


            {Fnc.JSONS(jsonData,false)}

            {Fnc.JSONS(ITEMS?.DEALSPLAYER,false)}
      </div>
        </DialogContent>

        <DialogActions style={{padding:'20px', display: 'flex', justifyContent: 'center'}}>

                {
                    checkData &&
                  <Button onClick={()=>{onSubmitting()}} 
                          disabled={onSubmitLoad || checkBlanks > 0}
                          sx={{...Cs.buttonClass('contained','violet'), width:onSubmitLoad ? '100%': '50%',borderRadius:'0',fontSize: onMobile ? '10px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='contained'>
                          {onSubmitLoad ? 'SUBMITTING' : checkBlanks > 0 ? 'INCOMPLETE' : 'SUBMIT'} 
                  </Button>
                }

                {
                    !onSubmitLoad &&
                <Button onClick={()=>resetUpload()} 
                        sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '10px' : ''}} 
                        disabled={onUploading && jsonData == null}
                        variant='standard' >
                           {onUploading && jsonData == null ? 'LOADING...' : 'CANCEL'} 
                </Button>
                }

        </DialogActions>
    </Dialog>



    <ExcelDialog onOpen={diaSetting?.open} 
                onClose={handleDialogClose} 
                onSubmitted={handleSubmitted}
                onName={diaSetting?.name} 
                onData={diaSetting?.data} 
                onItems={{
                            ACCOUNTS:ITEMS?.ACCOUNTS, 
                            CLUBS:ITEMS?.CLUBS,
                            DEALPLAYERS:ITEMS?.DEALSPLAYER,
                            DEALFORMULA:ITEMS?.DEALSUPLINE,
                            FORMULA:ITEMS?.FORMULA,
                            RATES:ITEMS?.RATES,
                            GAMES: ITEMS?.GAMES,
                        }} />


        </>
    );
};

