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

    const [countErrors,setcountErrors]              = useState({
                                                                    date:       0,
                                                                    club:       0,
                                                                    player:     0,
                                                                    upline:     0,
                                                                    agency:     0,
                                                                    downline:   0,
                                                                    deals:      0,
                                                                    fxrates:    0,
                                                                    points:     0,
                                                                    bonus:      0,
                                                                })

    const [diaSetting, setdiaSetting]               = useState({open: false, name: '', data: []});

    const [jsonData, setJsonData]                   = useState(null);
    const [error, setError]                         = useState(null);
    const [headers, setHeaders]                     = useState(null);
    const [keyError, setKeyError]                   = useState(null);
    const [fieldError, setfieldError]   = useState(null);
  
    const resetUpload =()=>{
        setJsonData(null)
        setError(null)
        setKeyError(null)
        setfieldError(null)
        setOpen(false)
        setonSubmitLoad(false)
        setonUploading(false)
    }

    const reUpload =()=>{
        setJsonData(null)
        setError(null)
        setKeyError(null)
        setfieldError(null)
        setonSubmitLoad(false)
        setonUploading(false)
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
        setdiaSetting({open: true, name: what, data: i})
      };

      const handleDialogClose = (i) => {
        setdiaSetting({open: false, name: '', data: []})
      };

      const errorCounting =(i)=>{
        return i == 'WRONG'
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
                        PLAYERSUB:            (e.PLAYERAPPID != 0 || e.PLAYERAPPID!= '') && e.PLAYERAPPID != i?.DATA?.APPID ?  'WRONG' : e.PLAYERAPPID == i?.DATA?.APPID ? '' :'NEW',
                        UPLINESUB:            (e.UPLINEAPPID != 0 || e.UPLINEAPPID!= '') && e.UPLINEAPPID != i?.DATA?.APPID ?  'WRONG' : e.UPLINEAPPID == i?.DATA?.APPID ? '' :'NEW',
                        AGENCYSUB:            (e.AGENCYAPPID != 0 || e.AGENCYAPPID!= '') && e.AGENCYAPPID != i?.DATA?.APPID ?  'WRONG' : e.AGENCYAPPID == i?.DATA?.APPID ? '' :'NEW',
                        DOWNLINESUB:          (e.DOWNLINEAPPID != 0 || e.DOWNLINEAPPID!= '') && e.DOWNLINEAPPID != i?.DATA?.APPID ?  'WRONG' : e.DOWNLINEAPPID == i?.DATA?.APPID ? '' :'NEW',
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

    const CheckAcct = (appA,appB,ID)=>{
        return Fnc.isNull(ID,0) ? '' : appA == 0 ? 'NEW' : appA != appB ? 'WRONG' : '';
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
                    : {id: !Fnc.isNull(val,0) ? val : '', nick: '', userID: 0, name: '', status: '', sub: 'NONE', appID: 0, appName: ''};
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

    const getDeals =(club,player,upline,agency,downline,rebate,rakeback)=>{
        const x =  ITEMS?.DEALSPLAYER?.find(i => NoSpaceUpCase(i?.clubID) === NoSpaceUpCase(club) && NoSpaceUpCase(i?.playerID) === NoSpaceUpCase(player) && NoSpaceUpCase(i?.uplineID) === NoSpaceUpCase(upline) && i?.status == 0  );
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

                        form_agencyAction:              getFormula(x?.form_agencyActionID,'AGENCY ACTION')?.formula, 
                        form_agencyBonus:               getFormula(x?.form_agencyBonusID,'AGENCY BONUS')?.formula, 
                        form_playerResult:              getFormula(x?.form_playerResultID,'PLAYER RESULT')?.formula,  
                        form_result:                    getFormula(5)?.formula, 
                        form_bonuspercent:              getFormula(4)?.formula,  

                        form_agencyActionName:          getFormula(x?.form_agencyActionID,'AGENCY ACTION')?.name, 
                        form_agencyBonusName:           getFormula(x?.form_agencyBonusID,'AGENCY BONUS')?.name, 
                        form_playerResultName:          getFormula(x?.form_playerResultID,'PLAYER RESULT')?.name, 
                        form_resultName:                getFormula(5)?.name, 
                        form_bonuspercentName:          getFormula(4)?.name, 
                        
                        form_agencyActionOper:          getFormula(x?.form_agencyActionID,'AGENCY ACTION')?.operation, 
                        form_agencyBonusOper:           getFormula(x?.form_agencyBonusID,'AGENCY BONUS')?.operation, 
                        form_playerResultOper:          getFormula(x?.form_playerResultID,'PLAYER RESULT')?.operation, 
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
        const filteredResult = resultTrim.filter(item => item['DATECLOSED'] && item['CLUB'] && item['PLAYERID']);
                  
        const reFillA = filteredResult?.map((i)=>{

            const nullRakeChip  = Fnc.NumForce(i.RAKEBACK) == 0 && Fnc.NumForce(i.REBATE) == 0 && Fnc.NumForce(i.PLAYERRAKE) == 0 ? true : false
            
            const iClub       = getClub(i.CLUB)
            const iPlayer     = getAcct(i.PLAYERID)
            const iUpline     = getAcct(i.UPLINEID)
            const iAgency     = getAcct(i.AGENCYID)
            const iDown       = getAcct(i.DOWNLINEID)
            const iDeals      = getDeals(i.CLUB,i.PLAYERID,i.UPLINEID,i.AGENCYID)

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
                        PLAYERSUB:          CheckAcct(iPlayer?.appID, iClub?.appID,i.PLAYERID),

                        UPLINEID:           iUpline?.id,
                        UPLINENICK:         iUpline?.nick,
                        UPLINENAME:         iUpline?.name,
                        UPLINEUSERID:       iUpline?.userID,
                        UPLINEAPPID:        iUpline?.appID,
                        UPLINESUB:          CheckAcct(iUpline?.appID, iClub?.appID,i.UPLINEID),

                        AGENCYID:           iAgency?.id,
                        AGENCYNICK:         iAgency?.nick,
                        AGENCYNAME:         iAgency?.name,
                        AGENCYUSERID:       iAgency?.userID,
                        AGENCYAPPID:        iAgency?.appID,
                        AGENCYSUB:          CheckAcct(iAgency?.appID, iClub?.appID,i.AGENCYID),

                        DOWNLINEID:         iDown?.id,
                        DOWNLINENICK:       iDown?.nick,
                        DOWNLINENAME:       iDown?.name,
                        DOWNLINEUSERID:     iDown?.userID,
                        DOWNLINEAPPID:      iDown?.appID,
                        DOWNLINESUB:        CheckAcct(iDown?.appID, iClub?.appID,i.DOWNLINEID),

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

    const checkBlanks   = jsonData?.every(w => String(w?.ID)?.length < 4 && String(w?.NAME)?.length < 4 && w?.APPID == 0 )

    const checkID       = jsonData?.every(w => String(w?.ID)?.length > 4 )
    const checkName     = jsonData?.every(w => String(w?.NAME)?.length > 2 )
    const checkApp      = jsonData?.every(w => w?.APPID == 0 )

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
                    }
            })
        try {

          const response = await axios.post(LinkUPLOAD('recordsnew'),UpsertDATA({JSONData: newDATA}));
          const feed =  response.data;
          console.log(feed)
          if(feed?.duplicateList?.length > 0){
            const dupData = jsonData?.filter(ii => feed?.duplicateList?.includes(ii.ID));
            setJsonData(dupData)
            setonSubmitLoad(false)
          }

          if( feed.added >= 1 && feed.duplicates == 0 ){
            
            ALERT( 'success', feed?.added+' Added!', false )
             
            const T = setTimeout(() => {
                resetUpload()
            }, 2500);
            return () => clearTimeout(T);

          } else if( feed.added >= 1 && feed.duplicates > 0 ){
            
            ALERT( 'success', feed?.added+' Added! '+(feed?.duplicate > 1 ? feed?.duplicate+' Duplicates' : feed?.duplicate+' Duplicate'), false )
             
          } else if( feed.added == 0 && feed.duplicates > 1 ){
            
            ALERT( 'warning', feed?.duplicate > 1 ? feed?.duplicate+' Duplicates!' : feed?.duplicate+' Duplicate!', false )
             
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
    },[DATA])

    return (
        <>

    <Dialog open={open} fullWidth maxWidth='xl'>
        {
            checkData &&
        <DialogTitle sx={{ m: 1, p: 1 }} id="customized-dialog-title">
          <Typography variant="h6" component="div" margin={1}>
            CONVERTED FILE 
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
                        onClick={resetInput}
                        sx={{fontSize: onMobile ? '11px' : '13px',height:'120px', width:'120px',borderRadius:'100%',...Cs.buttonClass('contained','violet')}}>
                    <span style={{marginBottom:'-12px'}}>
                        Upload File
                    </span>
                </Button>
                </label>

                <Chip   size='small'
                        label="Template"
                        onDelete={()=>{}}
                        onClick={()=>Fnc.downloadFile('/csv/','Club-Template.xlsx')}
                        sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet', marginTop:'10px', marginBottom:'-13px'}}
                        deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
                        variant="outlined"
                        />

                </Box>
                    
            </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Collapse in={onAlert} > 
                    {error && 
                        <Alert severity="error" sx={{fontSize: onMobile ? '11px' : '', width:'100%',textAlign: 'center'}}>
                            {error}
                        </Alert>}
                    {keyError && 
                        <Alert severity="warning" sx={{fontSize: onMobile ? '11px' : '', width:'100%',textAlign: 'center'}}>
                            {keyError}
                        </Alert>}
                    {fieldError && 
                        <Alert severity="warning" sx={{fontSize: onMobile ? '11px' : '', width:'100%',textAlign: 'center'}}>
                            {fieldError}
                        </Alert>}

                        </Collapse>
                </Grid>

            { checkData && !keyError && !error &&
            <Grid item xs={12} sm={12} md={12}  sx={{marginTop:'-20px'}}>

                <Table size='small'>
                    <TableHead >
                        <TableRow >
                        <TableCell sx={{fontSize: onMobile ? '10px' : '11px', width:'10px'}}>

                        </TableCell>
                        <TableCell sx={{fontSize: onMobile ? '10px' : '11px', width:'13px'}}>
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
                                    return  <TableCell key={index} sx={{fontSize: onMobile ? '10px' : '11px', }} align='center'>
                                                <span>{e}</span>
                                                <Badge badgeContent={badger} color="error" style={{marginLeft:'12px',marginTop:'-20px'}}>
                                                    <span></span>
                                                </Badge>
                                            </TableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            jsonData?.map((i,index)=>{

                                    const calc_agencyaction = Calculate(Def.toCalculate(i),i?.FORMULA_AGENCYACTION)
                                    const calc_agencybonus  = Calculate(Def.toCalculate(i),i?.FORMULA_AGENCYBONUS)
                                    const calc_playerresult = Calculate(Def.toCalculate(i),i?.FORMULA_PLAYERRESULT)

                                return  <TableRow key={index} sx={{'&:hover': { backgroundImage: 'linear-gradient(to top, rgba(148,0,211,.4), rgba(0,0,0,0))' } }}>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',maxWidth:'10px',}}> 
                                                <Icon   icon={'ep:remove-filled'} 
                                                        width={20} 
                                                        color='#ff4554' 
                                                        style={{cursor:'pointer', marginBottom:'-5px'}}
                                                        onClick={()=>handleRemove(index)}
                                                        /> 
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',maxWidth:'10px'}}> 
                                                <span>{index+1}</span>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} onClick={()=>handleEdit(i,'DATE')}> 
                                                <p style={{color:'lightgray'}}>{Fnc.dateText(i.DATEOPENNED)} until</p> 
                                                <p style={{marginTop:'-12px',fontWeight:'700'}}>{Fnc.dateText(i.DATECLOSED)}</p>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'180px',cursor:'pointer'}} onClick={()=>handleEdit(i,'CLUB')}>
                                                {
                                                    !Fnc.isNull(i?.APPID,0) 
                                                    ?
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i.APPNAME}</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>{i.CLUBNAME}</p>
                                                        <p style={{marginTop:'-14px'}}>ID: {i.CLUBID}</p>
                                                    </>
                                                    :
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>NOT FOUND!</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>{i.CLUB}</p>

                                                    </>
                                                } 
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'PLAYER')}>
                                            {
                                                    i?.PLAYERAPPID == 0
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.PLAYERID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.PLAYERRAKE}%</p>
                                                    </>
                                                    :
                                                    i?.PLAYERAPPID != i?.APPID
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.PLAYERID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.PLAYERRAKE}%</p>
                                                    </>
                                                    :  
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.PLAYERNAME ? i?.PLAYERNAME : i?.PLAYERNICK}</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.PLAYERID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.PLAYERRAKE}%</p>
                                                    </>
                                                }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'UPLINE')}>
                                            {
                                                    i?.UPLINEAPPID == 0
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.UPLINEID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.UPLINERAKE}%</p>
                                                    </>
                                                    :
                                                    i?.UPLINEAPPID != i?.APPID
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.UPLINEID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.UPLINERAKE}%</p>
                                                    </>
                                                    :  
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.UPLINENAME ? i?.UPLINENAME : i?.UPLINENICK}</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.UPLINEID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.UPLINERAKE}%</p>
                                                    </>
                                                }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'AGENCY')}>
                                                {
                                                    i?.AGENCYAPPID == 0
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.AGENCYID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.AGENCYRAKE}%</p>
                                                    </>
                                                    :
                                                    i?.AGENCYAPPID != i?.APPID
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.AGENCYID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.AGENCYRAKE}%</p>
                                                    </>
                                                    :  
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.AGENCYNAME ? i?.AGENCYNAME : i?.AGENCYNICK}</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.AGENCYID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Rakeback: {i?.AGENCYRAKE}%</p>
                                                    </>
                                                }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'165px',cursor:'pointer'}} onClick={()=>handleEdit(i,'DOWNLINE')}> 
                                                {
                                                    i?.DOWNLINEAPPID == 0
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#e88f00'}}>NEW?</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.DOWNLINEID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray',display:'none'}}>Rakeback: {i?.DOWNLINERAKE}%</p>
                                                    </>
                                                    :
                                                    i?.DOWNLINEAPPID != i?.APPID
                                                    ?
                                                    <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>WRONG CLUB!</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.DOWNLINEID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray',display:'none'}}>Rakeback: {i?.DOWNLINERAKE}%</p>
                                                    </>
                                                    :  
                                                    <>
                                                        <p style={{color:'lightgray'}}>{i?.DOWNLINENAME ? i?.DOWNLINENAME : i?.DOWNLINENICK}</p>
                                                        <p style={{marginTop:'-12px',fontSize:'12px',fontWeight:'700'}}>ID: {i?.DOWNLINEID}</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray',display:'none'}}>Rakeback: {i?.DOWNLINERAKE}%</p>
                                                    </>
                                                }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} onClick={()=>handleEdit(i,'DEAL')}>  
                                               {
                                                i.RAKEBACK == 0
                                                ?
                                                <>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.RAKEBACK} / {i?.REBATE}
                                                        </p>
                                                        <p style={{marginTop:'-12px',fontWeight:'700',color:'#ff4554'}}>CANNOT BE ZERO!</p>
                                                        <p style={{marginTop:'-12px',color:'lightgray'}}>Chiprate: {i?.CHIPRATE}%</p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.RAKEBACK} / {i?.REBATE}
                                                        </p>
                                                        <p style={{marginTop:'-13px',color:'lightgray'}}>Chiprate: {i?.CHIPRATE}</p>
                                                </>
                                               }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} onClick={()=>handleEdit(i,'RATE')}>     
                                            {
                                                i.FXUSD == 0
                                                ?
                                                <>
                                                        <p style={{fontWeight:'700',color:'#ff4554'}}>CANNOT BE ZERO!</p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.FXUSD} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                               }
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'POINTS')}>
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
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.POINTS_TOTAL} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {(i?.POINTS_TOTAL * i?.FXUSD).toFixed(2)} USD
                                                        </p>
                                                        <p style={{marginTop:'-15px',fontSize:'11px',fontWeight:'500'}}>
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
                                                        <p style={{marginTop:i?.POINTS_WIN != 0 && i?.POINTS_WIN != i?.POINTS_TOTAL ? '-13px' : '0px',color:'#ff4554'}}>
                                                            {i?.POINTS_LOSS} {i?.FXCURRENCY} Loss
                                                        </p>
                                                        }
                                                    </div>

                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'BONUS')}>
                                                
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
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.BONUS_TOTAL} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                                :
                                                <>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {(i?.BONUS_TOTAL * i?.FXUSD).toFixed(2)} USD
                                                        </p>
                                                        <p style={{marginTop:'-15px',fontSize:'11px',fontWeight:'500'}}>
                                                            {i?.BONUS_TOTAL} {i?.FXCURRENCY}
                                                        </p>
                                                </>
                                               } 

                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',}} align="right"> 
                                            <Tooltip placement="top" title={ <>     <span>Formula:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '10px' : '11px'}}>{i?.FORMULA_BONUSPERCENT}</p>
                                                                                    <span>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '10px' : '11px'}}>{i?.FORMULA_BONUSPERCENTOPERATION}</p>
                                                                                </>}>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.RESULT_BONUSPERCENT} USD
                                                        </p>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',}} align="right"> 
                                            <Tooltip placement="top" title={ <>     <span>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '10px' : '11px'}}>{i?.FORMULA_RESULT}</p>
                                                                                    <span>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '10px' : '11px'}}>{i?.FORMULA_RESULTOPERATION}</p>
                                                                                </>}>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.RESULT_RESULT} USD
                                                        </p>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'AGENCYACTION')}> 
                                            <Tooltip placement="top" title={ <>     <span>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '10px' : '11px'}}>
                                                                                        {calc_agencyaction?.formula}
                                                                                    </p>
                                                                                    <span>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '10px' : '11px'}}>
                                                                                        {calc_agencyaction?.operation}
                                                                                    </p>
                                                                                </>}>
                                                <span>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {i?.RESULT_AGENCYACTION} USD
                                                        </p>
                                                        <p style={{marginTop:'-10px',fontSize:'10px',fontWeight:'500',color:'lightgray'}}>
                                                            {i?.FORMULA_AGENCYACTIONNAME}
                                                        </p>
                                                </span>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'AGENCYBONUS')}>  
                                            <Tooltip placement="top" title={ <>     <span>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '10px' : '11px'}}>
                                                                                        {calc_agencybonus?.formula}
                                                                                    </p>
                                                                                    <span>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '10px' : '11px'}}>
                                                                                        {calc_agencybonus?.operation}
                                                                                    </p>
                                                                                </>}>
                                               <span>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {calc_agencybonus?.result} USD
                                                        </p>
                                                        <p style={{marginTop:'-10px',fontSize:'10px',fontWeight:'500',color:'lightgray'}}>
                                                            {i?.FORMULA_AGENCYBONUSNAME}
                                                        </p>
                                                </span>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'160px',cursor:'pointer'}} align="right" onClick={()=>handleEdit(i,'PLAYERRESULT')}>  
                                            <Tooltip placement="top" title={ <>     <span>Formula:</span>
                                                                                    <p style={{marginTop:'-0px',fontSize: onMobile ? '10px' : '11px'}}>
                                                                                        {calc_playerresult?.formula}
                                                                                    </p>
                                                                                    <span>Operation:</span>
                                                                                    <p style={{marginTop:'0px',fontSize: onMobile ? '10px' : '11px'}}>
                                                                                        {calc_playerresult?.operation}
                                                                                    </p>
                                                                                </>}>
                                               <span>
                                                        <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                            {calc_playerresult?.result} USD
                                                        </p>
                                                        <p style={{marginTop:'-10px',fontSize:'10px',fontWeight:'500',color:'lightgray'}}>
                                                            {i?.FORMULA_PLAYERRESULTNAME}
                                                        </p>
                                                </span>
                                               </Tooltip>
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'200px',cursor:'pointer'}} align="center" onClick={()=>handleEdit(i,'REMARKS')}>  
                                                <p style={{fontSize: onMobile ? '11px' : '13px',fontWeight:'700'}}>
                                                    {i?.REMARKS}
                                                </p>
                                            </TableCell>

                                        </TableRow>
                            })
                        }

                    </TableBody>
                </Table>

            </Grid>
            }

        </Grid>

        <div>
            {Fnc.arrayAddingPositives([1, -2, '3sj', -2])}

            {Fnc.JSONS(jsonData,false)}

            {Fnc.JSONS(ITEMS?.DEALSPLAYER,false)}
      </div>
        </DialogContent>

        <DialogActions style={{padding:'20px', display: 'flex', justifyContent: 'center'}}>

                {
                    checkData && 
                  <Button onClick={()=>{onSubmitting()}} 
                          disabled={onSubmitLoad}
                          sx={{...Cs.buttonClass('contained','violet'), width:onSubmitLoad ? '100%': '50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='contained'>
                          {onSubmitLoad ? 'SUBMITTING' : 'SUBMIT'} 
                  </Button>
                }

                {
                    !onSubmitLoad &&
                <Button onClick={()=>resetUpload()} 
                        sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}} 
                        disabled={onUploading && jsonData == null}
                        variant='outlined' >
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

